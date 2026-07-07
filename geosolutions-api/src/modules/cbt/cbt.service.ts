import { PrismaClient, CbtStatus } from '@prisma/client';
import { StartExamInput, SubmitExamInput, ProctorAnalyzeInput } from './cbt.schema';
import { AppError } from '../../core/errors/AppError';
import { aiClient } from '../../services/ai.client';
import { logger } from '../../config/logger';
import { clearCache } from '../../middleware/cache.middleware';

const prisma = new PrismaClient();

// Sample CBT Question Banks (In production, stored in DB or Redis)
const QUESTION_BANKS: Record<string, Array<{ id: string; question: string; options: string[]; answer: string }>> = {
  Mathematics: [
    { id: 'q1', question: 'What is the derivative of x^2?', options: ['2x', 'x^2', '2', '0'], answer: '2x' },
    { id: 'q2', question: 'Solve for x: 2x + 6 = 14', options: ['3', '4', '5', '6'], answer: '4' },
    { id: 'q3', question: 'What is 15% of 200?', options: ['20', '25', '30', '35'], answer: '30' },
  ],
  Physics: [
    { id: 'q1', question: 'What is the SI unit of Force?', options: ['Watt', 'Joule', 'Newton', 'Pascal'], answer: 'Newton' },
    { id: 'q2', question: 'Speed of light in vacuum is approximately?', options: ['3x10^8 m/s', '3x10^6 m/s', '3x10^5 km/s', '300 m/s'], answer: '3x10^8 m/s' },
  ],
};

export class CbtService {
  async getQuestionBank(subject: string) {
    const bank = QUESTION_BANKS[subject] || QUESTION_BANKS['Mathematics'];
    // Strip correct answers before returning to client!
    return bank.map(({ answer: _answer, ...rest }) => rest);
  }

  async startExam(input: StartExamInput, studentId: string) {
    // Check if student has active subscription
    const sub = await prisma.studentSubscription.findUnique({ where: { studentId } });
    if (!sub || sub.status !== 'active' || sub.currentPeriodEnd < new Date()) {
      throw AppError.forbidden('An active student subscription is required to access CBT practice labs.');
    }

    const session = await prisma.cbtExamSession.create({
      data: {
        studentId,
        subject: input.subject,
        durationMinutes: input.durationMinutes,
        status: CbtStatus.IN_PROGRESS,
      },
    });

    logger.info({ sessionId: session.id, studentId, subject: input.subject }, '📝 CBT exam session started');
    await clearCache('/api/v1/cbt*');
    return session;
  }

  async analyzeProctoring(input: ProctorAnalyzeInput, studentId: string) {
    const session = await prisma.cbtExamSession.findUnique({ where: { id: input.sessionId } });
    if (!session || session.studentId !== studentId) {
      throw AppError.notFound('Exam session not found.');
    }

    if (session.status !== CbtStatus.IN_PROGRESS) {
      throw AppError.badRequest('Cannot analyze closed or terminated exam session.');
    }

    // Call external Python FastAPI AI microservice
    const analysis = await aiClient.analyzeProctoringFrame(input.sessionId, studentId, input.telemetry);

    let status: CbtStatus = session.status;
    let violationsCount = session.violationsCount;

    if (analysis.isSuspicious) {
      violationsCount += 1;
      logger.warn(
        { sessionId: session.id, violationsCount, violations: analysis.detectedViolations },
        '🚨 AI Proctor detected academic dishonesty risk!'
      );

      if (violationsCount >= 3) {
        status = CbtStatus.FLAGGED_TERMINATED;
        logger.error({ sessionId: session.id, studentId }, '🚫 Exam session terminated due to excessive AI proctoring violations.');
      }
    }

    const updated = await prisma.cbtExamSession.update({
      where: { id: input.sessionId },
      data: {
        violationsCount,
        status,
        aiIntegrityScore: analysis.confidenceScore * 100,
        proctorMetadata: JSON.stringify(analysis.detectedViolations),
        completedAt: status === CbtStatus.FLAGGED_TERMINATED ? new Date() : null,
      },
    });

    return {
      isSuspicious: analysis.isSuspicious,
      confidenceScore: analysis.confidenceScore,
      violationsCount: updated.violationsCount,
      status: updated.status,
      detectedViolations: analysis.detectedViolations,
    };
  }

  async submitExam(input: SubmitExamInput, studentId: string) {
    const session = await prisma.cbtExamSession.findUnique({ where: { id: input.sessionId } });
    if (!session || session.studentId !== studentId) {
      throw AppError.notFound('Exam session not found.');
    }

    if (session.status === CbtStatus.FLAGGED_TERMINATED) {
      throw AppError.forbidden('This exam was terminated by AI proctoring due to integrity violations.');
    }

    if (session.status === CbtStatus.SUBMITTED) {
      throw AppError.badRequest('Exam has already been submitted.');
    }

    // Grade answers against question bank
    const bank = QUESTION_BANKS[session.subject] || QUESTION_BANKS['Mathematics'];
    let correct = 0;

    for (const q of bank) {
      if (input.answers[q.id] === q.answer) {
        correct++;
      }
    }

    const score = (correct / Math.max(bank.length, 1)) * 100;

    const updated = await prisma.cbtExamSession.update({
      where: { id: input.sessionId },
      data: {
        status: CbtStatus.SUBMITTED,
        score,
        completedAt: new Date(),
      },
    });

    logger.info({ sessionId: session.id, score, studentId }, '🏁 CBT exam submitted and graded');
    await clearCache('/api/v1/cbt*');
    return updated;
  }
}

export const cbtService = new CbtService();
