# Build stage
FROM oven/bun:1 as builder

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy workspace package files
COPY packages/db/package.json ./packages/db/
COPY apps/api/package.json ./apps/api/

# Install dependencies
RUN bun install

# Copy source code
COPY packages/db ./packages/db
COPY apps/api ./apps/api

# Generate Prisma client
RUN cd packages/db && bunx prisma generate

# Production stage
FROM oven/bun:1-slim

# Add non-root user for security
RUN addgroup --system appgroup && \
    adduser --system --ingroup appgroup appuser

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/packages/db ./packages/db
COPY --from=builder --chown=appuser:appgroup /app/apps/api ./apps/api

# Switch to non-root user
USER appuser

WORKDIR /app/apps/api

# Set environment variables
ENV NODE_ENV=production

EXPOSE 8080

# Use bun to run the application
CMD ["bun", "run", "index.ts"]