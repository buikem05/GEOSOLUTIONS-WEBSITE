import { Router } from 'express';
import { paymentsController } from './payments.controller';
import { authenticate, requireRole } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { CreatePaymentSchema, VerifyPaymentSchema, CreateSubscriptionSchema } from './payments.schema';
import { cacheMiddleware } from '../../middleware/cache.middleware';

const router = Router();

router.use(authenticate);

// List user's payments or all payments if admin
router.get('/', cacheMiddleware(120), paymentsController.list);
router.get('/subscription', cacheMiddleware(60), paymentsController.getMySubscription);

// Initialize payment (student or teacher)
router.post('/initialize', validate({ body: CreatePaymentSchema }), paymentsController.initialize);

// Verify payment (webhook callback or admin)
router.post('/verify', requireRole('admin', 'computer'), validate({ body: VerifyPaymentSchema }), paymentsController.verify);

// Manage subscription (admin only)
router.post('/subscription', requireRole('admin'), validate({ body: CreateSubscriptionSchema }), paymentsController.manageSubscription);

export default router;
