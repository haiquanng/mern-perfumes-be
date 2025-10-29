import { Comment } from '../models/Comment.js';
import { Perfume } from '../models/Perfume.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import mongoose from 'mongoose';

export const addComment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, content } = req.body;

  // Check if perfume exists
  const perfume = await Perfume.findById(id);
  if (!perfume) return res.status(404).json({ message: 'Perfume not found' });

  // Check if user already commented
  const existing = await Comment.findOne({ author: req.user.id, perfume: id });
  if (existing) return res.status(400).json({ message: 'You have already commented on this perfume' });

  // Create comment
  const comment = await Comment.create({ rating, content, author: req.user.id, perfume: id });

  // Add comment to perfume
  await Perfume.findByIdAndUpdate(id, { $push: { comments: comment._id } });

  // Update average rating
  const stats = await Comment.aggregate([
    { $match: { perfume: new mongoose.Types.ObjectId(id) } },
    { $group: { _id: '$perfume', avg: { $avg: '$rating' } } }
  ]);
  const avg = stats[0]?.avg || 0;
  await Perfume.findByIdAndUpdate(id, { averageRating: avg });

  const populated = await comment.populate('author', 'name');
  res.status(201).json(populated);
});

export const getComments = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const comments = await Comment.find({ perfume: id }).populate('author', 'name').sort({ createdAt: -1 });
  res.json(comments);
});


