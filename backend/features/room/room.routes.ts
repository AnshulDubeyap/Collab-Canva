import express from 'express';
import RoomController from './room.controller';
import { protect } from '../../middleware/authMiddleware';

const router = express.Router();

// Publicly list non-private rooms
router.get('/public', RoomController.getPublicRooms);

// Create a new room (requires login)
router.post('/', protect, RoomController.createRoom);

// Invite a friend to an existing room
router.post('/:roomId/invite', protect, RoomController.inviteFriend);

// Get specific room details
router.get('/:roomId', RoomController.getRoom);

export default router;
