import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app';
import Logger from './utils/logger';
import connectDB from './config/database';
import RoomService from './features/room/room.service';

// Keep track of ready players in memory
const readyPlayers = new Map<string, Set<string>>();

// Keep track of connected users per room: Map<roomId, Map<socketId, userData>>
const roomPresence = new Map<string, Map<string, { id: string, name: string }>>();

// 1. Set the port (8080)
const PORT = parseInt(process.env.PORT || '8080', 10);

// 2. Connect to Database (MongoDB)
connectDB();

/**
 * 3. Create a unified HTTP server.
 * We still wrap the Express 'app' so we can use the same server for both 
 * standard REST API calls (/auth, /users) and real-time WebSockets.
 */
const server = createServer(app);

/**
 * 4. Initialize Socket.io hub.
 * This 'io' instance is the "Command Center". 
 * We set up CORS to specifically allow your frontend (localhost:3000) 
 * to talk to this server.
 */
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

/**
 * 5. Handle Connections.
 * This is the "Entry Gate." 'io.on' is a listener that waits 
 * for a specific event—in this case, someone connecting.
 */
io.on('connection', (socket) => {
  // 'socket' represents the individual connection to a specific browser.
  Logger.info(`A user connected: ${socket.id}`);

  // 1. Join a specific Room
  socket.on('join-room', (data: { roomId: string, user: { id: string, name: string } }) => {
    const { roomId, user } = data;
    socket.join(roomId);
    Logger.info(`User ${user.name} (${socket.id}) joined room: ${roomId}`);
    
    // Track presence
    if (!roomPresence.has(roomId)) {
      roomPresence.set(roomId, new Map());
    }
    roomPresence.get(roomId)!.set(socket.id, user);

    // Broadcast updated presence list to everyone in the room
    const participants = Array.from(roomPresence.get(roomId)!.values());
    io.to(roomId).emit('presence-update', participants);

    // Send the current ready state to the joining user
    const roomReady = readyPlayers.get(roomId) || new Set();
    socket.emit('ready-update', Array.from(roomReady));
  });

  // 2. Handle Lobby Ready (3s hold complete)
  socket.on('lobby-ready', async (data: { roomId: string, userId: string }) => {
    const { roomId, userId } = data;
    
    if (!readyPlayers.has(roomId)) {
      readyPlayers.set(roomId, new Set());
    }
    
    const roomReady = readyPlayers.get(roomId)!;
    roomReady.add(userId);
    
    Logger.info(`User ${userId} is ready in room ${roomId}. (Total: ${roomReady.size})`);
    
    // Broadcast ready update to everyone in the room
    io.to(roomId).emit('ready-update', Array.from(roomReady));

    // If 2 people are ready, unlock the canvas!
    if (roomReady.size === 2) {
      Logger.info(`Room ${roomId} is now ACTIVE!`);
      
      // Update DB status to ACTIVE
      await RoomService.activateRoom(roomId);
      
      // Tell everyone to switch to Canvas view
      io.to(roomId).emit('start-canvas');
      
      // Clear ready state for this room now that it's active
      readyPlayers.delete(roomId);
    }
  });

  // 3. Handle drawing data (Fabric.js objects)
  socket.on('draw-data', (data: { roomId: string, object: any }) => {
    // Broadcast the drawing data to everyone ELSE in the room
    socket.to(data.roomId).emit('draw-data', data.object);
  });

  socket.on('disconnecting', () => {
    // A socket can be in multiple rooms
    for (const roomId of socket.rooms) {
      if (roomPresence.has(roomId)) {
        const roomUsers = roomPresence.get(roomId)!;
        roomUsers.delete(socket.id);
        
        // Broadcast updated list
        const participants = Array.from(roomUsers.values());
        io.to(roomId).emit('presence-update', participants);
        
        Logger.info(`User ${socket.id} removed from room ${roomId} presence.`);
      }
    }
  });

  socket.on('disconnect', () => {
    Logger.info(`User disconnected: ${socket.id}`);
  });
});

// 6. Start the unified "All-in-One" server
server.listen(PORT, () => {
  Logger.info(`Server running on port ${PORT} (API + Socket.io)`);
});

process.on('SIGTERM', () => {
  Logger.info('SIGTERM signal received: closing server');
  server.close(() => {
    Logger.info('Server closed');
  });
});
