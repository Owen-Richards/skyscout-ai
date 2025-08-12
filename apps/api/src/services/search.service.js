import { __awaiter } from "tslib";
import { prisma } from '../db/client';
import { CacheService } from '../db/redis';
import { logger } from '../utils/logger';
class SearchService {
    constructor() {
        this.cachePrefix = 'search:';
        this.cacheTTL = 3600; // 1 hour
    }
    autocomplete(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = `${this.cachePrefix}autocomplete:${input.type}:${input.query}:${input.limit}`;
            // Try cache first
            const cached = yield CacheService.get(cacheKey);
            if (cached) {
                return cached;
            }
            let results = [];
            switch (input.type) {
                case 'airport':
                    results = yield this.searchAirports(input.query, input.limit);
                    break;
                case 'city':
                    results = yield this.searchCities(input.query, input.limit);
                    break;
                case 'country':
                    results = yield this.searchCountries(input.query, input.limit);
                    break;
            }
            // Cache results
            yield CacheService.set(cacheKey, results, this.cacheTTL);
            return results;
        });
    }
    getAirports(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = `${this.cachePrefix}airports:${input.country || 'all'}:${input.city || 'all'}:${input.popular}:${input.limit}`;
            // Try cache first
            const cached = yield CacheService.get(cacheKey);
            if (cached) {
                return cached;
            }
            const whereClause = {};
            if (input.country) {
                whereClause.countryCode = input.country;
            }
            if (input.city) {
                whereClause.city = {
                    contains: input.city,
                    mode: 'insensitive',
                };
            }
            const airports = yield prisma.airport.findMany({
                where: whereClause,
                take: input.limit,
                orderBy: input.popular
                    ? [
                        { name: 'asc' }, // TODO: Add popularity score
                    ]
                    : [{ name: 'asc' }],
                select: {
                    id: true,
                    iataCode: true,
                    name: true,
                    city: true,
                    country: true,
                    countryCode: true,
                    timezone: true,
                    latitude: true,
                    longitude: true,
                },
            });
            const result = {
                airports,
                total: airports.length,
            };
            // Cache results
            yield CacheService.set(cacheKey, result, this.cacheTTL);
            return result;
        });
    }
    searchAirports(query, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchTerm = query.toLowerCase();
            const airports = yield prisma.airport.findMany({
                where: {
                    OR: [
                        {
                            iataCode: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            name: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            city: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                    ],
                },
                take: limit,
                orderBy: [
                    // Exact IATA code matches first
                    {
                        iataCode: 'asc',
                    },
                    {
                        name: 'asc',
                    },
                ],
                select: {
                    id: true,
                    iataCode: true,
                    name: true,
                    city: true,
                    country: true,
                    timezone: true,
                },
            });
            return airports.map(airport => ({
                type: 'airport',
                id: airport.id,
                code: airport.iataCode,
                name: airport.name,
                city: airport.city,
                country: airport.country,
                displayName: `${airport.city} (${airport.iataCode})`,
                subtitle: `${airport.name}, ${airport.country}`,
            }));
        });
    }
    searchCities(query, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchTerm = query.toLowerCase();
            // Get distinct cities from airports
            const cities = yield prisma.airport.findMany({
                where: {
                    city: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
                distinct: ['city', 'countryCode'],
                take: limit,
                orderBy: {
                    city: 'asc',
                },
                select: {
                    city: true,
                    country: true,
                    countryCode: true,
                },
            });
            return cities.map(city => ({
                type: 'city',
                name: city.city,
                country: city.country,
                countryCode: city.countryCode,
                displayName: city.city,
                subtitle: city.country,
            }));
        });
    }
    searchCountries(query, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchTerm = query.toLowerCase();
            // Get distinct countries from airports
            const countries = yield prisma.airport.findMany({
                where: {
                    OR: [
                        {
                            country: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                        {
                            countryCode: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                    ],
                },
                distinct: ['country', 'countryCode'],
                take: limit,
                orderBy: {
                    country: 'asc',
                },
                select: {
                    country: true,
                    countryCode: true,
                },
            });
            return countries.map(country => ({
                type: 'country',
                name: country.country,
                code: country.countryCode,
                displayName: country.country,
                subtitle: country.countryCode,
            }));
        });
    }
    getPopularRoutes() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            const cacheKey = `${this.cachePrefix}popular_routes:${limit}`;
            // Try cache first
            const cached = yield CacheService.get(cacheKey);
            if (cached) {
                return cached;
            }
            const routes = yield prisma.popularRoute.findMany({
                where: {
                    period: 'month',
                    periodStart: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
                orderBy: {
                    popularity: 'desc',
                },
                take: limit,
            });
            // Cache for 1 hour
            yield CacheService.set(cacheKey, routes, this.cacheTTL);
            return routes;
        });
    }
    getTrendingDestinations() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            const cacheKey = `${this.cachePrefix}trending_destinations:${limit}`;
            // Try cache first
            const cached = yield CacheService.get(cacheKey);
            if (cached) {
                return cached;
            }
            const destinations = yield prisma.trendingDestination.findMany({
                where: {
                    period: 'month',
                    periodStart: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
                orderBy: {
                    popularityScore: 'desc',
                },
                take: limit,
            });
            // Cache for 1 hour
            yield CacheService.set(cacheKey, destinations, this.cacheTTL);
            return destinations;
        });
    }
    indexAirportsFromCSV(_csvData) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Implement CSV parsing and airport data import
            logger.info('Airport indexing started');
            // This would parse CSV data and bulk insert airports
            // For now, just log that the function was called
            logger.info('Airport indexing completed');
            return { success: true, imported: 0 };
        });
    }
    refreshSearchCache() {
        return __awaiter(this, void 0, void 0, function* () {
            // Clear all search-related caches
            // TODO: Implement pattern-based cache clearing
            // For now, just clear the entire cache
            yield CacheService.flush();
            logger.info('Search cache refreshed');
            return { success: true };
        });
    }
}
export const searchService = new SearchService();
