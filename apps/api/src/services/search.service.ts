import { prisma } from '../db/client';
import { CacheService } from '../db/redis';
import { logger } from '../utils/logger';

interface AutocompleteInput {
  query: string;
  type: 'airport' | 'city' | 'country';
  limit: number;
}

interface AirportsInput {
  country?: string;
  city?: string;
  popular?: boolean;
  limit: number;
}

class SearchService {
  private readonly cachePrefix = 'search:';
  private readonly cacheTTL = 3600; // 1 hour

  async autocomplete(input: AutocompleteInput) {
    const cacheKey = `${this.cachePrefix}autocomplete:${input.type}:${input.query}:${input.limit}`;

    // Try cache first
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    let results = [];

    switch (input.type) {
      case 'airport':
        results = await this.searchAirports(input.query, input.limit);
        break;
      case 'city':
        results = await this.searchCities(input.query, input.limit);
        break;
      case 'country':
        results = await this.searchCountries(input.query, input.limit);
        break;
    }

    // Cache results
    await CacheService.set(cacheKey, results, this.cacheTTL);

    return results;
  }

  async getAirports(input: AirportsInput) {
    const cacheKey = `${this.cachePrefix}airports:${input.country || 'all'}:${input.city || 'all'}:${input.popular}:${input.limit}`;

    // Try cache first
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const whereClause: Record<string, unknown> = {};

    if (input.country) {
      whereClause.countryCode = input.country;
    }

    if (input.city) {
      whereClause.city = {
        contains: input.city,
        mode: 'insensitive',
      };
    }

    const airports = await prisma.airport.findMany({
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
    await CacheService.set(cacheKey, result, this.cacheTTL);

    return result;
  }

  async searchAirports(query: string, limit: number) {
    const searchTerm = query.toLowerCase();

    const airports = await prisma.airport.findMany({
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
  }

  async searchCities(query: string, limit: number) {
    const searchTerm = query.toLowerCase();

    // Get distinct cities from airports
    const cities = await prisma.airport.findMany({
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
  }

  async searchCountries(query: string, limit: number) {
    const searchTerm = query.toLowerCase();

    // Get distinct countries from airports
    const countries = await prisma.airport.findMany({
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
  }

  async getPopularRoutes(limit = 10) {
    const cacheKey = `${this.cachePrefix}popular_routes:${limit}`;

    // Try cache first
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const routes = await prisma.popularRoute.findMany({
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
    await CacheService.set(cacheKey, routes, this.cacheTTL);

    return routes;
  }

  async getTrendingDestinations(limit = 10) {
    const cacheKey = `${this.cachePrefix}trending_destinations:${limit}`;

    // Try cache first
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const destinations = await prisma.trendingDestination.findMany({
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
    await CacheService.set(cacheKey, destinations, this.cacheTTL);

    return destinations;
  }

  async indexAirportsFromCSV(_csvData: string) {
    // TODO: Implement CSV parsing and airport data import
    logger.info('Airport indexing started');

    // This would parse CSV data and bulk insert airports
    // For now, just log that the function was called

    logger.info('Airport indexing completed');
    return { success: true, imported: 0 };
  }

  async refreshSearchCache() {
    // Clear all search-related caches
    // TODO: Implement pattern-based cache clearing
    // For now, just clear the entire cache
    await CacheService.flush();

    logger.info('Search cache refreshed');
    return { success: true };
  }
}

export const searchService = new SearchService();
