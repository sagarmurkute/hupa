# Local-First Persistence & Synchronization Engine

HUPA delivers an offline-capable, local-first user experience backed by client-side IndexedDB and server-side Supabase PostgreSQL.

---

## Local Database (IndexedDB)

The client local persistence layer is managed by `HupaIndexedDB` (`src/lib/db/indexedDb.ts`).

### Object Stores

| Store Name | Primary Key | Description |
|---|---|---|
| `projects` | `id` (UUID) | Project metadata, domain, root graph ID, cloud flags |
| `graphs` | `id` (UUID) | Subsystem graphs, parent graph IDs, member node IDs |
| `nodes` | `id` (UUID) | Nodes with spatial coordinates, sizes, types, and properties |
| `edges` | `id` (UUID) | Connections, directionality, labels, and line styles |
| `groups` | `id` (UUID) | Visual bounding boxes, categories, and nested nodes |
| `documents` | `id` (UUID) | Architecture docs, linked nodes, and Markdown content |
| `views` | `id` (UUID) | Filter presets and architectural perspectives |
| `metadata` | `key` | Active project/graph IDs, breadcrumbs, viewport transform |
| `syncQueue` | `id` (UUID) | Pending offline/online mutation records |
| `tombstones` | `id` (UUID) | Deletion markers for remote synchronization |

---

## Change Tracking & Queue Model

Every entity mutation generates a `SyncQueueItem`:

```typescript
interface SyncQueueItem {
  id: string;
  projectId: string;
  entityType: 'project' | 'graph' | 'node' | 'edge' | 'group' | 'document' | 'view';
  entityId: string;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  payload: any;
  timestamp: number;
  clientId: string;
  syncStatus: 'pending' | 'syncing' | 'synced' | 'error';
  retryCount: number;
  error?: string;
}
```

---

## Debouncing High-Frequency Events

Canvas operations such as dragging nodes or resizing generate dozens of coordinate updates per second.

1. High-frequency operations pass a `debounceMs: 350` to `syncEngine.queueChange()`.
2. Intermediate movements update the in-memory canvas state immediately.
3. The mutation queue only captures the settled position once dragging ceases, minimizing network payload.

---

## Conflict Resolution & Tombstones

- **Last-Write-Wins (LWW)**: Timestamps (`updatedAt`) govern property updates on the backend.
- **Tombstones**: Deleting an entity creates a tombstone in IndexedDB. When the client syncs with the server, the backend deletes the corresponding row in PostgreSQL and deletes child relations via `CASCADE`.
- **Local Data Preservation**: Remote errors never wipe out local work. If a network sync fails, items remain in the `syncQueue` and retry exponentially.
