
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import AuthService from './auth.service';
import { registerSchema, loginSchema } from './auth.validation';
import { AppError } from '../../errors/AppError';

class AuthController {
  // Register User
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Validate Input
      const { error } = registerSchema.validate(req.body);
      if (error) {
        return next(new AppError(error.details[0].message, 400));
      }

      const { user, token } = await AuthService.register(req.body);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  // Login User
  async login(req: Request, res: Response, next: NextFunction) {
    // Validate Input
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new AppError(info?.message || 'Invalid credentials', 401));
      }

      req.logIn(user, { session: false }, async (err) => {
        if (err) {
          return next(err);
        }

        const { token } = await AuthService.login(user);

        res.status(200).json({
          success: true,
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      });
    })(req, res, next);
  }

  // Google OAuth
  googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email'],
  });

  // Google Callback
  googleCallback = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', { session: false }, async (err: any, user: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect('/login?error=auth_failed');
      }

      const { token } = await AuthService.googleLogin(user);

      // Redirect to frontend with token
      // In production, better to use a secure cookie or a temporary code exchange
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/success?token=${token}`);
    })(req, res, next);
  };
}

export default new AuthController();
