import { __awaiter, __decorate, __metadata, __param } from "tslib";
import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flight } from './entities/flight.entity';
let FlightsService = class FlightsService {
    constructor(flightsRepository, cacheManager) {
        this.flightsRepository = flightsRepository;
        this.cacheManager = cacheManager;
    }
    searchFlights(searchDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { origin, destination, departureDate, passengers = 1, cabin, maxStops, maxPrice, airlines, limit = 20, offset = 0, } = searchDto;
            // Generate cache key
            const cacheKey = `flights:${JSON.stringify(searchDto)}`;
            // Check cache first
            const cachedResult = yield this.cacheManager.get(cacheKey);
            if (cachedResult) {
                return cachedResult;
            }
            // Build query
            const queryBuilder = this.flightsRepository
                .createQueryBuilder('flight')
                .where('flight.origin = :origin', { origin })
                .andWhere('flight.destination = :destination', { destination })
                .andWhere('flight.departureDate >= :departureStart', {
                departureStart: new Date(departureDate),
            })
                .andWhere('flight.departureDate < :departureEnd', {
                departureEnd: new Date(new Date(departureDate).getTime() + 24 * 60 * 60 * 1000),
            })
                .andWhere('flight.availableSeats >= :passengers', { passengers })
                .andWhere('flight.isActive = :isActive', { isActive: true });
            if (cabin) {
                queryBuilder.andWhere('flight.cabin = :cabin', { cabin });
            }
            if (maxStops !== undefined) {
                queryBuilder.andWhere('flight.stops <= :maxStops', { maxStops });
            }
            if (maxPrice) {
                queryBuilder.andWhere('flight.price <= :maxPrice', { maxPrice });
            }
            if (airlines && airlines.length > 0) {
                queryBuilder.andWhere('flight.airline IN (:...airlines)', { airlines });
            }
            // Execute query with pagination
            const [flights, total] = yield queryBuilder
                .orderBy('flight.price', 'ASC')
                .addOrderBy('flight.duration', 'ASC')
                .skip(offset)
                .take(limit)
                .getManyAndCount();
            const result = {
                flights,
                pagination: {
                    total,
                    limit,
                    offset,
                    hasMore: offset + limit < total,
                },
            };
            // Cache result for 2 minutes
            yield this.cacheManager.set(cacheKey, result, 120);
            return result;
        });
    }
    getFlightById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cacheKey = `flight:${id}`;
            const cachedFlight = yield this.cacheManager.get(cacheKey);
            if (cachedFlight) {
                return cachedFlight;
            }
            const flight = yield this.flightsRepository.findOne({
                where: { id, isActive: true },
            });
            if (flight) {
                yield this.cacheManager.set(cacheKey, flight, 300);
            }
            return flight;
        });
    }
    getFlightPriceHistory(origin_1, destination_1) {
        return __awaiter(this, arguments, void 0, function* (origin, destination, days = 30) {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            const priceHistory = yield this.flightsRepository
                .createQueryBuilder('flight')
                .select([
                'DATE(flight.createdAt) as date',
                'AVG(flight.price) as avgPrice',
                'MIN(flight.price) as minPrice',
                'MAX(flight.price) as maxPrice',
                'COUNT(*) as flightCount',
            ])
                .where('flight.origin = :origin', { origin })
                .andWhere('flight.destination = :destination', { destination })
                .andWhere('flight.createdAt >= :startDate', { startDate })
                .andWhere('flight.isActive = :isActive', { isActive: true })
                .groupBy('DATE(flight.createdAt)')
                .orderBy('DATE(flight.createdAt)', 'ASC')
                .getRawMany();
            return priceHistory;
        });
    }
    getPopularRoutes() {
        return __awaiter(this, arguments, void 0, function* (limit = 10) {
            const cacheKey = 'popular-routes';
            const cachedRoutes = yield this.cacheManager.get(cacheKey);
            if (cachedRoutes) {
                return cachedRoutes;
            }
            const routes = yield this.flightsRepository
                .createQueryBuilder('flight')
                .select([
                'flight.origin',
                'flight.destination',
                'COUNT(*) as flightCount',
                'AVG(flight.price) as avgPrice',
                'MIN(flight.price) as minPrice',
            ])
                .where('flight.isActive = :isActive', { isActive: true })
                .groupBy('flight.origin, flight.destination')
                .orderBy('COUNT(*)', 'DESC')
                .limit(limit)
                .getRawMany();
            // Cache for 1 hour
            yield this.cacheManager.set(cacheKey, routes, 3600);
            return routes;
        });
    }
    createFlight(flightData) {
        return __awaiter(this, void 0, void 0, function* () {
            const flight = this.flightsRepository.create(Object.assign(Object.assign({}, flightData), { lastUpdated: new Date() }));
            return yield this.flightsRepository.save(flight);
        });
    }
    updateFlight(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.flightsRepository.update(id, Object.assign(Object.assign({}, updateData), { lastUpdated: new Date() }));
            // Invalidate cache
            yield this.cacheManager.del(`flight:${id}`);
            return yield this.getFlightById(id);
        });
    }
    deactivateFlight(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.flightsRepository.update(id, {
                isActive: false,
                lastUpdated: new Date(),
            });
            // Invalidate cache
            yield this.cacheManager.del(`flight:${id}`);
        });
    }
};
FlightsService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Flight)),
    __param(1, Inject(CACHE_MANAGER)),
    __metadata("design:paramtypes", [Repository, Object])
], FlightsService);
export { FlightsService };
