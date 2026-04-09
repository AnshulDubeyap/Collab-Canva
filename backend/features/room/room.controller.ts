import { Request, Response, NextFunction } from 'express';
import RoomService from './room.service';
import { AppError } from '../../errors/AppError';

class RoomController {
  // Create Room
  async createRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, isPrivate, invitedEmails } = req.body;
      
      // req.user should be populated by auth middleware
      const userId = (req as any).user?._id;
      const userName = (req as any).user?.name;
      
      if (!userId) {
        return next(new AppError('Unauthorized', 401));
      }

      const room = await RoomService.createRoom(userId, name || 'Untitled Room', isPrivate, invitedEmails);

      // If emails were provided, send the invitations immediately
      if (invitedEmails && Array.isArray(invitedEmails)) {
        for (const email of invitedEmails) {
          await RoomService.inviteToRoom(room.roomId, email, userName || 'Your Friend');
        }
      }

      res.status(201).json({
        success: true,
        room: {
          id: room._id,
          roomId: room.roomId,
          name: room.name,
          isPrivate: room.isPrivate,
          status: room.status,
          invitedUsers: room.invitedUsers,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  // Invite more friends later
  async inviteFriend(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomId } = req.params;
      const { email } = req.body;
      const inviterName = (req as any).user?.name || 'Your Friend';

      await RoomService.inviteToRoom(roomId as string, email, inviterName);

      res.status(200).json({
        success: true,
        message: `Invitation sent to ${email}`,
      });
    } catch (err) {
      next(err);
    }
  }

  // Get Room Details
  async getRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const room = await RoomService.getRoomById(req.params.roomId as string);
      
      res.status(200).json({
        success: true,
        room,
      });
    } catch (err) {
      next(err);
    }
  }

  // List Public Rooms
  async getPublicRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const rooms = await RoomService.getPublicRooms();
      
      res.status(200).json({
        success: true,
        rooms,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new RoomController();
