import React from 'react';
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

  if (!isStatsModalOpen) return null;

  const stats = analyzeGraph(nodes, edges, groups, graphs, activeGraphId);
  const currentNodes = Object.values(nodes).filter((n) => n.graphId === activeGraphId);

  const typeCounts: Record<string, number> = {};
  currentNodes.forEach((n) => {
    typeCounts[n.type] = (typeCounts[n.type] || 0) + 1;
  });

  return (
    <div className="modal-backdrop" onClick={() => setStatsModalOpen(false)}>
      <div
        className="glass-panel animate-slide-down"
        style={{
          width: '600px',
          maxHeight: '560px',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart2 size={16} color="#09090b" />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Graph Analytics & Topology Health</span>
          </div>
          <button onClick={() => setStatsModalOpen(false)} className="btn-icon" style={{ width: '24px', height: '24px' }}>
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '18px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Key Metrics 4-grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)' }}>TOTAL NODES</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#09090b' }}>{stats.totalNodes}</div>
            </div>
            <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)' }}>RELATIONSHIPS</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#18181b' }}>{stats.totalEdges}</div>
            </div>
            <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)' }}>AVG DEGREE</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#27272a' }}>{stats.avgConnectivity}</div>
            </div>
            <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#ffffff', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)' }}>NESTED GRAPHS</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#3f3f46' }}>{stats.totalGraphs}</div>
            </div>
          </div>

          {/* Architecture Health Check */}
          <div style={{ borderRadius: '8px', border: '1px solid var(--border-subtle)', padding: '14px', backgroundColor: '#ffffff' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '10px', color: 'var(--text-primary)' }}>
              Topology Diagnostics
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              {/* Circular dependencies check */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                {stats.circularDependencyCycles.length === 0 ? (
                  <CheckCircle2 size={16} color="#09090b" />
                ) : (
                  <AlertTriangle size={16} color="#71717a" />
                )}
                <div>
                  <div style={{ fontWeight: 600 }}>
                    Circular Dependencies:{' '}
                    {stats.circularDependencyCycles.length === 0 ? 'None detected (Clean DAG)' : `${stats.circularDependencyCycles.length} loops found`}
                  </div>
                  {stats.circularDependencyCycles.length > 0 && (
                    <div style={{ fontSize: '11px', color: '#71717a', marginTop: '4px' }}>
                      {stats.circularDependencyCycles.map((cycle, i) => (
                        <div key={i} style={{ fontFamily: 'var(--font-mono)' }}>
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
                  <CheckCircle2 size={16} color="#09090b" />
                ) : (
                  <CircleDot size={16} color="#71717a" />
                )}
                <div>
                  <span style={{ fontWeight: 600 }}>Isolated / Orphan Nodes: </span>
                  <span>{stats.orphanCount} node{stats.orphanCount !== 1 ? 's' : ''} without connections</span>
                </div>
              </div>

              {/* Unresolved items */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#09090b" />
                <div>
                  <span style={{ fontWeight: 600 }}>Blocked or Open Items: </span>
                  <span>{stats.unresolvedCount} items pending resolution</span>
                </div>
              </div>
            </div>
          </div>

          {/* Node Type Distribution */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)' }}>
              Node Type Distribution
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {Object.entries(typeCounts).map(([t, count]) => {
                const typeDef = BUILTIN_NODE_TYPES[t] || BUILTIN_NODE_TYPES.custom;
                return (
                  <div
                    key={t}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '12px',
                    }}
                  >
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{typeDef.label}</span>
                    <span
                      style={{
                        padding: '1px 6px',
                        borderRadius: '999px',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                    >
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 18px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button onClick={() => setStatsModalOpen(false)} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
