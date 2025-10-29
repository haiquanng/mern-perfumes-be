import { GeminiCache } from '../models/GeminiCache.js';
import { Perfume } from '../models/Perfume.js';
import { Comment } from '../models/Comment.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { geminiService } from '../services/gemini.service.js';

export const getSimilar = asyncHandler(async (req, res) => {
  const { perfumeId } = req.params;
  const { forceRefresh } = req.query;

  // Lấy thông tin perfume với brand
  const perfume = await Perfume.findById(perfumeId).populate('brand', 'brandName');
  if (!perfume) return res.status(404).json({ message: 'Perfume not found' });

  // Kiểm tra cache nếu không force refresh
  if (!forceRefresh) {
    const cache = await GeminiCache.findOne({ perfumeId });
    if (cache?.similarPerfumes?.length) {
      const perfumes = await Perfume.find({ _id: { $in: cache.similarPerfumes } })
        .populate('brand', 'brandName');
      return res.json({
        perfumes,
        source: 'cache',
        cachedAt: cache.lastUpdated
      });
    }
  }

  // Nếu không có cache hoặc force refresh, dùng AI phân tích
  try {
    const similarIds = await geminiService.analyzeSimilarPerfumes(perfume);

    // Cache kết quả
    await GeminiCache.findOneAndUpdate(
      { perfumeId },
      {
        perfumeId,
        similarPerfumes: similarIds,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );

    // Lấy thông tin chi tiết các perfumes tương tự
    const perfumes = await Perfume.find({ _id: { $in: similarIds } })
      .populate('brand', 'brandName');

    return res.json({
      perfumes,
      source: 'ai_analysis',
      analyzedAt: new Date()
    });
  } catch (error) {
    console.error('AI analysis error:', error);
    return res.status(500).json({
      message: 'Failed to analyze similar perfumes',
      error: error.message
    });
  }
});

export const getSummary = asyncHandler(async (req, res) => {
  const { perfumeId } = req.params;
  const { forceRefresh } = req.query;

  // Lấy thông tin perfume với brand
  const perfume = await Perfume.findById(perfumeId).populate('brand', 'brandName');
  if (!perfume) return res.status(404).json({ message: 'Perfume not found' });

  // Kiểm tra cache nếu không force refresh
  if (!forceRefresh) {
    const cache = await GeminiCache.findOne({ perfumeId });
    if (cache?.aiReviewSummary) {
      return res.json({
        summary: cache.aiReviewSummary,
        source: 'cache',
        cachedAt: cache.lastUpdated
      });
    }
  }

  // Nếu không có cache hoặc force refresh, generate summary từ reviews
  try {
    // Lấy tất cả comments của perfume này
    const reviews = await Comment.find({ perfume: perfumeId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    const summary = await geminiService.generateSummary(perfume, reviews);

    // Cache kết quả
    await GeminiCache.findOneAndUpdate(
      { perfumeId },
      {
        perfumeId,
        aiReviewSummary: summary,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );

    return res.json({
      summary,
      source: 'ai_generated',
      generatedAt: new Date(),
      reviewsCount: reviews.length
    });
  } catch (error) {
    console.error('Summary generation error:', error);
    return res.status(500).json({
      message: 'Failed to generate summary',
      error: error.message
    });
  }
});

export const chat = asyncHandler(async (req, res) => {
  const { query, includeContext, stream } = req.body;

  if (!query || typeof query !== 'string') {
    return res.status(400).json({ message: 'Query is required and must be a string' });
  }

  try {
    let context = {};

    // Nếu request muốn context, lấy danh sách perfumes
    if (includeContext) {
      const perfumes = await Perfume.find()
        .populate('brand', 'brandName')
        .select('perfumeName brand price concentration targetAudience description averageRating')
        .limit(50)
        .sort({ averageRating: -1 });

      context.perfumes = perfumes;
    }

    // Nếu request streaming
    if (stream) {
      // Set headers cho Server-Sent Events
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering

      // Send initial connection event
      res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date() })}\n\n`);

      try {
        // Stream response từ Gemini
        for await (const chunk of geminiService.chatStream(query, context)) {
          res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
        }

        // Send completion event
        res.write(`data: ${JSON.stringify({ type: 'done', timestamp: new Date() })}\n\n`);
        res.end();
      } catch (streamError) {
        res.write(`data: ${JSON.stringify({ type: 'error', message: streamError.message })}\n\n`);
        res.end();
      }
    } else {
      // Non-streaming response (normal)
      const reply = await geminiService.chat(query, context);

      return res.json({
        reply,
        query,
        timestamp: new Date()
      });
    }
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({
      message: 'Failed to process chat request',
      error: error.message
    });
  }
});


