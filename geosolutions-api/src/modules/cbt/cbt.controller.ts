import { Request, Response, NextFunction } from 'express';
import { cbtService } from './cbt.service';
import { StartExamInput, SubmitExamInput, ProctorAnalyzeInput } from './cbt.schema';
import { AppError } from '../../core/errors/AppError';
import { ErrorCodes } from '../../core/errors/ErrorCodes';

export class CbtController {
  async getQuestions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subject = (req.query.subject as string) || 'Mathematics';
      const questions = await cbtService.getQuestionBank(subject);
      res.status(200).json({ success: true, data: questions });
    } catch (error) {
      next(error);
    }
  }

  async start(req: Request<{}, {}, StartExamInput>, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.id) throw AppError.unauthorized('Not authenticated', ErrorCodes.UNAUTHORIZED);
      const session = await cbtService.startExam(req.body, req.user.id);
      res.status(201).json({ success: true, message: 'Exam session initialized', data: session });
    } catch (error) {
      next(error);
    }
  }

  async proctor(req: Request<{}, {}, ProctorAnalyzeInput>, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.id) throw AppError.unauthorized('Not authenticated', ErrorCodes.UNAUTHORIZED);
      const analysis = await cbtService.analyzeProctoring(req.body, req.user.id);
      res.status(200).json({ success: true, data: analysis });
    } catch (error) {
      next(error);
    }
  }

  async submit(req: Request<{}, {}, SubmitExamInput>, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.id) throw AppError.unauthorized('Not authenticated', ErrorCodes.UNAUTHORIZED);
      const result = await cbtService.submitExam(req.body, req.user.id);
      res.status(200).json({ success: true, message: 'Exam submitted successfully', data: result });
    } catch (error) {
      next(error);
    }
  }
}

export const cbtController = new CbtController();
