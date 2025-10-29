import { Brand } from '../models/Brand.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const listBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find().sort({ brandName: 1 });
  res.json(brands);
});

export const createBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.create(req.body);
  res.status(201).json(brand);
});

export const updateBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!brand) return res.status(404).json({ message: 'Brand not found' });
  res.json(brand);
});

export const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) return res.status(404).json({ message: 'Brand not found' });
  res.status(204).end();
});


