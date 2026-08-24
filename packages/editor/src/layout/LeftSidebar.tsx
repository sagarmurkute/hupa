import React, { useState } from 'react';
import { useGraphStore } from '@hupa/state';
import { BUILTIN_NODE_TYPES } from '@hupa/shared';
import { DynamicIcon } from '@hupa/ui';
import {
  Layers,
  Box,
  Folder,
  PanelLeftClose,
  PanelLeftOpen,
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

  // 1. MINIMIZED SLIM ICON RAIL (When Sidebar is Collapsed)
  if (!isSidebarOpen) {
    return (
      <aside
        className="drawer-panel left-drawer"
        style={{
          width: '44px',
          minWidth: '44px',
          alignItems: 'center',
          padding: '6px 0',
          gap: '6px',
        }}
        aria-label="Collapsed Navigation Dock"
      >
        {/* Expand Toggle Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="hupa-btn ghost icon-only"
          style={{ width: '32px', height: '32px' }}
          title="Expand Sidebar (⌘B)"
          aria-label="Expand Sidebar"
        >
          <PanelLeftOpen size={15} color="var(--text-secondary)" />
        </button>

        <div style={{ width: '20px', height: '1px', backgroundColor: 'var(--border-subtle)', margin: '2px 0' }} />

        {/* Quick Icon View Switcher */}
        <button
          onClick={() => {
            setActiveTab('views');
            setSidebarOpen(true);
          }}
          className={`hupa-btn ghost icon-only ${activeTab === 'views' ? 'active' : ''}`}
          style={{ width: '32px', height: '32px' }}
          title="Perspective Views"
          aria-label="Perspective Views"
        >
          <Layers size={14} />
        </button>

        <button
          onClick={() => {
            setActiveTab('nodes');
            setSidebarOpen(true);
          }}
          className={`hupa-btn ghost icon-only ${activeTab === 'nodes' ? 'active' : ''}`}
          style={{ width: '32px', height: '32px' }}
          title={`Architectural Nodes (${currentNodes.length})`}
          aria-label="Nodes Explorer"
        >
          <Box size={14} />
        </button>

        <button
          onClick={() => {
            setActiveTab('groups');
            setSidebarOpen(true);
          }}
          className={`hupa-btn ghost icon-only ${activeTab === 'groups' ? 'active' : ''}`}
          style={{ width: '32px', height: '32px' }}
          title={`Subsystem Groups (${currentGroups.length})`}
          aria-label="Subsystem Groups"
        >
          <Folder size={14} />
        </button>

        <div style={{ flex: 1 }} />

        {/* Quick Add Node Trigger */}
        <button
          onClick={onOpenNewNode}
          className="hupa-btn primary icon-only"
          style={{ width: '30px', height: '30px', borderRadius: '6px' }}
          title="Add New Node (N)"
          aria-label="Add Node"
        >
          <Plus size={14} />
        </button>
      </aside>
    );
  }

  // 2. EXPANDED FULL SIDEBAR
  return (
    <aside
      className="drawer-panel left-drawer"
      style={{
        width: 'var(--sidebar-width)',
        minWidth: 'var(--sidebar-width)',
      }}
      aria-label="Project Hierarchy Navigation"
    >
      {/* Header / Drawer Toggle */}
      <div className="drawer-header">
        <span style={{ fontSize: '11px', fontWeight: 600 }}>Project Hierarchy</span>

        <button
          onClick={() => setSidebarOpen(false)}
          className="hupa-btn ghost icon-only"
          style={{ width: '22px', height: '22px' }}
          title="Collapse Sidebar (⌘B)"
          aria-label="Collapse Navigation Sidebar"
        >
          <PanelLeftClose size={13} />
        </button>
      </div>

      {/* Segmented Tab Navigation */}
      <div
        style={{
          display: 'flex',
          padding: '6px 8px',
          gap: '3px',
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
                padding: '4px 6px',
                fontSize: '11px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                border: isActive ? '1px solid var(--border-subtle)' : '1px solid transparent',
                borderRadius: '5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 1px 2px rgba(15, 23, 42, 0.04)' : 'none',
                transition: 'all 0.12s ease',
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
                    gap: '8px',
                    padding: '6px 8px',
                    borderRadius: '5px',
                    fontSize: '11.5px',
                    cursor: 'pointer',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    backgroundColor: isActive ? 'var(--surface-subtle)' : 'transparent',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'background-color 0.1s ease',
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
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: isActive ? '#0f172a' : 'var(--border-medium)',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Node type chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px', paddingBottom: '2px' }}>
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
                      padding: '2px 6px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#0f172a' : 'var(--surface-subtle)',
                      color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)',
                      fontWeight: 500,
                      transition: 'all 0.1s ease',
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
                      padding: '5px 7px',
                      borderRadius: '5px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      transition: 'background-color 0.1s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-subtle)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <DynamicIcon name={(BUILTIN_NODE_TYPES[n.type] || BUILTIN_NODE_TYPES.custom).icon || 'Box'} size={12} color="var(--text-secondary)" />
                    <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
                      {n.name}
                    </span>
                    <span style={{ fontSize: '9.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
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
                  padding: '6px 8px',
                  borderRadius: '5px',
                  fontSize: '11.5px',
                  cursor: 'pointer',
                  transition: 'background-color 0.1s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-subtle)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Folder size={12} color="var(--text-secondary)" />
                <span style={{ flex: 1, fontWeight: 500 }}>{grp.name}</span>
                <span style={{ fontSize: '9.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  {grp.nodeIds.length} nodes
                </span>
              </div>
            ))}
            {currentGroups.length === 0 && (
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '12px 8px' }}>
                No groups in this graph
              </div>
            )}
          </div>
        )}
      </div>

      {/* Drawer Footer */}
      <div
        style={{
          padding: '8px 10px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--surface-subtle)',
        }}
      >
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {currentNodes.length} nodes · {currentGroups.length} groups
        </span>
        <button
          onClick={onOpenNewNode}
          className="hupa-btn primary"
          style={{ height: '24px', padding: '0 8px', fontSize: '10.5px' }}
        >
          <Plus size={11} /> Node
        </button>
      </div>
    </aside>
  );
};
