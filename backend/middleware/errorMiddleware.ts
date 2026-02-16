import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';
import Logger from '../utils/logger';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Logger.error(`Error: ${err.message}`, { stack: err.stack });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  // Handle unexpected errors
  return res.status(500).json({
    success: false,
    status: 'error',
    message: 'Something went wrong!',
  });
};
