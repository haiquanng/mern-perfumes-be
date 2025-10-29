import { Router } from 'express';
import { isAdmin, requireAuth } from '../middleware/authMiddleware.js';
import { listCollectors } from '../controllers/admin.controller.js';

export const adminRouter = Router();

adminRouter.get('/collectors', requireAuth, isAdmin, listCollectors);


