FROM oven/bun:1 as builder

WORKDIR /app

# copy root package files and install dependencies
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.bun \
    bun install

# copy workspace package files and source code
COPY packages/db/package.json ./packages/db/
COPY apps/validator/package.json ./apps/validator/
COPY packages/db ./packages/db
COPY packages/common ./packages/common
COPY apps/validator ./apps/validator

# generate prisma client
RUN --mount=type=cache,target=/root/.bun \
    cd packages/db && bunx prisma generate

FROM oven/bun:1-slim

# add non-root user for security
RUN addgroup --system appgroup && \
    adduser --system --ingroup appgroup appuser

WORKDIR /app

# copy only necessary files from builder
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/packages/db ./packages/db
COPY --from=builder --chown=appuser:appgroup /app/packages/common ./packages/common
COPY --from=builder --chown=appuser:appgroup /app/apps/validator ./apps/validator

# switch to non-root user
USER appuser

WORKDIR /app/apps/validator

# set environment variables
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0

# use bun to run the application
CMD ["bun", "run", "index.ts"]