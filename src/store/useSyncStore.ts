import { create } from 'zustand';
import type { SyncConnectionState } from '../lib/sync/syncTypes';

interface SyncState {
  status: SyncConnectionState;
  isOnline: boolean;
  pendingCount: number;
  lastSyncedAt: number | null;
  lastError: string | null;
  cloudProjectsList: any[];
  isLoadingCloudProjects: boolean;

  setStatus: (status: SyncConnectionState) => void;
  setIsOnline: (online: boolean) => void;
  setPendingCount: (count: number) => void;
  setLastSyncedAt: (timestamp: number) => void;
  setLastError: (error: string | null) => void;
  setCloudProjectsList: (projects: any[]) => void;
  setIsLoadingCloudProjects: (loading: boolean) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  status: typeof navigator !== 'undefined' && !navigator.onLine ? 'offline' : 'synced',
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  pendingCount: 0,
  lastSyncedAt: null,
  lastError: null,
  cloudProjectsList: [],
  isLoadingCloudProjects: false,

  setStatus: (status) => set({ status }),
  setIsOnline: (isOnline) => set({ isOnline, status: isOnline ? 'online' : 'offline' }),
  setPendingCount: (pendingCount) => set({ pendingCount }),
  setLastSyncedAt: (lastSyncedAt) => set({ lastSyncedAt, lastError: null }),
  setLastError: (lastError) => set({ lastError, status: 'error' }),
  setCloudProjectsList: (cloudProjectsList) => set({ cloudProjectsList }),
  setIsLoadingCloudProjects: (isLoadingCloudProjects) => set({ isLoadingCloudProjects }),
}));
