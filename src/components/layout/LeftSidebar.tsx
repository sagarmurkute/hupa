import React, { useState } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { BUILTIN_NODE_TYPES, CATEGORY_LABELS } from '../../constants/nodeTypes';
import { DynamicIcon } from '../common/DynamicIcon';
import {
  FolderGit2,
  Boxes,
  Layers,
  FileText,
  Folder,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Zap,
} from 'lucide-react';

interface LeftSidebarProps {
  onOpenNewNode: () => void;
  onOpenCustomType: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  onOpenNewNode,
  onOpenCustomType,
}) => {
  const {
    projects,
    activeProjectId,
    nodes,
    edges,
    groups,
    documents,
    views,
    activeViewId,
    setActiveView,
    activeGraphId,
    selectNode,
    selectGroup,
    deleteGroup,
    setTransform,
    isSidebarOpen,
    setSidebarOpen,
    activeSidebarTab,
    setActiveSidebarTab,
    addDocument,
    deleteDocument,
    customNodeTypes,
  } = useGraphStore();

  const [newDocTitle, setNewDocTitle] = useState('');
  const [isAddingDoc, setIsAddingDoc] = useState(false);

  const activeProject = projects[activeProjectId];
  const currentNodes = Object.values(nodes).filter((n) => n.graphId === activeGraphId);

  // Group nodes by category
  const categorizedNodes: Record<string, typeof currentNodes> = {};
  currentNodes.forEach((node) => {
    const typeDef = BUILTIN_NODE_TYPES[node.type] || customNodeTypes[node.type] || BUILTIN_NODE_TYPES.custom;
    const cat = typeDef.category || 'custom';
    if (!categorizedNodes[cat]) categorizedNodes[cat] = [];
    categorizedNodes[cat].push(node);
  });

  const handleFocusNode = (nodeId: string) => {
    selectNode(nodeId);
    const targetNode = nodes[nodeId];
    if (targetNode) {
      setTransform((prev) => ({
        x: window.innerWidth / 2 - (targetNode.position.x + (targetNode.size?.width || 210) / 2) * prev.zoom,
        y: window.innerHeight / 2 - (targetNode.position.y + (targetNode.size?.height || 110) / 2) * prev.zoom,
        zoom: Math.max(0.7, prev.zoom),
      }));
    }
  };

  const handleCreateDoc = () => {
    if (!newDocTitle.trim()) return;
    addDocument(newDocTitle.trim(), `# ${newDocTitle.trim()}\n\nWrite project specification here...`);
    setNewDocTitle('');
    setIsAddingDoc(false);
  };

  return (
    <aside className={`left-sidebar ${!isSidebarOpen ? 'collapsed' : ''}`}>
      {/* Sidebar Top Nav Tabs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarOpen ? 'space-between' : 'center',
          padding: '8px 12px',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface-subtle)',
        }}
      >
        {isSidebarOpen ? (
          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
            {[
              { id: 'overview', label: 'Overview', icon: FolderGit2 },
              { id: 'nodes', label: 'Nodes', icon: Boxes },
              { id: 'views', label: 'Views', icon: Layers },
              { id: 'documents', label: 'Docs', icon: FileText },
              { id: 'groups', label: 'Groups', icon: Folder },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeSidebarTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSidebarTab(tab.id as any)}
                  className={`btn-icon ${isActive ? 'active' : ''}`}
                  title={tab.label}
                  style={{ width: '28px', height: '28px' }}
                >
                  <IconComp size={14} />
                </button>
              );
            })}
          </div>
        ) : null}

        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="btn-icon"
          title={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          style={{ width: '28px', height: '28px' }}
        >
          {isSidebarOpen ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
        </button>
      </div>

      {/* Sidebar Body */}
      {isSidebarOpen && (
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {/* TAB 1: OVERVIEW */}
          {activeSidebarTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {activeProject?.name || 'Project Overview'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {activeProject?.description || 'Universal system architecture graph.'}
                </div>
              </div>

              {/* Health and Metrics Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '8px',
                  backgroundColor: '#ffffff',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>NODES</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#09090b' }}>
                    {Object.values(nodes).filter((n) => n.projectId === activeProjectId).length}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>RELATIONS</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#18181b' }}>
                    {Object.values(edges).filter((e) => e.projectId === activeProjectId).length}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>GROUPS</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#27272a' }}>
                    {Object.values(groups).filter((g) => g.projectId === activeProjectId).length}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>SPECS</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#3f3f46' }}>
                    {Object.values(documents).filter((d) => d.projectId === activeProjectId).length}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  onClick={onOpenNewNode}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                >
                  <Plus size={14} /> Add New Node
                </button>
                <button
                  onClick={onOpenCustomType}
                  className="btn"
                  style={{ width: '100%', justifyContent: 'flex-start' }}
                >
                  <Zap size={14} color="#09090b" /> Custom Types Builder
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: NODES TREE */}
          {activeSidebarTab === 'nodes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Nodes in View ({currentNodes.length})
                </span>
                <button onClick={onOpenNewNode} className="btn-icon" title="Add Node" style={{ width: '22px', height: '22px' }}>
                  <Plus size={13} />
                </button>
              </div>

              {currentNodes.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-subtle)', fontStyle: 'italic', padding: '12px 0' }}>
                  No nodes created yet in this graph. Click "+ Add Node" to get started.
                </div>
              ) : (
                Object.entries(categorizedNodes).map(([cat, nList]) => (
                  <div key={cat}>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        padding: '4px 0',
                        borderBottom: '1px solid var(--border-subtle)',
                        marginBottom: '4px',
                      }}
                    >
                      {CATEGORY_LABELS[cat] || cat} ({nList.length})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {nList.map((n) => {
                        const typeDef = BUILTIN_NODE_TYPES[n.type] || customNodeTypes[n.type] || BUILTIN_NODE_TYPES.custom;
                        return (
                          <button
                            key={n.id}
                            onClick={() => handleFocusNode(n.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 6px',
                              borderRadius: '4px',
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              textAlign: 'left',
                              fontSize: '12px',
                              color: 'var(--text-primary)',
                              transition: 'background var(--transition-fast)',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <DynamicIcon name={typeDef.icon || 'Box'} size={12} color="#18181b" />
                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {n.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: VIEWS PERSPECTIVES */}
          {activeSidebarTab === 'views' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Visual Perspectives
              </div>
              {views.map((v) => {
                const isActive = activeViewId === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setActiveView(v.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      backgroundColor: isActive ? '#09090b' : 'transparent',
                      color: isActive ? '#ffffff' : 'var(--text-primary)',
                      border: `1px solid ${isActive ? '#09090b' : 'var(--border-subtle)'}`,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <DynamicIcon name={v.icon} size={15} color={isActive ? '#ffffff' : '#3f3f46'} />
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: isActive ? '#ffffff' : '#09090b' }}>
                        {v.name}
                      </div>
                      <div style={{ fontSize: '10px', color: isActive ? '#d4d4d8' : 'var(--text-muted)', marginTop: '2px', lineHeight: '1.3' }}>
                        {v.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB 4: DOCUMENTS */}
          {activeSidebarTab === 'documents' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Specs & RFCs ({Object.values(documents).filter((d) => d.projectId === activeProjectId).length})
                </span>
                <button onClick={() => setIsAddingDoc(true)} className="btn-icon" style={{ width: '22px', height: '22px' }}>
                  <Plus size={13} />
                </button>
              </div>

              {isAddingDoc && (
                <div style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <input
                    type="text"
                    placeholder="Document title..."
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                    style={{ padding: '4px 6px', fontSize: '12px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}
                  />
                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                    <button onClick={() => setIsAddingDoc(false)} className="btn" style={{ padding: '2px 6px', fontSize: '11px' }}>
                      Cancel
                    </button>
                    <button onClick={handleCreateDoc} className="btn btn-primary" style={{ padding: '2px 6px', fontSize: '11px' }}>
                      Create
                    </button>
                  </div>
                </div>
              )}

              {Object.values(documents)
                .filter((d) => d.projectId === activeProjectId)
                .map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{doc.title}</span>
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.3',
                        maxHeight: '40px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {doc.content.slice(0, 100)}...
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* TAB 5: GROUPS */}
          {activeSidebarTab === 'groups' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Bounding Groups ({Object.values(groups).filter((g) => g.graphId === activeGraphId).length})
              </div>

              {Object.values(groups).filter((g) => g.graphId === activeGraphId).length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-subtle)', fontStyle: 'italic', padding: '12px 0' }}>
                  No groups in this graph. Select multiple nodes and click "Group" in canvas controls.
                </div>
              ) : (
                Object.values(groups)
                  .filter((g) => g.graphId === activeGraphId)
                  .map((grp) => (
                    <div
                      key={grp.id}
                      onClick={() => selectGroup(grp.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1px solid #d4d4d8',
                        backgroundColor: '#f4f4f5',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Folder size={14} color="#09090b" />
                        <span style={{ fontWeight: 600, color: '#09090b' }}>{grp.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{grp.nodeIds.length} nodes</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteGroup(grp.id);
                          }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a', padding: 0 }}
                          title="Delete Group"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
