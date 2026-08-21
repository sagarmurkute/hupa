import React, { useEffect } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { analyzeGraph } from '../../utils/analysis';
import { BarChart2, X, AlertTriangle, CheckCircle2, CircleDot } from 'lucide-react';
import { BUILTIN_NODE_TYPES } from '../../constants/nodeTypes';

export const StatsModal: React.FC = () => {
  const {
    isStatsModalOpen,
    setStatsModalOpen,
    nodes,
    edges,
    groups,
    graphs,
    activeGraphId,
  } = useGraphStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setStatsModalOpen(false);
      }
    };
    if (isStatsModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStatsModalOpen, setStatsModalOpen]);

  if (!isStatsModalOpen) return null;

  const stats = analyzeGraph(nodes, edges, groups, graphs, activeGraphId);
  const currentNodes = Object.values(nodes).filter((n) => n.graphId === activeGraphId);

  const typeCounts: Record<string, number> = {};
  currentNodes.forEach((n) => {
    typeCounts[n.type] = (typeCounts[n.type] || 0) + 1;
  });

  return (
    <div className="modal-overlay" onClick={() => setStatsModalOpen(false)}>
      <div
        className="modal-dialog"
        style={{
          width: '580px',
          maxHeight: '560px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={15} color="var(--text-primary)" />
            <span style={{ fontSize: '12.5px', fontWeight: 600 }}>Graph Topology & Analytics</span>
          </div>
          <button
            onClick={() => setStatsModalOpen(false)}
            className="hupa-btn ghost icon-only"
            style={{ width: '22px', height: '22px' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Key Metrics 4-grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '9.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>TOTAL NODES</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{stats.totalNodes}</div>
            </div>
            <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '9.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>RELATIONSHIPS</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{stats.totalEdges}</div>
            </div>
            <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '9.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>AVG DEGREE</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{stats.avgConnectivity}</div>
            </div>
            <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'var(--surface-subtle)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '9.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>NESTED GRAPHS</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{stats.totalGraphs}</div>
            </div>
          </div>

          {/* Architecture Health Check */}
          <div style={{ borderRadius: '6px', border: '1px solid var(--border-subtle)', padding: '12px', backgroundColor: '#ffffff' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', color: 'var(--text-muted)' }}>
              Topology Diagnostics
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11.5px' }}>
              {/* Circular dependencies check */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                {stats.circularDependencyCycles.length === 0 ? (
                  <CheckCircle2 size={14} color="#059669" />
                ) : (
                  <AlertTriangle size={14} color="#d97706" />
                )}
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    Circular Dependencies:{' '}
                    {stats.circularDependencyCycles.length === 0 ? 'None detected (Clean DAG)' : `${stats.circularDependencyCycles.length} loops found`}
                  </div>
                  {stats.circularDependencyCycles.length > 0 && (
                    <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                      {stats.circularDependencyCycles.map((cycle, i) => (
                        <div key={i}>
                          {cycle.map((id) => nodes[id]?.name || id).join(' → ')}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Orphan nodes check */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {stats.orphanCount === 0 ? (
                  <CheckCircle2 size={14} color="#059669" />
                ) : (
                  <CircleDot size={14} color="#94a3b8" />
                )}
                <div style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Isolated / Orphan Nodes: </span>
                  <span>{stats.orphanCount} node{stats.orphanCount !== 1 ? 's' : ''} without connections</span>
                </div>
              </div>

              {/* Unresolved items */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={14} color="#059669" />
                <div style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Blocked or Open Items: </span>
                  <span>{stats.unresolvedCount} items pending resolution</span>
                </div>
              </div>
            </div>
          </div>

          {/* Node Type Distribution */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', color: 'var(--text-muted)' }}>
              Component Distribution
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {Object.entries(typeCounts).map(([typeKey, count]) => {
                const typeDef = BUILTIN_NODE_TYPES[typeKey] || BUILTIN_NODE_TYPES.custom;
                const percentage = Math.round((count / (currentNodes.length || 1)) * 100);
                return (
                  <div
                    key={typeKey}
                    style={{
                      padding: '6px 8px',
                      backgroundColor: 'var(--surface-subtle)',
                      borderRadius: '5px',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '11.5px',
                    }}
                  >
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{typeDef.label}</span>
                    <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {count} ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', backgroundColor: 'var(--surface-subtle)' }}>
          <button onClick={() => setStatsModalOpen(false)} className="hupa-btn primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
