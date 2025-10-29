import { Router } from 'express';
import { isAdmin, requireAuth } from '../middleware/authMiddleware.js';
import { listCollectors, getStats } from '../controllers/admin.controller.js';

export const adminRouter = Router();

adminRouter.get('/admin/stats', requireAuth, isAdmin, getStats);
adminRouter.get('/collectors', requireAuth, isAdmin, listCollectors);


