import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

class RedisServiceImpl {
  public client: Redis;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  async connect() {
    await this.client.ping();
    console.log('Connected to Redis');
  }

  async disconnect() {
    await this.client.quit();
  }

  private getChatLockKey(senderId: string, receiverId: string) {
    const ids = [senderId, receiverId].sort();
    return `chat_lock:${ids[0]}:${ids[1]}`;
  }

  async getChatLock(senderId: string, receiverId: string): Promise<number> {
    const key = this.getChatLockKey(senderId, receiverId);
    const val = await this.client.get(key);
    return val ? parseInt(val, 10) : 0;
  }

  async incrementChatLock(senderId: string, receiverId: string): Promise<void> {
    const key = this.getChatLockKey(senderId, receiverId);
    await this.client.incr(key);
  }

  async resetChatLock(senderId: string, receiverId: string): Promise<void> {
    const key = this.getChatLockKey(senderId, receiverId);
    await this.client.set(key, '0');
  }

  async setOnline(userId: string): Promise<void> {
    await this.client.set(`user:online:${userId}`, '1', 'EX', 30);
  }

  async isOnline(userId: string): Promise<boolean> {
    const val = await this.client.get(`user:online:${userId}`);
    return !!val;
  }

  async setOffline(userId: string): Promise<void> {
    await this.client.del(`user:online:${userId}`);
  }

  async addToMatchQueue(userId: string, socketId: string): Promise<void> {
    await this.client.hset('match_queue', userId, socketId);
  }

  async findMatch(currentUserId: string): Promise<{ userId: string; socketId: string } | null> {
    const allUsers = await this.client.hgetall('match_queue');
    const userIds = Object.keys(allUsers);
    
    for (const userId of userIds) {
      if (userId !== currentUserId) {
        const socketId = allUsers[userId];
        return { userId, socketId };
      }
    }
    return null;
  }

  async removeFromMatchQueue(userId: string): Promise<void> {
    await this.client.hdel('match_queue', userId);
  }

  async setRevealVote(roomId: string, userId: string, vote: boolean): Promise<void> {
    await this.client.hset(`reveal:${roomId}`, userId, vote ? '1' : '0');
  }

  async getBothVotes(roomId: string): Promise<{ userA: boolean | null; userB: boolean | null }> {
    const votes = await this.client.hgetall(`reveal:${roomId}`);
    const keys = Object.keys(votes);
    if (keys.length === 0) return { userA: null, userB: null };
    if (keys.length === 1) return { userA: votes[keys[0]] === '1', userB: null };
    
    return {
      userA: votes[keys[0]] === '1',
      userB: votes[keys[1]] === '1'
    };
  }

  async clearRevealRoom(roomId: string): Promise<void> {
    await this.client.del(`reveal:${roomId}`);
  }

  async canReportNsfw(userId: string): Promise<boolean> {
    const val = await this.client.get(`nsfw_report_limit:${userId}`);
    return !val;
  }

  async markNsfwReported(userId: string): Promise<void> {
    await this.client.set(`nsfw_report_limit:${userId}`, '1', 'EX', 3600);
  }

  async cacheSession(jti: string, userId: string, ttlSeconds: number): Promise<void> {
    await this.client.set(`session:${jti}`, userId, 'EX', ttlSeconds);
  }

  async isSessionRevoked(jti: string): Promise<boolean> {
    const val = await this.client.get(`session_revoked:${jti}`);
    return !!val;
  }

  async revokeSession(jti: string): Promise<void> {
    await this.client.set(`session_revoked:${jti}`, '1', 'EX', 86400 * 7); // Max token lifetime
    await this.client.del(`session:${jti}`);
  }
}

export const RedisService = new RedisServiceImpl();
