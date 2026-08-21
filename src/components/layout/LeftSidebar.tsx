import React, { useState } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { BUILTIN_NODE_TYPES } from '../../constants/nodeTypes';
import { DynamicIcon } from '../common/DynamicIcon';
import { Plus } from 'lucide-react';

interface LeftSidebarProps {
  onOpenNewNode: () => void;
  onOpenCustomType: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  onOpenNewNode,
}) => {
  const {
    projects,
    activeProjectId,
    nodes,
    edges,
    groups,
    graphs,
    views,
    activeViewId,
    setActiveView,
    activeGraphId,
    selectGroup,
    customNodeTypes,
  } = useGraphStore();

  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const activeProject = projects[activeProjectId] || { id: '', name: 'HUPA Platform' };
  const currentGraph = graphs[activeGraphId] || { id: '', name: 'System Root' };
  const currentNodes = Object.values(nodes || {}).filter((n) => n && n.graphId === activeGraphId);
  const currentEdges = Object.values(edges || {}).filter((e) => e && e.graphId === activeGraphId);
  const currentGroups = Object.values(groups || {}).filter((g) => g && g.graphId === activeGraphId);

  // Filter counts
  const typeCounts: Record<string, number> = {};
  currentNodes.forEach((n) => {
    typeCounts[n.type] = (typeCounts[n.type] || 0) + 1;
  });

  // Calculate orphan count
  const orphanCount = currentNodes.filter(
    (n) => !currentEdges.some((e) => e.sourceNodeId === n.id || e.targetNodeId === n.id)
  ).length;

  const currentView = views.find((v) => v.id === activeViewId) || views[0];

  return (
    <aside className="sidebar-left">
      {/* Section 1: Project & Graph Overview */}
      <div className="sb-section">
        <div className="sb-title">
          <span>Project</span>
          <span style={{ fontWeight: 600, color: 'var(--text)', textTransform: 'none', fontSize: '12px' }}>
            {activeProject.name}
          </span>
        </div>
        <div className="nav-item active" style={{ fontSize: '12.5px' }}>
          <span>◉</span>
          <span style={{ fontWeight: 600 }}>Project Overview</span>
        </div>
        <div className="nav-item" style={{ fontSize: '12.5px' }}>
          <span>◍</span>
          <span>Graph • <strong style={{ color: 'var(--text)' }}>{currentGraph.name}</strong></span>
        </div>
      </div>

      {/* Section 2: Views / Perspectives */}
      <div className="sb-section">
        <div className="sb-title">
          <span>Views</span>
          <span style={{ fontWeight: 400, textTransform: 'none', color: 'var(--text2)', fontSize: '11px' }}>
            {currentView?.name || 'All'}
          </span>
        </div>
        <div className="view-list">
          {views.map((v) => {
            const isActive = activeViewId === v.id;
            return (
              <div
                key={v.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveView(v.id)}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? '#ffffff' : 'var(--indigo)',
                  }}
                />
                <span style={{ flex: 1 }}>{v.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Node Types Filter */}
      <div className="sb-section">
        <div className="sb-title">
          <span>Node Types</span>
          {typeFilter && (
            <button
              className="btn small ghost"
              style={{ height: '20px', padding: '0 6px', fontSize: '10.5px' }}
              onClick={() => setTypeFilter(null)}
            >
              Clear
            </button>
          )}
        </div>
        <div className="filter-list">
          {Object.entries(typeCounts).map(([typeKey, count]) => {
            const typeDef = BUILTIN_NODE_TYPES[typeKey] || customNodeTypes[typeKey] || BUILTIN_NODE_TYPES.custom;
            const isSelected = typeFilter === typeKey;
            return (
              <div
                key={typeKey}
                className={`nav-item ${isSelected ? 'active' : ''}`}
                onClick={() => setTypeFilter(isSelected ? null : typeKey)}
                style={{ fontSize: '12px', padding: '5px 8px' }}
              >
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '5px',
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--bg2)',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '11px',
                  }}
                >
                  <DynamicIcon name={typeDef.icon || 'Box'} size={11} color={isSelected ? '#ffffff' : '#4f46e5'} />
                </span>
                <span style={{ flex: 1 }}>{typeDef.label}</span>
                <span style={{ fontSize: '10.5px', opacity: 0.7, fontFamily: 'var(--mono)' }}>{count}</span>
              </div>
            );
          })}
          {Object.keys(typeCounts).length === 0 && (
            <div style={{ fontSize: '11.5px', color: 'var(--text3)', fontStyle: 'italic', padding: '4px 8px' }}>
              No nodes in this graph
            </div>
          )}
        </div>
      </div>

      {/* Section 4: Groups */}
      <div className="sb-section">
        <div className="sb-title">
          <span>Groups</span>
          <span style={{ fontSize: '10.5px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
            {currentGroups.length}
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {currentGroups.map((grp) => (
            <span
              key={grp.id}
              className="tag"
              onClick={() => selectGroup(grp.id)}
              style={{ cursor: 'pointer' }}
            >
              {grp.name}
            </span>
          ))}
          {currentGroups.length === 0 && (
            <div style={{ fontSize: '11.5px', color: 'var(--text3)', fontStyle: 'italic' }}>
              No groups defined
            </div>
          )}
        </div>
      </div>

      {/* Section 5: Graph Statistics & Diagnostics */}
      <div className="sb-section" style={{ borderBottom: 'none' }}>
        <div className="sb-title">
          <span>Graph Statistics</span>
        </div>
        <div className="stat-grid">
          <div className="stat">
            <b>{currentNodes.length}</b>
            <span>Nodes</span>
          </div>
          <div className="stat">
            <b>{currentEdges.length}</b>
            <span>Edges</span>
          </div>
          <div className="stat">
            <b>{currentGroups.length}</b>
            <span>Groups</span>
          </div>
          <div className="stat">
            <b>{Object.keys(graphs).length}</b>
            <span>Graphs</span>
          </div>
        </div>

        <div
          style={{
            marginTop: '12px',
            fontSize: '11px',
            color: 'var(--text2)',
            fontFamily: 'var(--mono)',
            padding: '8px',
            backgroundColor: 'var(--bg2)',
            borderRadius: '6px',
            border: '1px solid var(--border)',
          }}
        >
          Orphans: {orphanCount} • {currentGraph.name}
        </div>

        <button
          onClick={onOpenNewNode}
          className="btn primary small"
          style={{ width: '100%', marginTop: '12px' }}
        >
          <Plus size={12} /> Add Component Node
        </button>
      </div>
    </aside>
  );
};
