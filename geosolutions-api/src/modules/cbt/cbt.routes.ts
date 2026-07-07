import { Router } from 'express';
import { cbtController } from './cbt.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { StartExamSchema, SubmitExamSchema, ProctorAnalyzeSchema } from './cbt.schema';
import { cacheMiddleware } from '../../middleware/cache.middleware';

const router = Router();

router.use(authenticate);

// Get question bank (cached in Redis for 10 minutes)
router.get('/questions', cacheMiddleware(600), cbtController.getQuestions);

// Start exam session
router.post('/start', validate({ body: StartExamSchema }), cbtController.start);

// AI Proctoring frame analysis telemetry endpoint
router.post('/proctor/analyze', validate({ body: ProctorAnalyzeSchema }), cbtController.proctor);

// Submit and grade exam
router.post('/submit', validate({ body: SubmitExamSchema }), cbtController.submit);

export default router;
