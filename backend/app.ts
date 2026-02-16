// IMPORTANT: Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import Logger from './utils/logger';
import passport from './config/passport';

const app = express();

const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: {
      write: (message) => Logger.http(message.trim()),
    },
  }
);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true, // Allow cookies to be sent
}));
app.use(morganMiddleware);
app.use(express.json());
app.use(cookieParser()); // Parse cookies from requests
app.use(passport.initialize());

import authRoutes from './features/auth/auth.routes';
import userRoutes from './features/user/user.routes';
import { errorHandler } from './middleware/errorMiddleware';

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
