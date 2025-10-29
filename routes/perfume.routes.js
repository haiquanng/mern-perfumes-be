import { Router } from 'express';
import { isAdmin, requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { listPerfumes, getPerfume, createPerfume, updatePerfume, deletePerfume } from '../controllers/perfume.controller.js';
import {
  listPerfumesSchema,
  getPerfumeSchema,
  createPerfumeSchema,
  updatePerfumeSchema,
  deletePerfumeSchema
} from '../validators/perfume.validator.js';

export const perfumeRouter = Router();

perfumeRouter.get('/perfumes', validate(listPerfumesSchema), listPerfumes);
perfumeRouter.get('/perfumes/:id', validate(getPerfumeSchema), getPerfume);
perfumeRouter.post('/perfumes', requireAuth, isAdmin, validate(createPerfumeSchema), createPerfume);
perfumeRouter.put('/perfumes/:id', requireAuth, isAdmin, validate(updatePerfumeSchema), updatePerfume);
perfumeRouter.delete('/perfumes/:id', requireAuth, isAdmin, validate(deletePerfumeSchema), deletePerfume);


