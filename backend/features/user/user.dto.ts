import { BaseResponse } from '../../interface/BaseDTO';

export interface UserProfileResponse extends BaseResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    googleId?: string;
  };
}

export interface EmailChangeResponse extends BaseResponse {
  message: string;
}
