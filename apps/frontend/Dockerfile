# stage 1: install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# copy package files for dependency installation
COPY package.json bun.lock ./
COPY apps/frontend/package.json ./frontend/

# install dependencies with legacy peer dependencies
RUN npm install --legacy-peer-deps

# stage 2: build the application
FROM node:20-alpine AS builder
WORKDIR /app

# copy installed node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# copy frontend source code
COPY apps/frontend ./frontend

# copy typescript and next.js configuration files
COPY apps/frontend/tsconfig.json ./tsconfig.json
COPY apps/frontend/next.config.mjs ./next.config.mjs

WORKDIR /app/frontend

# install dependencies again for the frontend
RUN npm install --legacy-peer-deps

# set environment to production
ENV NODE_ENV=production
# build the next.js application
RUN npm run build

# stage 3: run the application
FROM node:20-alpine AS runner
WORKDIR /app

# install serve globally to serve the built application
RUN npm install -g serve

# copy built files from builder stage
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/.next/standalone ./
COPY --from=builder /app/frontend/.next/static ./.next/static
COPY --from=builder /app/frontend/package.json ./package.json

# set environment variables for production
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

# switch to non-root user
USER nextjs

# expose the application port
EXPOSE 3000
# command to run the application
CMD ["node", "server.js"]