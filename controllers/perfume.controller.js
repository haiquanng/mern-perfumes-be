import { Perfume } from '../models/Perfume.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const listPerfumes = asyncHandler(async (req, res) => {
  const { q, brand, concentration, targetAudience } = req.query;
  const filter = {};
  if (q) filter.perfumeName = { $regex: q, $options: 'i' };
  if (brand) filter.brand = brand;
  if (concentration) filter.concentration = concentration;
  if (targetAudience) filter.targetAudience = targetAudience;
  const perfumes = await Perfume.find(filter).populate('brand', 'brandName').sort({ createdAt: -1 });
  res.json(perfumes);
});

export const getPerfume = asyncHandler(async (req, res) => {
  const perfume = await Perfume.findById(req.params.id).populate('brand', 'brandName');
  if (!perfume) return res.status(404).json({ message: 'Perfume not found' });
  res.json(perfume);
});

export const createPerfume = asyncHandler(async (req, res) => {
  const p = await Perfume.create(req.body);
  const populated = await p.populate('brand', 'brandName');
  res.status(201).json(populated);
});

export const updatePerfume = asyncHandler(async (req, res) => {
  const updated = await Perfume.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('brand', 'brandName');
  if (!updated) return res.status(404).json({ message: 'Perfume not found' });
  res.json(updated);
});

export const deletePerfume = asyncHandler(async (req, res) => {
  const perfume = await Perfume.findByIdAndDelete(req.params.id);
  if (!perfume) return res.status(404).json({ message: 'Perfume not found' });
  res.status(204).end();
});


