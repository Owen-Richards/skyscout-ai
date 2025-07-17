import Redis from 'ioredis';
import { config } from '../config';
import { logger } from '../utils/logger';

export const redis = new Redis(config.REDIS_URL, {
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  lazyConnect: true,
  maxRetriesPerRequest: 3,
  commandTimeout: 5000,
  connectTimeout: 10000,
});

redis.on('connect', () => {
  logger.info('Connected to Redis');
});

redis.on('ready', () => {
  logger.info('Redis is ready');
});

redis.on('error', error => {
  logger.error('Redis error:', error);
});

redis.on('close', () => {
  logger.info('Redis connection closed');
});

redis.on('reconnecting', time => {
  logger.info(`Reconnecting to Redis in ${time}ms`);
});

// Cache helper functions
export class CacheService {
  private static readonly DEFAULT_TTL = 300; // 5 minutes

  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await redis.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Cache get error:', { key, error });
      return null;
    }
  }

  static async set(
    key: string,
    value: unknown,
    ttl = this.DEFAULT_TTL
  ): Promise<boolean> {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      logger.error('Cache set error:', { key, error });
      return false;
    }
  }

  static async del(key: string): Promise<boolean> {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      logger.error('Cache delete error:', { key, error });
      return false;
    }
  }

  static async exists(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Cache exists error:', { key, error });
      return false;
    }
  }

  static async flush(): Promise<boolean> {
    try {
      await redis.flushall();
      return true;
    } catch (error) {
      logger.error('Cache flush error:', error);
      return false;
    }
  }

  // List operations
  static async lpush(key: string, ...values: string[]): Promise<number> {
    try {
      return await redis.lpush(key, ...values);
    } catch (error) {
      logger.error('Cache lpush error:', { key, error });
      return 0;
    }
  }

  static async lrange(key: string, start = 0, stop = -1): Promise<string[]> {
    try {
      return await redis.lrange(key, start, stop);
    } catch (error) {
      logger.error('Cache lrange error:', { key, error });
      return [];
    }
  }

  static async ltrim(
    key: string,
    start: number,
    stop: number
  ): Promise<boolean> {
    try {
      await redis.ltrim(key, start, stop);
      return true;
    } catch (error) {
      logger.error('Cache ltrim error:', { key, error });
      return false;
    }
  }

  // Set operations
  static async sadd(key: string, ...members: string[]): Promise<number> {
    try {
      return await redis.sadd(key, ...members);
    } catch (error) {
      logger.error('Cache sadd error:', { key, error });
      return 0;
    }
  }

  static async smembers(key: string): Promise<string[]> {
    try {
      return await redis.smembers(key);
    } catch (error) {
      logger.error('Cache smembers error:', { key, error });
      return [];
    }
  }

  // Hash operations
  static async hset(
    key: string,
    field: string,
    value: string
  ): Promise<number> {
    try {
      return await redis.hset(key, field, value);
    } catch (error) {
      logger.error('Cache hset error:', { key, field, error });
      return 0;
    }
  }

  static async hget(key: string, field: string): Promise<string | null> {
    try {
      return await redis.hget(key, field);
    } catch (error) {
      logger.error('Cache hget error:', { key, field, error });
      return null;
    }
  }

  static async hgetall(key: string): Promise<Record<string, string>> {
    try {
      return await redis.hgetall(key);
    } catch (error) {
      logger.error('Cache hgetall error:', { key, error });
      return {};
    }
  }

  // Rate limiting
  static async rateLimit(
    key: string,
    limit: number,
    window: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    try {
      const pipeline = redis.pipeline();
      const now = Date.now();
      const windowStart = now - window * 1000;

      // Remove old entries
      pipeline.zremrangebyscore(key, 0, windowStart);
      // Add current request
      pipeline.zadd(key, now, now);
      // Count requests in current window
      pipeline.zcard(key);
      // Set expiry
      pipeline.expire(key, window);

      const results = await pipeline.exec();
      const count = (results?.[2]?.[1] as number) || 0;

      return {
        allowed: count <= limit,
        remaining: Math.max(0, limit - count),
        resetTime: now + window * 1000,
      };
    } catch (error) {
      logger.error('Rate limit error:', { key, error });
      return { allowed: true, remaining: limit, resetTime: Date.now() };
    }
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await redis.quit();
});
