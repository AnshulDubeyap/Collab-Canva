
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import AuthService from './auth.service';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.validation';
import { AppError } from '../../errors/AppError';
import { RegisterRequest, RegisterResponse, LoginResponse } from './auth.dto';
import { setAuthCookie, clearAuthCookie } from '../../utils/cookieUtils';

class AuthController {
  // Register User
  async register(req: Request<{}, {}, RegisterRequest>, res: Response<RegisterResponse>, next: NextFunction) {
    try {
      console.log('Register request received:', req.body);
      // Validate Input
      const { error } = registerSchema.validate(req.body);
      if (error) {
        console.error('Validation error:', error.details[0].message);
        return next(new AppError(error.details[0].message, 400));
      }

      console.log('Calling AuthService.register...');
      const { user, token } = await AuthService.register(req.body);
      console.log('AuthService.register successful');

      // Set httpOnly cookie
      setAuthCookie(res, token);

      res.status(201).json({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          googleId: user.googleId,
        },
      });
    } catch (err) {
      console.error('Register failed:', err);
      // Log stack trace if available
      if (err instanceof Error) {
          console.error(err.stack);
      }
      next(err);
    }
  }

  // Login User
  async login(req: Request, res: Response<LoginResponse>, next: NextFunction) {
    // Validate Input
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    // Authenticate function in passport JS, directs us to the passport middlewares(strategy middleware)
    passport.authenticate('local', (err: any, user: any, info: any) => {
      // Error handling
      if (err) {
        return next(err);
      }
      // User not found
      if (!user) {  
        return next(new AppError(info?.message || 'Invalid credentials', 401));
      }

      // Login user
      req.logIn(user, { session: false }, async (err) => {
        if (err) {
          return next(err);
        }

        const { token } = await AuthService.login(user);

        // Set httpOnly cookie
        setAuthCookie(res, token);

        res.status(200).json({
          success: true,
          message: 'Logged in successfully',
          user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          googleId: user.googleId,
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

      // Set httpOnly cookie before redirect
      setAuthCookie(res, token);

      // Redirect to frontend without token in URL
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/success`);
    })(req, res, next);
  };

  // Logout
  logout = (req: Request, res: Response) => {
    clearAuthCookie(res);
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  };

  // Forgot Password
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = forgotPasswordSchema.validate(req.body);
      if (error) {
        return next(new AppError(error.details[0].message, 400));
      }

      await AuthService.forgotPassword(req.body.email);

      res.status(200).json({
        success: true,
        message: 'Password reset link sent to email',
      });
    } catch (err) {
      next(err);
    }
  }

  // Reset Password
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { error } = resetPasswordSchema.validate(req.body);
      if (error) {
        return next(new AppError(error.details[0].message, 400));
      }

      const { token, password } = req.body;
      await AuthService.resetPassword(token, password);

      res.status(200).json({
        success: true,
        message: 'Password reset successfully',
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
