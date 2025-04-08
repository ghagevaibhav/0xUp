# Docker Deployment Instructions

This guide explains how to deploy the application using Docker Compose in production.

## Prerequisites

- Docker and Docker Compose installed on your server
- Domain name configured to point to your server
- SSL certificates (we'll use Let's Encrypt with certbot)

## Setup Instructions

### 1. Environment Configuration

Copy the example environment file and update it with your values:

```bash
cp .env.example .env
```

Edit the `.env` file and replace the placeholder values with your actual configuration.

### 2. Setting Up Docker Secrets

For production deployments, create Docker secrets for sensitive information:

```bash
echo "your_postgres_password" | docker secret create postgres_password -
echo "your_postgres_user" | docker secret create postgres_user -
echo "your_clerk_secret_key" | docker secret create clerk_secret_key -
echo "your_clerk_publishable_key" | docker secret create clerk_publishable_key -
echo "postgresql://user:password@postgres:5432/db" | docker secret create database_url -
```

### 3. SSL Certificates

#### Automatic SSL Setup with Let's Encrypt

Before starting the application, you need to set up SSL certificates. We've included a script to help you get started:

1. Edit the `docker/init-letsencrypt.sh` script:
   - Update the `domains` array with your domain names
   - Set your email address
   - Set `staging=1` for testing (to avoid rate limits) and `staging=0` for production

2. Run the initialization script:

```bash
# Make the script executable if needed
chmod +x docker/init-letsencrypt.sh

# Run the script
./docker/init-letsencrypt.sh
```

This script will:
- Create required directories for certbot
- Generate temporary self-signed certificates
- Start Nginx
- Request and obtain proper Let's Encrypt certificates
- Configure Nginx to use the certificates

#### Manual SSL Certificate Setup

If you prefer to set up certificates manually:

```bash
# Create required directories
mkdir -p docker/certbot/conf docker/certbot/www

# Replace yourdomain.com with your actual domain
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Copy the certificates to the certbot directory
sudo cp -L /etc/letsencrypt/live/yourdomain.com/fullchain.pem ./docker/certbot/conf/
sudo cp -L /etc/letsencrypt/live/yourdomain.com/privkey.pem ./docker/certbot/conf/
sudo cp -L /etc/letsencrypt/live/yourdomain.com/chain.pem ./docker/certbot/conf/
```

### 4. Update Nginx Configuration

Update the Nginx configuration files in `docker/nginx/conf.d/default.conf` to use your domain name:

Replace all instances of `yourdomain.com` with your actual domain.

### 5. Deployment

Deploy the application:

```bash
# Development deployment
docker compose up -d

# Production deployment
docker compose -f compose.yaml -f compose.production.yaml up -d
```

### 6. Database Migrations

Run database migrations:

```bash
docker compose exec api bun run prisma migrate deploy
```

## Scaling Services

To scale services horizontally:

```bash
docker compose -f compose.yaml -f compose.production.yaml up -d --scale api=3
```

## Monitoring

Monitor container logs:

```bash
docker compose logs -f
```

## Updating the Application

To update the application:

```bash
git pull
docker compose -f compose.yaml -f compose.production.yaml build
docker compose -f compose.yaml -f compose.production.yaml up -d
```

## Backing Up PostgreSQL Data

Create a database backup:

```bash
docker compose exec postgres pg_dump -U youruser -d yourdb > backup.sql
```

## Troubleshooting

### Check Container Status

```bash
docker compose ps
```

### View Container Logs

```bash
docker compose logs -f service_name
```

### SSL Certificate Issues

If you're having issues with SSL certificates:

```bash
# Check the certbot logs
docker compose logs certbot

# Force certificate renewal
docker compose run --rm certbot renew --force-renewal

# Check certificate files
ls -la docker/certbot/conf/live/yourdomain.com/
``` 