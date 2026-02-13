
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import { RegisterUser, TokenPayload } from './auth.dto';
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
  async register(userData: RegisterUser) {
    const { email } = userData;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    // Create user
    const user = await User.create({
      ...userData,
      role: UserRole.USER,
    });

    const token = this.generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  // Login (User already verified by Passport)
  async login(user: any) {
    const token = this.generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  // Google Login (User verified by Passport Google Strategy)
  async googleLogin(user: any) {
     const token = this.generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }
}

export default new AuthService();
