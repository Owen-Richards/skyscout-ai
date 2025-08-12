import { z } from 'zod';
const configSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
    PORT: z.string().transform(Number).default('3001'),
    HOST: z.string().default('0.0.0.0'),
    // Database
    DATABASE_URL: z.string(),
    // Redis
    REDIS_URL: z.string(),
    // JWT
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string().default('7d'),
    // External APIs
    AMADEUS_API_KEY: z.string().optional(),
    AMADEUS_API_SECRET: z.string().optional(),
    SKYSCANNER_API_KEY: z.string().optional(),
    GOOGLE_FLIGHTS_API_KEY: z.string().optional(),
    // ML Service
    ML_SERVICE_URL: z.string().default('http://localhost:8000'),
    // Search Service
    SEARCH_SERVICE_URL: z.string().default('http://localhost:8080'),
    // AWS
    AWS_REGION: z.string().default('us-east-1'),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    // Monitoring
    SENTRY_DSN: z.string().optional(),
    NEW_RELIC_LICENSE_KEY: z.string().optional(),
    // Rate Limiting
    RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
    RATE_LIMIT_WINDOW: z.string().default('15m'),
});
export const config = configSchema.parse(process.env);
