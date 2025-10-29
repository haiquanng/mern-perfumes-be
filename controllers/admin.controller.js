import { Member } from '../models/Member.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const listCollectors = asyncHandler(async (req, res) => {
  const members = await Member.find().select('-password').sort({ createdAt: -1 });
  res.json(members);
});


