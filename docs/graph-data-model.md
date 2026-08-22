# Graph Data Model & Specifications

This document defines the core data model and schemas for HUPA projects, graphs, nodes, relationships, and groups.

---

## Universal Project Schema (`UPGProject`)

```typescript
interface UPGProject {
  id: string;                      // Stable UUID
  name: string;                    // Project display name
  description: string;             // Architectural overview
  domain: string;                  // e.g. "Systems & Infrastructure"
  type: string;                    // "software" | "system" | "universal"
  version: string;                 // Semantic project version
  rootGraphId: string;             // Root system graph UUID
  createdAt: number;               // Epoch timestamp
  updatedAt: number;               // Epoch timestamp
  isCloud?: boolean;               // True if synchronized with Supabase
  syncStatus?: 'synced' | 'pending' | 'error';
  lastSyncedAt?: number;
}
```

---

## Subsystem Graph Schema (`UPGGraph`)

```typescript
interface UPGGraph {
  id: string;
  projectId: string;
  parentNodeId?: string;           // Parent node if this is a nested subsystem
  parentGraphId?: string;          // Parent graph UUID
  name: string;
  description: string;
  nodeIds: string[];               // Member node UUIDs
  edgeIds: string[];               // Member relationship UUIDs
  groupIds: string[];              // Visual boundary UUIDs
  createdAt: number;
  updatedAt: number;
}
```

---

## Node Schema (`UPGNode`)

```typescript
interface UPGNode {
  id: string;
  projectId: string;
  graphId: string;
  type: string;                    // "service" | "database" | "queue" | "agent" | etc.
  name: string;
  description: string;
  status: 'active' | 'deprecated' | 'proposed' | 'maintenance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  position: { x: number; y: number };
  size: { width: number; height: number };
  childGraphId?: string;           // Links to a nested child subsystem graph
  properties: Record<string, any>; // Custom typed key-value attributes
  tags: string[];
  createdAt: number;
  updatedAt: number;
}
```

---

## Edge Schema (`UPGEdge`)

```typescript
interface UPGEdge {
  id: string;
  projectId: string;
  graphId: string;
  sourceNodeId: string;
  targetNodeId: string;
  type: string;                    // "http_rest" | "grpc" | "sql_query" | "pubsub" | etc.
  label: string;
  directionality: 'directed' | 'bidirectional' | 'undirected';
  lineStyle: 'solid' | 'dashed' | 'dotted';
  color?: string;
  animated?: boolean;
  properties: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}
```
