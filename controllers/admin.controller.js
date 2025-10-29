import { Member } from '../models/Member.js';
import { Perfume } from '../models/Perfume.js';
import { Brand } from '../models/Brand.js';
import { Comment } from '../models/Comment.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const listCollectors = asyncHandler(async (req, res) => {
  const members = await Member.find().select('-password').sort({ createdAt: -1 });
  res.json(members);
});

/**
 * Get dashboard statistics for admin
 * Returns total counts and average rating
 */
export const getStats = asyncHandler(async (req, res) => {
  // Run all queries in parallel for better performance
  const [
    totalUsers,
    totalProducts,
    totalBrands,
    totalComments,
    ratingStats
  ] = await Promise.all([
    // Count total users
    Member.countDocuments(),

    // Count total perfumes
    Perfume.countDocuments(),

    // Count total brands
    Brand.countDocuments(),

    // Count total comments/reviews
    Comment.countDocuments(),

    // Calculate average rating across all products
    Perfume.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$averageRating' },
          totalWithRatings: {
            $sum: {
              $cond: [{ $gt: ['$averageRating', 0] }, 1, 0]
            }
          }
        }
      }
    ])
  ]);

  // Get top rated products
  const topRatedProducts = await Perfume.find({ averageRating: { $gt: 0 } })
    .sort({ averageRating: -1 })
    .limit(5)
    .populate('brand', 'brandName')
    .select('perfumeName averageRating uri');

  // Get recent users (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentUsersCount = await Member.countDocuments({
    createdAt: { $gte: sevenDaysAgo }
  });

  // Get products with most comments
  const mostReviewedProducts = await Perfume.find()
    .sort({ comments: -1 })
    .limit(5)
    .populate('brand', 'brandName')
    .select('perfumeName averageRating uri comments')
    .lean();

  // Add comment count to each product
  for (const product of mostReviewedProducts) {
    product.commentCount = product.comments?.length || 0;
  }

  const stats = {
    overview: {
      totalUsers,
      totalProducts,
      totalBrands,
      totalComments,
      averageRatingAcrossAllProducts: ratingStats[0]?.averageRating
        ? parseFloat(ratingStats[0].averageRating.toFixed(2))
        : 0,
      productsWithRatings: ratingStats[0]?.totalWithRatings || 0,
      recentUsersCount // Users registered in last 7 days
    },
    topRatedProducts: topRatedProducts.map(p => ({
      id: p._id,
      name: p.perfumeName,
      brand: p.brand?.brandName || 'Unknown',
      rating: parseFloat(p.averageRating.toFixed(2)),
      image: p.uri
    })),
    mostReviewedProducts: mostReviewedProducts.map(p => ({
      id: p._id,
      name: p.perfumeName,
      brand: p.brand?.brandName || 'Unknown',
      rating: p.averageRating ? parseFloat(p.averageRating.toFixed(2)) : 0,
      commentCount: p.commentCount,
      image: p.uri
    }))
  };

  res.json(stats);
});

