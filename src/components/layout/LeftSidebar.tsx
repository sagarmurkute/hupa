import React, { useState } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { BUILTIN_NODE_TYPES } from '../../constants/nodeTypes';
import { DynamicIcon } from '../common/DynamicIcon';
import {
  Layers,
  Box,
  Folder,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';

interface LeftSidebarProps {
  onOpenNewNode: () => void;
  onOpenCustomType: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  onOpenNewNode,
}) => {
  const {
    nodes,
    groups,
    views,
    activeViewId,
    setActiveView,
    activeGraphId,
    selectGroup,
    selectNode,
    setTransform,
    isSidebarOpen,
    setSidebarOpen,
    customNodeTypes,
  } = useGraphStore();

  const [activeTab, setActiveTab] = useState<'views' | 'nodes' | 'groups'>('views');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const currentNodes = Object.values(nodes || {}).filter((n) => n && n.graphId === activeGraphId);
  const currentGroups = Object.values(groups || {}).filter((g) => g && g.graphId === activeGraphId);

  const typeCounts: Record<string, number> = {};
  currentNodes.forEach((n) => {
    typeCounts[n.type] = (typeCounts[n.type] || 0) + 1;
  });

  const handleFocusNode = (nodeId: string) => {
    selectNode(nodeId);
    const targetNode = nodes[nodeId];
    if (targetNode) {
      setTransform((prev) => ({
        x: window.innerWidth / 2 - (targetNode.position.x + (targetNode.size?.width || 240) / 2) * prev.zoom,
        y: window.innerHeight / 2 - (targetNode.position.y + (targetNode.size?.height || 76) / 2) * prev.zoom,
        zoom: Math.max(0.85, prev.zoom),
      }));
    }
  };

  return (
    <aside
      className="drawer-panel left-drawer"
      style={{
        width: isSidebarOpen ? 'var(--sidebar-width)' : '42px',
      }}
    >
      {/* Header / Drawer Toggle */}
      <div className="drawer-header">
        {isSidebarOpen ? (
          <span>Project Hierarchy</span>
        ) : (
          <span style={{ fontSize: '10px' }}>NAV</span>
        )}

        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="hupa-btn ghost icon-only"
          style={{ width: '22px', height: '22px' }}
          title={isSidebarOpen ? 'Collapse Navigation (⌘B)' : 'Expand Navigation'}
        >
          {isSidebarOpen ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
        </button>
      </div>

      {isSidebarOpen && (
        <>
          {/* Segmented Tab Navigation */}
          <div
            style={{
              display: 'flex',
              padding: '5px 8px',
              gap: '2px',
              borderBottom: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--surface-subtle)',
            }}
          >
            {[
              { id: 'views', label: 'Views', icon: Layers },
              { id: 'nodes', label: `Nodes (${currentNodes.length})`, icon: Box },
              { id: 'groups', label: `Groups (${currentGroups.length})`, icon: Folder },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    flex: 1,
                    padding: '3px 6px',
                    fontSize: '11px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? '#ffffff' : 'transparent',
                    border: isActive ? '1px solid var(--border-subtle)' : '1px solid transparent',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Icon size={11} /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* Drawer Body Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
            {/* TAB 1: PERSPECTIVE VIEWS */}
            {activeTab === 'views' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {views.map((v) => {
                  const isActive = activeViewId === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setActiveView(v.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '5px 8px',
                        borderRadius: '4px',
                        fontSize: '11.5px',
                        cursor: 'pointer',
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        backgroundColor: isActive ? 'var(--surface-subtle)' : 'transparent',
                        fontWeight: isActive ? 600 : 400,
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'var(--surface-subtle)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <span
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          backgroundColor: isActive ? '#0f172a' : 'var(--border-subtle)',
                        }}
                      />
                      <span style={{ flex: 1 }}>{v.name}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: NODES EXPLORER */}
            {activeTab === 'nodes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {/* Node type chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', paddingBottom: '4px' }}>
                  {Object.entries(typeCounts).map(([typeKey, count]) => {
                    const typeDef = BUILTIN_NODE_TYPES[typeKey] || customNodeTypes[typeKey] || BUILTIN_NODE_TYPES.custom;
                    const isSelected = selectedType === typeKey;
                    return (
                      <span
                        key={typeKey}
                        onClick={() => setSelectedType(isSelected ? null : typeKey)}
                        style={{
                          fontSize: '10px',
                          fontFamily: 'var(--font-mono)',
                          padding: '1px 5px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? '#0f172a' : 'var(--surface-subtle)',
                          color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        {typeDef.label} ({count})
                      </span>
                    );
                  })}
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

                {/* Filtered nodes list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  {currentNodes
                    .filter((n) => !selectedType || n.type === selectedType)
                    .map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleFocusNode(n.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 6px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          color: 'var(--text-primary)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-subtle)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <DynamicIcon name={(BUILTIN_NODE_TYPES[n.type] || BUILTIN_NODE_TYPES.custom).icon || 'Box'} size={11} color="var(--text-muted)" />
                        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {n.name}
                        </span>
                        <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                          v{n.version || '0.1.0'}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* TAB 3: GROUPS */}
            {activeTab === 'groups' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {currentGroups.map((grp) => (
                  <div
                    key={grp.id}
                    onClick={() => selectGroup(grp.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '5px 8px',
                      borderRadius: '4px',
                      fontSize: '11.5px',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-subtle)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <Folder size={11} color="var(--text-muted)" />
                    <span style={{ flex: 1, fontWeight: 500 }}>{grp.name}</span>
                    <span style={{ fontSize: '9.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {grp.nodeIds.length} nodes
                    </span>
                  </div>
                ))}
                {currentGroups.length === 0 && (
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '8px' }}>
                    No groups in this graph
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          <div
            style={{
              padding: '6px 8px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {currentNodes.length} nodes · {currentGroups.length} groups
            </span>
            <button
              onClick={onOpenNewNode}
              className="hupa-btn primary"
              style={{ height: '22px', padding: '0 6px', fontSize: '10.5px' }}
            >
              <Plus size={11} /> Node
            </button>
          </div>
        </>
      )}
    </aside>
  );
};
