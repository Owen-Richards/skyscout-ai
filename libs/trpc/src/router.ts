import { FlightSearchSchema } from '@skyscout/shared';
import { z } from 'zod';
import { publicProcedure, router } from './trpc';

export const appRouter = router({
  health: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  flights: router({
    search: publicProcedure
      .input(FlightSearchSchema)
      .query(async ({ input }) => {
        // TODO: Implement actual flight search
        return {
          results: [
            {
              id: '1',
              origin: input.origin,
              destination: input.destination,
              departureDate: input.departureDate,
              arrivalDate: input.returnDate || input.departureDate,
              price: 589,
              currency: 'USD',
              airline: 'Mock Airlines',
              duration: '8h 45m',
              stops: 0,
              confidence: 85,
              prediction: 'Price likely to increase in next 7 days',
            },
          ],
          total: 1,
          page: 1,
        };
      }),

    getDeals: publicProcedure.query(async () => {
      // TODO: Implement actual deals fetching
      return [
        {
          id: '1',
          origin: 'NYC',
          destination: 'TYO',
          departureDate: '2024-12-15T10:00:00Z',
          arrivalDate: '2024-12-16T14:25:00Z',
          price: 589,
          currency: 'USD',
          airline: 'ANA',
          duration: '14h 25m',
          stops: 0,
          confidence: 85,
          prediction: 'Price likely to increase 15% in next 7 days',
        },
      ];
    }),
  }),

  predictions: router({
    getPrice: publicProcedure
      .input(
        z.object({
          origin: z.string(),
          destination: z.string(),
          departureDate: z.string(),
        })
      )
      .query(async ({ input }) => {
        // TODO: Implement ML price prediction
        return {
          currentPrice: 589,
          predictedPrice: 625,
          confidence: 85,
          trend: 'increasing' as const,
          recommendation: 'Book now to save an estimated $36',
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
