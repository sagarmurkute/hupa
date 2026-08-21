import React, { useState } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { BUILTIN_NODE_TYPES } from '../../constants/nodeTypes';
import { DynamicIcon } from '../common/DynamicIcon';
import {
  FolderGit2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Layers,
  Folder,
} from 'lucide-react';

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

  const activeProject = projects[activeProjectId] || { id: '', name: 'HUPA' };
  const currentNodes = Object.values(nodes || {}).filter((n) => n && n.graphId === activeGraphId);
  const currentGroups = Object.values(groups || {}).filter((g) => g && g.graphId === activeGraphId);

  // Group nodes by type
  const typeCounts: Record<string, number> = {};
  currentNodes.forEach((n) => {
    typeCounts[n.type] = (typeCounts[n.type] || 0) + 1;
  });

  const handleFocusNode = (nodeId: string) => {
    selectNode(nodeId);
    const targetNode = nodes[nodeId];
    if (targetNode) {
      setTransform((prev) => ({
        x: window.innerWidth / 2 - (targetNode.position.x + (targetNode.size?.width || 250) / 2) * prev.zoom,
        y: window.innerHeight / 2 - (targetNode.position.y + (targetNode.size?.height || 80) / 2) * prev.zoom,
        zoom: Math.max(0.85, prev.zoom),
      }));
    }
  };

  return (
    <aside className={`sidebar-left ${!isSidebarOpen ? 'collapsed' : ''}`}>
      {/* Top Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 10px',
          borderBottom: '1px solid var(--border)',
          height: '42px',
        }}
      >
        {isSidebarOpen ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
            <FolderGit2 size={13} color="var(--text2)" />
            <span
              style={{
                fontSize: '11.5px',
                fontWeight: 600,
                color: 'var(--text)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {activeProject.name}
            </span>
          </div>
        ) : null}

        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="btn-icon"
          title={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          style={{ width: '24px', height: '24px' }}
        >
          {isSidebarOpen ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
        </button>
      </div>

      {isSidebarOpen && (
        <>
          {/* Tab Navigation: Views, Nodes, Groups */}
          <div
            style={{
              display: 'flex',
              padding: '6px 8px',
              gap: '2px',
              borderBottom: '1px solid var(--border)',
              backgroundColor: 'var(--bg2)',
            }}
          >
            {[
              { id: 'views', label: 'Views', icon: Layers },
              { id: 'nodes', label: `Nodes (${currentNodes.length})`, icon: null },
              { id: 'groups', label: `Groups (${currentGroups.length})`, icon: Folder },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    flex: 1,
                    padding: '4px 6px',
                    fontSize: '11px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'var(--text)' : 'var(--text2)',
                    backgroundColor: isActive ? '#ffffff' : 'transparent',
                    border: isActive ? '1px solid var(--border)' : '1px solid transparent',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.1s ease',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
            {/* TAB 1: PERSPECTIVE VIEWS */}
            {activeTab === 'views' && (
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
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          backgroundColor: isActive ? 'var(--text)' : 'var(--text3)',
                        }}
                      />
                      <span style={{ flex: 1 }}>{v.name}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: NODES TREE */}
            {activeTab === 'nodes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Node Types quick filter */}
                <div className="filter-list">
                  {Object.entries(typeCounts).map(([typeKey, count]) => {
                    const typeDef = BUILTIN_NODE_TYPES[typeKey] || customNodeTypes[typeKey] || BUILTIN_NODE_TYPES.custom;
                    const isSelected = selectedType === typeKey;
                    return (
                      <div
                        key={typeKey}
                        className={`nav-item ${isSelected ? 'active' : ''}`}
                        onClick={() => setSelectedType(isSelected ? null : typeKey)}
                        style={{ fontSize: '11.5px', padding: '4px 6px' }}
                      >
                        <DynamicIcon name={typeDef.icon || 'Box'} size={11} color="var(--text2)" />
                        <span style={{ flex: 1 }}>{typeDef.label}</span>
                        <span style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '2px 0' }} />

                {/* Nodes List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  {currentNodes
                    .filter((n) => !selectedType || n.type === selectedType)
                    .map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleFocusNode(n.id)}
                        className="nav-item"
                        style={{ fontSize: '11.5px', padding: '4px 6px' }}
                      >
                        <span
                          style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: n.status === 'completed' || n.status === 'review' ? '#10b981' : '#9ea5b1',
                          }}
                        />
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {n.name}
                        </span>
                        <span style={{ fontSize: '9.5px', color: 'var(--text3)', textTransform: 'capitalize' }}>
                          {n.type}
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
                    className="nav-item"
                    onClick={() => selectGroup(grp.id)}
                  >
                    <Folder size={12} color="var(--text2)" />
                    <span style={{ flex: 1, fontWeight: 500 }}>{grp.name}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
                      {grp.nodeIds.length}
                    </span>
                  </div>
                ))}
                {currentGroups.length === 0 && (
                  <div style={{ fontSize: '11px', color: 'var(--text3)', fontStyle: 'italic', padding: '8px' }}>
                    No groups in this graph
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Minimalist Bottom Bar */}
          <div
            style={{
              padding: '6px 8px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '10.5px', color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
              {currentNodes.length} nodes • {Object.values(useGraphStore.getState().edges).filter((e) => e.graphId === activeGraphId).length} rels
            </span>
            <button
              onClick={onOpenNewNode}
              className="btn small primary"
              style={{ height: '22px', padding: '0 6px', fontSize: '11px' }}
            >
              <Plus size={11} /> Node
            </button>
          </div>
        </>
      )}
    </aside>
  );
};
