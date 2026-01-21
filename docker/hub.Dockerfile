FROM oven/bun:1.2.21 AS base

# Set working directory
WORKDIR /app

# Install dependencies
FROM base as dependencies
COPY package.json bun.lock ./
COPY apps/hub/package.json ./apps/hub/
COPY packages/db/package.json ./packages/db/
COPY packages/common/package.json ./packages/common/
RUN bun install

# Build the app
FROM dependencies as builder
COPY . .
# Generate Prisma client (no build needed for Bun TS)
RUN cd packages/db && bunx prisma generate

# Production image
FROM base as runner

ENV NODE_ENV=production

# Copy only necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/hub ./apps/hub
COPY --from=builder /app/packages/db ./packages/db
COPY --from=builder /app/packages/common ./packages/common
COPY --from=builder /app/package.json ./package.json

# Expose WebSocket port if needed
EXPOSE 8080

# Start the Hub service
CMD ["bun", "run", "apps/hub/index.ts"] 