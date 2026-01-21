FROM oven/bun:1.2.21 AS base

# Set working directory
WORKDIR /app

# Install dependencies
FROM base as dependencies
COPY package.json bun.lock ./
COPY apps/validator/package.json ./apps/validator/
COPY packages/common/package.json ./packages/common/
RUN bun install

# Build the app
FROM dependencies as builder
COPY . .
# No build step needed - Bun runs TS directly

# Production image
FROM base as runner

ENV NODE_ENV=production

# Copy only necessary files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/validator ./apps/validator
COPY --from=builder /app/packages/common ./packages/common
COPY --from=builder /app/package.json ./package.json

# Start the Validator service
CMD ["bun", "run", "apps/validator/index.ts"] 