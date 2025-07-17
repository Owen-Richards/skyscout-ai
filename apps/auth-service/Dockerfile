# Multi-stage build for Auth service
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY libs/ui/package.json ./libs/ui/
COPY libs/shared/package.json ./libs/shared/
COPY libs/trpc/package.json ./libs/trpc/

# Install dependencies
RUN npm ci --only=production

# Development image
FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install development dependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "run", "dev"]

# Production build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 auth

# Copy built application
COPY --from=builder --chown=auth:nodejs /app/dist ./dist
COPY --from=builder --chown=auth:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=auth:nodejs /app/package*.json ./
COPY --from=builder --chown=auth:nodejs /app/prisma ./prisma

USER auth

EXPOSE 3001

CMD ["npm", "start"]
