import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import { getSimilar, getSummary, chat } from '../controllers/ai.controller.js';
import { getSimilarSchema, getSummarySchema, chatSchema } from '../validators/ai.validator.js';

export const aiRouter = Router();

aiRouter.get('/ai/similar/:perfumeId', validate(getSimilarSchema), getSimilar);
aiRouter.get('/ai/summary/:perfumeId', validate(getSummarySchema), getSummary);
aiRouter.post('/ai/chat', validate(chatSchema), chat);


