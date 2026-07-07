import { Router } from 'express';
import { usersController } from './users.controller';
import { authenticate, requireRole } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { ListUsersQuerySchema, UpdateStatusSchema, UserParamsSchema } from './users.schema';
import { cacheMiddleware } from '../../middleware/cache.middleware';

const router = Router();

// Protect all user administration routes with admin role guard
router.use(authenticate, requireRole('admin'));

router.get('/', validate({ query: ListUsersQuerySchema }), cacheMiddleware(60), usersController.list);
router.get('/:id', validate({ params: UserParamsSchema }), cacheMiddleware(120), usersController.getById);
router.patch('/:id/status', validate({ params: UserParamsSchema, body: UpdateStatusSchema }), usersController.updateStatus);
router.delete('/:id', validate({ params: UserParamsSchema }), usersController.delete);

export default router;
