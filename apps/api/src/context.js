import { __awaiter } from "tslib";
import { prisma } from './db/client';
import { redis } from './db/redis';
import { logger } from './utils/logger';
import { verifyJWT } from './utils/auth';
export function createContext(_a) {
    return __awaiter(this, arguments, void 0, function* ({ req, res, }) {
        // Extract JWT token from Authorization header
        const authHeader = req.headers.authorization;
        let user;
        if (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer ')) {
            const token = authHeader.slice(7);
            try {
                const payload = yield verifyJWT(token);
                user = {
                    id: payload.sub,
                    email: payload.email,
                    roles: payload.roles || [],
                };
            }
            catch (error) {
                logger.warn('Invalid JWT token:', { error: error.message });
                // Continue without user (for public endpoints)
            }
        }
        return {
            prisma,
            redis,
            user,
            req,
            res,
        };
    });
}
