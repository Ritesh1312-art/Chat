import { Server, Socket } from 'socket.io';
import { Redis } from 'ioredis';

export const registerWebRTCHandlers = (io: Server, socket: Socket, redis: Redis) => {
  const userId = socket.data.userId;

  socket.on('OFFER', (data: { offer: any, roomId: string }) => {
    socket.to(data.roomId).emit('OFFER', { offer: data.offer, roomId: data.roomId });
  });

  socket.on('ANSWER', (data: { answer: any, roomId: string }) => {
    socket.to(data.roomId).emit('ANSWER', { answer: data.answer, roomId: data.roomId });
  });

  socket.on('ICE_CANDIDATE', (data: { candidate: any, roomId: string }) => {
    socket.to(data.roomId).emit('ICE_CANDIDATE', { candidate: data.candidate, roomId: data.roomId });
  });

  socket.on('REVEAL_VOTE', async (data: { roomId: string, vote: boolean }) => {
    const { roomId, vote } = data;
    
    // Store vote in Redis reveal:{roomId} hash
    await redis.hset(`reveal:${roomId}`, userId, vote ? 'true' : 'false');
    
    // Check if both votes received
    const votes = await redis.hgetall(`reveal:${roomId}`);
    const voters = Object.keys(votes);
    
    if (voters.length === 2) {
      const vote1 = votes[voters[0]] === 'true';
      const vote2 = votes[voters[1]] === 'true';
      
      if (vote1 && vote2) {
        // Both true
        io.to(roomId).emit('REMOVE_BLUR');
      } else {
        // Any false
        io.to(roomId).emit('END_MATCH');
        const socketsInRoom = await io.in(roomId).fetchSockets();
        socketsInRoom.forEach(s => s.leave(roomId));
      }
      
      // Clear Redis key after handling
      await redis.del(`reveal:${roomId}`);
    }
  });

  socket.on('END_MATCH', async (data: { roomId: string }) => {
    socket.to(data.roomId).emit('END_MATCH');
    socket.leave(data.roomId);
    
    // Clean up
    await redis.del(`reveal:${data.roomId}`);
  });
};
