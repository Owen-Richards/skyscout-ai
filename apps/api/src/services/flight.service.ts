import { prisma } from '../db/client';
import { CacheService } from '../db/redis';
import { logger } from '../utils/logger';
import { metrics } from '../utils/metrics';

interface FlightSearchInput {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  cabin: string;
  currency: string;
  maxPrice?: number;
  airlines?: string[];
  stops?: number;
  sortBy: string;
}

interface PriceAlertInput {
  userId: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  maxPrice: number;
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
}

interface PriceHistoryInput {
  origin: string;
  destination: string;
  departureMonth: string;
  days: number;
}

class FlightService {
  private readonly cachePrefix = 'flight:';
  private readonly searchCacheTTL = 300; // 5 minutes
  private readonly priceHistoryCacheTTL = 3600; // 1 hour

  async search(input: FlightSearchInput, userId?: string) {
    const timer = metrics.timer('flight.search.duration');
    metrics.increment('flight.search.count');

    try {
      // Generate cache key
      const cacheKey = this.generateSearchCacheKey(input);

      // Try to get from cache first
      const cachedResult = await CacheService.get(cacheKey);
      if (cachedResult) {
        metrics.increment('flight.search.cache_hit');
        logger.debug('Flight search cache hit', { cacheKey });
        return cachedResult;
      }

      metrics.increment('flight.search.cache_miss');

      // Store search query for analytics
      if (userId) {
        await this.storeSearchQuery(input, userId);
      }

      // Search flights from multiple providers
      const results = await this.searchFromProviders(input);

      // Cache the results
      await CacheService.set(cacheKey, results, this.searchCacheTTL);

      logger.info('Flight search completed', {
        origin: input.origin,
        destination: input.destination,
        resultsCount: results.flights.length,
        searchTime: results.meta.searchTime,
      });

      return results;
    } catch (error) {
      metrics.increment('flight.search.error');
      logger.error('Flight search error:', error);
      throw error;
    } finally {
      timer();
    }
  }

  async getPriceHistory(input: PriceHistoryInput) {
    const cacheKey = `${this.cachePrefix}price_history:${input.origin}:${input.destination}:${input.departureMonth}`;

    // Try cache first
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Get from database
    const endDate = new Date(input.departureMonth + '-01');
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(endDate.getDate() - 1);

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - input.days);

    const priceHistory = await prisma.priceHistory.findMany({
      where: {
        origin: input.origin,
        destination: input.destination,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: 'asc' },
    });

    const result = {
      origin: input.origin,
      destination: input.destination,
      period: {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
      },
      data: priceHistory.map(record => ({
        date: record.date.toISOString().split('T')[0],
        minPrice: record.minPrice,
        avgPrice: record.avgPrice,
        maxPrice: record.maxPrice,
        currency: record.currency,
      })),
      summary: {
        lowestPrice: Math.min(...priceHistory.map(p => p.minPrice)),
        averagePrice:
          priceHistory.reduce((sum, p) => sum + p.avgPrice, 0) /
          priceHistory.length,
        highestPrice: Math.max(...priceHistory.map(p => p.maxPrice)),
      },
    };

    // Cache for 1 hour
    await CacheService.set(cacheKey, result, this.priceHistoryCacheTTL);

    return result;
  }

  async createPriceAlert(input: PriceAlertInput) {
    const alert = await prisma.priceAlert.create({
      data: {
        userId: input.userId,
        origin: input.origin,
        destination: input.destination,
        departureDate: new Date(input.departureDate),
        returnDate: input.returnDate ? new Date(input.returnDate) : null,
        maxPrice: input.maxPrice,
        adults: input.passengers.adults,
        children: input.passengers.children,
        infants: input.passengers.infants,
      },
    });

    logger.info('Price alert created', {
      alertId: alert.id,
      userId: input.userId,
    });

    // TODO: Add to price monitoring queue

    return alert;
  }

  async getUserPriceAlerts(userId: string) {
    const alerts = await prisma.priceAlert.findMany({
      where: {
        userId,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return alerts;
  }

  async deletePriceAlert(alertId: string, userId: string) {
    const alert = await prisma.priceAlert.findFirst({
      where: {
        id: alertId,
        userId,
      },
    });

    if (!alert) {
      throw new Error('Alert not found');
    }

    await prisma.priceAlert.update({
      where: { id: alertId },
      data: { isActive: false },
    });

    logger.info('Price alert deleted', { alertId, userId });

    return { success: true };
  }

  private async storeSearchQuery(input: FlightSearchInput, userId: string) {
    try {
      await prisma.flightSearch.create({
        data: {
          userId,
          origin: input.origin,
          destination: input.destination,
          departureDate: new Date(input.departureDate),
          returnDate: input.returnDate ? new Date(input.returnDate) : null,
          adults: input.passengers.adults,
          children: input.passengers.children,
          infants: input.passengers.infants,
          cabin: input.cabin,
          currency: input.currency,
        },
      });
    } catch (error) {
      logger.error('Failed to store search query:', error);
      // Don't throw - this is not critical
    }
  }

  private generateSearchCacheKey(input: FlightSearchInput): string {
    const key = [
      this.cachePrefix,
      'search',
      input.origin,
      input.destination,
      input.departureDate,
      input.returnDate || 'oneway',
      `${input.passengers.adults}a${input.passengers.children}c${input.passengers.infants}i`,
      input.cabin,
      input.currency,
      input.sortBy,
    ].join(':');

    // Add optional filters
    if (input.maxPrice) key += `:maxPrice${input.maxPrice}`;
    if (input.airlines?.length)
      key += `:airlines${input.airlines.sort().join(',')}`;
    if (input.stops !== undefined) key += `:stops${input.stops}`;

    return key;
  }

  private async searchFromProviders(input: FlightSearchInput) {
    const startTime = Date.now();

    // TODO: Implement actual flight API integrations
    // For now, return mock data
    const mockResults = {
      flights: [
        {
          id: 'flight-123',
          price: {
            total: 299.99,
            currency: input.currency,
            formatted: '$299.99',
          },
          outbound: {
            duration: 180, // 3 hours
            stops: 0,
            departure: {
              airport: input.origin,
              time: input.departureDate + 'T08:00:00Z',
            },
            arrival: {
              airport: input.destination,
              time: input.departureDate + 'T11:00:00Z',
            },
            segments: [
              {
                airline: {
                  code: 'AA',
                  name: 'American Airlines',
                  logo: 'https://example.com/aa-logo.png',
                },
                flight: 'AA1234',
                aircraft: 'Boeing 737-800',
                departure: {
                  airport: input.origin,
                  terminal: '1',
                  time: input.departureDate + 'T08:00:00Z',
                },
                arrival: {
                  airport: input.destination,
                  terminal: '2',
                  time: input.departureDate + 'T11:00:00Z',
                },
                duration: 180,
                cabin: input.cabin,
              },
            ],
          },
          return: input.returnDate
            ? {
                duration: 180,
                stops: 0,
                departure: {
                  airport: input.destination,
                  time: input.returnDate + 'T15:00:00Z',
                },
                arrival: {
                  airport: input.origin,
                  time: input.returnDate + 'T18:00:00Z',
                },
                segments: [
                  {
                    airline: {
                      code: 'AA',
                      name: 'American Airlines',
                      logo: 'https://example.com/aa-logo.png',
                    },
                    flight: 'AA5678',
                    aircraft: 'Boeing 737-800',
                    departure: {
                      airport: input.destination,
                      terminal: '2',
                      time: input.returnDate + 'T15:00:00Z',
                    },
                    arrival: {
                      airport: input.origin,
                      terminal: '1',
                      time: input.returnDate + 'T18:00:00Z',
                    },
                    duration: 180,
                    cabin: input.cabin,
                  },
                ],
              }
            : undefined,
          bookingUrl: 'https://example.com/book/flight-123',
          deepLink: 'skyscout://book/flight-123',
        },
      ],
      meta: {
        totalResults: 1,
        searchTime: Date.now() - startTime,
        currency: input.currency,
        filters: {
          minPrice: 199.99,
          maxPrice: 599.99,
          airlines: ['AA', 'DL', 'UA'],
          stops: [0, 1, 2],
        },
      },
    };

    return mockResults;
  }
}

export const flightService = new FlightService();
