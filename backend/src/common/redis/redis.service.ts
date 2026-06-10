import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common'
import { createClient, RedisClientType } from 'redis'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name)
  private client: RedisClientType

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL')
    this.client = createClient({
      url: redisUrl
    })

    this.client.on('error', (err) => {
      this.logger.error('Redis Client Error', err)
    })

    this.client.on('connect', () => {
      this.logger.log('Redis Client Connected')
    })

    await this.client.connect()
  }

  async onModuleDestroy() {
    await this.client.quit()
  }

  getClient(): RedisClientType {
    return this.client
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, { EX: ttl })
    } else {
      await this.client.set(key, value)
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key)
  }

  async del(key: string): Promise<number> {
    return this.client.del(key)
  }

  async incr(key: string): Promise<number> {
    return this.client.incr(key)
  }

  async hSet(key: string, field: string, value: string): Promise<number> {
    return this.client.hSet(key, field, value)
  }

  async hGet(key: string, field: string): Promise<string | null> {
    return this.client.hGet(key, field)
  }

  async hGetAll(key: string): Promise<Record<string, string>> {
    return this.client.hGetAll(key)
  }

  async zAdd(key: string, score: number, member: string): Promise<number> {
    return this.client.zAdd(key, { score, value: member })
  }

  async zRange(key: string, start: number, stop: number): Promise<string[]> {
    return this.client.zRange(key, start, stop)
  }

  async zRevRange(key: string, start: number, stop: number): Promise<string[]> {
    return this.client.zRevRange(key, start, stop)
  }

  async acquireLock(lockKey: string, lockValue: string, ttl: number): Promise<boolean> {
    const result = await this.client.set(lockKey, lockValue, {
      NX: true,
      EX: ttl
    })
    return result === 'OK'
  }

  async releaseLock(lockKey: string, lockValue: string): Promise<boolean> {
    const luaScript = `
      if redis.call('GET', KEYS[1]) == ARGV[1] then
        return redis.call('DEL', KEYS[1])
      else
        return 0
      end
    `
    const result = await this.client.eval(luaScript, 1, lockKey, lockValue)
    return result === 1
  }

  async atomicBid(productKey: string, bidderId: string, bidPrice: string, minIncrement: string): Promise<string> {
    const luaScript = `
      local currentPrice = tonumber(redis.call('HGET', KEYS[1], 'current_price') or 0)
      local expectedNextPrice = currentPrice + tonumber(ARGV[3])
      
      if tonumber(ARGV[2]) ~= expectedNextPrice then
        return redis.error_reply("INVALID_PRICE")
      end
      
      redis.call('HSET', KEYS[1], 'current_price', ARGV[2])
      redis.call('HSET', KEYS[1], 'last_bidder', ARGV[1])
      redis.call('HSET', KEYS[1], 'last_bid_time', redis.call('TIME')[1])
      
      return redis.status_reply("OK")
    `
    return this.client.eval(luaScript, 1, productKey, bidderId, bidPrice, minIncrement) as Promise<string>
  }
}
