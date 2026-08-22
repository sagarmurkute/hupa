<div align="center">

# HUPA

**Universal Project Graph Environment for Developers**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev/)
[![Electron](https://img.shields.io/badge/Electron-Desktop-47848F.svg?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![PostgreSQL](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg?logo=supabase&logoColor=white)](https://supabase.com)
[![Better Auth](https://img.shields.io/badge/Auth-Better%20Auth-black.svg)](https://www.better-auth.com/)

[**Features**](#-features) • [**Architecture**](#-architecture) • [**Quick Start**](#-quick-start) • [**Desktop App**](#-windows-desktop-application) • [**Local-First Sync**](#-local-first-synchronization) • [**Docs**](#-documentation)

</div>

---

## 💡 What is HUPA?

**HUPA** is a universal project graph environment built for software engineers, architects, and technical leaders. 

Software systems have outgrown static Markdown documents, flat file trees, and disconnected flowcharts. HUPA allows developers to visually model, understand, organize, and navigate complex software systems as **interconnected living graphs**—spanning services, databases, queues, AI agent pipelines, auth boundaries, infrastructure, and technical documentation.

---

## 🎯 Why HUPA Exists & Who It Is For

Modern software engineering involves dozens of distributed microservices, third-party APIs, database schemas, and background workflows. Mental models get lost across pull requests and documentation drifts out of date.

HUPA bridges the gap between high-level architectural intent and deep structural reality:

- **System Architects & Lead Engineers**: Model system topology, dependencies, failure domains, and architectural boundaries.
- **Fullstack & Backend Developers**: Trace data lifecycles, service contracts, event streams, and database relationships.
- **Engineering Teams**: Onboard new engineers in minutes by providing an interactive, explorable, visual map of the entire codebase.

---

## ✨ Features

### 🗺️ Spatial Canvas & Graph Engine
- **Infinite Smooth Canvas**: High-performance pan, zoom, marquee box selection, snap-to-grid, and mini-map.
- **Hierarchical Subsystems**: Nest full subsystem graphs inside parent nodes and drill down seamlessly across multi-level architectures.
- **Auto-Layout Algorithms**: Force-directed, hierarchical DAG, orthogonal grid, and radial system layouts.
- **Node & Edge Specializations**: Microservices, Serverless Functions, Relational Databases, NoSQL Stores, Vector DBs, Redis Caches, Message Queues, AI Agents, Storage Buckets, and Custom Entity Types.

### 🔍 Multi-Dimensional Perspectives & Views
- **10 Curated Architectural Perspectives**: Complete System, Data Flow, Failure Domain, Execution Context, Security Boundary, Deployment Target, Team Ownership, Performance Critical, Cost Impact, and Lifecycle.
- **Structural Analysis & Health Metrics**: Real-time cycle detection, orphan node identification, dependency depth analysis, and connectivity scoring.

### ⚡ Local-First Foundation & Cloud Sync
- **100% Offline Capable**: Normal graph creation, node dragging, editing, connections, and undo/redo execute instantly in local IndexedDB storage with 0ms network latency.
- **Background Cloud Synchronization**: Changes are debounced, tracked in an offline mutation queue, and batched atomically to Supabase PostgreSQL when connected.
- **Deterministic Conflict Resolution**: Timestamp-based Last-Write-Wins (LWW) with tombstone synchronization for safe deletions.

### 🔒 Modern Authentication (Better Auth)
- Robust email/password authentication and session management powered by **Better Auth**.
- Strict session validation and project ownership verification on every database mutation.

### 🖥️ Windows Desktop Application
- Professional native desktop build powered by Electron with NSIS installer (`.exe`), native file open/save dialogs, window state persistence, and offline independence.

---

## 🏗️ Architecture

```
                                      HUPA CORE
                                    /           \
                                   /             \
                       HUPA WEB APP               HUPA WINDOWS DESKTOP
                 (Chromium / Browser)            (Electron 43 Shell)
                          │                               │
                          └───────────────┬───────────────┘
                                          │
                        ┌─────────────────┴─────────────────┐
                        │   ZUSTAND IN-MEMORY GRAPH STORE   │
                        │   - Spatial Node/Edge State       │
                        │   - 0ms Interaction Latency       │
                        └─────────────────┬─────────────────┘
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   ▼                                             ▼
       [ Local IndexedDB Layer ]                     [ Background Sync Engine ]
       - 10 Structured Entity Stores                 - Offline Mutation Queue
       - Automatic Migration                         - Drag Debouncing (350ms)
       - Offline Cache                               - Exponential Retry Backoff
                                                                 │
                                                          (Authenticated)
                                                       Batch HTTP Sync API
                                                                 │
                                                                 ▼
                                                  ┌──────────────────────────────┐
                                                  │    HUPA BACKEND (Express)    │
                                                  │    Better Auth Middleware    │
                                                  └──────────────┬───────────────┘
                                                                 │
                                                                 ▼
                                                  ┌──────────────────────────────┐
                                                  │     SUPABASE POSTGRESQL      │
                                                  │   (projects, graphs, nodes,  │
                                                  │    edges, groups, docs)      │
                                                  └──────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `v20.x` or later (tested on Node v24)
- **npm**: `v10.x` or later
- **PostgreSQL**: Local PostgreSQL or a free [Supabase](https://supabase.com) project

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/sagarmurkute/hupa.git
cd hupa

# Install dependencies
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` with your Supabase PostgreSQL connection string and a secret key:
```env
NODE_ENV=development
PORT=3001
APP_URL=http://localhost:5173

# Better Auth Secret (generate with: openssl rand -base64 32)
BETTER_AUTH_SECRET=your-32-character-secret-key
BETTER_AUTH_URL=http://localhost:5173

# Supabase PostgreSQL Database URL
DATABASE_URL=postgresql://postgres:your-db-password@localhost:5432/hupa
```

### 3. Run Database Migrations
Run the SQL migration in `supabase/migrations/20260821000000_initial_schema.sql` against your PostgreSQL database using the Supabase SQL Editor or `psql`:
```bash
psql $DATABASE_URL -f supabase/migrations/20260821000000_initial_schema.sql
```

### 4. Start Development Server
```bash
# Runs frontend (Vite :5173) and backend (Express :3001) concurrently
npm run dev
```
Open **http://localhost:5173** in your browser.

---

## 🖥️ Windows Desktop Application

HUPA provides a native Windows 10/11 desktop experience.

### Run Desktop in Development
```bash
npm run dev:desktop
```

### Package Production Installer & Executable
```bash
# Compiles React/Vite UI + Electron main/preload and builds NSIS installer
npm run package:win
```

**Packaged Outputs** in `dist-desktop/`:
- `HUPA-Setup-0.1.0.exe` — Windows NSIS Installer (with Desktop shortcut, Start Menu entry, and Uninstaller)
- `win-unpacked/HUPA.exe` — Standalone Windows Executable

---

## 🔄 Local-First Synchronization

HUPA is built on a **Local-First** model:

1. **Zero-Latency Editing**: All state mutations are applied immediately to in-memory Zustand state and committed to browser IndexedDB (`hupa_local_db`).
2. **Offline Queuing**: When offline or signed out, projects remain fully functional locally.
3. **Change Tracking & Batching**: High-frequency node movements are debounced (350ms), enqueued as structured change records (`CREATE`, `UPDATE`, `DELETE`), and dispatched atomically in batches to Supabase PostgreSQL.
4. **Tombstone Sync**: Deletions record tombstones to ensure deleted nodes and relationships synchronize cleanly when reconnecting.

---

## 📁 Repository Structure

```
hupa/
├── .github/                  # GitHub Actions CI/CD workflows and issue templates
├── docs/                     # Architectural, setup, and developer guides
├── electron/                 # Electron main process, preload bridge, and IPC handlers
├── server/                   # Express 5 backend, Better Auth server, PostgreSQL pool
│   ├── routes/               # API routes (projects, sync-changes, snapshots)
│   ├── middleware/           # Session authentication middleware
│   └── db/                   # PostgreSQL connection pool
├── src/                      # React 19 + TypeScript frontend application
│   ├── components/           # Canvas, nodes, edges, inspector, modals, layout
│   ├── store/                # Zustand stores (useGraphStore, useAuthStore, useSyncStore)
│   ├── lib/                  # IndexedDB persistence, SyncEngine, API & Auth clients
│   ├── constants/            # Templates, perspectives, node types
│   └── types/                # TypeScript interfaces (Graph, Nodes, Edges, Sync)
├── supabase/migrations/      # PostgreSQL DDL migrations
└── public/                   # Static branding SVG assets
```

---

## 📚 Documentation

Explore the complete technical guides in the [`docs/`](./docs) directory:

- [Getting Started Guide](./docs/getting-started.md)
- [System Architecture](./docs/architecture.md)
- [Local-First Persistence & Sync Engine](./docs/local-first-and-sync.md)
- [Database Schema & Authentication](./docs/database-and-auth.md)
- [Windows Desktop Application](./docs/desktop-application.md)
- [Graph Data Model & Specifications](./docs/graph-data-model.md)

---

## 🤝 Contributing

Contributions from the developer community are welcome! Please review [CONTRIBUTING.md](./CONTRIBUTING.md) and our [Code of Conduct](./CODE_OF_CONDUCT.md) before submitting pull requests.

```bash
# Type check and lint
npm run lint
npm run build
```

---

## 🛡️ Security

For security vulnerabilities and reporting procedures, please refer to [SECURITY.md](./SECURITY.md).

---

## 🗺️ Roadmap

- [x] Production graph canvas & spatial renderer
- [x] IndexedDB local-first persistence engine
- [x] Better Auth authentication & session management
- [x] Supabase PostgreSQL sync & batch change processor
- [x] Windows Desktop App & NSIS installer packaging
- [ ] Real-time collaborative multi-user editing (Supabase Realtime / WebSockets)
- [ ] Codebase AST reverse-engineering (parse Git repository into architecture graph)
- [ ] macOS (.dmg) & Linux (.AppImage / .deb) desktop distribution
- [ ] Plugin ecosystem for custom node inspectors & exporters

---

## 📄 License

HUPA is open-source software licensed under the [MIT License](./LICENSE).
