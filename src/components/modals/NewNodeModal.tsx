import React, { useState } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { BUILTIN_NODE_TYPES, CATEGORY_LABELS } from '../../constants/nodeTypes';
import { DynamicIcon } from '../common/DynamicIcon';
import { Plus, X, Box } from 'lucide-react';
import type { NodeStatus, NodePriority } from '../../types/graph';

export const NewNodeModal: React.FC = () => {
  const {
    isNewNodeModalOpen,
    setNewNodeModalOpen,
    addNode,
    transform,
    customNodeTypes,
  } = useGraphStore();

  const [selectedType, setSelectedType] = useState<string>('service');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<NodeStatus>('planned');
  const [priority, setPriority] = useState<NodePriority>('medium');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  if (!isNewNodeModalOpen) return null;

  const allTypes = { ...BUILTIN_NODE_TYPES, ...customNodeTypes };

  const filteredTypes = Object.values(allTypes).filter((t) => {
    if (categoryFilter === 'all') return true;
    return t.category === categoryFilter;
  });

  const handleCreate = () => {
    if (!name.trim()) return;

    const viewportCenterX = (-transform.x + window.innerWidth / 2) / transform.zoom;
    const viewportCenterY = (-transform.y + window.innerHeight / 2) / transform.zoom;

    addNode({
      name: name.trim(),
      type: selectedType,
      description: description.trim(),
      status,
      priority,
      position: {
        x: Math.round(viewportCenterX - 100),
        y: Math.round(viewportCenterY - 50),
      },
    });

    setName('');
    setDescription('');
    setNewNodeModalOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => setNewNodeModalOpen(false)}>
      <div
        className="glass-panel animate-slide-down"
        style={{
          width: '580px',
          maxHeight: '520px',
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
            <Box size={16} color="#09090b" />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Create New Node</span>
          </div>
          <button onClick={() => setNewNodeModalOpen(false)} className="btn-icon" style={{ width: '24px', height: '24px' }}>
            <X size={15} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '16px 18px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Node Type Category Filter Tabs */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Category
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              <button
                onClick={() => setCategoryFilter('all')}
                className={`btn ${categoryFilter === 'all' ? 'btn-primary' : ''}`}
                style={{ padding: '2px 8px', fontSize: '11px' }}
              >
                All Types
              </button>
              {Object.entries(CATEGORY_LABELS).map(([catKey, catLabel]) => (
                <button
                  key={catKey}
                  onClick={() => setCategoryFilter(catKey)}
                  className={`btn ${categoryFilter === catKey ? 'btn-primary' : ''}`}
                  style={{ padding: '2px 8px', fontSize: '11px' }}
                >
                  {catLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Type Selection Grid */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Select Node Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', maxHeight: '140px', overflowY: 'auto', padding: '2px' }}>
              {filteredTypes.map((t) => {
                const isSelected = selectedType === t.type;
                return (
                  <div
                    key={t.type}
                    onClick={() => setSelectedType(t.type)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: `1.5px solid ${isSelected ? '#09090b' : 'var(--border-subtle)'}`,
                      backgroundColor: isSelected ? '#09090b' : '#ffffff',
                      color: isSelected ? '#ffffff' : 'var(--text-primary)',
                      cursor: 'pointer',
                      fontSize: '11.5px',
                      fontWeight: isSelected ? 600 : 500,
                    }}
                  >
                    <DynamicIcon name={t.icon || 'Box'} size={13} color={isSelected ? '#ffffff' : '#09090b'} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Node Name */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
              Node Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Authentication Service, LLM Router, Payment Gateway..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-default)',
                fontSize: '13px',
                fontWeight: 500,
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Summary of architectural responsibility..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-default)',
                fontSize: '12px',
                resize: 'none',
              }}
            />
          </div>

          {/* Status and Priority */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as NodeStatus)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-default)',
                  fontSize: '12px',
                  backgroundColor: '#ffffff',
                }}
              >
                {['concept', 'planned', 'in-progress', 'active', 'completed', 'blocked'].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as NodePriority)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-default)',
                  fontSize: '12px',
                  backgroundColor: '#ffffff',
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
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 18px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
          }}
        >
          <button onClick={() => setNewNodeModalOpen(false)} className="btn">
            Cancel
          </button>
          <button onClick={handleCreate} disabled={!name.trim()} className="btn btn-primary">
            <Plus size={14} /> Create Node
          </button>
        </div>
      </div>
    </div>
  );
};
