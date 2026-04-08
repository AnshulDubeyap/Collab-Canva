
import express from 'express';
import AuthController from './auth.controller';

const router = express.Router();

// Register
router.post('/register', AuthController.register);

// Login (Local)
router.post('/login', AuthController.login);

// Login (Google)
router.get('/google', AuthController.googleAuth);

// Google Callback
router.get('/google/callback', AuthController.googleCallback);

// Logout
router.post('/logout', AuthController.logout);

// Forgot & Reset Password
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);

export default router;
