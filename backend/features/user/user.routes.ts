import { Router } from 'express';
import UserController from './user.controller';
import { protect } from '../../middleware/authMiddleware';

const router = Router();

// Protect all routes
router.use(protect);

router.get('/profile', UserController.getProfile as any);
router.put('/profile', UserController.updateProfile as any);
router.post('/request-email-change', UserController.requestEmailChange as any);
router.post('/verify-email-change', UserController.verifyEmailChange as any);

export default router;
