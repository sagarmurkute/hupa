import React from 'react';
import { useGraphStore } from '@hupa/state';
import { BUILTIN_NODE_TYPES } from '@hupa/shared';
import { DynamicIcon } from '@hupa/ui';
import { CustomSelect } from '@hupa/ui';
import { CustomTagInput } from '@hupa/ui';
import { CustomFieldsEditor } from '@hupa/ui';
import {
  Layers,
  FileText,
  GitFork,
  Trash2,
  Sliders,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import type { NodeStatus, NodePriority } from '@hupa/core';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: '#059669', badge: 'RUNNING' },
  { value: 'in-progress', label: 'In Progress', color: '#d97706', badge: 'DEV' },
  { value: 'planned', label: 'Planned', color: '#64748b', badge: 'ROADMAP' },
  { value: 'review', label: 'Review', color: '#2563eb', badge: 'QA' },
  { value: 'completed', label: 'Completed', color: '#059669', badge: 'DONE' },
  { value: 'blocked', label: 'Blocked', color: '#e11d48', badge: 'ISSUE' },
  { value: 'deprecated', label: 'Deprecated', color: '#94a3b8', badge: 'LEGACY' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: '#94a3b8' },
  { value: 'medium', label: 'Medium', color: '#3b82f6' },
  { value: 'high', label: 'High', color: '#f59e0b', badge: 'HIGH' },
  { value: 'critical', label: 'Critical', color: '#ef4444', badge: 'CRITICAL' },
];

export const NodeInspector: React.FC = () => {
  const {
    isInspectorOpen,
    setInspectorOpen,
    inspectorTab,
    setInspectorTab,
    selectedNodeIds,
    nodes,
    edges,
    updateNode,
    deleteNode,
    selectNode,
    drillIntoNode,
    customNodeTypes,
  } = useGraphStore();

  // 1. MINIMIZED SLIM DOCK (When Inspector is Closed)
  if (!isInspectorOpen) {
    return (
      <aside
        className="inspector-panel"
        style={{
          width: '38px',
          minWidth: '38px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '6px 0',
          gap: '6px',
        }}
        aria-label="Collapsed Inspector Panel"
      >
        <button
          onClick={() => setInspectorOpen(true)}
          className="hupa-btn ghost icon-only"
          style={{ width: '28px', height: '28px' }}
          title="Expand Node Inspector"
          aria-label="Expand Inspector"
        >
          <PanelRightOpen size={14} color="var(--text-secondary)" />
        </button>

        <div style={{ width: '16px', height: '1px', backgroundColor: 'var(--border-subtle)', margin: '2px 0' }} />

        <span
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontSize: '9.5px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginTop: '8px',
            userSelect: 'none',
          }}
        >
          INSPECTOR
        </span>
      </aside>
    );
  }

  const selectedNodeId = selectedNodeIds[0];
  const selectedNode = selectedNodeId ? nodes[selectedNodeId] : null;

  // 2. OPEN INSPECTOR WITH EMPTY STATE
  if (!selectedNode) {
    return (
      <aside className="inspector-panel">
        <div
          style={{
            padding: '12px 14px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface-subtle)',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Node Inspector
          </span>
          <button
            onClick={() => setInspectorOpen(false)}
            className="hupa-btn ghost icon-only"
            style={{ width: '22px', height: '22px' }}
            title="Collapse Inspector"
          >
            <PanelRightClose size={13} />
          </button>
        </div>
        <div
          style={{
            padding: '28px 16px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '11.5px',
            lineHeight: '1.5',
          }}
        >
          Select an architectural node on the canvas to inspect and edit properties.
        </div>
      </aside>
    );
  }

  // 3. OPEN INSPECTOR WITH ACTIVE NODE
  const allNodeTypes = { ...BUILTIN_NODE_TYPES, ...customNodeTypes };
  const typeDef = allNodeTypes[selectedNode.type] || BUILTIN_NODE_TYPES.custom;

  const typeOptions = Object.values(allNodeTypes).map((t) => ({
    value: t.type,
    label: t.label,
    icon: t.icon,
    description: t.description,
  }));

  const incomingEdges = Object.values(edges).filter((e) => e.targetNodeId === selectedNode.id);
  const outgoingEdges = Object.values(edges).filter((e) => e.sourceNodeId === selectedNode.id);

  const tabs: { id: typeof inspectorTab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { id: 'overview', label: 'Spec', icon: Layers },
    { id: 'relations', label: `Rels (${incomingEdges.length + outgoingEdges.length})`, icon: GitFork },
    { id: 'properties', label: 'Props', icon: Sliders },
    { id: 'docs', label: 'Docs', icon: FileText },
  ];

  const handleJumpToNode = (targetId: string) => {
    selectNode(targetId);
  };

  return (
    <aside className="inspector-panel" aria-label="Node Inspector Panel">
      {/* Header */}
      <div
        style={{
          padding: '12px 14px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--surface-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <DynamicIcon name={typeDef.icon || 'Box'} size={13} color={typeDef.color || '#0f172a'} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {selectedNode.name}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {typeDef.label} • v{selectedNode.version || '1.0.0'}
            </div>
          </div>
        </div>

        <button
          onClick={() => setInspectorOpen(false)}
          className="hupa-btn ghost icon-only"
          style={{ width: '22px', height: '22px' }}
          title="Collapse Inspector"
        >
          <PanelRightClose size={13} />
        </button>
      </div>

      {/* Tabs Switcher */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '4px 6px',
          gap: '2px',
          backgroundColor: '#ffffff',
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = inspectorTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setInspectorTab(tab.id)}
              style={{
                flex: 1,
                padding: '4px 6px',
                fontSize: '11px',
                fontWeight: isActive ? 600 : 400,
                borderRadius: '4px',
                border: 'none',
                backgroundColor: isActive ? 'var(--surface-subtle)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: 'pointer',
                transition: 'all 0.1s ease',
              }}
            >
              <Icon size={11} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
        {/* TAB: SPEC / OVERVIEW */}
        {inspectorTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Node Identifier
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
                  outline: 'none',
                }}
              />
            </div>

            {/* Type & Status using CustomSelect */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Component Type
                </label>
                <CustomSelect
                  value={selectedNode.type}
                  options={typeOptions}
                  onChange={(val) => updateNode(selectedNode.id, { type: val as any })}
                />
              </div>

              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Status
                </label>
                <CustomSelect
                  value={selectedNode.status}
                  options={STATUS_OPTIONS}
                  onChange={(val) => updateNode(selectedNode.id, { status: val as NodeStatus })}
                />
              </div>
            </div>

            {/* Priority & Owner using CustomSelect */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Priority
                </label>
                <CustomSelect
                  value={selectedNode.priority || 'medium'}
                  options={PRIORITY_OPTIONS}
                  onChange={(val) => updateNode(selectedNode.id, { priority: val as NodePriority })}
                />
              </div>

              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Owner / Lead
                </label>
                <input
                  value={selectedNode.owner || ''}
                  onChange={(e) => updateNode(selectedNode.id, { owner: e.target.value })}
                  placeholder="e.g. backend-team"
                  style={{
                    width: '100%',
                    height: '28px',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '5px',
                    padding: '0 8px',
                    fontSize: '11.5px',
                    backgroundColor: '#ffffff',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
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
                  outline: 'none',
                }}
              />
            </div>

            {/* Custom Tag Input */}
            <div>
              <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Tech Stack / Tags
              </label>
              <CustomTagInput
                tags={selectedNode.tags || []}
                onChange={(newTags) => updateNode(selectedNode.id, { tags: newTags })}
              />
            </div>

            {/* Subsystem graph drill-down button */}
            <div style={{ paddingTop: '4px' }}>
              <button
                onClick={() => drillIntoNode(selectedNode.id)}
                className="hupa-btn"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <GitFork size={12} color="var(--accent-indigo)" />
                {selectedNode.subGraphId ? 'Enter Subsystem Graph ↗' : 'Encapsulate into Subsystem'}
              </button>
            </div>

            <div style={{ paddingTop: '2px' }}>
              <button
                onClick={() => deleteNode(selectedNode.id)}
                className="hupa-btn danger"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Trash2 size={12} /> Delete Node
              </button>
            </div>
          </div>
        )}

        {/* TAB: RELATIONS */}
        {inspectorTab === 'relations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
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
                      padding: '6px 8px',
                      borderRadius: '5px',
                      backgroundColor: 'var(--surface-subtle)',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '4px',
                      cursor: 'pointer',
                      fontSize: '11.5px',
                      transition: 'background-color 0.1s ease',
                    }}
                    onMouseEnter={(ev) => (ev.currentTarget.style.backgroundColor = 'var(--surface-hover)')}
                    onMouseLeave={(ev) => (ev.currentTarget.style.backgroundColor = 'var(--surface-subtle)')}
                  >
                    <span style={{ fontWeight: 500 }}>{s?.name || e.sourceNodeId}</span>
                    <span style={{ fontSize: '9.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {e.label || e.type}
                    </span>
                  </div>
                );
              })}
              {incomingEdges.length === 0 && (
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '4px 0' }}>
                  No incoming relationships
                </div>
              )}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
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
                      padding: '6px 8px',
                      borderRadius: '5px',
                      backgroundColor: 'var(--surface-subtle)',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '4px',
                      cursor: 'pointer',
                      fontSize: '11.5px',
                      transition: 'background-color 0.1s ease',
                    }}
                    onMouseEnter={(ev) => (ev.currentTarget.style.backgroundColor = 'var(--surface-hover)')}
                    onMouseLeave={(ev) => (ev.currentTarget.style.backgroundColor = 'var(--surface-subtle)')}
                  >
                    <span style={{ fontWeight: 500 }}>{t?.name || e.targetNodeId}</span>
                    <span style={{ fontSize: '9.5px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {e.label || e.type}
                    </span>
                  </div>
                );
              })}
              {outgoingEdges.length === 0 && (
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '4px 0' }}>
                  No outgoing relationships
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: PROPERTIES */}
        {inspectorTab === 'properties' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <CustomFieldsEditor
              properties={selectedNode.properties || {}}
              onChange={(nextProps) => updateNode(selectedNode.id, { properties: nextProps })}
            />
          </div>
        )}

        {/* TAB: DOCUMENTATION */}
        {inspectorTab === 'docs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Architectural Specification
            </div>
            <textarea
              value={selectedNode.documentation || ''}
              onChange={(e) => updateNode(selectedNode.id, { documentation: e.target.value })}
              placeholder="# System Architecture&#10;Write comprehensive markdown documentation, API specifications, RFC notes..."
              rows={12}
              style={{
                width: '100%',
                border: '1px solid var(--border-subtle)',
                borderRadius: '5px',
                padding: '8px',
                fontSize: '11.5px',
                fontFamily: 'var(--font-mono)',
                lineHeight: '1.5',
                resize: 'vertical',
                backgroundColor: '#ffffff',
                outline: 'none',
              }}
            />
          </div>
        )}
      </div>
    </aside>
  );
};
