// IMPORTANT: Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

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
app.use(cors());
app.use(morganMiddleware);
app.use(express.json());
app.use(passport.initialize());

import authRoutes from './features/auth/auth.routes';
app.use('/auth', authRoutes);

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
