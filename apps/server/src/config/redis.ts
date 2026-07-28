import Redis from 'ioredis'

let client: Redis | null = null

export function getRedisClient(): Redis {
  if (!client) {
    const url = process.env.REDIS_URL;
    const validUrl = url && !url.includes('PLACEHOLDER') ? url : 'redis://127.0.0.1:6379';
    client = new Redis(validUrl, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
      enableOfflineQueue: true,
      retryStrategy() {
        return null; // Stop retrying if placeholder or unavailable
      }
    });
    client.on('connect', () => console.log('[Redis] Connected'));
    client.on('error', (err) => {
      // Suppress connection spam when offline or placeholder
    });
  }
  return client;
}

export async function closeRedis() {
  if (client) { await client.quit(); client = null }
}
