import React, { useState } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { BUILTIN_NODE_TYPES } from '../../constants/nodeTypes';
import { BUILTIN_RELATIONSHIP_TYPES } from '../../constants/relationshipTypes';
import { DynamicIcon } from '../common/DynamicIcon';
import {
  ChevronRight,
  Plus,
  Trash2,
  GitFork,
  ArrowRight,
  ArrowLeftRight,
} from 'lucide-react';

export const NodeInspector: React.FC = () => {
  const {
    nodes,
    edges,
    graphs,
    activeGraphId,
    projects,
    activeProjectId,
    selectedNodeIds,
    selectedEdgeIds,
    updateNode,
    deleteNode,
    updateEdge,
    deleteEdge,
    drillIntoNode,
    selectNode,
    setTransform,
    isInspectorOpen,
    setInspectorOpen,
    inspectorTab,
    setInspectorTab,
    customNodeTypes,
    customRelationshipTypes,
    setNewNodeModalOpen,
  } = useGraphStore();

  const [activeDocPreview, setActiveDocPreview] = useState(false);
  const [newPropKey, setNewPropKey] = useState('');
  const [newPropVal, setNewPropVal] = useState('');

  if (!isInspectorOpen) return null;

  const activeProject = projects[activeProjectId] || { name: 'HUPA Platform' };
  const currentGraph = graphs[activeGraphId] || { name: 'System Root' };
  const currentNodes = Object.values(nodes).filter((n) => n.graphId === activeGraphId);
  const currentEdges = Object.values(edges).filter((e) => e.graphId === activeGraphId);

  // Single Node Selected
  const selectedNode = selectedNodeIds.length === 1 ? nodes[selectedNodeIds[0]] : null;
  // Single Edge Selected
  const selectedEdge = selectedEdgeIds.length === 1 ? edges[selectedEdgeIds[0]] : null;

  // Jump canvas to a node
  const handleJumpToNode = (nodeId: string) => {
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

  // 1. NOTHING SELECTED — PROJECT & GRAPH CONTEXT
  if (!selectedNode && !selectedEdge) {
    return (
      <aside className="drawer-panel right-drawer" style={{ width: 'var(--inspector-width)' }}>
        <div className="drawer-header">
          <span>Graph Context</span>
          <button
            onClick={() => setInspectorOpen(false)}
            className="hupa-btn ghost icon-only"
            style={{ width: '22px', height: '22px' }}
          >
            <ChevronRight size={13} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {currentGraph.name}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Project: {activeProject.name}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--surface-subtle)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {currentNodes.length}
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Nodes</div>
            </div>

            <div style={{ padding: '8px', backgroundColor: 'var(--surface-subtle)', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {currentEdges.length}
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Relationships</div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Quick Graph Actions
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <button
                onClick={() => setNewNodeModalOpen(true)}
                className="hupa-btn"
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                <Plus size={12} /> Add Architectural Node
              </button>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // 2. EDGE SELECTED — RELATIONSHIP INSPECTOR
  if (selectedEdge) {
    const src = nodes[selectedEdge.sourceNodeId];
    const tgt = nodes[selectedEdge.targetNodeId];
    const relDef = customRelationshipTypes[selectedEdge.type] || BUILTIN_RELATIONSHIP_TYPES[selectedEdge.type] || BUILTIN_RELATIONSHIP_TYPES.uses;

    return (
      <aside className="drawer-panel right-drawer" style={{ width: 'var(--inspector-width)' }}>
        <div className="drawer-header">
          <span>Relationship Spec</span>
          <button
            onClick={() => setInspectorOpen(false)}
            className="hupa-btn ghost icon-only"
            style={{ width: '22px', height: '22px' }}
          >
            <ChevronRight size={13} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Source -> Target */}
          <div
            style={{
              padding: '10px',
              backgroundColor: 'var(--surface-subtle)',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11.5px',
            }}
          >
            <span style={{ fontWeight: 600 }}>{src?.name || selectedEdge.sourceNodeId}</span>
            <ArrowRight size={12} color="var(--text-muted)" />
            <span style={{ fontWeight: 600 }}>{tgt?.name || selectedEdge.targetNodeId}</span>
          </div>

          {/* Relationship Type */}
          <div>
            <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Semantic Type
            </label>
            <select
              value={selectedEdge.type}
              onChange={(e) => {
                const newType = e.target.value;
                const def = BUILTIN_RELATIONSHIP_TYPES[newType];
                updateEdge(selectedEdge.id, {
                  type: newType,
                  label: def ? def.label : newType,
                });
              }}
              style={{
                width: '100%',
                height: '28px',
                border: '1px solid var(--border-subtle)',
                borderRadius: '5px',
                padding: '0 8px',
                fontSize: '11.5px',
                backgroundColor: '#ffffff',
              }}
            >
              {Object.values(BUILTIN_RELATIONSHIP_TYPES).map((r) => (
                <option key={r.type} value={r.type}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Label */}
          <div>
            <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Pill Label
            </label>
            <input
              value={selectedEdge.label || ''}
              onChange={(e) => updateEdge(selectedEdge.id, { label: e.target.value })}
              placeholder={relDef.label}
              style={{
                width: '100%',
                height: '28px',
                border: '1px solid var(--border-subtle)',
                borderRadius: '5px',
                padding: '0 8px',
                fontSize: '11.5px',
                backgroundColor: '#ffffff',
              }}
            />
          </div>

          {/* Swap Direction & Delete Actions */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
            <button
              onClick={() =>
                updateEdge(selectedEdge.id, {
                  sourceNodeId: selectedEdge.targetNodeId,
                  targetNodeId: selectedEdge.sourceNodeId,
                })
              }
              className="hupa-btn"
              style={{ flex: 1 }}
            >
              <ArrowLeftRight size={12} /> Swap Direction
            </button>

            <button
              onClick={() => deleteEdge(selectedEdge.id)}
              className="hupa-btn"
              style={{ color: '#e11d48' }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // 3. NODE SELECTED — PRECISION NODE INSPECTOR
  if (!selectedNode) return null;

  const typeDef = customNodeTypes[selectedNode.type] || BUILTIN_NODE_TYPES[selectedNode.type] || BUILTIN_NODE_TYPES.custom;
  const incomingEdges = currentEdges.filter((e) => e.targetNodeId === selectedNode.id);
  const outgoingEdges = currentEdges.filter((e) => e.sourceNodeId === selectedNode.id);

  return (
    <aside className="drawer-panel right-drawer" style={{ width: 'var(--inspector-width)' }}>
      {/* Header */}
      <div className="drawer-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <DynamicIcon name={typeDef.icon || 'Box'} size={12} color="var(--text-secondary)" />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
            {selectedNode.name}
          </span>
        </div>
        <button
          onClick={() => setInspectorOpen(false)}
          className="hupa-btn ghost icon-only"
          style={{ width: '22px', height: '22px' }}
        >
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--surface-subtle)',
          padding: '4px 8px',
          gap: '2px',
        }}
      >
        {[
          { id: 'overview', label: 'Spec' },
          { id: 'relations', label: `Rels (${incomingEdges.length + outgoingEdges.length})` },
          { id: 'properties', label: 'Props' },
          { id: 'docs', label: 'Docs' },
        ].map((tab) => {
          const isActive = inspectorTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setInspectorTab(tab.id as any)}
              style={{
                flex: 1,
                padding: '3px 4px',
                fontSize: '11px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                border: isActive ? '1px solid var(--border-subtle)' : '1px solid transparent',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
        {/* TAB: OVERVIEW */}
        {inspectorTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
                Node Name
              </label>
              <input
                value={selectedNode.name}
                onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
                style={{
                  width: '100%',
                  height: '28px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '5px',
                  padding: '0 8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  backgroundColor: '#ffffff',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
                  Type
                </label>
                <select
                  value={selectedNode.type}
                  onChange={(e) => updateNode(selectedNode.id, { type: e.target.value as any })}
                  style={{
                    width: '100%',
                    height: '28px',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '5px',
                    padding: '0 6px',
                    fontSize: '11.5px',
                    backgroundColor: '#ffffff',
                  }}
                >
                  {Object.values(BUILTIN_NODE_TYPES).map((t) => (
                    <option key={t.type} value={t.type}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
                  Status
                </label>
                <select
                  value={selectedNode.status}
                  onChange={(e) => updateNode(selectedNode.id, { status: e.target.value as any })}
                  style={{
                    width: '100%',
                    height: '28px',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '5px',
                    padding: '0 6px',
                    fontSize: '11.5px',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <option value="planned">Planned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                  <option value="deprecated">Deprecated</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '3px' }}>
                Description
              </label>
              <textarea
                value={selectedNode.description || ''}
                onChange={(e) => updateNode(selectedNode.id, { description: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '5px',
                  padding: '6px 8px',
                  fontSize: '11.5px',
                  resize: 'vertical',
                  lineHeight: '1.4',
                  backgroundColor: '#ffffff',
                }}
              />
            </div>

            {/* Subsystem graph drill-down button */}
            <div style={{ paddingTop: '6px' }}>
              <button
                onClick={() => drillIntoNode(selectedNode.id)}
                className="hupa-btn"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <GitFork size={12} color="var(--accent-indigo)" />
                {selectedNode.subGraphId ? 'Enter Subsystem Graph ↗' : 'Encapsulate into Subsystem'}
              </button>
            </div>

            <div style={{ paddingTop: '4px' }}>
              <button
                onClick={() => deleteNode(selectedNode.id)}
                className="hupa-btn ghost"
                style={{ width: '100%', justifyContent: 'center', color: '#e11d48' }}
              >
                <Trash2 size={12} /> Delete Node
              </button>
            </div>
          </div>
        )}

        {/* TAB: RELATIONS */}
        {inspectorTab === 'relations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Incoming Connections ({incomingEdges.length})
              </div>
              {incomingEdges.map((e) => {
                const s = nodes[e.sourceNodeId];
                return (
                  <div
                    key={e.id}
                    onClick={() => handleJumpToNode(e.sourceNodeId)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '5px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--surface-subtle)',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                    }}
                  >
                    <span>{s?.name || e.sourceNodeId}</span>
                    <span style={{ fontSize: '9.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {e.label || e.type}
                    </span>
                  </div>
                );
              })}
              {incomingEdges.length === 0 && (
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No incoming relationships
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Outgoing Connections ({outgoingEdges.length})
              </div>
              {outgoingEdges.map((e) => {
                const t = nodes[e.targetNodeId];
                return (
                  <div
                    key={e.id}
                    onClick={() => handleJumpToNode(e.targetNodeId)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '5px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--surface-subtle)',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                    }}
                  >
                    <span>{t?.name || e.targetNodeId}</span>
                    <span style={{ fontSize: '9.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {e.label || e.type}
                    </span>
                  </div>
                );
              })}
              {outgoingEdges.length === 0 && (
                <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  No outgoing relationships
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: PROPERTIES */}
        {inspectorTab === 'properties' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Custom Property Store
            </div>
            {Object.entries(selectedNode.properties || {}).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <input
                  disabled
                  value={key}
                  style={{
                    flex: 1,
                    height: '24px',
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    padding: '0 6px',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    backgroundColor: 'var(--surface-subtle)',
                  }}
                />
                <input
                  value={String(val)}
                  onChange={(e) => {
                    const nextProps = { ...selectedNode.properties, [key]: e.target.value };
                    updateNode(selectedNode.id, { properties: nextProps });
                  }}
                  style={{
                    flex: 1,
                    height: '24px',
                    fontSize: '11px',
                    padding: '0 6px',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '4px',
                    backgroundColor: '#ffffff',
                  }}
                />
                <button
                  onClick={() => {
                    const nextProps = { ...selectedNode.properties };
                    delete nextProps[key];
                    updateNode(selectedNode.id, { properties: nextProps });
                  }}
                  className="hupa-btn ghost icon-only"
                  style={{ width: '20px', height: '20px', color: '#e11d48' }}
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}

            {/* Add Property Row */}
            <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
              <input
                placeholder="Key"
                value={newPropKey}
                onChange={(e) => setNewPropKey(e.target.value)}
                style={{
                  flex: 1,
                  height: '24px',
                  fontSize: '11px',
                  padding: '0 6px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                }}
              />
              <input
                placeholder="Value"
                value={newPropVal}
                onChange={(e) => setNewPropVal(e.target.value)}
                style={{
                  flex: 1,
                  height: '24px',
                  fontSize: '11px',
                  padding: '0 6px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                }}
              />
              <button
                onClick={() => {
                  if (newPropKey.trim()) {
                    const nextProps = { ...selectedNode.properties, [newPropKey.trim()]: newPropVal };
                    updateNode(selectedNode.id, { properties: nextProps });
                    setNewPropKey('');
                    setNewPropVal('');
                  }
                }}
                className="hupa-btn primary"
                style={{ height: '24px', padding: '0 6px' }}
              >
                <Plus size={11} />
              </button>
            </div>
          </div>
        )}

        {/* TAB: DOCS */}
        {inspectorTab === 'docs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Markdown Spec
              </span>
              <button
                onClick={() => setActiveDocPreview(!activeDocPreview)}
                className="hupa-btn ghost"
                style={{ height: '20px', padding: '0 6px', fontSize: '10px' }}
              >
                {activeDocPreview ? 'Edit Raw' : 'Preview'}
              </button>
            </div>

            {activeDocPreview ? (
              <div
                style={{
                  padding: '8px',
                  backgroundColor: 'var(--surface-subtle)',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '11px',
                  lineHeight: '1.4',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selectedNode.documentation || `# ${selectedNode.name}\n\n${selectedNode.description || ''}`}
              </div>
            ) : (
              <textarea
                value={selectedNode.documentation || ''}
                onChange={(e) => updateNode(selectedNode.id, { documentation: e.target.value })}
                placeholder={`# ${selectedNode.name}\n\nTechnical specification and architecture notes...`}
                rows={10}
                style={{
                  width: '100%',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '5px',
                  padding: '6px 8px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  resize: 'vertical',
                  lineHeight: '1.4',
                  backgroundColor: '#ffffff',
                }}
              />
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
