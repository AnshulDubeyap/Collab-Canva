import User, { IUser } from '../../models/User';
import { AppError } from '../../errors/AppError';
import crypto from 'crypto';
import { sendVerificationEmail } from '../../utils/emailService';

class UserService {
  // Get User Profile
  async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  // Update Profile
  async updateProfile(userId: string, updateData: Partial<IUser>) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  // Request Email Change
  async requestEmailChange(userId: string, newEmail: string, currentPassword?: string) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify password if it's a local account
    if (!user.googleId) {
        if (!currentPassword) {
            throw new AppError('Password is required to change email', 400);
        }
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            throw new AppError('Incorrect password', 401);
        }
    }

    // Check if email already taken
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      throw new AppError('Email already in use', 400);
    }

    // Generate 6-digit numeric token
    const token = crypto.randomInt(100000, 999999).toString();
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Save to DB
    user.newEmail = newEmail;
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    // Send Real Email
    await sendVerificationEmail(newEmail, token);
    
    return token;
  }

  // Verify Email Change
  async verifyEmailChange(userId: string, token: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      _id: userId,
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError('Invalid or expired token', 400);
    }

    // Update Email
    user.email = user.newEmail!;
    user.newEmail = undefined;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    return user;
  }
}

export default new UserService();
