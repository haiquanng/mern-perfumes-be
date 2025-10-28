import { GeminiCache } from '../models/GeminiCache.js';
import { Perfume } from '../models/Perfume.js';

export async function getSimilar(req, res) {
  const { perfumeId } = req.params;
  const perfume = await Perfume.findById(perfumeId);
  if (!perfume) return res.status(404).json({ message: 'Not found' });
  const cache = await GeminiCache.findOne({ perfumeId });
  if (cache?.similarPerfumes?.length) {
    const perfumes = await Perfume.find({ _id: { $in: cache.similarPerfumes } });
    return res.json(perfumes);
  }
  return res.json([]);
}

export async function getSummary(req, res) {
  const { perfumeId } = req.params;
  const perfume = await Perfume.findById(perfumeId);
  if (!perfume) return res.status(404).json({ message: 'Not found' });
  const cache = await GeminiCache.findOne({ perfumeId });
  return res.json({ summary: cache?.aiReviewSummary || '' });
}

export async function chat(req, res) {
  const { query } = req.body;
  if (!query) return res.status(400).json({ message: 'Missing query' });
  res.json({ reply: 'Gemini integration not yet implemented.' });
}


