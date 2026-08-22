# Contributing to HUPA

Thank you for your interest in contributing to HUPA! We welcome contributions from developers of all skill levels.

---

## Development Setup

### 1. Prerequisites
- **Node.js**: `v20.x` or later
- **npm**: `v10.x` or later
- **PostgreSQL**: Local database or Supabase project

### 2. Fork and Clone
```bash
git clone https://github.com/your-username/hupa.git
cd hupa
npm install
```

### 3. Environment Configuration
```bash
cp .env.example .env
```
Populate `.env` with your PostgreSQL database credentials and a 32-character secret key for Better Auth.

### 4. Running the Dev Environment
```bash
# Web application (Vite client + Express API backend)
npm run dev

# Windows Desktop development (Vite + Express + Electron)
npm run dev:desktop
```

---

## Code Quality Standards

### Linting & Formatting
HUPA uses `oxlint` for high-speed, modern JavaScript/TypeScript linting:
```bash
npm run lint
```

### Type Checking & Building
Always ensure all TypeScript checks pass before submitting a pull request:
```bash
npm run build
npm run build:electron
```

---

## Pull Request Guidelines

1. **Branch Naming**: Use descriptive branch names:
   - `feat/node-group-export`
   - `fix/edge-snap-calculation`
   - `docs/clarify-sync-engine`
2. **Atomic Commits**: Write clear, imperative commit messages (`feat: add orthogonal edge routing`, `fix: prevent sync race condition`).
3. **Describe Changes**: Complete the PR template with what changed, why, and verification steps.
4. **Self-Review**: Verify that no debug artifacts, secrets, or temporary files are committed.

---

## Community

Please adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md) in all community interactions.
