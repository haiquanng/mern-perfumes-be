// Load env vars FIRST before any imports that use them
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Import database connection
import connectDB from './config/database.js';

// Import Firebase config
import { initializeFirebase } from './config/firebase.js';

// Import middleware
import errorHandler from './middleware/errorMiddleware.js';
import { requestLogger } from './utils/logger.js';

// Import routes
import { registerRouter } from './routes/auth.routes.js';
import { brandRouter } from './routes/brand.routes.js';
import { perfumeRouter } from './routes/perfume.routes.js';
import { commentRouter } from './routes/comment.routes.js';
import { adminRouter } from './routes/admin.routes.js';
import { aiRouter } from './routes/ai.routes.js';

// Connect to database
connectDB();

// Initialize Firebase (optional - only if credentials are provided)
try {
  if (process.env.FIREBASE_PROJECT_ID) {
    initializeFirebase();
  }
} catch (error) {
  console.warn('Firebase not initialized:', error.message);
}

const app = express();

// Security middleware
app.use(helmet());

// Logging middleware
app.use(morgan('dev'));
app.use(requestLogger);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  credentials: true
}));

// Health check
app.get('/health', (req, res) => res.json({
  status: 'ok',
  timestamp: new Date().toISOString(),
  environment: process.env.NODE_ENV
}));

// Debug endpoint for API keys (remove in production)
app.get('/debug/env', (req, res) => {
  const geminiKey = process.env.GEMINI_API_KEY;
  res.json({
    gemini_key_exists: !!geminiKey,
    gemini_key_length: geminiKey?.length || 0,
    gemini_key_preview: geminiKey ? `${geminiKey.substring(0, 10)}...${geminiKey.substring(geminiKey.length - 5)}` : 'NOT_FOUND',
    node_env: process.env.NODE_ENV,
    port: process.env.PORT
  });
});

// Mount routers
app.use('/api', registerRouter);
app.use('/api', brandRouter);
app.use('/api', perfumeRouter);
app.use('/api', commentRouter);
app.use('/api', adminRouter);
app.use('/api', aiRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});


