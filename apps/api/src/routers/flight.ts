import { z } from 'zod';
import { router, baseProcedure, protectedProcedure } from './trpc';
import { flightService } from '../services/flight.service';
import { searchService } from '../services/search.service';
import { TRPCError } from '@trpc/server';

export const flightRouter = router({
  search: baseProcedure
    .input(
      z.object({
        origin: z.string().min(3).max(3), // IATA code
        destination: z.string().min(3).max(3),
        departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        returnDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
        passengers: z
          .object({
            adults: z.number().min(1).max(9).default(1),
            children: z.number().min(0).max(8).default(0),
            infants: z.number().min(0).max(8).default(0),
          })
          .default({ adults: 1, children: 0, infants: 0 }),
        cabin: z
          .enum(['economy', 'premium_economy', 'business', 'first'])
          .default('economy'),
        currency: z.string().length(3).default('USD'),
        maxPrice: z.number().optional(),
        airlines: z.array(z.string()).optional(),
        stops: z.number().min(0).max(3).optional(),
        sortBy: z
          .enum(['price', 'duration', 'departure', 'arrival'])
          .default('price'),
      })
    )
    .output(
      z.object({
        flights: z.array(
          z.object({
            id: z.string(),
            price: z.object({
              total: z.number(),
              currency: z.string(),
              formatted: z.string(),
            }),
            outbound: z.object({
              duration: z.number(), // minutes
              stops: z.number(),
              departure: z.object({
                airport: z.string(),
                time: z.string(),
              }),
              arrival: z.object({
                airport: z.string(),
                time: z.string(),
              }),
              segments: z.array(
                z.object({
                  airline: z.object({
                    code: z.string(),
                    name: z.string(),
                    logo: z.string().optional(),
                  }),
                  flight: z.string(),
                  aircraft: z.string().optional(),
                  departure: z.object({
                    airport: z.string(),
                    terminal: z.string().optional(),
                    time: z.string(),
                  }),
                  arrival: z.object({
                    airport: z.string(),
                    terminal: z.string().optional(),
                    time: z.string(),
                  }),
                  duration: z.number(),
                  cabin: z.string(),
                })
              ),
            }),
            return: z
              .object({
                duration: z.number(),
                stops: z.number(),
                departure: z.object({
                  airport: z.string(),
                  time: z.string(),
                }),
                arrival: z.object({
                  airport: z.string(),
                  time: z.string(),
                }),
                segments: z.array(
                  z.object({
                    airline: z.object({
                      code: z.string(),
                      name: z.string(),
                      logo: z.string().optional(),
                    }),
                    flight: z.string(),
                    aircraft: z.string().optional(),
                    departure: z.object({
                      airport: z.string(),
                      terminal: z.string().optional(),
                      time: z.string(),
                    }),
                    arrival: z.object({
                      airport: z.string(),
                      terminal: z.string().optional(),
                      time: z.string(),
                    }),
                    duration: z.number(),
                    cabin: z.string(),
                  })
                ),
              })
              .optional(),
            bookingUrl: z.string().url(),
            deepLink: z.string().url().optional(),
          })
        ),
        meta: z.object({
          totalResults: z.number(),
          searchTime: z.number(),
          currency: z.string(),
          filters: z.object({
            minPrice: z.number(),
            maxPrice: z.number(),
            airlines: z.array(z.string()),
            stops: z.array(z.number()),
          }),
        }),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const results = await flightService.search(input, ctx.user?.id);
        return results;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to search flights',
          cause: error,
        });
      }
    }),

  autocomplete: baseProcedure
    .input(
      z.object({
        query: z.string().min(1).max(100),
        type: z.enum(['airport', 'city', 'country']).default('airport'),
        limit: z.number().min(1).max(20).default(10),
      })
    )
    .query(async ({ input }) => {
      return await searchService.autocomplete(input);
    }),

  airports: baseProcedure
    .input(
      z.object({
        country: z.string().optional(),
        city: z.string().optional(),
        popular: z.boolean().default(false),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ input }) => {
      return await searchService.getAirports(input);
    }),

  priceHistory: baseProcedure
    .input(
      z.object({
        origin: z.string().min(3).max(3),
        destination: z.string().min(3).max(3),
        departureMonth: z.string().regex(/^\d{4}-\d{2}$/),
        days: z.number().min(7).max(365).default(30),
      })
    )
    .query(async ({ input }) => {
      return await flightService.getPriceHistory(input);
    }),

  priceAlerts: protectedProcedure
    .input(
      z.object({
        origin: z.string().min(3).max(3),
        destination: z.string().min(3).max(3),
        departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        returnDate: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
        maxPrice: z.number().min(1),
        passengers: z.object({
          adults: z.number().min(1).max(9),
          children: z.number().min(0).max(8),
          infants: z.number().min(0).max(8),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await flightService.createPriceAlert({
        ...input,
        userId: ctx.user.id,
      });
    }),

  getUserAlerts: protectedProcedure.query(async ({ ctx }) => {
    return await flightService.getUserPriceAlerts(ctx.user.id);
  }),

  deleteAlert: protectedProcedure
    .input(
      z.object({
        alertId: z.string().uuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await flightService.deletePriceAlert(input.alertId, ctx.user.id);
    }),
});
