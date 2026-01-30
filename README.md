# 🦊 Elysia Starter Kit

A modern, batteries-included starter kit for building fast backend servers with **Elysia** and **Bun**.

## ✨ Features

- 🚀 **Elysia** - Fast, type-safe web framework
- ⚡ **Bun** - Incredibly fast JavaScript runtime
- 📚 **OpenAPI** - Auto-generated API documentation
- 🔒 **CORS** - Cross-origin resource sharing enabled
- ⏰ **Cron Jobs** - Built-in task scheduling
- 📊 **OpenTelemetry** - Observability and tracing
- ⚡ **Server Timing** - Performance metrics
- 🛠️ **TypeScript** - Full type safety
- 🧹 **Ultracite** - Zero-config linting & formatting (Oxlint + Oxfmt)
- 🔗 **Husky + Commitlint** - Git hooks & conventional commits

## 🤔 Why Elysia + Bun?

- **Elysia** - End-to-end type safety with minimal runtime overhead
- **Bun** - All-in-one runtime with native TypeScript, fast package manager, and built-in test runner

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.0 or higher

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

## 📜 Scripts

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `bun run dev`       | Start development server with hot reload |
| `bun test`          | Run tests                                |
| `bun run lint`      | Check for linting issues                 |
| `bun run format`    | Fix linting and formatting issues        |
| `bun run typecheck` | Run TypeScript type checking             |

## 📁 Project Structure

```
elysia-start/
├── src/
│   └── index.ts      # Application entry point
├── tests/            # Test files
├── .husky/           # Git hooks
└── package.json
```

## 🛠️ Code Quality

This project uses **Ultracite** for zero-config code quality:

```bash
# Check for issues
bun run lint

# Auto-fix issues
bun run format
```

Pre-commit hooks automatically format staged files.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Made with 💜 using [Elysia](https://elysiajs.com) and [Bun](https://bun.sh)
