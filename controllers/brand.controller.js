import { Brand } from '../models/Brand.js';

export async function listBrands(req, res) {
  const brands = await Brand.find().sort({ brandName: 1 });
  res.json(brands);
}
export async function createBrand(req, res) {
  const brand = await Brand.create(req.body);
  res.status(201).json(brand);
}
export async function updateBrand(req, res) {
  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(brand);
}
export async function deleteBrand(req, res) {
  await Brand.findByIdAndDelete(req.params.id);
  res.status(204).end();
}


