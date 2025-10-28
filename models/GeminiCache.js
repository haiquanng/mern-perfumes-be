import mongoose, { Schema } from 'mongoose';

const geminiCacheSchema = new Schema({
  perfumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Perfumes', unique: true },
  aiReviewSummary: String,
  similarPerfumes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Perfumes' }],
  lastUpdated: { type: Date, default: Date.now }
});

export const GeminiCache = mongoose.model('GeminiCache', geminiCacheSchema);


