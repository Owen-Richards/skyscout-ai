import { __awaiter } from "tslib";
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { config } from '../config';
import { logger } from '../utils/logger';
export function registerPlugins(server) {
    return __awaiter(this, void 0, void 0, function* () {
        // Security headers
        yield server.register(helmet, {
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", 'data:', 'https:'],
                },
            },
        });
        // CORS
        yield server.register(cors, {
            origin: config.NODE_ENV === 'production'
                ? ['https://skyscout.ai', 'https://www.skyscout.ai']
                : true,
            credentials: true,
        });
        // Rate limiting
        yield server.register(rateLimit, {
            max: parseInt(config.RATE_LIMIT_MAX.toString()),
            timeWindow: config.RATE_LIMIT_WINDOW,
            addHeaders: {
                'x-ratelimit-limit': true,
                'x-ratelimit-remaining': true,
                'x-ratelimit-reset': true,
            },
        });
        // Request logging
        server.addHook('onRequest', (request) => __awaiter(this, void 0, void 0, function* () {
            logger.info('Incoming request', {
                method: request.method,
                url: request.url,
                userAgent: request.headers['user-agent'],
                ip: request.ip,
            });
        }));
        // Error handling
        server.setErrorHandler((error, request, reply) => {
            logger.error('Request error', {
                error: error.message,
                stack: error.stack,
                method: request.method,
                url: request.url,
            });
            // Don't leak error details in production
            const message = config.NODE_ENV === 'production'
                ? 'Internal Server Error'
                : error.message;
            reply.status(500).send({
                error: 'Internal Server Error',
                message,
                statusCode: 500,
            });
        });
        logger.info('Plugins registered successfully');
    });
}
