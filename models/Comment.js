import mongoose, { Schema } from 'mongoose';

const commentSchema = new Schema({
  rating: { type: Number, min: 1, max: 5, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Members', required: true },
  perfume: { type: mongoose.Schema.Types.ObjectId, ref: 'Perfumes', required: true },
}, { timestamps: true });

export const Comment = mongoose.model('Comments', commentSchema);


