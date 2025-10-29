import mongoose, { Schema } from 'mongoose';

const memberSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  yob: Number,
  gender: { type: Boolean },
  isAdmin: { type: Boolean, default: false },
  firebaseUid: { type: String, unique: true, sparse: true },
  googleAvatar: { type: String }, 
}, { timestamps: true });

export const Member = mongoose.model('Members', memberSchema);


