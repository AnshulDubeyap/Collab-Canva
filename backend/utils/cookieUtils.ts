import { Response } from 'express';

interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  maxAge: number;
  path: string;
}

const COOKIE_NAME = 'token';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

/**
 * Get cookie options based on environment
 */
const getCookieOptions = (): CookieOptions => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    httpOnly: true, // Prevents JavaScript access (XSS protection)
    secure: isProduction, // HTTPS only in production
    sameSite: 'lax', // CSRF protection
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  };
};

/**
 * Set authentication token cookie
 */
export const setAuthCookie = (res: Response, token: string): void => {
  const options = getCookieOptions();
  res.cookie(COOKIE_NAME, token, options);
};

/**
 * Clear authentication token cookie
 */
export const clearAuthCookie = (res: Response): void => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
};

export { COOKIE_NAME };
