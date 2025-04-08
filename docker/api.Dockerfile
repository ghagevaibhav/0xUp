FROM oven/bun:1.2.1 as base

# Set working directory
WORKDIR /app

# Install dependencies
FROM base as dependencies
COPY package.json bun.lock ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
RUN bun install --frozen-lockfile

# Build the app
FROM dependencies as builder
COPY . .
RUN bun run build

# Production image
FROM base as runner

ENV NODE_ENV=production

# Copy only necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api ./apps/api
COPY --from=builder /app/packages/db ./packages/db
COPY --from=builder /app/package.json ./package.json

# Set up health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Expose API port
EXPOSE 3001

# Start the API
CMD ["bun", "run", "apps/api/index.ts"] 