import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { addComment, getComments } from '../controllers/comment.controller.js';
import { addCommentSchema, getCommentsSchema } from '../validators/comment.validator.js';

export const commentRouter = Router();

commentRouter.post('/perfumes/:id/comments', requireAuth, validate(addCommentSchema), addComment);
commentRouter.get('/perfumes/:id/comments', validate(getCommentsSchema), getComments);


