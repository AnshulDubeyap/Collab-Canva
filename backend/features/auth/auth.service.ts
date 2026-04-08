
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User, { IUser } from '../../models/User';
import { RegisterRequest, TokenPayload } from './auth.dto';
import { UserRole } from '../../enums/userRole';
import { AppError } from "../../errors/AppError";

// Ensure JWT_SECRET is available
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

class AuthService {
  // Generate JWT Token
  private generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET as jwt.Secret, {
      expiresIn: JWT_EXPIRE as any,
    });
  }

  // Register user
  async register(userData: RegisterRequest) {
    const { email } = userData;

    console.log('Checking if user exists:', email);
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn('User already exists:', email);
      throw new AppError('User already exists', 400);
    }

    console.log('Creating user in database...');
    // Create user
    try {
        const user = await User.create({
          ...userData,
          role: UserRole.USER,
        });
        console.log('User created:', user._id);

        const token = this.generateToken({
          userId: user._id.toString(),
          email: user.email,
          role: user.role,
        });

        return { user, token };
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
  }

  // Login (User already verified by Passport)
  async login(user: IUser) {
    const token = this.generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  // Google Login (User verified by Passport Google Strategy)
  async googleLogin(user: IUser) {
     const token = this.generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  // Forgot Password
  async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Generate Token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Set Reset Token and Expiry (1 hour)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);

    await user.save();

    // MOCK EMAIL
    console.log(`[MOCK EMAIL SERVICE] Password Reset Token for ${email}: ${resetToken}`);

    return resetToken;
  }

  // Reset Password
  async resetPassword(token: string, password: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return user;
  }
}

export default new AuthService();
