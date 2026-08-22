# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2026-08-22

### Added
- **Production Graph Studio Canvas**: Infinite spatial rendering engine supporting pan, zoom, marquee box selection, snap-to-grid, and mini-map.
- **Hierarchical Subsystem Graphs**: Support for nested child subsystem graphs inside individual nodes.
- **10 Architectural Perspectives & Views**: Complete System, Data Flow, Failure Domain, Execution Context, Security Boundary, Deployment Target, Team Ownership, Performance Critical, Cost Impact, and Lifecycle.
- **Structural Analysis & Health Engine**: Real-time cycle detection, orphan node detection, connectivity index, and depth metrics.
- **Universal Architecture Templates**: Starter templates for Blank Canvas, Fullstack Web, Microservices Ecosystem, AI Agent Swarm, and Event-Driven Pipelines.
- **Local-First Persistence Engine**: Structured 10-store client IndexedDB storage (`hupa_local_db`) with automatic migration from legacy storage.
- **Cloud Synchronization Engine**: Background worker with drag debouncing (350ms), offline mutation queue, exponential backoff retries, and tombstone synchronization.
- **Authentication**: Better Auth email/password authentication with PostgreSQL pool session storage.
- **Database Backend**: Supabase PostgreSQL schema with atomic batch change processing and ownership verification.
- **Windows Desktop Application**: Electron desktop build with native file dialogs, window state persistence, and NSIS installer packaging (`.exe`).
