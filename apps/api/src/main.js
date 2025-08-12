import { __awaiter } from "tslib";
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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Register plugins
            yield registerPlugins(server);
            // Register tRPC
            yield server.register(fastifyTRPCPlugin, {
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
            server.get('/health', () => __awaiter(this, void 0, void 0, function* () {
                return ({
                    status: 'ok',
                    timestamp: new Date().toISOString(),
                    uptime: process.uptime(),
                    environment: config.NODE_ENV,
                });
            }));
            // Metrics endpoint
            server.get('/metrics', () => __awaiter(this, void 0, void 0, function* () { return metrics.getAll(); }));
            // Start server
            const address = yield server.listen({
                port: config.PORT,
                host: config.HOST,
            });
            logger.info(`🚀 SkyScout API Server running at ${address}`);
            logger.info(`📊 Environment: ${config.NODE_ENV}`);
            logger.info(`🔗 tRPC endpoint: ${address}/trpc`);
            // Graceful shutdown
            process.on('SIGTERM', () => __awaiter(this, void 0, void 0, function* () {
                logger.info('SIGTERM received, shutting down gracefully');
                yield server.close();
                process.exit(0);
            }));
            process.on('SIGINT', () => __awaiter(this, void 0, void 0, function* () {
                logger.info('SIGINT received, shutting down gracefully');
                yield server.close();
                process.exit(0);
            }));
        }
        catch (error) {
            logger.error('Error starting server:', error);
            process.exit(1);
        }
    });
}
main();
