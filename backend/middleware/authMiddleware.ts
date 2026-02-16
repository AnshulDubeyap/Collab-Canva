import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { AppError } from '../errors/AppError';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return next(new AppError('Not authorized to access this route', 401));
    }
    req.user = user;
    next();
  })(req, res, next);
};
