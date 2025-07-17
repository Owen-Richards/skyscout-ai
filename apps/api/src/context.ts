import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { prisma } from './db/client';
import { redis } from './db/redis';
import { logger } from './utils/logger';
import { verifyJWT } from './utils/auth';

export interface Context {
  prisma: typeof prisma;
  redis: typeof redis;
  user?: {
    id: string;
    email: string;
    roles: string[];
  };
  req: CreateFastifyContextOptions['req'];
  res: CreateFastifyContextOptions['res'];
}

export async function createContext({
  req,
  res,
}: CreateFastifyContextOptions): Promise<Context> {
  // Extract JWT token from Authorization header
  const authHeader = req.headers.authorization;
  let user: Context['user'];

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    try {
      const payload = await verifyJWT(token);
      user = {
        id: payload.sub as string,
        email: payload.email as string,
        roles: (payload.roles as string[]) || [],
      };
    } catch (error) {
      logger.warn('Invalid JWT token:', { error: (error as Error).message });
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
}
