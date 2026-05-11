import { Server } from 'socket.io';
import { RoomRepository } from '../database/repositories/RoomRepository.js';
import { SessionRepository } from '../database/repositories/SessionRepository.js';
import { RoomService } from '../../domain/services/RoomService.js';
import { SessionService } from '../../domain/services/SessionService.js';

export function createSocketHandler(httpServer, db) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.FRONTEND_URL ?? true, credentials: true },
  });

  const roomRepo = new RoomRepository(db);
  const sessionRepo = new SessionRepository(db);
  const roomService = new RoomService(roomRepo);
  const sessionService = new SessionService(sessionRepo);

  const activeSessions = new Map(); // roomCode → sessionId
  const userSockets = new Map();    // userName → socketId (for targeted WebRTC answers)

  io.on('connection', (socket) => {
    let currentRoom = null;
    let currentUser = null;

    socket.on('room:join', async ({ code, userName, userColor }) => {
      try {
        const room = await roomService.joinRoom(code, userName, userColor);
        currentRoom = code;
        currentUser = userName;
        userSockets.set(userName, socket.id);
        socket.join(code);
        io.to(code).emit('room:updated', room.toJSON());
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('room:leave', async () => {
      if (!currentRoom || !currentUser) return;
      const room = await roomService.leaveRoom(currentRoom, currentUser);
      socket.leave(currentRoom);
      if (room) io.to(currentRoom).emit('room:updated', room.toJSON());
      userSockets.delete(currentUser);
      currentRoom = null;
      currentUser = null;
    });

    socket.on('share:start', async () => {
      if (!currentRoom || !currentUser) return;
      try {
        const room = await roomService.startSharing(currentRoom, currentUser);
        const session = await sessionService.startSession(room.id, currentUser, room.users);
        activeSessions.set(currentRoom, session.id);
        io.to(currentRoom).emit('room:updated', room.toJSON());
        io.to(currentRoom).emit('session:started', { sessionId: session.id, sharingUser: currentUser });
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('share:stop', async () => {
      if (!currentRoom) return;
      const room = await roomService.stopSharing(currentRoom);
      io.to(currentRoom).emit('room:updated', room.toJSON());
    });

    socket.on('session:end', async () => {
      if (!currentRoom || !currentUser) return;
      const room = await roomService.stopSharing(currentRoom);
      io.to(currentRoom).emit('room:updated', room.toJSON());
      io.to(currentRoom).emit('session:ended', {});
    });

    socket.on('chat:message', ({ text }) => {
      if (!currentRoom || !currentUser || !text?.trim()) return;
      const now = new Date();
      const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
      io.to(currentRoom).emit('chat:message', {
        userName: currentUser,
        text: text.trim().slice(0, 300),
        time,
      });
    });

    // WebRTC relay — offer and ICE broadcast to room; answer routed to specific target
    socket.on('webrtc:offer', ({ offer }) => {
      socket.to(currentRoom).emit('webrtc:offer', { from: currentUser, offer });
    });

    socket.on('webrtc:answer', ({ answer, target }) => {
      const targetSocketId = target ? userSockets.get(target) : null;
      if (targetSocketId) {
        io.to(targetSocketId).emit('webrtc:answer', { from: currentUser, answer });
      } else {
        socket.to(currentRoom).emit('webrtc:answer', { from: currentUser, answer });
      }
    });

    socket.on('webrtc:ice', ({ candidate }) => {
      socket.to(currentRoom).emit('webrtc:ice', { from: currentUser, candidate });
    });

    socket.on('disconnect', async () => {
      if (currentUser) userSockets.delete(currentUser);
      if (currentRoom && currentUser) {
        const room = await roomService.leaveRoom(currentRoom, currentUser);
        if (room) io.to(currentRoom).emit('room:updated', room.toJSON());
      }
    });
  });

  return io;
}
