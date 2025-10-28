import { Router } from 'express';
import { isAdmin, requireAuth } from '../middlewares/auth.js';
import { listPerfumes, getPerfume, createPerfume, updatePerfume, deletePerfume } from '../controllers/perfume.controller.js';

export const perfumeRouter = Router();

perfumeRouter.get('/perfumes', listPerfumes);
perfumeRouter.get('/perfumes/:id', getPerfume);
perfumeRouter.post('/perfumes', requireAuth, isAdmin, createPerfume);
perfumeRouter.put('/perfumes/:id', requireAuth, isAdmin, updatePerfume);
perfumeRouter.delete('/perfumes/:id', requireAuth, isAdmin, deletePerfume);


