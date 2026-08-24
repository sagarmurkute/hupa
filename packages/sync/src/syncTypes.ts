export type SyncOperation = 'CREATE' | 'UPDATE' | 'DELETE';

export type SyncEntityType =
  | 'project'
  | 'graph'
  | 'node'
  | 'edge'
  | 'group'
  | 'document'
  | 'view';

export type SyncItemStatus = 'pending' | 'syncing' | 'synced' | 'failed';

export type SyncConnectionState =
  | 'online'
  | 'offline'
  | 'syncing'
  | 'synced'
  | 'error';

export interface SyncQueueItem {
  id: string;
  projectId: string;
  entityType: SyncEntityType;
  entityId: string;
  operation: SyncOperation;
  payload?: any;
  timestamp: number;
  clientId: string;
  syncStatus: SyncItemStatus;
  retryCount: number;
  error?: string;
}

export interface Tombstone {
  id: string; // `${entityType}-${entityId}`
  projectId: string;
  entityType: SyncEntityType;
  entityId: string;
  deletedAt: number;
  synced: boolean;
}

export interface SyncBatchPayload {
  projectId: string;
  clientId: string;
  changes: {
    id: string;
    entityType: SyncEntityType;
    entityId: string;
    operation: SyncOperation;
    payload?: any;
    timestamp: number;
  }[];
}

export interface SyncBatchResult {
  success: boolean;
  syncedIds: string[];
  failedIds?: { id: string; error: string }[];
  serverTimestamp: number;
}
