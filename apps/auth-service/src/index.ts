import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import redis from '@fastify/redis';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import Fastify from 'fastify';
import { z } from 'zod';

// Type definitions
interface JWTPayload {
  userId: string;
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JWTPayload;
    user: JWTPayload;
  }
}

const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
    },
  },
});

const prisma = new PrismaClient();

// Validation schemas
const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Register plugins
async function registerPlugins() {
  await fastify.register(cors, {
    origin: process.env.NODE_ENV === 'production' ? false : true,
  });

  await fastify.register(helmet);

  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key',
  });

  await fastify.register(redis, {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  });
}

// Routes
async function registerRoutes() {
  // Health check
  fastify.get('/health', async () => {
    return { status: 'ok', service: 'auth-service' };
  });

  // Register user
  fastify.post('/register', async (request, reply) => {
    try {
      const { email, password, name } = RegisterSchema.parse(request.body);

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return reply.code(400).send({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      // Generate JWT
      const token = fastify.jwt.sign({ userId: user.id });

      return { user, token };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(400).send({ error: 'Invalid request data' });
    }
  });

  // Login user
  fastify.post('/login', async (request, reply) => {
    try {
      const { email, password } = LoginSchema.parse(request.body);

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      // Generate JWT
      const token = fastify.jwt.sign({ userId: user.id });

      // Cache user session
      await fastify.redis.setex(
        `session:${user.id}`,
        86400,
        JSON.stringify({
          userId: user.id,
          email: user.email,
          name: user.name,
        })
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(400).send({ error: 'Invalid request data' });
    }
  });

  // Verify token
  fastify.get('/verify', async (request, reply) => {
    try {
      await request.jwtVerify();
      const userId = (request.user as JWTPayload).userId;

      // Check cached session
      const cachedSession = await fastify.redis.get(`session:${userId}`);

      if (cachedSession) {
        return JSON.parse(cachedSession);
      }

      // Fallback to database
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      if (!user) {
        return reply.code(401).send({ error: 'Invalid token' });
      }

      return user;
    } catch (error) {
      return reply.code(401).send({ error: 'Invalid token' });
    }
  });

  // Logout
  fastify.post('/logout', async (request, reply) => {
    try {
      await request.jwtVerify();
      const userId = (request.user as JWTPayload).userId;

      // Remove cached session
      await fastify.redis.del(`session:${userId}`);

      return { message: 'Logged out successfully' };
    } catch (error) {
      return reply.code(401).send({ error: 'Invalid token' });
    }
  });
}

// Start server
async function start() {
  try {
    await registerPlugins();
    await registerRoutes();

    const port = parseInt(process.env.PORT || '3001');
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    fastify.log.info(`Auth service running on http://${host}:${port}`);
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  fastify.log.info('Shutting down auth service...');
  await prisma.$disconnect();
  await fastify.close();
  process.exit(0);
});

start();
