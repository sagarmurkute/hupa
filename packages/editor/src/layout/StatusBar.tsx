import React from 'react';
import { useGraphStore } from '@hupa/state';
import { useSyncStore } from '@hupa/state';
import { syncEngine } from '@hupa/sync';
import {
  Layers,
  MousePointer,
  Database,
  CheckCircle2,
  Cloud,
  RefreshCw,
  WifiOff,
  AlertCircle,
} from 'lucide-react';

export const StatusBar: React.FC = () => {
  const {
    nodes,
    edges,
    groups,
    activeGraphId,
    graphs,
    projects,
    activeProjectId,
    selectedNodeIds,
    selectedEdgeIds,
    activeViewId,
    views,
    transform,
  } = useGraphStore();

  const { status, isOnline, pendingCount, lastError } = useSyncStore();

  const activeProject = projects[activeProjectId];
  const isCloudProject = Boolean(activeProject?.isCloud);

  const currentNodes = Object.values(nodes).filter((n) => n.graphId === activeGraphId);
  const currentEdges = Object.values(edges).filter((e) => e.graphId === activeGraphId);
  const currentGroups = Object.values(groups).filter((g) => g.graphId === activeGraphId);
  const activeGraph = graphs[activeGraphId];
  const activeView = views.find((v) => v.id === activeViewId) || views[0];

  const selectionText =
    selectedNodeIds.length > 0
      ? `${selectedNodeIds.length} node${selectedNodeIds.length > 1 ? 's' : ''} selected`
      : selectedEdgeIds.length > 0
      ? `${selectedEdgeIds.length} relationship${selectedEdgeIds.length > 1 ? 's' : ''} selected`
      : 'Ready';

  // Render Sync Status Widget
  const renderSyncWidget = () => {
    if (!isOnline || status === 'offline') {
      return (
        <div
          title="Offline mode active. All edits are persisted safely to local IndexedDB and will synchronize once back online."
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: 'var(--status-warning, #d97706)',
            fontWeight: 500,
            cursor: 'pointer',
          }}
          onClick={() => syncEngine.triggerSync()}
        >
          <WifiOff size={11} />
          <span style={{ fontSize: '10px' }}>Offline (Local DB)</span>
        </div>
      );
    }

    if (status === 'syncing') {
      return (
        <div
          title="Synchronizing graph mutations with Supabase PostgreSQL..."
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: 'var(--accent-indigo, #4f46e5)',
            fontWeight: 500,
          }}
        >
          <RefreshCw size={11} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '10px' }}>
            Syncing{pendingCount > 0 ? ` (${pendingCount})` : ''}...
          </span>
        </div>
      );
    }

    if (status === 'error') {
      return (
        <div
          title={`Sync error: ${lastError || 'Retry required'}. Click to retry sync.`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#e11d48',
            fontWeight: 500,
            cursor: 'pointer',
          }}
          onClick={() => syncEngine.triggerSync()}
        >
          <AlertCircle size={11} />
          <span style={{ fontSize: '10px' }}>Sync Retry ({pendingCount})</span>
        </div>
      );
    }

    if (isCloudProject) {
      return (
        <div
          title="Cloud project synchronized to Supabase PostgreSQL & stored locally in IndexedDB."
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: 'var(--status-completed, #10b981)',
            fontWeight: 500,
            cursor: 'pointer',
          }}
          onClick={() => syncEngine.triggerSync()}
        >
          <Cloud size={11} />
          <span style={{ fontSize: '10px' }}>Cloud Synced</span>
          <CheckCircle2 size={11} />
        </div>
      );
    }

    // Default: Local-only project in IndexedDB
    return (
      <div
        title="Local-first persistence active (IndexedDB). Instant zero-latency saves."
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--accent-primary, #4f46e5)',
          fontWeight: 500,
        }}
      >
        <Database size={11} />
        <span style={{ fontSize: '10px' }}>Local IndexedDB</span>
        <CheckCircle2 size={11} color="var(--status-completed, #10b981)" />
      </div>
    );
  };

  return (
    <footer className="statusbar">
      {/* Left: Active Graph & Selection State */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isCloudProject ? 'var(--accent-indigo)' : '#0f172a',
            }}
          />
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {activeGraph?.name || 'Root Graph'}
          </span>
        </div>

        <div style={{ width: '1px', height: '12px', backgroundColor: 'var(--border-subtle)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
          <MousePointer size={11} />
          <span>{selectionText}</span>
        </div>
      </div>

      {/* Right: Metrics, Active View, Zoom, Storage/Sync Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div>
          <span>Graph: </span>
          <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{currentNodes.length}</strong> nodes,{' '}
          <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{currentEdges.length}</strong> rels,{' '}
          <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{currentGroups.length}</strong> groups
        </div>

        <div style={{ width: '1px', height: '12px', backgroundColor: 'var(--border-subtle)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Layers size={11} />
          <strong style={{ color: 'var(--text-primary)' }}>{activeView?.name}</strong>
        </div>

        <div style={{ width: '1px', height: '12px', backgroundColor: 'var(--border-subtle)' }} />

        <div>
          <span>Zoom: </span>
          <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
            {Math.round(transform.zoom * 100)}%
          </strong>
        </div>

        <div style={{ width: '1px', height: '12px', backgroundColor: 'var(--border-subtle)' }} />

        {renderSyncWidget()}
      </div>
    </footer>
  );
};
