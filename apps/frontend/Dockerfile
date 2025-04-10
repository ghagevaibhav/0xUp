# FROM node:20-alpine as deps

# WORKDIR /app

# COPY package.json bun.lock ./
# COPY apps/frontend/package.json ./app/frontend/

# RUN npm install

# FROM node:20-alpine as builder

# COPY apps/frontend/ ./app/frontend         
# COPY --from=deps /app/node_modules ./node_modules

# WORKDIR /app/frontend

# RUN npm run build

# FROM node:20-alpine as runner
# WORKDIR /app/frontend


# EXPOSE 3000

# ENV PORT 3000

# CMD ["node", "./apps/frontend/.next/standalone/server.js"]



# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files first for better caching
COPY package.json bun.lock ./
COPY apps/frontend/package.json ./apps/frontend/

# Use npm ci for production dependencies only (faster and more reliable than install)
RUN npm install

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application files
COPY . .

WORKDIR /app/apps/frontend

# Build the application
RUN npm run build

# Stage 3: Production runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Install production dependencies only (no need for devDependencies)
RUN npm install -g serve

# Copy built assets and dependencies
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder /app/apps/frontend/.next/standalone ./
COPY --from=builder /app/apps/frontend/.next/static ./apps/frontend/.next/static

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000

# Expose and run
EXPOSE 3000
CMD ["node", "./apps/frontend/server.js"]