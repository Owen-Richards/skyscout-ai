import { z } from 'zod';

export const FlightSearchSchema = z.object({
  origin: z.string().min(3).max(3),
  destination: z.string().min(3).max(3),
  departureDate: z.string().datetime(),
  returnDate: z.string().datetime().optional(),
  passengers: z.number().min(1).max(9),
  class: z
    .enum(['economy', 'premium_economy', 'business', 'first'])
    .default('economy'),
});

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
  preferences: z
    .object({
      currency: z.string().default('USD'),
      language: z.string().default('en'),
      notifications: z.boolean().default(true),
    })
    .optional(),
});

export const FlightOfferSchema = z.object({
  id: z.string(),
  origin: z.string(),
  destination: z.string(),
  departureDate: z.string(),
  arrivalDate: z.string(),
  price: z.number().positive(),
  currency: z.string(),
  airline: z.string(),
  duration: z.string(),
  stops: z.number().min(0),
  aircraft: z.string().optional(),
  confidence: z.number().min(0).max(100),
  prediction: z.string(),
});

export type FlightSearch = z.infer<typeof FlightSearchSchema>;
export type User = z.infer<typeof UserSchema>;
export type FlightOffer = z.infer<typeof FlightOfferSchema>;
