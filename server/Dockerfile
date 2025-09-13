# Stage 1: Build
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install all dependencies (dev + prod)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the project (compile TypeScript)
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Only copy production node_modules from build stage
COPY --from=build /app/node_modules ./node_modules

# Copy the built JS files from build stage
COPY --from=build /app/dist ./dist

# Copy package.json if needed for metadata
COPY --from=build /app/package.json .

# Expose the app port (adjust if different)
EXPOSE 3000

# Start the app
CMD ["node", "dist/index.js"]
