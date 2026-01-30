# Build stage - compile to standalone binary (Elysia recommended)
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install all dependencies (needed for compilation)
RUN bun install --frozen-lockfile

# Copy source code
COPY src ./src
COPY tsconfig.json ./

# Compile to standalone binary (reduces memory usage & file size)
ENV NODE_ENV=production
RUN bun build \
    --compile \
    --minify-whitespace \
    --minify-syntax \
    --target bun \
    --outfile server \
    ./src/index.ts

# Production stage - minimal image
FROM oven/bun:1-alpine AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S elysia && \
    adduser -S elysia -u 1001

# Copy compiled binary
COPY --from=builder --chown=elysia:elysia /app/server ./server

USER elysia

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["./server"]

# =============================================================================
# Alternative: Distroless (even smaller, ~50% size reduction)
# Uncomment below and comment out the alpine runner above for minimal image
# Note: No shell access for debugging, no wget for health checks
# =============================================================================
# FROM gcr.io/distroless/base AS runner
# WORKDIR /app
# COPY --from=builder /app/server ./server
# ENV NODE_ENV=production
# EXPOSE 3000
# CMD ["./server"]
