# HUPA System Architecture

HUPA is engineered around a **Local-First, Shared-Core** architecture. The core application logic, graph state engine, and local storage layers remain completely identical between the Web and Windows Desktop applications.

---

## Architectural Principles

1. **Local-First Supremacy**: Graph rendering, panning, zooming, node manipulation, property editing, and undo/redo operations never block on network requests.
2. **Deterministic State Synchronization**: State mutations are captured as discrete, timestamped operations and batched asynchronously to the remote PostgreSQL database.
3. **Strict Separation of Privilege**: The client runtime (browser or Electron renderer) is treated as an untrusted client. Database operations are strictly authorized on the Express backend via verified Better Auth sessions.
4. **Hierarchical Graph Navigation**: Architecture graphs are multi-layered; any node can contain a complete child subsystem graph with its own isolated nodes, edges, and groups.

---

## Component Topology

```
+─────────────────────────────────────────────────────────────────────────+
|                               HUPA CLIENT                               |
|                                                                         |
|  [ React Graph Canvas ] <---> [ Zustand Graph Store (In-Memory State) ] |
|                                       │                                 |
|                      ┌────────────────┴────────────────┐                |
|                      ▼                                 ▼                |
|            [ IndexedDB Layer ]               [ Sync Engine & Queue ]    |
|         - projects   - nodes               - Change Queue (IndexedDB)   |
|         - graphs     - edges               - Debounce Worker            |
|         - groups     - documents           - Offline Detector           |
|         - views      - tombstones          - Backoff Retry Worker       |
+────────────────────────────────────────────────────────┬────────────────+
                                                         │
                                                  (Authenticated)
                                                HTTP Sync API / JSON
                                                         │
                                                         ▼
+─────────────────────────────────────────────────────────────────────────+
|                        HUPA BACKEND (Express 5)                         |
|                                                                         |
|  [ Better Auth Session Middleware ] ---> [ /api/projects Router ]       |
|                                                  │                      |
|                                                  ▼                      |
|                         [ Supabase PostgreSQL Database ]                |
|               (projects, graphs, nodes, edges, groups, documents)       |
+─────────────────────────────────────────────────────────────────────────+
```

---

## Data Flow

### 1. Local Mutation Lifecycle
1. User interacts with canvas (e.g. drags a node or updates a property).
2. `useGraphStore` updates reactive in-memory state (0ms latency, 60fps render loop).
3. Non-blocking asynchronous write commits the update to `localDb` (IndexedDB).
4. If the project is cloud-enabled (`isCloud: true`), `SyncEngine.queueChange()` logs the mutation into the `syncQueue` store.

### 2. Synchronization Lifecycle
1. The `SyncEngine` worker batches pending operations by project.
2. `POST /api/projects/:id/sync-changes` transmits the batch payload over HTTPS.
3. The Express backend verifies the user's Better Auth session and project ownership.
4. Backend executes an atomic PostgreSQL transaction applying `CREATE`, `UPDATE`, and `DELETE` operations.
5. Upon 200 OK response, the client clears the synced items from the local `syncQueue`.
