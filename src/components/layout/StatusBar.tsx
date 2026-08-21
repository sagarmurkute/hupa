import React from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { Layers, MousePointer, Database, CheckCircle2 } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const {
    nodes,
    edges,
    groups,
    activeGraphId,
    graphs,
    selectedNodeIds,
    selectedEdgeIds,
    activeViewId,
    views,
    transform,
  } = useGraphStore();

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

  return (
    <footer className="statusbar">
      {/* Left: Active Graph & Selection State */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#0f172a',
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

      {/* Right: Metrics, Active View, Zoom, Storage Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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

        <div
          title="Local persistence active (instant state auto-saving)"
          style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0f172a', fontWeight: 500 }}
        >
          <Database size={11} />
          <span style={{ fontSize: '10px' }}>Local Sync</span>
          <CheckCircle2 size={11} />
        </div>
      </div>
    </footer>
  );
};
