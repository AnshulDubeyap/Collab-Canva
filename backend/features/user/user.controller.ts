import { Request, Response, NextFunction } from 'express';
import UserService from './user.service';
import { AppError } from '../../errors/AppError';
import { updateProfileSchema, requestEmailChangeSchema, verifyEmailChangeSchema } from './user.validation';
import { UserProfileResponse, EmailChangeResponse } from './user.dto';

class UserController {
  // Get Current User Profile
  async getProfile(req: Request, res: Response<UserProfileResponse>, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return next(new AppError('User ID missing', 400));
      }
      const user = await UserService.getProfile(req.user.id);

      res.status(200).json({
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
      next(err);
    }
  }

  // Update Profile (Name, Avatar)
  async updateProfile(req: Request, res: Response<UserProfileResponse>, next: NextFunction) {
    try {
      const { error } = updateProfileSchema.validate(req.body);
      if (error) {
        return next(new AppError(error.details[0].message, 400));
      }

      if (!req.user?.id) {
        return next(new AppError('User ID missing', 400));
      }

      const user = await UserService.updateProfile(req.user.id, req.body);

      res.status(200).json({
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
      next(err);
    }
  }

  // Request Email Change
  async requestEmailChange(req: Request, res: Response<EmailChangeResponse>, next: NextFunction) {
    try {
      const { error } = requestEmailChangeSchema.validate(req.body);
      if (error) {
        return next(new AppError(error.details[0].message, 400));
      }

      if (!req.user?.id) {
        return next(new AppError('User ID missing', 400));
      }

      const { newEmail, currentPassword } = req.body;
      const token = await UserService.requestEmailChange(req.user.id, newEmail, currentPassword);

      res.status(200).json({
        success: true,
        message: 'Verification token sent to new email (Check server console)',
      });
    } catch (err) {
      next(err);
    }
  }

  // Verify Email Change
  async verifyEmailChange(req: Request, res: Response<EmailChangeResponse>, next: NextFunction) {
    try {
      const { error } = verifyEmailChangeSchema.validate(req.body);
      if (error) {
        return next(new AppError(error.details[0].message, 400));
      }

      if (!req.user?.id) {
        return next(new AppError('User ID missing', 400));
      }

      const { token } = req.body;
      await UserService.verifyEmailChange(req.user.id, token);

      res.status(200).json({
        success: true,
        message: 'Email updated successfully',
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
