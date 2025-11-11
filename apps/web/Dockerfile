# Multi-stage Dockerfile for Next.js application
# Optimized for production with minimal image size

# Stage 1: Dependencies
FROM node:20.11.0-alpine AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

# Install dependencies
RUN npm ci --only=production && \
    cd apps/web && \
    npm ci --only=production

# Stage 2: Builder
FROM node:20.11.0-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/
COPY apps/web/prisma ./apps/web/prisma/

# Install all dependencies (including dev dependencies for build)
RUN npm ci && \
    cd apps/web && \
    npm ci

# Copy source code
COPY apps/web ./apps/web

# Generate Prisma Client
WORKDIR /app/apps/web
RUN npx prisma generate

# Build Next.js application
RUN npm run build

# Stage 3: Runner
FROM node:20.11.0-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
# Use standalone output for optimized Docker image
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static
COPY --from=builder /app/apps/web/prisma ./prisma

# Set working directory
WORKDIR /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]

