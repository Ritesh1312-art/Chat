import { Server, Socket } from 'socket.io';
import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/User';

export const registerMatchmakingHandlers = (io: Server, socket: Socket, redis: Redis) => {
  const userId = socket.data.userId;

  socket.on('JOIN_ZONE_A', async () => {
    // Add user to Redis match queue
    await redis.rpush('match_queue:zoneA', userId);

    // Try to find a match immediately
    const queueLen = await redis.llen('match_queue:zoneA');
    if (queueLen >= 2) {
      // Basic matching: pop two users
      const multi = redis.multi();
      multi.lpop('match_queue:zoneA');
      multi.lpop('match_queue:zoneA');
      const results = await multi.exec();

      if (results && results.length === 2 && results[0][1] && results[1][1]) {
        const u1 = results[0][1] as string;
        const u2 = results[1][1] as string;

        const roomId = uuidv4();
        
        // Fetch user info for payload
        const [user1, user2] = await Promise.all([
          User.findById(u1).select('displayName avatar'),
          User.findById(u2).select('displayName avatar')
        ]);

        if (user1 && user2) {
          // Emit MATCH_FOUND to both users
          io.to(`user:${u1}`).emit('MATCH_FOUND', {
            roomId,
            peerId: u2,
            peerName: user2.displayName,
            peerAvatar: user2.avatar
          });
          
          io.to(`user:${u2}`).emit('MATCH_FOUND', {
            roomId,
            peerId: u1,
            peerName: user1.displayName,
            peerAvatar: user1.avatar
          });

          // Join their sockets to the new room
          const sockets1 = await io.in(`user:${u1}`).fetchSockets();
          const sockets2 = await io.in(`user:${u2}`).fetchSockets();
          
          sockets1.forEach(s => s.join(roomId));
          sockets2.forEach(s => s.join(roomId));

          // Start 15-second server-authoritative countdown
          let secondsLeft = 15;
          const intervalId = setInterval(() => {
            if (secondsLeft > 0) {
              io.to(roomId).emit('TICK', { secondsLeft });
              secondsLeft--;
            } else {
              clearInterval(intervalId);
              io.to(roomId).emit('REVEAL_PROMPT');
            }
          }, 1000);
        }
      }
    }
  });

  socket.on('LEAVE_ZONE_A', async () => {
    await redis.lrem('match_queue:zoneA', 0, userId);
    // Leave current WebRTC rooms, keeping own id and personal room
    socket.rooms.forEach(room => {
      if (room !== socket.id && room !== `user:${userId}`) {
        socket.leave(room);
      }
    });
  });

  socket.on('MATCH_ENDED', (data: { roomId: string }) => {
    socket.to(data.roomId).emit('MATCH_ENDED');
    socket.leave(data.roomId);
  });
};
