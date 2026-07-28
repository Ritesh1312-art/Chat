import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { getRedisClient } from '../config/redis';
import { User } from '../models/User';
import { registerMatchmakingHandlers } from './matchmaking';
import { registerWebRTCHandlers } from './webrtc';
import { registerMessagingHandlers } from './messaging';
import { registerModerationHandlers } from './moderation';

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST']
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { id: string };
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.data.userId = user._id.toString();
      socket.data.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    const userId = socket.data.userId;
    const redis = getRedisClient();

    // Set online with TTL
    await redis.set(`user:online:${userId}`, 'true', 'EX', 60);
    socket.join(`user:${userId}`);

    // Register handlers
    registerMatchmakingHandlers(io, socket, redis);
    registerWebRTCHandlers(io, socket, redis);
    registerMessagingHandlers(io, socket, redis);
    registerModerationHandlers(io, socket, redis);

    socket.on('disconnect', async () => {
      // Set offline
      await redis.del(`user:online:${userId}`);
      // Remove from match queue
      await redis.lrem('match_queue:zoneA', 0, userId);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};
