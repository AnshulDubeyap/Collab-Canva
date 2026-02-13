
export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface RegisterUser {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  googleId?: string;
}

export interface LoginUser {
  email: string;
  password?: string;
}
