# Elysia Starter Kit

A backend server starter kit using **Elysia** and **Bun**.

## Quick Start

```bash
bun install          # Install dependencies
bun run docker:up    # Start PostgreSQL & Redis (optional)
bun run dev          # Start dev server with hot reload (port 3000)
bun test             # Run tests
```

API docs available at http://localhost:3000/openapi

---

## Important Rules

- **README.md**: MUST use emojis in section headers (e.g., `## 🚀 Quick Start`)

---

## Scripts

| Command                | Description                            |
| ---------------------- | -------------------------------------- |
| `bun run dev`          | Start dev server with hot reload       |
| `bun test`             | Run test suite (Bun's built-in runner) |
| `bun run lint`         | Check for linting issues               |
| `bun run format`       | Auto-fix linting and formatting        |
| `bun run typecheck`    | TypeScript type checking               |
| `bun run docker:up`    | Start local PostgreSQL & Redis         |
| `bun run docker:down`  | Stop local databases                   |
| `bun run docker:clean` | Stop and remove volumes                |
| `bun run docker:prod`  | Start full production stack            |

---

## Project Structure

```
elysia-start/
├── src/
│   ├── index.ts              # Entry point - starts server
│   ├── app.ts                # Elysia app with plugins
│   ├── features/             # Feature-based modules
│   │   └── health/           # Example feature
│   │       ├── health.controller.ts
│   │       ├── health.service.ts
│   │       └── health.model.ts
│   ├── shared/               # Shared utilities
│   │   ├── errors/           # Custom error classes
│   │   ├── models/           # Shared Zod schemas
│   │   ├── plugins/          # Reusable Elysia plugins
│   │   └── utils/            # Utility functions
│   ├── config/               # Configuration (t3-env)
│   └── types/                # Global TypeScript types
├── tests/
│   └── index.test.ts         # Test suite
├── .claude/                  # AI agent configuration
├── .husky/                   # Git hooks
├── Dockerfile                # Production build
├── docker-compose.yml        # Production stack
├── docker-compose.local.yml  # Local databases
├── .env.example              # Environment template
├── package.json
├── tsconfig.json
├── bunfig.toml               # Bun config
├── .oxlintrc.json            # Linter rules
├── .oxfmtrc.jsonc            # Formatter rules
└── commitlint.config.ts      # Conventional commits
```

### Feature Structure

Each feature folder contains:

- `*.controller.ts` - HTTP routing, request validation
- `*.service.ts` - Business logic (framework-agnostic)
- `*.model.ts` - Zod validation schemas

---

## Elysia Plugins

The app uses these official Elysia plugins:

| Plugin                    | Purpose                               |
| ------------------------- | ------------------------------------- |
| `@elysiajs/cors`          | Cross-origin resource sharing         |
| `@elysiajs/cron`          | Scheduled tasks (heartbeat every 30s) |
| `@elysiajs/openapi`       | Auto-generated API documentation      |
| `@elysiajs/opentelemetry` | Observability and tracing             |
| `@elysiajs/server-timing` | Performance metrics                   |

All plugins are added via `.use()` method chaining.

---

## Docker

### Local Development

```bash
bun run docker:up    # Start PostgreSQL 18 & Redis 8
bun run docker:down  # Stop containers
bun run docker:clean # Remove volumes (fresh start)
```

**Default credentials** (no `.env` needed):

- PostgreSQL: `elysia:elysia_local_pass@localhost:5432/elysia_dev`
- Redis: `localhost:6379` (no password)

### Production

```bash
cp .env.example .env  # Configure POSTGRES_PASSWORD & REDIS_PASSWORD
bun run docker:prod   # Start app + databases
```

### Files

- `Dockerfile` - Multi-stage build, compiles to binary via `bun build --compile`
- `docker-compose.yml` - Production stack (app + PostgreSQL + Redis)
- `docker-compose.local.yml` - Local dev (databases only)

---

## Testing

Uses Bun's built-in test runner with `bun:test`:

```typescript
import { describe, expect, it } from "bun:test";
import { Elysia } from "elysia";

describe("Elysia", () => {
  it("returns response", async () => {
    const app = new Elysia().get("/", () => "hello");
    const response = await app.handle(new Request("http://localhost/"));
    expect(response.status).toBe(200);
  });
});
```

---

## Git Workflow

- **Pre-commit**: Runs `bun lint-staged` (formats staged files)
- **Commit-msg**: Validates conventional commits via commitlint

Commit format: `type(scope): message`

- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## Ultracite Code Standards

This project uses **Ultracite** for zero-config linting and formatting.

### Commands

- **Format code**: `bun run format`
- **Check for issues**: `bun run lint`

### Core Principles

Write code that is **accessible, performant, type-safe, and maintainable**.

### Type Safety

- Use explicit types for function parameters and return values
- Prefer `unknown` over `any`
- Use const assertions (`as const`) for immutable values
- Leverage TypeScript's type narrowing instead of assertions

### Modern JavaScript/TypeScript

- Use arrow functions for callbacks
- Prefer `for...of` loops over `.forEach()`
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Prefer template literals over string concatenation
- Use `const` by default, `let` only when needed, never `var`

### Async & Promises

- Always `await` promises in async functions
- Use `async/await` over promise chains
- Handle errors with try-catch blocks
- Don't use async functions as Promise executors

### Error Handling

- Remove `console.log`, `debugger` from production code
- Throw `Error` objects with descriptive messages
- Prefer early returns over nested conditionals

### Code Organization

- Keep functions focused and simple
- Extract complex conditions into well-named variables
- Use early returns to reduce nesting
- Group related code together

### Zod Schemas

- Use **PascalCase** for Zod schema names (e.g., `UserResponse`, `CreatePostBody`)
- Suffix inferred types with `Type` (e.g., `type UserResponseType = z.infer<typeof UserResponse>`)
- Place schemas in `*.model.ts` files within feature folders
- Use Zod for all validation (routes, env config) - not Typebox

---

## Source Code Reference

Source code for dependencies is available in `opensrc/` for deeper understanding.

See `opensrc/sources.json` for available packages and versions.

### Fetching Additional Source Code

```bash
npx opensrc <package>           # npm package (e.g., npx opensrc zod)
npx opensrc pypi:<package>      # Python package
npx opensrc crates:<package>    # Rust crate
npx opensrc <owner>/<repo>      # GitHub repo
```
