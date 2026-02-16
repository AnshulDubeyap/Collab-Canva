
import { BaseRequest, BaseResponse } from '../../interface/BaseDTO';

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface RegisterRequest extends BaseRequest {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  googleId?: string;
}

export interface RegisterResponse extends BaseResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    googleId?: string;
  };
}

export interface LoginRequest extends BaseRequest {
  email: string;
  password?: string;
}

export interface LoginResponse extends BaseResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    googleId?: string;
  };
}
