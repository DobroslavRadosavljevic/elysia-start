# Contributing to Elysia Start

Thank you for your interest in contributing! This guide will help you get started.

## Ways to Contribute

- Report bugs
- Suggest new features
- Improve documentation
- Submit pull requests

## Getting Started

1. **Fork the repository**

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/elysia-start.git
   cd elysia-start
   ```

3. **Install dependencies**

   ```bash
   bun install
   ```

4. **Create a branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Make your changes**

6. **Run checks**

   ```bash
   bun run lint
   bun run format
   bun run typecheck
   ```

7. **Commit your changes**

   ```bash
   git commit -m "feat: add your feature description"
   ```

8. **Push and create a PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Code Style

This project uses [Ultracite](https://github.com/haydenbleasel/ultracite) for linting and formatting:

```bash
# Check for issues
bun run lint

# Auto-fix issues
bun run format
```

Please ensure your code passes all checks before submitting a PR.

## Reporting Bugs

When reporting bugs, please include:

1. A clear description of the issue
2. Steps to reproduce
3. Expected vs actual behavior
4. Your environment (OS, Bun version, etc.)

## Suggesting Features

Feature requests are welcome! Please:

1. Check existing issues first
2. Describe the use case
3. Explain why this would be useful

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing!
