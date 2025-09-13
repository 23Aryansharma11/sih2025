# Use official Node.js image as base
FROM node:20-alpine

# Set working directory in container
WORKDIR /app

# Copy package files for dependency installation (cache layer)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the TypeScript project
RUN npm run build

# Expose the port your server listens on (default 3000, adjust if different)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
