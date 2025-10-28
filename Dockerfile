# Stage 1: Build the application
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies using 'npm ci' for clean, reproducible builds
RUN npm ci

# Copy source code
COPY . .

# Build the TypeScript application
RUN npm run build


# Stage 2: Create the final, smaller runtime image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy built code and production dependencies from builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Install production dependencies only
RUN npm ci --only=production

# Command to run the application
CMD ["npm", "start"]
