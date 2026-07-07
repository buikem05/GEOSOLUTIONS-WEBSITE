import { Request, Response, NextFunction } from 'express';
import { paymentsService } from './payments.service';
import { CreatePaymentInput, VerifyPaymentInput, CreateSubscriptionInput } from './payments.schema';
import { AppError } from '../../core/errors/AppError';
import { ErrorCodes } from '../../core/errors/ErrorCodes';

export class PaymentsController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const studentId = req.user?.role === 'student' ? req.user.id : undefined;
      const payments = await paymentsService.listPayments(studentId);
      res.status(200).json({ success: true, data: payments });
    } catch (error) {
      next(error);
    }
  }

  async initialize(req: Request<{}, {}, CreatePaymentInput>, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.id) throw AppError.unauthorized('Not authenticated', ErrorCodes.UNAUTHORIZED);
      const payment = await paymentsService.initializePayment(req.body, req.user.id);
      res.status(201).json({ success: true, message: 'Payment initialized', data: payment });
    } catch (error) {
      next(error);
    }
  }

  async verify(req: Request<{}, {}, VerifyPaymentInput>, res: Response, next: NextFunction): Promise<void> {
    try {
      const verified = await paymentsService.verifyPayment(req.body);
      res.status(200).json({ success: true, message: 'Payment verified successfully', data: verified });
    } catch (error) {
      next(error);
    }
  }

  async getMySubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user?.id) throw AppError.unauthorized('Not authenticated');
      const sub = await paymentsService.getSubscription(req.user.id);
      res.status(200).json({ success: true, data: sub });
    } catch (error) {
      next(error);
    }
  }

  async manageSubscription(req: Request<{}, {}, CreateSubscriptionInput>, res: Response, next: NextFunction): Promise<void> {
    try {
      const sub = await paymentsService.manageSubscription(req.body);
      res.status(200).json({ success: true, message: 'Subscription updated', data: sub });
    } catch (error) {
      next(error);
    }
  }
}

export const paymentsController = new PaymentsController();
