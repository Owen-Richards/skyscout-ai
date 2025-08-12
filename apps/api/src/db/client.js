var _a;
import { __awaiter } from "tslib";
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
const globalForPrisma = globalThis;
export const prisma = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'event',
            level: 'error',
        },
        {
            emit: 'event',
            level: 'info',
        },
        {
            emit: 'event',
            level: 'warn',
        },
    ],
});
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = prisma;
// Log database queries in development
if (process.env.NODE_ENV === 'development') {
    prisma.$on('query', e => {
        logger.debug('Query executed:', {
            query: e.query,
            params: e.params,
            duration: `${e.duration}ms`,
        });
    });
}
prisma.$on('error', e => {
    logger.error('Database error:', e);
});
prisma.$on('warn', e => {
    logger.warn('Database warning:', e);
});
prisma.$on('info', e => {
    logger.info('Database info:', e);
});
// Graceful shutdown
process.on('beforeExit', () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
