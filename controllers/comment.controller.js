import { Comment } from '../models/Comment.js';
import { Perfume } from '../models/Perfume.js';

export async function addComment(req, res) {
  const { id } = req.params;
  const { rating, content } = req.body;
  const existing = await Comment.findOne({ author: req.user.id, perfume: id });
  if (existing) return res.status(400).json({ message: 'Already commented' });
  const comment = await Comment.create({ rating, content, author: req.user.id, perfume: id });
  await Perfume.findByIdAndUpdate(id, { $push: { comments: comment._id } });
  const stats = await Comment.aggregate([
    { $match: { perfume: comment.perfume } },
    { $group: { _id: '$perfume', avg: { $avg: '$rating' } } }
  ]);
  const avg = stats[0]?.avg || 0;
  await Perfume.findByIdAndUpdate(id, { averageRating: avg });
  res.status(201).json(comment);
}

export async function getComments(req, res) {
  const { id } = req.params;
  const comments = await Comment.find({ perfume: id }).populate('author', 'name');
  res.json(comments);
}


