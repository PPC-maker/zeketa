# Backend Dockerfile
FROM node:20-slim

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy Prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build using npx to ensure nest CLI is found
RUN npx nest build

# Expose port
EXPOSE 4000

# Set production environment
ENV NODE_ENV=production

# Start command
CMD ["npm", "run", "start:prod"]
