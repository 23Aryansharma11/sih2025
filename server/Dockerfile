# 1. Build backend only
FROM oven/bun:1.2.20 AS builder
WORKDIR /app

# Copy backend deps and files
COPY bun.lock package.json tsconfig.json ./
RUN bun install

# Copy all source code (since you run build inside server folder)
COPY . .

# 2. Final runtime image
FROM oven/bun:latest
WORKDIR /app

COPY --from=builder /app/bun.lock ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/tsconfig.json ./
RUN bun install --production

COPY --from=builder /app .

EXPOSE 3000

CMD ["bun", "src/index.ts"]
