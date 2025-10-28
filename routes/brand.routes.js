import { Router } from 'express';
import { isAdmin, requireAuth } from '../middlewares/auth.js';
import { listBrands, createBrand, updateBrand, deleteBrand } from '../controllers/brand.controller.js';

export const brandRouter = Router();

brandRouter.get('/brands', listBrands);
brandRouter.post('/brands', requireAuth, isAdmin, createBrand);
brandRouter.put('/brands/:id', requireAuth, isAdmin, updateBrand);
brandRouter.delete('/brands/:id', requireAuth, isAdmin, deleteBrand);


