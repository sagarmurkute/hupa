import type { SyncQueueItem, SyncBatchResult } from './sync/syncTypes';
import { getApiBaseUrl } from './authClient';

export interface CloudProject {
  id: string;
  name: string;
  description: string;
  domain: string;
  type: string;
  version: string;
  rootGraphId: string;
  createdAt: number;
  updatedAt: number;
  isCloud?: boolean;
}

export interface CloudProjectBundle {
  project: CloudProject;
  graphs: Record<string, any>;
  nodes: Record<string, any>;
  edges: Record<string, any>;
  groups: Record<string, any>;
  views: any[];
  documents: Record<string, any>;
}

export const apiClient = {
  async checkHealth(): Promise<{ status: string; service: string }> {
    const base = getApiBaseUrl();
    const res = await fetch(`${base}/api/health`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error(`Health check failed: ${res.statusText}`);
    }
    return res.json();
  },

  async listProjects(): Promise<{ projects: CloudProject[] }> {
    const base = getApiBaseUrl();
    const res = await fetch(`${base}/api/projects`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error(`Failed to list projects: ${res.statusText}`);
    }
    return res.json();
  },

  async createProject(data: { name: string; description?: string; domain?: string }): Promise<{ project: CloudProject }> {
    const base = getApiBaseUrl();
    const res = await fetch(`${base}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create project: ${res.statusText}`);
    }
    return res.json();
  },

  async uploadLocalProject(bundle: CloudProjectBundle): Promise<{ success: boolean; project: { id: string; isCloud: boolean } }> {
    const base = getApiBaseUrl();
    const res = await fetch(`${base}/api/projects/upload-local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(bundle),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to upload local project: ${res.statusText}`);
    }
    return res.json();
  },

  async syncBatchChanges(projectId: string, changes: SyncQueueItem[]): Promise<SyncBatchResult> {
    const base = getApiBaseUrl();
    const payload = {
      clientId: changes[0]?.clientId,
      changes: changes.map((c) => ({
        id: c.id,
        entityType: c.entityType,
        entityId: c.entityId,
        operation: c.operation,
        payload: c.payload,
        timestamp: c.timestamp,
      })),
    };

    const res = await fetch(`${base}/api/projects/${projectId}/sync-changes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Sync failed: ${res.statusText}`);
    }

    return res.json();
  },

  async getProjectBundle(projectId: string): Promise<CloudProjectBundle> {
    const base = getApiBaseUrl();
    const res = await fetch(`${base}/api/projects/${projectId}/bundle`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error(`Failed to load project bundle: ${res.statusText}`);
    }
    return res.json();
  },

  async saveProjectSnapshot(projectId: string, bundle: Partial<CloudProjectBundle>): Promise<{ success: boolean; message: string }> {
    const base = getApiBaseUrl();
    const res = await fetch(`${base}/api/projects/${projectId}/save-snapshot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(bundle),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to save project snapshot: ${res.statusText}`);
    }
    return res.json();
  },

  async deleteProject(projectId: string): Promise<{ success: boolean }> {
    const base = getApiBaseUrl();
    const res = await fetch(`${base}/api/projects/${projectId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error(`Failed to delete project: ${res.statusText}`);
    }
    return res.json();
  },
};
