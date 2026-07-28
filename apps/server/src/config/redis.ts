import Redis from 'ioredis'

let client: Redis | null = null

export function getRedisClient(): Redis {
  if (!client) {
    const url = process.env.REDIS_URL!
    if (!url) throw new Error('REDIS_URL not defined')
    client = new Redis(url, {
      maxRetriesPerRequest: 3,
      lazyConnect: false,
      enableOfflineQueue: true,
      retryStrategy(times) {
        if (times > 10) return null
        return Math.min(times * 200, 2000)
      }
    })
    client.on('connect', () => console.log('[Redis] Connected'))
    client.on('error', (err) => console.error('[Redis] Error:', err))
  }
  return client
}

export async function closeRedis() {
  if (client) { await client.quit(); client = null }
}
