import { Router } from 'express';
import { getSimilar, getSummary, chat } from '../controllers/ai.controller.js';

export const aiRouter = Router();

aiRouter.get('/ai/similar/:perfumeId', getSimilar);
aiRouter.get('/ai/summary/:perfumeId', getSummary);
aiRouter.post('/ai/chat', chat);


