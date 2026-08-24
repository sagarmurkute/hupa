import { localDb } from '@hupa/storage';
import { apiClient } from './apiClient';
import { useSyncStore, useAuthStore } from '@hupa/state';
import type { SyncQueueItem, SyncEntityType, SyncOperation } from './syncTypes';

export class SyncEngine {
  private isProcessing = false;
  private debounceMap: Map<string, number> = new Map();
  private initialized = false;

  public init() {
    if (this.initialized) return;
    this.initialized = true;

    // Listen to network state
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        useSyncStore.getState().setIsOnline(true);
        this.triggerSync();
      });
      window.addEventListener('offline', () => {
        useSyncStore.getState().setIsOnline(false);
      });
    }

    // Initial check for pending items
    this.updatePendingCount();

    // Auto-sync interval every 15s if online
    if (typeof window !== 'undefined') {
      setInterval(() => {
        if (navigator.onLine && !this.isProcessing) {
          this.triggerSync();
        }
      }, 15000);
    }
  }

  // Enqueue a mutation with debouncing per entity
  public queueChange(
    projectId: string,
    entityType: SyncEntityType,
    entityId: string,
    operation: SyncOperation,
    payload?: any,
    debounceMs = 350
  ) {
    const key = `${entityType}:${entityId}`;
    const existing = this.debounceMap.get(key);
    if (existing) {
      clearTimeout(existing);
    }

    const timer = window.setTimeout(async () => {
      this.debounceMap.delete(key);
      await this.doQueueChange(projectId, entityType, entityId, operation, payload);
    }, debounceMs);

    this.debounceMap.set(key, timer);
  }

  // Immediate queue without debounce
  public async queueChangeImmediate(
    projectId: string,
    entityType: SyncEntityType,
    entityId: string,
    operation: SyncOperation,
    payload?: any
  ) {
    const key = `${entityType}:${entityId}`;
    const existing = this.debounceMap.get(key);
    if (existing) {
      clearTimeout(existing);
      this.debounceMap.delete(key);
    }
    await this.doQueueChange(projectId, entityType, entityId, operation, payload);
  }

  private async updatePendingCount(): Promise<number> {
    try {
      const pending = await localDb.getPendingChanges();
      useSyncStore.getState().setPendingCount(pending.length);
      return pending.length;
    } catch {
      return 0;
    }
  }

  private async doQueueChange(
    projectId: string,
    entityType: SyncEntityType,
    entityId: string,
    operation: SyncOperation,
    payload?: any
  ): Promise<void> {
    const id = `change-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const item: Omit<SyncQueueItem, 'clientId'> = {
      id,
      projectId,
      entityType,
      entityId,
      operation,
      payload,
      timestamp: Date.now(),
      syncStatus: 'pending',
      retryCount: 0,
    };

    if (operation === 'DELETE') {
      await localDb.addTombstone(projectId, entityType, entityId);
    }

    await localDb.enqueueChange(item);
    await this.updatePendingCount();

    // If online, trigger sync
    if (navigator.onLine) {
      this.triggerSync();
    }
  }

  public triggerSync() {
    if (this.isProcessing) return;
    this.processQueue();
  }

  // Process the queue
  public async processQueue(): Promise<void> {
    if (this.isProcessing || (typeof navigator !== 'undefined' && !navigator.onLine)) {
      return;
    }

    const authUser = useAuthStore.getState().user;
    if (!authUser) {
      // User is in offline / guest local mode
      const pending = await localDb.getPendingChanges();
      useSyncStore.getState().setPendingCount(pending.length);
      useSyncStore.getState().setStatus('synced');
      return;
    }

    this.isProcessing = true;
    useSyncStore.getState().setStatus('syncing');

    try {
      const pendingChanges = await localDb.getPendingChanges();
      if (pendingChanges.length === 0) {
        useSyncStore.getState().setPendingCount(0);
        useSyncStore.getState().setStatus('synced');
        this.isProcessing = false;
        return;
      }

      // Group changes by projectId
      const projectGroups = new Map<string, SyncQueueItem[]>();
      for (const item of pendingChanges) {
        const list = projectGroups.get(item.projectId) || [];
        list.push(item);
        projectGroups.set(item.projectId, list);
      }

      for (const [projectId, changes] of projectGroups.entries()) {
        // Verify if project is a cloud project in local DB
        const project = await localDb.get<any>('projects', projectId);
        if (!project || !project.isCloud) {
          // Skip local-only projects from cloud syncing until promoted
          continue;
        }

        const changeIds = changes.map((c) => c.id);
        await localDb.updateQueueItemsStatus(changeIds, 'syncing');

        try {
          const res = await apiClient.syncBatchChanges(projectId, changes);
          if (res.success) {
            await localDb.removeQueueItems(res.syncedIds);
            useSyncStore.getState().setLastSyncedAt(res.serverTimestamp || Date.now());
          }
        } catch (err: any) {
          console.warn(`Sync batch failed for project ${projectId}:`, err);
          await localDb.updateQueueItemsStatus(changeIds, 'failed', err.message || 'Sync failed');
          useSyncStore.getState().setLastError(err.message || 'Synchronization failed');
        }
      }

      const remaining = await this.updatePendingCount();
      if (remaining === 0) {
        useSyncStore.getState().setStatus('synced');
      } else {
        useSyncStore.getState().setStatus('error');
      }
    } catch (err: any) {
      console.error('Fatal sync processor error:', err);
      useSyncStore.getState().setLastError(err.message || 'Unexpected sync error');
    } finally {
      this.isProcessing = false;
    }
  }

  // Promote a local project to a Cloud Project
  public async uploadLocalProjectToCloud(projectId: string): Promise<{ success: boolean; message: string }> {
    const user = useAuthStore.getState().user;
    if (!user) {
      throw new Error('Please sign in before uploading project to cloud.');
    }

    useSyncStore.getState().setStatus('syncing');

    try {
      const project = await localDb.get<any>('projects', projectId);
      if (!project) throw new Error('Project not found in local storage.');

      const [graphs, nodes, edges, groups, views, documents] = await Promise.all([
        localDb.getByIndex<any>('graphs', 'projectId', projectId),
        localDb.getByIndex<any>('nodes', 'projectId', projectId),
        localDb.getByIndex<any>('edges', 'projectId', projectId),
        localDb.getByIndex<any>('groups', 'projectId', projectId),
        localDb.getByIndex<any>('views', 'projectId', projectId),
        localDb.getByIndex<any>('documents', 'projectId', projectId),
      ]);

      const graphsMap: Record<string, any> = {};
      graphs.forEach((g: any) => (graphsMap[g.id] = g));

      const nodesMap: Record<string, any> = {};
      nodes.forEach((n: any) => (nodesMap[n.id] = n));

      const edgesMap: Record<string, any> = {};
      edges.forEach((e: any) => (edgesMap[e.id] = e));

      const groupsMap: Record<string, any> = {};
      groups.forEach((gr: any) => (groupsMap[gr.id] = gr));

      const docsMap: Record<string, any> = {};
      documents.forEach((d: any) => (docsMap[d.id] = d));

      const bundle = {
        project: { ...project, isCloud: true },
        graphs: graphsMap,
        nodes: nodesMap,
        edges: edgesMap,
        groups: groupsMap,
        views,
        documents: docsMap,
      };

      const res = await apiClient.uploadLocalProject(bundle);
      if (res.success) {
        // Mark project as cloud in local IndexedDB
        const updatedProject = {
          ...project,
          isCloud: true,
          syncStatus: 'synced',
          lastSyncedAt: Date.now(),
        };
        await localDb.put('projects', updatedProject);
        useSyncStore.getState().setStatus('synced');
        useSyncStore.getState().setLastSyncedAt(Date.now());
        return { success: true, message: 'Project successfully synchronized to Supabase PostgreSQL.' };
      }

      throw new Error('Upload failed.');
    } catch (err: any) {
      useSyncStore.getState().setLastError(err.message || 'Failed to upload project.');
      throw err;
    }
  }

  // Fetch Cloud Projects List
  public async fetchCloudProjects(): Promise<any[]> {
    try {
      useSyncStore.getState().setIsLoadingCloudProjects(true);
      const res = await apiClient.listProjects();
      useSyncStore.getState().setCloudProjectsList(res.projects || []);
      return res.projects || [];
    } catch (err: any) {
      console.warn('Failed to fetch cloud projects list:', err);
      return [];
    } finally {
      useSyncStore.getState().setIsLoadingCloudProjects(false);
    }
  }

  // Download a remote cloud project into local IndexedDB
  public async downloadCloudProject(cloudProjectId: string): Promise<any> {
    useSyncStore.getState().setStatus('syncing');
    try {
      const bundle = await apiClient.getProjectBundle(cloudProjectId);
      if (!bundle || !bundle.project) {
        throw new Error('Invalid project bundle received from server.');
      }

      const project = {
        ...bundle.project,
        isCloud: true,
        syncStatus: 'synced',
        lastSyncedAt: Date.now(),
      };

      // Save into local IndexedDB
      await localDb.put('projects', project);

      const graphItems = Object.values(bundle.graphs || {});
      const nodeItems = Object.values(bundle.nodes || {});
      const edgeItems = Object.values(bundle.edges || {});
      const groupItems = Object.values(bundle.groups || {});
      const docItems = Object.values(bundle.documents || {});
      const viewItems = bundle.views || [];

      await Promise.all([
        localDb.putMany('graphs', graphItems),
        localDb.putMany('nodes', nodeItems),
        localDb.putMany('edges', edgeItems),
        localDb.putMany('groups', groupItems),
        localDb.putMany('documents', docItems),
        localDb.putMany('views', viewItems),
      ]);

      useSyncStore.getState().setStatus('synced');
      useSyncStore.getState().setLastSyncedAt(Date.now());

      return bundle;
    } catch (err: any) {
      useSyncStore.getState().setLastError(err.message || 'Failed to download cloud project.');
      throw err;
    }
  }
}

export const syncEngine = new SyncEngine();
