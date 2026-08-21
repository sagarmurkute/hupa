import React, { useState, useEffect } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { BUILTIN_NODE_TYPES } from '../../constants/nodeTypes';
import { CustomSelect } from '../common/CustomSelect';
import { CustomTagInput } from '../common/CustomTagInput';
import { Plus, X, Box } from 'lucide-react';
import type { NodeStatus, NodePriority } from '../../types/graph';

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

export const NewNodeModal: React.FC = () => {
  const {
    isNewNodeModalOpen,
    setNewNodeModalOpen,
    addNode,
    transform,
    customNodeTypes,
  } = useGraphStore();

  const [name, setName] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('service');
  const [description, setDescription] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [owner, setOwner] = useState<string>('');
  const [status, setStatus] = useState<NodeStatus>('active');
  const [priority, setPriority] = useState<NodePriority>('medium');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNewNodeModalOpen(false);
      }
    };
    if (isNewNodeModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNewNodeModalOpen, setNewNodeModalOpen]);

  if (!isNewNodeModalOpen) return null;

  const allTypes = { ...BUILTIN_NODE_TYPES, ...customNodeTypes };
  const typeOptions = Object.values(allTypes).map((t) => ({
    value: t.type,
    label: t.label,
    icon: t.icon,
    description: t.description,
  }));

  const handleCreate = () => {
    if (!name.trim()) return;

    const viewportCenterX = (-transform.x + window.innerWidth / 2) / transform.zoom;
    const viewportCenterY = (-transform.y + window.innerHeight / 2) / transform.zoom;

    addNode({
      name: name.trim(),
      type: selectedType,
      description: description.trim(),
      tags,
      owner: owner.trim() || undefined,
      status,
      priority,
      position: {
        x: Math.round(viewportCenterX - 130),
        y: Math.round(viewportCenterY - 55),
      },
    });

    setName('');
    setDescription('');
    setTags([]);
    setOwner('');
    setNewNodeModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setNewNodeModalOpen(false)}>
      <div
        className="modal-dialog"
        style={{
          width: '460px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Box size={15} color="var(--text-primary)" />
            <span style={{ fontSize: '12.5px', fontWeight: 600 }}>Create Architectural Node</span>
          </div>
          <button
            onClick={() => setNewNodeModalOpen(false)}
            className="hupa-btn ghost icon-only"
            style={{ width: '22px', height: '22px' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Modal Form Body */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Node Name */}
          <div>
            <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Node Identifier / Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Auth Service, Postgres Database, API Gateway..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
              style={{
                width: '100%',
                height: '32px',
                padding: '0 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                fontSize: '12.5px',
                fontWeight: 600,
                outline: 'none',
                backgroundColor: '#ffffff',
              }}
            />
          </div>

          {/* Component Type & Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Component Type
              </label>
              <CustomSelect
                value={selectedType}
                options={typeOptions}
                onChange={setSelectedType}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Status
              </label>
              <CustomSelect
                value={status}
                options={STATUS_OPTIONS}
                onChange={(val) => setStatus(val as NodeStatus)}
              />
            </div>
          </div>

          {/* Priority & Owner */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Priority
              </label>
              <CustomSelect
                value={priority}
                options={PRIORITY_OPTIONS}
                onChange={(val) => setPriority(val as NodePriority)}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Owner / Lead
              </label>
              <input
                type="text"
                placeholder="e.g. backend-team, @alex"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                style={{
                  width: '100%',
                  height: '28px',
                  padding: '0 8px',
                  borderRadius: '5px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '11.5px',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Description
            </label>
            <textarea
              placeholder="Architectural role and functionality..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              style={{
                width: '100%',
                padding: '6px 8px',
                borderRadius: '5px',
                border: '1px solid var(--border-subtle)',
                fontSize: '11.5px',
                outline: 'none',
                backgroundColor: '#ffffff',
                resize: 'none',
                lineHeight: '1.4',
              }}
            />
          </div>

          {/* Tech Stack / Tags */}
          <div>
            <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Tech Stack / Tags
            </label>
            <CustomTagInput
              tags={tags}
              onChange={setTags}
              placeholder="Type tag (e.g. react, postgres) & press Enter"
            />
          </div>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '6px',
              marginTop: '4px',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '12px',
            }}
          >
            <button onClick={() => setNewNodeModalOpen(false)} className="hupa-btn">
              Cancel
            </button>
            <button onClick={handleCreate} disabled={!name.trim()} className="hupa-btn primary">
              <Plus size={12} /> Place Node
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
