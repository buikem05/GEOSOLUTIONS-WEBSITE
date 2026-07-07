import { Request, Response, NextFunction } from 'express';
import { resultsService } from './results.service';
import { CreateResultInput, UpdateResultInput, ResultQuery } from './results.schema';
import { AppError } from '../../core/errors/AppError';
import { ErrorCodes } from '../../core/errors/ErrorCodes';

export class ResultsController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as unknown as ResultQuery;
      // If user is a student, restrict results to their own studentId!
      if (req.user?.role === 'student') {
        query.studentId = req.user.id;
      }

      const result = await resultsService.listResults(query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request<{}, {}, CreateResultInput>, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.id) {
        throw AppError.unauthorized('Not authenticated', ErrorCodes.UNAUTHORIZED);
      }
      const newResult = await resultsService.createResult(req.body, req.user.id);
      res.status(201).json({ success: true, message: 'Result published successfully', data: newResult });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request<{ id: string }, {}, UpdateResultInput>, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) throw AppError.badRequest('Invalid result ID');
      const updated = await resultsService.updateResult(id, req.body);
      res.status(200).json({ success: true, message: 'Result updated successfully', data: updated });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) throw AppError.badRequest('Invalid result ID');
      await resultsService.deleteResult(id);
      res.status(200).json({ success: true, message: 'Result deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const resultsController = new ResultsController();
