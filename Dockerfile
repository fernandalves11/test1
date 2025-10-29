# Stage 1: Build the application
FROM node:20-slim AS builder

# Set working directory
WORKDIR /uphold-bot-assessment

# Copy package.json and package-lock.json
COPY package*.json ./
RUN npm install

# Install dependencies using 'npm ci' for clean, reproducible builds
RUN npm ci

# Copy source code
COPY . .

# Build the TypeScript application
RUN npm run build

# Stage 2: Create the final, smaller runtime image
FROM node:20-slim

# Copy built code and production dependencies from builder stage
COPY --from=builder /uphold-bot-assessment/package*.json ./
COPY --from=builder /uphold-bot-assessment/dist ./dist

# Install production dependencies only
RUN npm ci --only=production

# Command to run the application
CMD ["node", "dist/index.js"]
