# 🦊 Elysia Starter Kit

A modern, batteries-included starter kit for building fast backend servers with **Elysia** and **Bun**.

## ✨ Features

- 🚀 **Elysia** - Fast, type-safe web framework
- ⚡ **Bun** - Incredibly fast JavaScript runtime
- 🗄️ **Drizzle ORM** - Type-safe PostgreSQL with migrations
- 🔴 **Redis** - ioredis client with KV utilities
- 📋 **BullMQ** - Redis-backed job queues with Bull Board UI
- 📚 **OpenAPI** - Auto-generated API documentation
- 🔒 **CORS** - Cross-origin resource sharing enabled
- ⏰ **Cron Jobs** - Built-in task scheduling
- 📊 **OpenTelemetry** - Observability and tracing
- ⚡ **Server Timing** - Performance metrics
- 🛠️ **TypeScript** - Full type safety
- 🐳 **Docker** - Production-ready containerization with PostgreSQL & Redis
- 🔄 **CI/CD** - Optional GitHub Actions pipelines (disabled by default)
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

## 📋 Queue Jobs (BullMQ)

This project includes **BullMQ** for background job processing with **Bull Board** for monitoring.

### Bull Board UI

Access the queue dashboard at [http://localhost:3000/admin/queues](http://localhost:3000/admin/queues)

**Default credentials:**

- Username: `admin`
- Password: `admin123!` (change in production!)

### Creating Queues

Define queues in `src/queues/queues/`:

```typescript
import { Queue } from "bullmq";
import { z } from "zod";
import { bullMQConnection } from "../connection";

// Define job data schema with Zod
export const EmailJobData = z.object({
  to: z.string().email(),
  subject: z.string(),
  body: z.string(),
});

export type EmailJobDataType = z.infer<typeof EmailJobData>;

export const emailQueue = new Queue<EmailJobDataType>("email", {
  connection: bullMQConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
  },
});
```

### Creating Workers

Define workers in `src/queues/workers/`:

```typescript
import { type Job, Worker } from "bullmq";
import { createBullMQConnection } from "../connection";
import type { EmailJobDataType } from "../queues/email.queue";

export const emailWorker = new Worker<EmailJobDataType>(
  "email",
  async (job: Job<EmailJobDataType>) => {
    const { to, subject, body } = job.data;
    // Send email logic here
    await job.updateProgress(100);
    return { sent: true };
  },
  { connection: createBullMQConnection(), concurrency: 5 }
);

emailWorker.on("completed", (job) => console.log(`Job ${job.id} completed`));
emailWorker.on("failed", (job, err) =>
  console.error(`Job ${job?.id} failed:`, err)
);
```

### Adding Jobs

```typescript
import { emailQueue } from "../queues";

// Add a job
const job = await emailQueue.add("send", {
  to: "user@example.com",
  subject: "Welcome!",
  body: "Hello from BullMQ",
});

// Add with options
await emailQueue.add("send", data, {
  delay: 5000, // 5 second delay
  priority: 1, // Higher priority
  attempts: 5, // Override default attempts
});

// Add recurring job
await emailQueue.upsertJobScheduler(
  "daily-report",
  { pattern: "0 9 * * *" }, // 9 AM daily
  { name: "report", data: { type: "daily" } }
);
```

### Registering New Queues

1. Create queue file in `src/queues/queues/`
2. Create worker file in `src/queues/workers/`
3. Export from `src/queues/queues/index.ts`:
   ```typescript
   export { emailQueue } from "./email.queue";
   export const allQueues = [exampleQueue, emailQueue];
   ```
4. Export from `src/queues/workers/index.ts`:
   ```typescript
   export const allWorkers = [exampleWorker, emailWorker];
   ```

---

## 🔐 Environment Variables

Environment variables are validated at startup using [t3-env](https://github.com/t3-oss/t3-env).

| Variable              | Type   | Default             | Description                                 |
| --------------------- | ------ | ------------------- | ------------------------------------------- |
| `NODE_ENV`            | enum   | `development`       | `development`, `production`, or `test`      |
| `PORT`                | number | `3000`              | Server port                                 |
| `POSTGRES_HOST`       | string | `localhost`         | PostgreSQL host                             |
| `POSTGRES_PORT`       | number | `5432`              | PostgreSQL port                             |
| `POSTGRES_USER`       | string | `elysia`            | PostgreSQL user                             |
| `POSTGRES_PASSWORD`   | string | `elysia_local_pass` | PostgreSQL password                         |
| `POSTGRES_DB`         | string | `elysia_dev`        | PostgreSQL database name                    |
| `DATABASE_URL`        | string | -                   | Full PostgreSQL connection URL (optional)   |
| `REDIS_HOST`          | string | `localhost`         | Redis host                                  |
| `REDIS_PORT`          | number | `6379`              | Redis port                                  |
| `REDIS_PASSWORD`      | string | -                   | Redis password (optional for local)         |
| `REDIS_URL`           | string | -                   | Full Redis connection URL (optional)        |
| `BULL_BOARD_USERNAME` | string | `admin`             | Bull Board dashboard username               |
| `BULL_BOARD_PASSWORD` | string | `admin123!`         | Bull Board dashboard password (min 8 chars) |

---

## 📜 Scripts

| Command                | Description                              |
| ---------------------- | ---------------------------------------- |
| `bun run dev`          | Start development server with hot reload |
| `bun run start`        | Start production server                  |
| `bun run build`        | Build TypeScript to JavaScript for prod  |
| `bun run start:prod`   | Run built production server              |
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
| `bun run ci:enable`    | Enable GitHub Actions & Dependabot       |
| `bun run ci:disable`   | Disable GitHub Actions & Dependabot      |

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
│   ├── queues/               # Queue layer (BullMQ)
│   │   ├── connection.ts     # BullMQ Redis connection
│   │   ├── board.ts          # Bull Board setup
│   │   ├── queues/           # Queue definitions
│   │   └── workers/          # Worker definitions
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
├── scripts/
│   ├── ci-enable.ts          # Enable CI/CD workflows
│   └── ci-disable.ts         # Disable CI/CD workflows
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

## 🔄 CI/CD (Optional)

This starter kit includes pre-configured CI/CD pipelines that are **disabled by default**. Enable them when you're ready for automated testing, Docker builds, and releases.

### Enable CI/CD

```bash
bun run ci:enable
```

This enables:

| Workflow       | Trigger              | Description                               |
| -------------- | -------------------- | ----------------------------------------- |
| **CI**         | Push to `main`, PRs  | Lint, typecheck, test, build validation   |
| **Docker**     | Push to `main`, tags | Build multi-platform images, push to GHCR |
| **Migrations** | PRs (schema changes) | Validate database migrations              |
| **Release**    | Version tags (`v*`)  | Create GitHub releases with changelog     |
| **Dependabot** | Weekly               | Automated dependency updates              |

### Disable CI/CD

```bash
bun run ci:disable
```

### Manual Enable/Disable

Alternatively, rename files in `.github/` manually:

```bash
# Enable a workflow
mv .github/workflows/ci.yml.disabled .github/workflows/ci.yml

# Disable a workflow
mv .github/workflows/ci.yml .github/workflows/ci.yml.disabled
```

### Creating Releases

With CI/CD enabled, create releases by pushing version tags:

```bash
git tag v1.0.0
git push origin v1.0.0
```

This generates a changelog and creates a GitHub Release automatically.

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

### Option 3: 🏃 Classic Build & Run

Build TypeScript to JavaScript and run with Bun (requires Bun installed on server):

```bash
# Build for production
bun run build

# Run production server
bun run start:prod
```

Or manually:

```bash
bun build --target=bun --minify --sourcemap=external --outdir=dist ./src/index.ts
NODE_ENV=production bun dist/index.js
```

**Pros:**

- ⚡ Faster build times than standalone binary
- 📦 Smaller output (no embedded Bun runtime)
- 🔄 Easy to update Bun version independently

**Cons:**

- Requires Bun installed on the target server

### Option 4: ☁️ Cloud Platforms

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
