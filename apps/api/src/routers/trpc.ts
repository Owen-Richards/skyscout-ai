import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from '../context';
import { logger } from '../utils/logger';
import { metrics } from '../utils/metrics';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware for authentication
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

// Middleware for admin access
const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user || !ctx.user.roles.includes('admin')) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

// Middleware for logging and metrics
const withMetrics = t.middleware(async ({ path, type, next }) => {
  const timer = metrics.timer('trpc.request.duration', { path, type });
  metrics.increment('trpc.request.count', 1, { path, type });

  const start = Date.now();
  logger.debug('tRPC call started', { path, type });

  try {
    const result = await next();
    const duration = Date.now() - start;

    logger.debug('tRPC call completed', { path, type, duration });
    metrics.increment('trpc.request.success', 1, { path, type });

    return result;
  } catch (error) {
    const duration = Date.now() - start;

    logger.error('tRPC call failed', {
      path,
      type,
      duration,
      error: (error as Error).message,
    });
    metrics.increment('trpc.request.error', 1, { path, type });

    throw error;
  } finally {
    timer();
  }
});

export const protectedProcedure = publicProcedure
  .use(withMetrics)
  .use(isAuthed);

export const adminProcedure = protectedProcedure.use(isAdmin);

export const baseProcedure = publicProcedure.use(withMetrics);
