import { GeminiCache } from '../models/GeminiCache.js';
import { Perfume } from '../models/Perfume.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getSimilar = asyncHandler(async (req, res) => {
  const { perfumeId } = req.params;
  const perfume = await Perfume.findById(perfumeId);
  if (!perfume) return res.status(404).json({ message: 'Perfume not found' });

  const cache = await GeminiCache.findOne({ perfumeId });
  if (cache?.similarPerfumes?.length) {
    const perfumes = await Perfume.find({ _id: { $in: cache.similarPerfumes } }).populate('brand', 'brandName');
    return res.json(perfumes);
  }
  return res.json([]);
});

export const getSummary = asyncHandler(async (req, res) => {
  const { perfumeId } = req.params;
  const perfume = await Perfume.findById(perfumeId);
  if (!perfume) return res.status(404).json({ message: 'Perfume not found' });

  const cache = await GeminiCache.findOne({ perfumeId });
  return res.json({ summary: cache?.aiReviewSummary || '' });
});

export const chat = asyncHandler(async (req, res) => {
  const { query } = req.body;
  res.json({ reply: 'Gemini integration not yet implemented.' });
});


