import React, { useState } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { BUILTIN_NODE_TYPES } from '../../constants/nodeTypes';
import { BUILTIN_RELATIONSHIP_TYPES } from '../../constants/relationshipTypes';
import { DynamicIcon } from '../common/DynamicIcon';
import {
  X,
  Layers,
  Sliders,
  GitFork,
  FileText,
  Clock,
  Plus,
  Trash2,
  Tag,
  ArrowRight,
  ArrowLeft,
  Eye,
  Edit3,
  Link2,
} from 'lucide-react';
import type { NodeStatus, NodePriority } from '../../types/graph';

export const NodeInspector: React.FC = () => {
  const {
    nodes,
    edges,
    selectedNodeIds,
    selectedEdgeIds,
    updateNode,
    deleteNode,
    updateEdge,
    deleteEdge,
    drillIntoNode,
    selectNode,
    isInspectorOpen,
    setInspectorOpen,
    inspectorTab,
    setInspectorTab,
    customNodeTypes,
    customRelationshipTypes,
    graphs,
  } = useGraphStore();

  const [newTagInput, setNewTagInput] = useState('');
  const [newPropKey, setNewPropKey] = useState('');
  const [newPropVal, setNewPropVal] = useState('');
  const [isMarkdownPreview, setIsMarkdownPreview] = useState(false);

  if (!isInspectorOpen) return null;

  const selectedNode = selectedNodeIds.length === 1 ? nodes[selectedNodeIds[0]] : null;
  const selectedEdge = selectedEdgeIds.length === 1 && selectedNodeIds.length === 0 ? edges[selectedEdgeIds[0]] : null;

  // EDGE INSPECTOR VIEW
  if (selectedEdge) {
    const srcNode = nodes[selectedEdge.sourceNodeId];
    const tgtNode = nodes[selectedEdge.targetNodeId];
    const allRelTypes = { ...BUILTIN_RELATIONSHIP_TYPES, ...customRelationshipTypes };

    return (
      <aside className="right-inspector">
        {/* Edge Header */}
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: '#e4e4e7',
                color: '#09090b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Link2 size={15} />
            </div>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Relationship
              </span>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {selectedEdge.label || selectedEdge.type}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={() => deleteEdge(selectedEdge.id)}
              className="btn-icon"
              title="Delete Relationship"
              style={{ color: '#71717a' }}
            >
              <Trash2 size={15} />
            </button>
            <button onClick={() => setInspectorOpen(false)} className="btn-icon" title="Close Inspector">
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Source -> Target banner */}
        <div
          style={{
            padding: '10px 16px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
          }}
        >
          <button
            onClick={() => srcNode && selectNode(srcNode.id)}
            style={{ fontWeight: 600, background: 'none', border: 'none', color: '#09090b', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {srcNode?.name || selectedEdge.sourceNodeId}
          </button>
          <ArrowRight size={13} color="#71717a" />
          <button
            onClick={() => tgtNode && selectNode(tgtNode.id)}
            style={{ fontWeight: 600, background: 'none', border: 'none', color: '#09090b', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {tgtNode?.name || selectedEdge.targetNodeId}
          </button>
        </div>

        {/* Edge Edit Form */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1, overflowY: 'auto' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
              Relationship Semantic Type
            </label>
            <select
              value={selectedEdge.type}
              onChange={(e) => updateEdge(selectedEdge.id, { type: e.target.value, label: e.target.value })}
              style={{
                width: '100%',
                padding: '6px 8px',
                borderRadius: '6px',
                border: '1px solid var(--border-default)',
                fontSize: '12px',
                backgroundColor: '#ffffff',
              }}
            >
              {Object.values(allRelTypes).map((rel) => (
                <option key={rel.type} value={rel.type}>
                  {rel.label} ({rel.lineStyle || 'solid'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
              Custom Label Pill
            </label>
            <input
              type="text"
              value={selectedEdge.label || ''}
              onChange={(e) => updateEdge(selectedEdge.id, { label: e.target.value })}
              placeholder={selectedEdge.type}
              style={{
                width: '100%',
                padding: '6px 8px',
                borderRadius: '6px',
                border: '1px solid var(--border-default)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
              Line Style
            </label>
            <select
              value={selectedEdge.lineStyle || 'solid'}
              onChange={(e) => updateEdge(selectedEdge.id, { lineStyle: e.target.value as any })}
              style={{
                width: '100%',
                padding: '6px 8px',
                borderRadius: '6px',
                border: '1px solid var(--border-default)',
                fontSize: '12px',
                backgroundColor: '#ffffff',
              }}
            >
              <option value="solid">Solid Stroke</option>
              <option value="dashed">Dashed (Asynchronous / Loose)</option>
              <option value="dotted">Dotted (Referential / Weak)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
              Architectural Notes & Contract Spec
            </label>
            <textarea
              rows={4}
              value={selectedEdge.notes || ''}
              onChange={(e) => updateEdge(selectedEdge.id, { notes: e.target.value })}
              placeholder="e.g. Rate-limited to 10k req/s, gRPC payload contract..."
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid var(--border-default)',
                fontSize: '12px',
                resize: 'vertical',
              }}
            />
          </div>
        </div>
      </aside>
    );
  }

  // NO SELECTION VIEW
  if (!selectedNode) {
    return (
      <aside className="right-inspector">
        <div
          style={{
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>
            Inspector
          </span>
          <button onClick={() => setInspectorOpen(false)} className="btn-icon" title="Close Inspector">
            <X size={15} />
          </button>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px',
            color: 'var(--text-muted)',
            textAlign: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-surface-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-subtle)',
            }}
          >
            <Sliders size={22} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
              No Element Selected
            </div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>
              Select any node or relationship on the canvas to inspect and edit its properties.
            </div>
          </div>
        </div>
      </aside>
    );
  }

  const typeDef =
    customNodeTypes[selectedNode.type] ||
    BUILTIN_NODE_TYPES[selectedNode.type] ||
    BUILTIN_NODE_TYPES.custom;

  // Compute incoming and outgoing edges
  const incomingEdges = Object.values(edges).filter((e) => e.targetNodeId === selectedNode.id);
  const outgoingEdges = Object.values(edges).filter((e) => e.sourceNodeId === selectedNode.id);

  const subGraph = selectedNode.subGraphId ? graphs[selectedNode.subGraphId] : null;

  // Add Tag handler
  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    if (!selectedNode.tags.includes(newTagInput.trim())) {
      updateNode(selectedNode.id, { tags: [...selectedNode.tags, newTagInput.trim()] });
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateNode(selectedNode.id, {
      tags: selectedNode.tags.filter((t) => t !== tagToRemove),
    });
  };

  // Add Property handler
  const handleAddProperty = () => {
    if (!newPropKey.trim()) return;
    const currentProps = { ...selectedNode.properties };
    currentProps[newPropKey.trim()] = newPropVal.trim();
    updateNode(selectedNode.id, { properties: currentProps });
    setNewPropKey('');
    setNewPropVal('');
  };

  const handleRemoveProperty = (key: string) => {
    const currentProps = { ...selectedNode.properties };
    delete currentProps[key];
    updateNode(selectedNode.id, { properties: currentProps });
  };

  return (
    <aside className="right-inspector">
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-surface-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: '#e4e4e7',
              color: '#09090b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <DynamicIcon name={typeDef.icon || 'Box'} size={15} color="#09090b" />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#71717a',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              {typeDef.label}
            </span>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {selectedNode.name}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={() => deleteNode(selectedNode.id)}
            className="btn-icon"
            title="Delete Node"
            style={{ color: '#71717a' }}
          >
            <Trash2 size={15} />
          </button>
          <button onClick={() => setInspectorOpen(false)} className="btn-icon" title="Close Inspector">
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 8px',
          backgroundColor: 'var(--bg-surface)',
        }}
      >
        {[
          { id: 'overview', label: 'Overview', icon: Sliders },
          { id: 'properties', label: 'Properties', icon: Layers },
          { id: 'relations', label: 'Relations', icon: GitFork },
          { id: 'docs', label: 'Docs & Spec', icon: FileText },
          { id: 'activity', label: 'Info', icon: Clock },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = inspectorTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setInspectorTab(tab.id as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '8px 10px',
                fontSize: '11.5px',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#09090b' : 'var(--text-secondary)',
                borderBottom: `2px solid ${isActive ? '#09090b' : 'transparent'}`,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <IconComp size={13} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {/* OVERVIEW TAB */}
        {inspectorTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                Node Name
              </label>
              <input
                type="text"
                value={selectedNode.name}
                onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-default)',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              />
            </div>

            {/* Type Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                Node Type
              </label>
              <select
                value={selectedNode.type}
                onChange={(e) => updateNode(selectedNode.id, { type: e.target.value })}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-default)',
                  fontSize: '12px',
                  backgroundColor: '#ffffff',
                }}
              >
                {Object.values(BUILTIN_NODE_TYPES).map((t) => (
                  <option key={t.type} value={t.type}>
                    {t.label} ({t.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Status & Priority Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Status
                </label>
                <select
                  value={selectedNode.status}
                  onChange={(e) => updateNode(selectedNode.id, { status: e.target.value as NodeStatus })}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-default)',
                    fontSize: '12px',
                    backgroundColor: '#ffffff',
                    textTransform: 'capitalize',
                  }}
                >
                  {['concept', 'planned', 'in-progress', 'active', 'review', 'completed', 'deprecated', 'blocked'].map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Priority
                </label>
                <select
                  value={selectedNode.priority}
                  onChange={(e) => updateNode(selectedNode.id, { priority: e.target.value as NodePriority })}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-default)',
                    fontSize: '12px',
                    backgroundColor: '#ffffff',
                    textTransform: 'capitalize',
                  }}
                >
                  {['low', 'medium', 'high', 'critical'].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Version & Owner Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Version
                </label>
                <input
                  type="text"
                  placeholder="e.g. 1.0.0"
                  value={selectedNode.version || ''}
                  onChange={(e) => updateNode(selectedNode.id, { version: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-default)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Owner / Lead
                </label>
                <input
                  type="text"
                  placeholder="Team or person"
                  value={selectedNode.owner || ''}
                  onChange={(e) => updateNode(selectedNode.id, { owner: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-default)',
                    fontSize: '12px',
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                Description
              </label>
              <textarea
                rows={3}
                value={selectedNode.description}
                onChange={(e) => updateNode(selectedNode.id, { description: e.target.value })}
                placeholder="High-level architecture context..."
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-default)',
                  fontSize: '12px',
                  lineHeight: '1.4',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Tags */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                Tags
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {selectedNode.tags.map((tag) => (
                  <span
                    key={tag}
                    className="badge"
                    style={{
                      backgroundColor: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      padding: '2px 6px',
                    }}
                  >
                    <Tag size={10} />
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginLeft: '2px' }}
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="Add new tag..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  style={{
                    flex: 1,
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--border-default)',
                    fontSize: '11px',
                  }}
                />
                <button onClick={handleAddTag} className="btn" style={{ padding: '4px 8px', fontSize: '11px' }}>
                  <Plus size={12} /> Add
                </button>
              </div>
            </div>

            {/* Nested Sub-graph Card */}
            <div
              style={{
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d4d4d8',
                backgroundColor: '#f4f4f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#09090b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <GitFork size={13} />
                  <span>Nested Subsystem</span>
                </div>
                <div style={{ fontSize: '11px', color: '#52525b', marginTop: '2px' }}>
                  {subGraph ? `${subGraph.nodeIds.length} sub-nodes modeled` : 'No sub-graph created yet'}
                </div>
              </div>

              <button
                onClick={() => drillIntoNode(selectedNode.id)}
                className="btn btn-primary"
                style={{ fontSize: '11px', padding: '4px 10px' }}
              >
                {subGraph ? 'Drill In' : 'Create Graph'}
              </button>
            </div>
          </div>
        )}

        {/* PROPERTIES TAB */}
        {inspectorTab === 'properties' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Structured domain attributes and configuration parameters.
            </div>

            {/* Existing Properties */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {Object.entries(selectedNode.properties || {}).map(([key, val]) => (
                <div
                  key={key}
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
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      {key}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                      {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveProperty(key)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a' }}
                    title="Remove property"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Property Form */}
            <div
              style={{
                marginTop: '12px',
                padding: '10px',
                borderRadius: '6px',
                border: '1px dashed var(--border-default)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>Add New Property</div>
              <input
                type="text"
                placeholder="Property Key (e.g. latency, runtime)"
                value={newPropKey}
                onChange={(e) => setNewPropKey(e.target.value)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-default)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                }}
              />
              <input
                type="text"
                placeholder="Property Value"
                value={newPropVal}
                onChange={(e) => setNewPropVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddProperty()}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-default)',
                  fontSize: '11px',
                }}
              />
              <button onClick={handleAddProperty} className="btn" style={{ alignSelf: 'flex-end', fontSize: '11px' }}>
                <Plus size={12} /> Add Property
              </button>
            </div>
          </div>
        )}

        {/* RELATIONS TAB */}
        {inspectorTab === 'relations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Outgoing Relations */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                Outgoing Relationships ({outgoingEdges.length})
              </div>
              {outgoingEdges.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-subtle)', fontStyle: 'italic' }}>
                  No outgoing connections. Drag from a node handle to connect.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {outgoingEdges.map((edge) => {
                    const targetNode = nodes[edge.targetNodeId];
                    if (!targetNode) return null;

                    return (
                      <div
                        key={edge.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: '#ffffff',
                          fontSize: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ArrowRight size={13} color="#09090b" />
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 600,
                              padding: '1px 5px',
                              borderRadius: '4px',
                              backgroundColor: '#f4f4f5',
                              color: '#09090b',
                              border: '1px solid #e4e4e7',
                            }}
                          >
                            {edge.label || edge.type}
                          </span>
                          <button
                            onClick={() => selectNode(targetNode.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#09090b',
                              fontWeight: 600,
                              cursor: 'pointer',
                              textAlign: 'left',
                              textDecoration: 'underline',
                              textDecorationColor: 'var(--border-default)',
                            }}
                          >
                            {targetNode.name}
                          </button>
                        </div>

                        <button
                          onClick={() => deleteEdge(edge.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a' }}
                          title="Delete relationship"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Incoming Relations */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                Incoming Relationships ({incomingEdges.length})
              </div>
              {incomingEdges.length === 0 ? (
                <div style={{ fontSize: '12px', color: 'var(--text-subtle)', fontStyle: 'italic' }}>
                  No incoming connections.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {incomingEdges.map((edge) => {
                    const sourceNode = nodes[edge.sourceNodeId];
                    if (!sourceNode) return null;

                    return (
                      <div
                        key={edge.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          backgroundColor: '#ffffff',
                          fontSize: '12px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <ArrowLeft size={13} color="#09090b" />
                          <button
                            onClick={() => selectNode(sourceNode.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#09090b',
                              fontWeight: 600,
                              cursor: 'pointer',
                              textAlign: 'left',
                              textDecoration: 'underline',
                              textDecorationColor: 'var(--border-default)',
                            }}
                          >
                            {sourceNode.name}
                          </button>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 600,
                              padding: '1px 5px',
                              borderRadius: '4px',
                              backgroundColor: '#f4f4f5',
                              color: '#09090b',
                              border: '1px solid #e4e4e7',
                            }}
                          >
                            {edge.label || edge.type}
                          </span>
                        </div>

                        <button
                          onClick={() => deleteEdge(edge.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#71717a' }}
                          title="Delete relationship"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* DOCS & SPEC TAB */}
        {inspectorTab === 'docs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
                Architecture Specification & Notes
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => setIsMarkdownPreview(false)}
                  className={`btn ${!isMarkdownPreview ? 'btn-primary' : ''}`}
                  style={{ padding: '2px 8px', fontSize: '11px' }}
                >
                  <Edit3 size={11} /> Edit
                </button>
                <button
                  onClick={() => setIsMarkdownPreview(true)}
                  className={`btn ${isMarkdownPreview ? 'btn-primary' : ''}`}
                  style={{ padding: '2px 8px', fontSize: '11px' }}
                >
                  <Eye size={11} /> Preview
                </button>
              </div>
            </div>

            {isMarkdownPreview ? (
              <div
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface-subtle)',
                  minHeight: '220px',
                  fontSize: '12px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                {selectedNode.documentation || '*(No documentation written yet)*'}
              </div>
            ) : (
              <textarea
                rows={12}
                value={selectedNode.documentation || ''}
                onChange={(e) => updateNode(selectedNode.id, { documentation: e.target.value })}
                placeholder="# Architecture Spec\n\n- Key Decisions\n- API Contracts\n- Performance constraints..."
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-default)',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  lineHeight: '1.5',
                  resize: 'vertical',
                }}
              />
            )}
          </div>
        )}

        {/* ACTIVITY & INFO TAB */}
        {inspectorTab === 'activity' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
            <div style={{ padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-surface-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Internal ID</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{selectedNode.id}</div>
            </div>

            <div style={{ padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-surface-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Graph Container</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{selectedNode.graphId}</div>
            </div>

            <div style={{ padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-surface-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Created At</div>
              <div>{new Date(selectedNode.createdAt).toLocaleString()}</div>
            </div>

            <div style={{ padding: '10px', borderRadius: '6px', backgroundColor: 'var(--bg-surface-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Last Updated</div>
              <div>{new Date(selectedNode.updatedAt).toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
