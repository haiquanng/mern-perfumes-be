import mongoose, { Schema } from 'mongoose';

const perfumeSchema = new Schema({
  perfumeName: { type: String, required: true },
  uri: { type: String, required: true },
  price: { type: Number, required: true },
  concentration: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: String,
  volume: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  targetAudience: { type: String, enum: ['male', 'female', 'unisex'], required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brands', required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comments' }],
  averageRating: { type: Number, default: 0 },
}, { timestamps: true });

export const Perfume = mongoose.model('Perfumes', perfumeSchema);


