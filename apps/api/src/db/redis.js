import { __awaiter } from "tslib";
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
    static get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const value = yield redis.get(key);
                return value ? JSON.parse(value) : null;
            }
            catch (error) {
                logger.error('Cache get error:', { key, error });
                return null;
            }
        });
    }
    static set(key_1, value_1) {
        return __awaiter(this, arguments, void 0, function* (key, value, ttl = this.DEFAULT_TTL) {
            try {
                yield redis.setex(key, ttl, JSON.stringify(value));
                return true;
            }
            catch (error) {
                logger.error('Cache set error:', { key, error });
                return false;
            }
        });
    }
    static del(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield redis.del(key);
                return true;
            }
            catch (error) {
                logger.error('Cache delete error:', { key, error });
                return false;
            }
        });
    }
    static exists(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield redis.exists(key);
                return result === 1;
            }
            catch (error) {
                logger.error('Cache exists error:', { key, error });
                return false;
            }
        });
    }
    static flush() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield redis.flushall();
                return true;
            }
            catch (error) {
                logger.error('Cache flush error:', error);
                return false;
            }
        });
    }
    // List operations
    static lpush(key, ...values) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield redis.lpush(key, ...values);
            }
            catch (error) {
                logger.error('Cache lpush error:', { key, error });
                return 0;
            }
        });
    }
    static lrange(key_1) {
        return __awaiter(this, arguments, void 0, function* (key, start = 0, stop = -1) {
            try {
                return yield redis.lrange(key, start, stop);
            }
            catch (error) {
                logger.error('Cache lrange error:', { key, error });
                return [];
            }
        });
    }
    static ltrim(key, start, stop) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield redis.ltrim(key, start, stop);
                return true;
            }
            catch (error) {
                logger.error('Cache ltrim error:', { key, error });
                return false;
            }
        });
    }
    // Set operations
    static sadd(key, ...members) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield redis.sadd(key, ...members);
            }
            catch (error) {
                logger.error('Cache sadd error:', { key, error });
                return 0;
            }
        });
    }
    static smembers(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield redis.smembers(key);
            }
            catch (error) {
                logger.error('Cache smembers error:', { key, error });
                return [];
            }
        });
    }
    // Hash operations
    static hset(key, field, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield redis.hset(key, field, value);
            }
            catch (error) {
                logger.error('Cache hset error:', { key, field, error });
                return 0;
            }
        });
    }
    static hget(key, field) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield redis.hget(key, field);
            }
            catch (error) {
                logger.error('Cache hget error:', { key, field, error });
                return null;
            }
        });
    }
    static hgetall(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield redis.hgetall(key);
            }
            catch (error) {
                logger.error('Cache hgetall error:', { key, error });
                return {};
            }
        });
    }
    // Rate limiting
    static rateLimit(key, limit, window) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
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
                const results = yield pipeline.exec();
                const count = ((_a = results === null || results === void 0 ? void 0 : results[2]) === null || _a === void 0 ? void 0 : _a[1]) || 0;
                return {
                    allowed: count <= limit,
                    remaining: Math.max(0, limit - count),
                    resetTime: now + window * 1000,
                };
            }
            catch (error) {
                logger.error('Rate limit error:', { key, error });
                return { allowed: true, remaining: limit, resetTime: Date.now() };
            }
        });
    }
}
CacheService.DEFAULT_TTL = 300; // 5 minutes
// Graceful shutdown
process.on('beforeExit', () => __awaiter(void 0, void 0, void 0, function* () {
    yield redis.quit();
}));
