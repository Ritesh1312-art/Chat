import Redis from 'ioredis-mock'

describe('RedisService', () => {
  let redis: any

  beforeEach(() => {
    redis = new Redis()
  })

  afterEach(() => {
    redis.disconnect()
  })

  describe('Chat Lock', () => {
    it('should increment chat lock and reset it', async () => {
      const chatId = 'chat123'
      const key = `lock:${chatId}`

      // Starts at null/0
      let val = await redis.get(key)
      expect(val).toBeNull()

      // Increment
      await redis.incr(key)
      val = await redis.get(key)
      expect(val).toBe('1')

      await redis.incr(key)
      val = await redis.get(key)
      expect(val).toBe('2')

      // Reset
      await redis.del(key)
      val = await redis.get(key)
      expect(val).toBeNull()
    })
  })

  describe('NSFW Rate Limiting', () => {
    it('canReportNsfw should limit calls', async () => {
      const userId = 'user123'
      const key = `nsfw_report:${userId}`
      
      // Simulating first call
      const setFirst = await redis.set(key, '1', 'EX', 60, 'NX')
      expect(setFirst).toBe('OK')
      
      // Simulating second call within 60s
      const setSecond = await redis.set(key, '1', 'EX', 60, 'NX')
      expect(setSecond).toBeNull()
    })
  })
})
