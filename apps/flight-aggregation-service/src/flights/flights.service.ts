import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { Flight } from './entities/flight.entity';
import { SearchFlightsDto } from './dto/search-flights.dto';

@Injectable()
export class FlightsService {
  constructor(
    @InjectRepository(Flight)
    private flightsRepository: Repository<Flight>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache
  ) {}

  async searchFlights(searchDto: SearchFlightsDto) {
    const {
      origin,
      destination,
      departureDate,
      passengers = 1,
      cabin,
      maxStops,
      maxPrice,
      airlines,
      limit = 20,
      offset = 0,
    } = searchDto;

    // Generate cache key
    const cacheKey = `flights:${JSON.stringify(searchDto)}`;

    // Check cache first
    const cachedResult = await this.cacheManager.get(cacheKey);
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
        departureEnd: new Date(
          new Date(departureDate).getTime() + 24 * 60 * 60 * 1000
        ),
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
    const [flights, total] = await queryBuilder
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
    await this.cacheManager.set(cacheKey, result, 120);

    return result;
  }

  async getFlightById(id: string): Promise<Flight> {
    const cacheKey = `flight:${id}`;

    const cachedFlight = await this.cacheManager.get<Flight>(cacheKey);
    if (cachedFlight) {
      return cachedFlight;
    }

    const flight = await this.flightsRepository.findOne({
      where: { id, isActive: true },
    });

    if (flight) {
      await this.cacheManager.set(cacheKey, flight, 300);
    }

    return flight;
  }

  async getFlightPriceHistory(
    origin: string,
    destination: string,
    days: number = 30
  ) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const priceHistory = await this.flightsRepository
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
  }

  async getPopularRoutes(limit: number = 10) {
    const cacheKey = 'popular-routes';

    const cachedRoutes = await this.cacheManager.get(cacheKey);
    if (cachedRoutes) {
      return cachedRoutes;
    }

    const routes = await this.flightsRepository
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
    await this.cacheManager.set(cacheKey, routes, 3600);

    return routes;
  }

  async createFlight(flightData: Partial<Flight>): Promise<Flight> {
    const flight = this.flightsRepository.create({
      ...flightData,
      lastUpdated: new Date(),
    });

    return await this.flightsRepository.save(flight);
  }

  async updateFlight(id: string, updateData: Partial<Flight>): Promise<Flight> {
    await this.flightsRepository.update(id, {
      ...updateData,
      lastUpdated: new Date(),
    });

    // Invalidate cache
    await this.cacheManager.del(`flight:${id}`);

    return await this.getFlightById(id);
  }

  async deactivateFlight(id: string): Promise<void> {
    await this.flightsRepository.update(id, {
      isActive: false,
      lastUpdated: new Date(),
    });

    // Invalidate cache
    await this.cacheManager.del(`flight:${id}`);
  }
}
