import mongoose, { Schema } from 'mongoose';

const brandSchema = new Schema({
  brandName: { type: String, required: true },
  description: String,
  country: String,
}, { timestamps: true });

export const Brand = mongoose.model('Brands', brandSchema);


