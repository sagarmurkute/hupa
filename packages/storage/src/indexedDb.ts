import type {
  UPGProject,
  UPGGraph,
  UPGNode,
  UPGEdge,
  UPGGroup,
  UPGDocument,
  UPGView,
  CanvasTransform,
  NodeTypeDefinition,
  RelationshipTypeDefinition,
} from '@hupa/core';
import type { SyncQueueItem, Tombstone } from '@hupa/sync';

const DB_NAME = 'hupa_local_db';
const DB_VERSION = 1;

export interface WorkspaceMetadata {
  key: string;
  value: any;
}

export class HupaIndexedDB {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private clientId: string | null = null;

  public async getDb(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not supported in this environment.'));
        return;
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 1. Projects store
        if (!db.objectStoreNames.contains('projects')) {
          const projStore = db.createObjectStore('projects', { keyPath: 'id' });
          projStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        // 2. Graphs store
        if (!db.objectStoreNames.contains('graphs')) {
          const graphStore = db.createObjectStore('graphs', { keyPath: 'id' });
          graphStore.createIndex('projectId', 'projectId', { unique: false });
        }

        // 3. Nodes store
        if (!db.objectStoreNames.contains('nodes')) {
          const nodeStore = db.createObjectStore('nodes', { keyPath: 'id' });
          nodeStore.createIndex('projectId', 'projectId', { unique: false });
          nodeStore.createIndex('graphId', 'graphId', { unique: false });
        }

        // 4. Edges store
        if (!db.objectStoreNames.contains('edges')) {
          const edgeStore = db.createObjectStore('edges', { keyPath: 'id' });
          edgeStore.createIndex('projectId', 'projectId', { unique: false });
          edgeStore.createIndex('graphId', 'graphId', { unique: false });
        }

        // 5. Groups store
        if (!db.objectStoreNames.contains('groups')) {
          const groupStore = db.createObjectStore('groups', { keyPath: 'id' });
          groupStore.createIndex('projectId', 'projectId', { unique: false });
          groupStore.createIndex('graphId', 'graphId', { unique: false });
        }

        // 6. Documents store
        if (!db.objectStoreNames.contains('documents')) {
          const docStore = db.createObjectStore('documents', { keyPath: 'id' });
          docStore.createIndex('projectId', 'projectId', { unique: false });
        }

        // 7. Views store
        if (!db.objectStoreNames.contains('views')) {
          const viewStore = db.createObjectStore('views', { keyPath: 'id' });
          viewStore.createIndex('projectId', 'projectId', { unique: false });
        }

        // 8. Metadata store
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }

        // 9. Sync Queue store
        if (!db.objectStoreNames.contains('syncQueue')) {
          const queueStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          queueStore.createIndex('projectId', 'projectId', { unique: false });
          queueStore.createIndex('syncStatus', 'syncStatus', { unique: false });
          queueStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // 10. Tombstones store
        if (!db.objectStoreNames.contains('tombstones')) {
          const tombStore = db.createObjectStore('tombstones', { keyPath: 'id' });
          tombStore.createIndex('projectId', 'projectId', { unique: false });
          tombStore.createIndex('deletedAt', 'deletedAt', { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  public getClientId(): string {
    if (this.clientId) return this.clientId;
    let stored = typeof localStorage !== 'undefined' ? localStorage.getItem('hupa_client_id') : null;
    if (!stored) {
      stored = `client-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('hupa_client_id', stored);
      }
    }
    this.clientId = stored;
    return stored;
  }

  // Generic Transaction Helpers
  public async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  public async getByIndex<T>(storeName: string, indexName: string, value: any): Promise<T[]> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const idx = store.index(indexName);
      const req = idx.getAll(value);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  public async get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  public async put<T>(storeName: string, item: T): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(item);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async putMany<T>(storeName: string, items: T[]): Promise<void> {
    if (items.length === 0) return;
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      items.forEach((item) => store.put(item));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  public async delete(storeName: string, key: IDBValidKey): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async deleteMany(storeName: string, keys: IDBValidKey[]): Promise<void> {
    if (keys.length === 0) return;
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      keys.forEach((key) => store.delete(key));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  public async clear(storeName: string): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // High-Level Workspace Snapshot Persistence
  public async loadCompleteWorkspace(): Promise<{
    projects: Record<string, UPGProject>;
    activeProjectId: string | null;
    graphs: Record<string, UPGGraph>;
    activeGraphId: string | null;
    nodes: Record<string, UPGNode>;
    edges: Record<string, UPGEdge>;
    groups: Record<string, UPGGroup>;
    documents: Record<string, UPGDocument>;
    views: UPGView[];
    customNodeTypes: Record<string, NodeTypeDefinition>;
    customRelationshipTypes: Record<string, RelationshipTypeDefinition>;
    breadcrumbs: { graphId: string; name: string; nodeId?: string }[];
    transform: CanvasTransform | null;
  }> {
    const [
      projectsList,
      graphsList,
      nodesList,
      edgesList,
      groupsList,
      documentsList,
      viewsList,
      metaList,
    ] = await Promise.all([
      this.getAll<UPGProject>('projects'),
      this.getAll<UPGGraph>('graphs'),
      this.getAll<UPGNode>('nodes'),
      this.getAll<UPGEdge>('edges'),
      this.getAll<UPGGroup>('groups'),
      this.getAll<UPGDocument>('documents'),
      this.getAll<UPGView>('views'),
      this.getAll<WorkspaceMetadata>('metadata'),
    ]);

    const projects: Record<string, UPGProject> = {};
    projectsList.forEach((p) => (projects[p.id] = p));

    const graphs: Record<string, UPGGraph> = {};
    graphsList.forEach((g) => (graphs[g.id] = g));

    const nodes: Record<string, UPGNode> = {};
    nodesList.forEach((n) => (nodes[n.id] = n));

    const edges: Record<string, UPGEdge> = {};
    edgesList.forEach((e) => (edges[e.id] = e));

    const groups: Record<string, UPGGroup> = {};
    groupsList.forEach((gr) => (groups[gr.id] = gr));

    const documents: Record<string, UPGDocument> = {};
    documentsList.forEach((d) => (documents[d.id] = d));

    const metaMap: Record<string, any> = {};
    metaList.forEach((m) => (metaMap[m.key] = m.value));

    return {
      projects,
      activeProjectId: metaMap['activeProjectId'] || null,
      graphs,
      activeGraphId: metaMap['activeGraphId'] || null,
      nodes,
      edges,
      groups,
      documents,
      views: viewsList,
      customNodeTypes: metaMap['customNodeTypes'] || {},
      customRelationshipTypes: metaMap['customRelationshipTypes'] || {},
      breadcrumbs: metaMap['breadcrumbs'] || [],
      transform: metaMap['transform'] || null,
    };
  }

  public async saveCompleteWorkspace(data: {
    projects: Record<string, UPGProject>;
    activeProjectId: string;
    graphs: Record<string, UPGGraph>;
    activeGraphId: string;
    nodes: Record<string, UPGNode>;
    edges: Record<string, UPGEdge>;
    groups: Record<string, UPGGroup>;
    documents: Record<string, UPGDocument>;
    views: UPGView[];
    customNodeTypes: Record<string, NodeTypeDefinition>;
    customRelationshipTypes: Record<string, RelationshipTypeDefinition>;
    breadcrumbs: { graphId: string; name: string; nodeId?: string }[];
    transform?: CanvasTransform;
  }): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(
        ['projects', 'graphs', 'nodes', 'edges', 'groups', 'documents', 'views', 'metadata'],
        'readwrite'
      );

      // Save Projects
      const projStore = tx.objectStore('projects');
      projStore.clear();
      Object.values(data.projects).forEach((p) => projStore.put(p));

      // Save Graphs
      const graphStore = tx.objectStore('graphs');
      graphStore.clear();
      Object.values(data.graphs).forEach((g) => graphStore.put(g));

      // Save Nodes
      const nodeStore = tx.objectStore('nodes');
      nodeStore.clear();
      Object.values(data.nodes).forEach((n) => nodeStore.put(n));

      // Save Edges
      const edgeStore = tx.objectStore('edges');
      edgeStore.clear();
      Object.values(data.edges).forEach((e) => edgeStore.put(e));

      // Save Groups
      const groupStore = tx.objectStore('groups');
      groupStore.clear();
      Object.values(data.groups).forEach((gr) => groupStore.put(gr));

      // Save Documents
      const docStore = tx.objectStore('documents');
      docStore.clear();
      Object.values(data.documents).forEach((d) => docStore.put(d));

      // Save Views
      const viewStore = tx.objectStore('views');
      viewStore.clear();
      data.views.forEach((v) => viewStore.put(v));

      // Save Metadata
      const metaStore = tx.objectStore('metadata');
      metaStore.put({ key: 'activeProjectId', value: data.activeProjectId });
      metaStore.put({ key: 'activeGraphId', value: data.activeGraphId });
      metaStore.put({ key: 'customNodeTypes', value: data.customNodeTypes });
      metaStore.put({ key: 'customRelationshipTypes', value: data.customRelationshipTypes });
      metaStore.put({ key: 'breadcrumbs', value: data.breadcrumbs });
      if (data.transform) {
        metaStore.put({ key: 'transform', value: data.transform });
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // Sync Queue Methods
  public async enqueueChange(item: Omit<SyncQueueItem, 'clientId'>): Promise<void> {
    const queueItem: SyncQueueItem = {
      ...item,
      clientId: this.getClientId(),
    };
    await this.put('syncQueue', queueItem);
  }

  public async getPendingChanges(projectId?: string): Promise<SyncQueueItem[]> {
    const all = await this.getAll<SyncQueueItem>('syncQueue');
    const filtered = all.filter((item) => {
      const isPending = item.syncStatus === 'pending' || item.syncStatus === 'failed';
      return projectId ? item.projectId === projectId && isPending : isPending;
    });
    return filtered.sort((a, b) => a.timestamp - b.timestamp);
  }

  public async updateQueueItemsStatus(ids: string[], status: SyncQueueItem['syncStatus'], error?: string): Promise<void> {
    if (ids.length === 0) return;
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('syncQueue', 'readwrite');
      const store = tx.objectStore('syncQueue');
      ids.forEach((id) => {
        const getReq = store.get(id);
        getReq.onsuccess = () => {
          if (getReq.result) {
            const updated = {
              ...getReq.result,
              syncStatus: status,
              retryCount: status === 'failed' ? (getReq.result.retryCount || 0) + 1 : getReq.result.retryCount,
              error: error || getReq.result.error,
            };
            store.put(updated);
          }
        };
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  public async removeQueueItems(ids: string[]): Promise<void> {
    return this.deleteMany('syncQueue', ids);
  }

  // Tombstones Methods
  public async addTombstone(projectId: string, entityType: Tombstone['entityType'], entityId: string): Promise<void> {
    const tombstone: Tombstone = {
      id: `${entityType}-${entityId}`,
      projectId,
      entityType,
      entityId,
      deletedAt: Date.now(),
      synced: false,
    };
    await this.put('tombstones', tombstone);
  }

  public async getTombstones(projectId: string): Promise<Tombstone[]> {
    const all = await this.getAll<Tombstone>('tombstones');
    return all.filter((t) => t.projectId === projectId && !t.synced);
  }

  public async markTombstonesSynced(ids: string[]): Promise<void> {
    return this.deleteMany('tombstones', ids);
  }

  // Migration from localStorage
  public async checkAndMigrateLocalStorage(): Promise<boolean> {
    if (typeof localStorage === 'undefined') return false;

    const saved = localStorage.getItem('hupa_workspace_state_v1') || localStorage.getItem('upg_workspace_state_v1');
    if (!saved) return false;

    try {
      // Check if DB already has projects
      const existingProjects = await this.getAll<UPGProject>('projects');
      if (existingProjects.length > 0) {
        return false; // Already has data, no migration needed
      }

      const parsed = JSON.parse(saved);
      if (parsed.projects && parsed.activeProjectId && parsed.graphs) {
        await this.saveCompleteWorkspace({
          projects: parsed.projects,
          activeProjectId: parsed.activeProjectId,
          graphs: parsed.graphs,
          activeGraphId: parsed.activeGraphId || parsed.projects[parsed.activeProjectId]?.rootGraphId,
          nodes: parsed.nodes || {},
          edges: parsed.edges || {},
          groups: parsed.groups || {},
          documents: parsed.documents || {},
          views: parsed.views || [],
          customNodeTypes: parsed.customNodeTypes || {},
          customRelationshipTypes: parsed.customRelationshipTypes || {},
          breadcrumbs: parsed.breadcrumbs || [],
        });
        console.log('Successfully migrated HUPA workspace from localStorage into IndexedDB.');
        return true;
      }
    } catch (err) {
      console.warn('Failed to migrate localStorage to IndexedDB:', err);
    }
    return false;
  }
}

export const localDb = new HupaIndexedDB();
