import { Router } from 'express';
import { isAdmin, requireAuth } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { listBrands, createBrand, updateBrand, deleteBrand } from '../controllers/brand.controller.js';
import {
  createBrandSchema,
  updateBrandSchema,
  deleteBrandSchema
} from '../validators/brand.validator.js';

export const brandRouter = Router();

brandRouter.get('/brands', listBrands);
brandRouter.post('/brands', requireAuth, isAdmin, validate(createBrandSchema), createBrand);
brandRouter.put('/brands/:id', requireAuth, isAdmin, validate(updateBrandSchema), updateBrand);
brandRouter.delete('/brands/:id', requireAuth, isAdmin, validate(deleteBrandSchema), deleteBrand);


