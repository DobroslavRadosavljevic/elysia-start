# 🦊 Elysia Starter Kit

A modern, batteries-included starter kit for building fast backend servers with **Elysia** and **Bun**.

## ✨ Features

- 🚀 **Elysia** - Fast, type-safe web framework
- ⚡ **Bun** - Incredibly fast JavaScript runtime
- 🗄️ **Drizzle ORM** - Type-safe PostgreSQL with migrations
- 🔴 **Redis** - ioredis client with KV utilities
- 📚 **OpenAPI** - Auto-generated API documentation
- 🔒 **CORS** - Cross-origin resource sharing enabled
- ⏰ **Cron Jobs** - Built-in task scheduling
- 📊 **OpenTelemetry** - Observability and tracing
- ⚡ **Server Timing** - Performance metrics
- 🛠️ **TypeScript** - Full type safety
- 🐳 **Docker** - Production-ready containerization with PostgreSQL & Redis
- 🧹 **Ultracite** - Zero-config linting & formatting (Oxlint + Oxfmt)
- 🔗 **Husky + Commitlint** - Git hooks & conventional commits

## 🤔 Why Elysia + Bun?

- **Elysia** - End-to-end type safety with minimal runtime overhead
- **Bun** - All-in-one runtime with native TypeScript, fast package manager, and built-in test runner

---

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.0 or higher
- [Docker](https://docker.com) (optional, for databases)

### Installation

```bash
# Clone the repository
git clone https://github.com/DobroslavRadosavljevic/elysia-start.git
cd elysia-start

# Install dependencies
bun install
```

### Development

```bash
# Start development server with hot reload
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your server running.

📚 API documentation available at [http://localhost:3000/openapi](http://localhost:3000/openapi)

---

## 🐳 Docker Setup

### Local Development (Databases Only)

Start PostgreSQL and Redis containers for local development:

```bash
# Start databases
bun run docker:up

# Check status
bun run docker:ps

# View logs
bun run docker:logs

# Stop databases
bun run docker:down

# Stop and remove volumes (fresh start)
bun run docker:clean
```

**Default local credentials** (no `.env` needed):

| Service    | Host      | Port | User   | Password          | Database   |
| ---------- | --------- | ---- | ------ | ----------------- | ---------- |
| PostgreSQL | localhost | 5432 | elysia | elysia_local_pass | elysia_dev |
| Redis      | localhost | 6379 | -      | (none)            | -          |

### 🏭 Production Deployment

The production setup includes the Elysia app, PostgreSQL, and Redis in a single stack.

#### 1. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit with your production values
nano .env
```

Required environment variables for production:

```bash
# Server
NODE_ENV=production
PORT=3000

# PostgreSQL (required)
POSTGRES_USER=elysia
POSTGRES_PASSWORD=your_secure_password    # REQUIRED
POSTGRES_DB=elysia_db

# Redis (required)
REDIS_PASSWORD=your_redis_password        # REQUIRED
```

#### 2. Build and Deploy

```bash
# Build the production image
bun run docker:build

# Start the full stack (app + databases)
bun run docker:prod

# Check all services
docker compose ps
```

#### 3. Verify Deployment

```bash
# Health check
curl http://localhost:3000/health

# API docs
open http://localhost:3000/openapi
```

### 📦 Docker Images

| Image                | Version | Size   | Purpose     |
| -------------------- | ------- | ------ | ----------- |
| `oven/bun:1-alpine`  | 1.x     | ~95MB  | App runtime |
| `postgres:18-alpine` | 18      | ~240MB | Database    |
| `redis:8-alpine`     | 8       | ~40MB  | Cache/Queue |

The Elysia app is compiled to a standalone binary with bytecode using `bun build --compile --bytecode`, reducing memory usage and improving startup time.

---

## 🗄️ Database (Drizzle ORM)

This project uses **Drizzle ORM** for type-safe PostgreSQL access with automatic Zod schema generation.

### Setup

```bash
# Start PostgreSQL
bun run docker:up

# Push schema to database (development)
bun run db:push

# Or use migrations (production)
bun run db:generate   # Generate migration files
bun run db:migrate    # Apply migrations
```

### Database Scripts

| Command               | Description                           |
| --------------------- | ------------------------------------- |
| `bun run db:push`     | Push schema directly to DB (dev only) |
| `bun run db:generate` | Generate SQL migration files          |
| `bun run db:migrate`  | Apply pending migrations              |
| `bun run db:pull`     | Introspect DB and generate schema     |
| `bun run db:studio`   | Open Drizzle Studio GUI               |
| `bun run db:check`    | Check for schema conflicts            |
| `bun run db:drop`     | Drop a migration file                 |

### Schema Definition

Define tables in `src/db/schema/*.schema.ts`:

```typescript
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Auto-generated Zod schemas
export const UserInsert = createInsertSchema(users);
export const UserSelect = createSelectSchema(users);
```

### Usage in Services

```typescript
import { eq } from "drizzle-orm";
import { db, users } from "../db";

// Insert
const [user] = await db.insert(users).values({ email, name }).returning();

// Query
const [user] = await db.select().from(users).where(eq(users.id, id));

// Update
await db.update(users).set({ name }).where(eq(users.id, id));

// Delete
await db.delete(users).where(eq(users.id, id));
```

---

## 🔴 Redis (ioredis)

Redis client with lazy connection and KV utilities for common operations.

### KV Utilities

```typescript
import { kv } from "../redis";

// Store JSON data with optional TTL (seconds)
await kv.set("user:123", { name: "John", role: "admin" }, 3600);

// Retrieve and parse JSON
const user = await kv.get<{ name: string; role: string }>("user:123");

// Check existence
const exists = await kv.exists("user:123");

// Delete
await kv.del("user:123");

// Counters
await kv.incr("page:views");
await kv.decr("stock:item:42");

// TTL operations
await kv.expire("session:abc", 1800);
const ttl = await kv.ttl("session:abc");

// Pattern matching
const keys = await kv.keys("user:*");
```

### Direct Redis Access

For advanced operations, access the ioredis client directly:

```typescript
import { redis } from "../redis";

// Transactions
const results = await redis
  .multi()
  .set("key1", "value1")
  .set("key2", "value2")
  .exec();

// Pub/Sub, Streams, etc.
await redis.publish("channel", "message");
```

---

## 🔐 Environment Variables

Environment variables are validated at startup using [t3-env](https://github.com/t3-oss/t3-env).

| Variable            | Type   | Default             | Description                               |
| ------------------- | ------ | ------------------- | ----------------------------------------- |
| `NODE_ENV`          | enum   | `development`       | `development`, `production`, or `test`    |
| `PORT`              | number | `3000`              | Server port                               |
| `POSTGRES_HOST`     | string | `localhost`         | PostgreSQL host                           |
| `POSTGRES_PORT`     | number | `5432`              | PostgreSQL port                           |
| `POSTGRES_USER`     | string | `elysia`            | PostgreSQL user                           |
| `POSTGRES_PASSWORD` | string | `elysia_local_pass` | PostgreSQL password                       |
| `POSTGRES_DB`       | string | `elysia_dev`        | PostgreSQL database name                  |
| `DATABASE_URL`      | string | -                   | Full PostgreSQL connection URL (optional) |
| `REDIS_HOST`        | string | `localhost`         | Redis host                                |
| `REDIS_PORT`        | number | `6379`              | Redis port                                |
| `REDIS_PASSWORD`    | string | -                   | Redis password (optional for local)       |
| `REDIS_URL`         | string | -                   | Full Redis connection URL (optional)      |

---

## 📜 Scripts

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `bun run dev`          | Start development server with hot reload |
| `bun run start`        | Start production server                  |
| `bun test`             | Run tests                                |
| `bun run lint`         | Check for linting issues                 |
| `bun run format`       | Fix linting and formatting issues        |
| `bun run typecheck`    | Run TypeScript type checking             |
| `bun run db:push`      | Push schema to database (dev)            |
| `bun run db:generate`  | Generate migration files                 |
| `bun run db:migrate`   | Apply pending migrations                 |
| `bun run db:studio`    | Open Drizzle Studio GUI                  |
| `bun run docker:up`    | Start local PostgreSQL & Redis           |
| `bun run docker:down`  | Stop local databases                     |
| `bun run docker:logs`  | Follow database logs                     |
| `bun run docker:ps`    | Show running containers                  |
| `bun run docker:clean` | Stop databases and remove volumes        |
| `bun run docker:build` | Build production Docker image            |
| `bun run docker:prod`  | Start full production stack              |

---

## 📁 Project Structure

```
elysia-start/
├── src/
│   ├── index.ts              # Entry point - starts server
│   ├── app.ts                # Elysia app with plugins
│   ├── config/
│   │   └── env.ts            # Environment configuration (t3-env)
│   ├── db/                   # Database layer (Drizzle ORM)
│   │   ├── client.ts         # PostgreSQL connection
│   │   ├── schema/           # Table definitions
│   │   │   └── users.schema.ts
│   │   └── migrations/       # Generated migrations
│   ├── redis/                # Redis layer (ioredis)
│   │   ├── client.ts         # Redis connection
│   │   └── kv.ts             # KV utility functions
│   ├── features/             # Feature-based modules
│   │   └── health/           # Health check feature
│   │       ├── health.controller.ts
│   │       ├── health.service.ts
│   │       └── health.model.ts
│   ├── shared/
│   │   ├── errors/           # Custom error classes
│   │   ├── models/           # Shared Zod schemas
│   │   ├── plugins/          # Reusable Elysia plugins
│   │   └── utils/            # Utility functions
│   └── types/                # Global TypeScript types
├── tests/
│   └── index.test.ts         # Test suite
├── drizzle.config.ts         # Drizzle Kit configuration
├── Dockerfile                # Production multi-stage build
├── docker-compose.yml        # Production stack (app + databases)
├── docker-compose.local.yml  # Local development (databases only)
├── .env.example              # Environment template
├── .dockerignore             # Docker build exclusions
├── package.json
├── tsconfig.json
└── bunfig.toml
```

### Feature Structure

Each feature folder follows this pattern:

- `*.controller.ts` - HTTP routing and request validation
- `*.service.ts` - Business logic (framework-agnostic)
- `*.model.ts` - Zod validation schemas

---

## 🛠️ Code Quality

This project uses **Ultracite** for zero-config code quality:

```bash
# Check for issues
bun run lint

# Auto-fix issues
bun run format
```

Pre-commit hooks automatically format staged files.

### Commit Convention

Commits follow [Conventional Commits](https://conventionalcommits.org):

```
type(scope): message
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## 🧪 Testing

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch
```

Tests use Bun's built-in test runner with `bun:test`.

---

## 🌐 Deployment Options

### Option 1: Docker Compose (Recommended)

Full stack deployment with `docker compose`:

```bash
cp .env.example .env
# Edit .env with production values
bun run docker:prod
```

### Option 2: Standalone Binary

Build a portable binary that runs without Bun installed:

```bash
bun build --compile --minify-whitespace --minify-syntax \
  --bytecode --sourcemap=external \
  --target bun --outfile server ./src/index.ts

# Run the binary
./server
```

### Option 3: Cloud Platforms

The Dockerfile is compatible with:

- ☁️ **Railway** - Auto-detects Dockerfile
- 🪰 **Fly.io** - Use `fly launch`
- 🌐 **Google Cloud Run** - Use `gcloud run deploy`
- 🟠 **AWS ECS/Fargate** - Build and push to ECR
- 🌊 **DigitalOcean App Platform** - Auto-detects Dockerfile

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with 💜 using [Elysia](https://elysiajs.com) and [Bun](https://bun.sh)
