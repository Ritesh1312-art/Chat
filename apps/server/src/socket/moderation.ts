import { Server, Socket } from 'socket.io';
import { Redis } from 'ioredis';
import { User } from '../models/User';
import { Report } from '../models/Report';
import { Chat } from '../models/Chat';
import { ModerationService } from '../services/ModerationService';

export const registerModerationHandlers = (io: Server, socket: Socket, redis: Redis) => {
  const userId = socket.data.userId as string;

  // ─── PANIC BUTTON ───────────────────────────────────────────────
  socket.on('PANIC_PRESSED', async (data: { targetUserId: string }, callback?: Function) => {
    try {
      const { targetUserId } = data;

      // Destroy call/match for target
      io.to(`user:${targetUserId}`).emit('END_MATCH', { reason: 'panic' });

      // Add target to blocker's blocklist
      await User.findByIdAndUpdate(userId, { $addToSet: { blockedUsers: targetUserId } });

      // Log report
      await Report.create({
        reporterId: userId,
        targetId: targetUserId,
        type: 'panic',
        status: 'pending',
      });

      if (callback) callback({ success: true });
    } catch (error) {
      console.error('[Moderation] PANIC error:', error);
      if (callback) callback({ error: 'Panic action failed' });
    }
  });

  // ─── NSFW REPORT ────────────────────────────────────────────────
  socket.on('NSFW_REPORT', async (data: { targetUserId: string; category: string; confidence: number }) => {
    try {
      const { targetUserId, category, confidence } = data;

      // Rate limit: max 5 reports per minute per reporter
      const rateLimitKey = `nsfw_rate:${userId}`;
      const count = await redis.incr(rateLimitKey);
      if (count === 1) await redis.expire(rateLimitKey, 60);
      if (count > 5) return;

      // Prevent duplicate report of same pair within 1 hour
      const pairKey = `nsfw_pair:${userId}:${targetUserId}`;
      const alreadyReported = await redis.get(pairKey);
      if (alreadyReported) return;
      await redis.setex(pairKey, 3600, '1');

      // Handle strike
      const result = await ModerationService.handleNsfwStrike(targetUserId);

      if (result.action === 'warn') {
        io.to(`user:${targetUserId}`).emit('MODERATION_WARNING', {
          message: 'Warning: Inappropriate content detected. This may result in a ban.',
        });
      } else if (result.action === 'temp_ban_24h' || result.action === 'temp_ban_48h') {
        io.to(`user:${targetUserId}`).emit('FORCE_LOGOUT', {
          reason: `You are temporarily banned until ${result.banUntil?.toISOString()}`,
        });
        const sockets = await io.in(`user:${targetUserId}`).fetchSockets();
        sockets.forEach(s => s.disconnect(true));
      } else if (result.action === 'permanent_ban') {
        io.to(`user:${targetUserId}`).emit('BANNED', { reason: 'Permanent ban: repeated/severe violations' });
        const sockets = await io.in(`user:${targetUserId}`).fetchSockets();
        sockets.forEach(s => s.disconnect(true));
        await User.findByIdAndUpdate(targetUserId, { walletBalance: 0 });
      }

      await Report.create({
        reporterId: userId,
        targetId: targetUserId,
        type: 'nsfw',
        details: { category, confidence },
        actionTaken: result.action,
        status: 'pending',
      });

    } catch (error) {
      console.error('[Moderation] NSFW_REPORT error:', error);
    }
  });

  // ─── HEARTBEAT ───────────────────────────────────────────────────
  socket.on('HEARTBEAT', async () => {
    await redis.set(`user:online:${userId}`, 'true', 'EX', 60);
  });

  // ─── CALL REQUEST ────────────────────────────────────────────────
  socket.on('CALL_REQUEST', (data: { targetUserId: string }) => {
    io.to(`user:${data.targetUserId}`).emit('CALL_REQUEST', {
      requesterId: userId,
      requesterName: socket.data.user?.displayName,
      requesterAvatar: socket.data.user?.avatar,
    });
  });

  // ─── CALL CONSENT ────────────────────────────────────────────────
  socket.on('CALL_CONSENT', async (data: { targetUserId: string; granted: boolean }) => {
    const { targetUserId, granted } = data;

    if (granted) {
      // Update MongoDB
      await Chat.findOneAndUpdate(
        { participants: { $all: [userId, targetUserId] } },
        { $addToSet: { callPermissionGrantedBy: userId } },
        { upsert: false }
      );
      io.to(`user:${targetUserId}`).emit('CALL_ENABLED', { grantedBy: userId });
    } else {
      io.to(`user:${targetUserId}`).emit('CALL_DENIED', { deniedBy: userId });
    }
  });
};
