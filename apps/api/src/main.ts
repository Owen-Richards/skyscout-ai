import Fastify from 'fastify';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { createContext } from './context';
import { appRouter } from './routers';
import { registerPlugins } from './plugins';
import { config } from './config';
import { logger } from './utils/logger';
import { metrics } from './utils/metrics';

const server = Fastify({
  maxParamLength: 5000,
  logger: false, // We use winston instead
});

async function main() {
  try {
    // Register plugins
    await registerPlugins(server);

    // Register tRPC
    await server.register(fastifyTRPCPlugin, {
      prefix: '/trpc',
      trpcOptions: {
        router: appRouter,
        createContext,
        onError({ path, error }) {
          logger.error('tRPC Error on path:', { path, error: error.message });
          metrics.increment('trpc.error', 1, { path: path || 'unknown' });
        },
      },
    });

    // Health check endpoint
    server.get('/health', async () => ({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.NODE_ENV,
    }));

    // Metrics endpoint
    server.get('/metrics', async () => metrics.getAll());

    // Start server
    const address = await server.listen({
      port: config.PORT,
      host: config.HOST,
    });

    logger.info(`🚀 SkyScout API Server running at ${address}`);
    logger.info(`📊 Environment: ${config.NODE_ENV}`);
    logger.info(`🔗 tRPC endpoint: ${address}/trpc`);

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('SIGTERM received, shutting down gracefully');
      await server.close();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      logger.info('SIGINT received, shutting down gracefully');
      await server.close();
      process.exit(0);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
}

main();
