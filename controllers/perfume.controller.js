import { Perfume } from '../models/Perfume.js';

export async function listPerfumes(req, res) {
  const { q, brand, concentration, targetAudience } = req.query;
  const filter = {};
  if (q) filter.perfumeName = { $regex: q, $options: 'i' };
  if (brand) filter.brand = brand;
  if (concentration) filter.concentration = concentration;
  if (targetAudience) filter.targetAudience = targetAudience;
  const perfumes = await Perfume.find(filter).populate('brand', 'brandName').sort({ createdAt: -1 });
  res.json(perfumes);
}

export async function getPerfume(req, res) {
  const perfume = await Perfume.findById(req.params.id).populate('brand', 'brandName');
  if (!perfume) return res.status(404).json({ message: 'Not found' });
  res.json(perfume);
}

export async function createPerfume(req, res) {
  const p = await Perfume.create(req.body);
  const populated = await p.populate('brand', 'brandName');
  res.status(201).json(populated);
}

export async function updatePerfume(req, res) {
  const updated = await Perfume.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('brand', 'brandName');
  res.json(updated);
}

export async function deletePerfume(req, res) {
  await Perfume.findByIdAndDelete(req.params.id);
  res.status(204).end();
}


