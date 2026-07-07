import { PrismaClient, Prisma } from '@prisma/client';
import { CreateResultInput, UpdateResultInput, ResultQuery } from './results.schema';
import { AppError } from '../../core/errors/AppError';
import { logger } from '../../config/logger';
import { clearCache } from '../../middleware/cache.middleware';

const prisma = new PrismaClient();

export class ResultsService {
  async listResults(query: ResultQuery) {
    const { studentId, subject, term, sessionYear, page, limit } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ResultWhereInput = {};
    if (studentId) where.studentId = studentId;
    if (subject) where.subject = subject;
    if (term) where.term = term;
    if (sessionYear) where.sessionYear = sessionYear;

    const [results, total] = await Promise.all([
      prisma.result.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sessionYear: 'desc' }, { term: 'desc' }, { subject: 'asc' }],
        include: {
          student: {
            select: { id: true, fullName: true, identifier: true, email: true },
          },
        },
      }),
      prisma.result.count({ where }),
    ]);

    return {
      results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createResult(input: CreateResultInput, creatorId: string) {
    const existing = await prisma.result.findUnique({
      where: {
        uniq_result: {
          studentId: input.studentId,
          subject: input.subject,
          term: input.term,
          sessionYear: input.sessionYear,
        },
      },
    });

    if (existing) {
      throw AppError.conflict(
        `Result already exists for student in ${input.subject} (${input.term}, ${input.sessionYear}).`
      );
    }

    const grade = input.grade || this.calculateGrade(Number(input.score));

    const result = await prisma.result.create({
      data: {
        studentId: input.studentId,
        subject: input.subject,
        score: input.score,
        grade,
        term: input.term,
        sessionYear: input.sessionYear,
        createdBy: creatorId,
      },
    });

    logger.info({ resultId: result.id, studentId: input.studentId, subject: input.subject }, '📊 Academic result created');
    await clearCache('/api/v1/results*');
    return result;
  }

  async updateResult(id: number, input: UpdateResultInput) {
    const existing = await prisma.result.findUnique({ where: { id } });
    if (!existing) {
      throw AppError.notFound('Result not found');
    }

    const data: Prisma.ResultUpdateInput = { ...input };
    if (input.score !== undefined && !input.grade) {
      data.grade = this.calculateGrade(Number(input.score));
    }

    const updated = await prisma.result.update({
      where: { id },
      data,
    });

    logger.info({ resultId: id }, '📊 Academic result updated');
    await clearCache('/api/v1/results*');
    return updated;
  }

  async deleteResult(id: number) {
    const existing = await prisma.result.findUnique({ where: { id } });
    if (!existing) {
      throw AppError.notFound('Result not found');
    }

    await prisma.result.delete({ where: { id } });
    logger.info({ resultId: id }, '🗑️ Academic result deleted');
    await clearCache('/api/v1/results*');
  }

  private calculateGrade(score: number): string {
    if (score >= 75) return 'A1';
    if (score >= 70) return 'B2';
    if (score >= 65) return 'B3';
    if (score >= 60) return 'C4';
    if (score >= 55) return 'C5';
    if (score >= 50) return 'C6';
    if (score >= 45) return 'D7';
    if (score >= 40) return 'E8';
    return 'F9';
  }
}

export const resultsService = new ResultsService();
