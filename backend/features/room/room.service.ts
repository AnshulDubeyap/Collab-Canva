import Room, { IRoom } from '../../models/Room';
import { AppError } from '../../errors/AppError';
import { v4 as uuidv4 } from 'uuid';
import { sendRoomInviteEmail } from '../../utils/emailService';

class RoomService {
  async createRoom(userId: string, name: string, isPrivate: boolean = true, invitedEmails: string[] = []): Promise<IRoom> {
    const roomId = uuidv4(); // Generate a unique ID for the room URL
    
    const room = await Room.create({
      roomId,
      name,
      owner: userId,
      isPrivate,
      invitedUsers: invitedEmails,
    });

    return room;
  }

  async getRoomById(roomId: string): Promise<IRoom> {
    const room = await Room.findOne({ roomId }).populate('owner', 'name avatar');
    
    if (!room) {
      throw new AppError('Room not found', 404);
    }

    return room;
  }

  async getPublicRooms(): Promise<IRoom[]> {
    return await Room.find({ isPrivate: false }).sort({ createdAt: -1 });
  }

  async inviteToRoom(roomId: string, email: string, inviterName: string): Promise<void> {
    const room = await this.getRoomById(roomId);
    
    // Add to invited list if not already there
    if (!room.invitedUsers.includes(email)) {
      room.invitedUsers.push(email);
      await room.save();
    }

    // Send the email
    await sendRoomInviteEmail(email, roomId, inviterName, room.name);
  }

  async activateRoom(roomId: string): Promise<IRoom> {
    const room = await this.getRoomById(roomId);
    room.status = 'ACTIVE';
    await room.save();
    return room;
  }
}

export default new RoomService();
