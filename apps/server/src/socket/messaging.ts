import { Server, Socket } from 'socket.io';
import { Redis } from 'ioredis';
import { User } from '../models/User';
import { Chat } from '../models/Chat';
import { TranslateService } from '../services/TranslateService';

export const registerMessagingHandlers = (io: Server, socket: Socket, redis: Redis) => {
  const senderId = socket.data.userId as string;
  const senderUser = socket.data.user;

  socket.on('SEND_MESSAGE', async (
    data: { receiverId: string; content: string; chatId?: string },
    callback?: Function
  ) => {
    try {
      const { receiverId, content, chatId } = data;

      if (!content || !content.trim()) {
        if (callback) callback({ error: 'Message cannot be empty' });
        return;
      }

      // 1. Find receiver
      const receiver = await User.findById(receiverId);
      if (!receiver) {
        if (callback) callback({ error: 'Receiver not found' });
        return;
      }

      // 2. Check blocklists
      const isBlockedByReceiver = receiver.blockedUsers.some(id => id.toString() === senderId);
      const hasBlockedReceiver = senderUser.blockedUsers?.some((id: any) => id.toString() === receiverId);

      if (isBlockedByReceiver || hasBlockedReceiver) {
        if (callback) callback({ error: 'Cannot send message to this user' });
        return;
      }

      // 3. Check sender ban
      if (senderUser.isBanned) {
        if (callback) callback({ error: 'You are banned' });
        return;
      }
      if (senderUser.banUntil && senderUser.banUntil > new Date()) {
        if (callback) callback({ error: 'You are temporarily banned' });
        return;
      }

      // 4. Check 2-message Redis lock
      const lockKey = `chatLock:${senderId}:${receiverId}`;
      const lockCount = await redis.get(lockKey);

      if (lockCount && parseInt(lockCount, 10) >= 2) {
        socket.emit('LOCK_WARNING', { message: 'Wait for a reply before sending more messages.' });
        if (callback) callback({ error: 'Lock limit reached' });
        return;
      }

      await redis.incr(lockKey);
      // Reset receiver's lock on A when A sends to B (B is now replying implicitly)
      await redis.del(`chatLock:${receiverId}:${senderId}`);

      // 5. Translate if needed
      let finalContent = content.trim();
      let isTranslated = false;
      const senderLang = senderUser.nativeLanguage || 'en';
      const receiverLang = receiver.nativeLanguage || 'en';

      if (TranslateService.needsTranslation(senderLang, receiverLang)) {
        finalContent = await TranslateService.translate(content.trim(), senderLang, receiverLang);
        isTranslated = true;
      }

      // 6. Find or create Chat
      let chat;
      if (chatId) {
        chat = await Chat.findById(chatId);
      }
      if (!chat) {
        chat = await Chat.findOne({ participants: { $all: [senderId, receiverId] } });
      }
      if (!chat) {
        chat = new Chat({
          participants: [senderId, receiverId],
          messages: [],
          callPermissionGrantedBy: [],
        });
      }

      // 7. Push message
      chat.messages.push({
        sender: senderId as any,
        content: finalContent,
        originalContent: isTranslated ? content.trim() : undefined,
        isTranslated,
        deleted: false,
        timestamp: new Date(),
      } as any);
      chat.lastMessageAt = new Date();
      chat.lastActivity = new Date();
      await chat.save();

      const savedMsg = chat.messages[chat.messages.length - 1] as any;

      // 8. Deliver to receiver
      io.to(`user:${receiverId}`).emit('RECEIVE_MESSAGE', {
        messageId: savedMsg._id?.toString(),
        chatId: chat._id.toString(),
        senderId,
        senderName: senderUser.displayName,
        senderAvatar: senderUser.avatar,
        content: finalContent,
        originalContent: isTranslated ? content.trim() : undefined,
        isTranslated,
        senderLang,
        receiverLang,
        timestamp: savedMsg.timestamp,
      });

      // 9. Confirm to sender
      if (callback) callback({ success: true, messageId: savedMsg._id?.toString(), chatId: chat._id.toString() });

    } catch (error) {
      console.error('[Messaging] SEND_MESSAGE error:', error);
      if (callback) callback({ error: 'Failed to send message' });
    }
  });

  socket.on('TYPING', (data: { receiverId: string }) => {
    io.to(`user:${data.receiverId}`).emit('TYPING', { senderId });
  });

  socket.on('STOP_TYPING', (data: { receiverId: string }) => {
    io.to(`user:${data.receiverId}`).emit('STOP_TYPING', { senderId });
  });
};
