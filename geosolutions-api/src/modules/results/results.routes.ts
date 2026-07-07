import { Router } from 'express';
import { resultsController } from './results.controller';
import { authenticate, requireRole } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { CreateResultSchema, UpdateResultSchema, ResultQuerySchema } from './results.schema';
import { cacheMiddleware } from '../../middleware/cache.middleware';

const router = Router();

router.use(authenticate);

// Students, teachers, and admins can view results (students only see their own via controller logic)
router.get('/', validate({ query: ResultQuerySchema }), cacheMiddleware(300), resultsController.list);

// Teachers and Admins can publish, edit, and delete results
router.post('/', requireRole('teacher', 'admin'), validate({ body: CreateResultSchema }), resultsController.create);
router.patch('/:id', requireRole('teacher', 'admin'), validate({ body: UpdateResultSchema }), resultsController.update);
router.delete('/:id', requireRole('teacher', 'admin'), resultsController.delete);

export default router;
