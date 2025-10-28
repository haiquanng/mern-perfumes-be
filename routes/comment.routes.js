import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { addComment, getComments } from '../controllers/comment.controller.js';

export const commentRouter = Router();

commentRouter.post('/perfumes/:id/comments', requireAuth, addComment);
commentRouter.get('/perfumes/:id/comments', getComments);


