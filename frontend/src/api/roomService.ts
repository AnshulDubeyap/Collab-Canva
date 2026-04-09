import api from './api';

export interface Room {
  id: string;
  roomId: string;
  name: string;
  isPrivate: boolean;
  status: 'WAITING' | 'ACTIVE';
  invitedUsers: string[];
  owner?: any;
}

export const createRoom = async (name: string, isPrivate: boolean = true, invitedEmails: string[] = []): Promise<Room> => {
  const response = await api.post('/rooms', { name, isPrivate, invitedEmails });
  return response.data.room;
};

export const inviteToRoom = async (roomId: string, email: string): Promise<void> => {
  await api.post(`/rooms/${roomId}/invite`, { email });
};

export const getRoomDetails = async (roomId: string): Promise<Room> => {
  const response = await api.get(`/rooms/${roomId}`);
  return response.data.room;
};

export const getPublicRooms = async (): Promise<Room[]> => {
  const response = await api.get('/rooms/public');
  return response.data.rooms;
};
