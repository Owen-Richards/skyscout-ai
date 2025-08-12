import { __awaiter } from "tslib";
import { z } from 'zod';
import { router, baseProcedure, protectedProcedure, adminProcedure, } from './trpc';
import { prisma } from '../db/client';
import { metrics } from '../utils/metrics';
export const analyticsRouter = router({
    // Public analytics - trending destinations, popular routes
    trending: baseProcedure
        .input(z.object({
        type: z.enum(['destinations', 'routes']).default('destinations'),
        limit: z.number().min(1).max(50).default(10),
        period: z.enum(['week', 'month', 'quarter']).default('month'),
    }))
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        if (input.type === 'destinations') {
            return yield prisma.trendingDestination.findMany({
                where: {
                    period: input.period,
                    periodStart: {
                        gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                    },
                },
                orderBy: { popularityScore: 'desc' },
                take: input.limit,
            });
        }
        else {
            return yield prisma.popularRoute.findMany({
                where: {
                    period: input.period,
                    periodStart: {
                        gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                    },
                },
                orderBy: { popularity: 'desc' },
                take: input.limit,
            });
        }
    })),
    // User analytics - personal search history, savings
    userStats: protectedProcedure.query((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx }) {
        const [totalSearches, totalBookings, recentSearches, savedFlights, priceAlerts,] = yield Promise.all([
            prisma.flightSearch.count({
                where: { userId: ctx.user.id },
            }),
            prisma.booking.count({
                where: { userId: ctx.user.id },
            }),
            prisma.flightSearch.findMany({
                where: { userId: ctx.user.id },
                orderBy: { createdAt: 'desc' },
                take: 5,
            }),
            prisma.savedFlight.count({
                where: { userId: ctx.user.id },
            }),
            prisma.priceAlert.count({
                where: { userId: ctx.user.id, isActive: true },
            }),
        ]);
        return {
            totalSearches,
            totalBookings,
            savedFlights,
            activePriceAlerts: priceAlerts,
            recentSearches: recentSearches.map(search => ({
                origin: search.origin,
                destination: search.destination,
                departureDate: search.departureDate,
                returnDate: search.returnDate,
                createdAt: search.createdAt,
            })),
        };
    })),
    // Search analytics for insights
    searchInsights: protectedProcedure
        .input(z.object({
        origin: z.string().min(3).max(3),
        destination: z.string().min(3).max(3),
        departureMonth: z.string().regex(/^\d{4}-\d{2}$/),
    }))
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        // Get price history for insights
        const priceHistory = yield prisma.priceHistory.findMany({
            where: {
                origin: input.origin,
                destination: input.destination,
                date: {
                    gte: new Date(input.departureMonth + '-01'),
                    lt: new Date(new Date(input.departureMonth + '-01').setMonth(new Date(input.departureMonth + '-01').getMonth() + 1)),
                },
            },
            orderBy: { date: 'asc' },
        });
        const prices = priceHistory.map(p => p.avgPrice);
        const currentPrice = prices[prices.length - 1] || 0;
        const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length || 0;
        const minPrice = Math.min(...prices) || 0;
        return {
            route: `${input.origin}-${input.destination}`,
            month: input.departureMonth,
            currentPrice,
            averagePrice: avgPrice,
            lowestPrice: minPrice,
            priceChange: prices.length > 1
                ? ((currentPrice - prices[0]) / prices[0]) * 100
                : 0,
            recommendation: currentPrice < avgPrice * 0.9 ? 'buy' : 'wait',
            confidence: Math.min(prices.length / 30, 1), // Based on data points
            bestDaysToBuy: [54, 47, 40], // Days before departure (mock data)
            priceHistory: priceHistory.map(p => ({
                date: p.date,
                price: p.avgPrice,
            })),
        };
    })),
    // Admin analytics - system-wide metrics
    systemMetrics: adminProcedure.query(() => __awaiter(void 0, void 0, void 0, function* () {
        const [totalUsers, totalSearches, totalBookings, activeAlerts] = yield Promise.all([
            prisma.user.count(),
            prisma.flightSearch.count(),
            prisma.booking.count(),
            prisma.priceAlert.count({ where: { isActive: true } }),
        ]);
        // Get metrics from our metrics collector
        const systemMetrics = metrics.getAll();
        return {
            users: {
                total: totalUsers,
                new_today: 0, // TODO: Calculate from today's registrations
                active_monthly: 0, // TODO: Calculate MAU
            },
            searches: {
                total: totalSearches,
                today: 0, // TODO: Calculate from today's searches
                avg_response_time: systemMetrics['trpc.request.duration.avg'] || 0,
            },
            bookings: {
                total: totalBookings,
                today: 0, // TODO: Calculate from today's bookings
                conversion_rate: totalSearches > 0 ? (totalBookings / totalSearches) * 100 : 0,
            },
            alerts: {
                active: activeAlerts,
                triggered_today: 0, // TODO: Calculate from today's triggers
            },
            system: {
                uptime: process.uptime(),
                memory_usage: process.memoryUsage(),
                metrics: systemMetrics,
            },
        };
    })),
    // Performance metrics
    performance: adminProcedure
        .input(z.object({
        timeRange: z.enum(['1h', '24h', '7d', '30d']).default('24h'),
    }))
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ input }) {
        // This would typically come from a time-series database
        // For now, return current metrics
        const allMetrics = metrics.getAll();
        return {
            timeRange: input.timeRange,
            apiLatency: {
                avg: allMetrics['trpc.request.duration.avg'] || 0,
                p95: allMetrics['trpc.request.duration.p95'] || 0,
                p99: allMetrics['trpc.request.duration.p99'] || 0,
            },
            throughput: {
                requests_per_second: allMetrics['trpc.request.count'] || 0,
                success_rate: 100, // Calculate from success/error metrics
            },
            database: {
                query_time: 0, // TODO: Get from Prisma metrics
                connections: 0, // TODO: Get from connection pool
            },
            cache: {
                hit_rate: 85, // TODO: Calculate from Redis metrics
                memory_usage: 0, // TODO: Get from Redis info
            },
        };
    })),
});
