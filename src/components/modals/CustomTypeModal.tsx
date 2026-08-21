import React, { useState } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { Zap, X, Plus } from 'lucide-react';
import type { NodeCategory } from '../../types/graph';
import { CATEGORY_LABELS } from '../../constants/nodeTypes';

export const CustomTypeModal: React.FC = () => {
  const {
    isCustomTypeModalOpen,
    setCustomTypeModalOpen,
    addCustomNodeType,
    addCustomRelationshipType,
  } = useGraphStore();

  const [activeTab, setActiveTab] = useState<'node' | 'relation'>('node');

  // Node type state
  const [typeName, setTypeName] = useState('');
  const [category, setCategory] = useState<NodeCategory>('custom');
  const [color, setColor] = useState('#09090b');
  const [description, setDescription] = useState('');

  // Relation type state
  const [relName, setRelName] = useState('');
  const [relColor, setRelColor] = useState('#09090b');
  const [lineStyle, setLineStyle] = useState<'solid' | 'dashed' | 'dotted'>('solid');
  const [relDescription, setRelDescription] = useState('');

  if (!isCustomTypeModalOpen) return null;

  const handleCreateNodeType = () => {
    if (!typeName.trim()) return;
    const typeKey = `custom-${typeName.trim().toLowerCase().replace(/\s+/g, '-')}`;
    addCustomNodeType({
      type: typeKey,
      label: typeName.trim(),
      category,
      color,
      badgeBg: '#f4f4f5',
      borderColor: color,
      icon: 'Boxes',
      description: description.trim() || 'Custom user-defined primitive',
    });
    setTypeName('');
    setDescription('');
    setCustomTypeModalOpen(false);
  };

  const handleCreateRelType = () => {
    if (!relName.trim()) return;
    const relKey = `custom-${relName.trim().toLowerCase().replace(/\s+/g, '-')}`;
    addCustomRelationshipType({
      type: relKey,
      label: relName.trim(),
      color: relColor,
      lineStyle,
      description: relDescription.trim() || 'Custom semantic relationship',
    });
    setRelName('');
    setRelDescription('');
    setCustomTypeModalOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => setCustomTypeModalOpen(false)}>
      <div
        className="glass-panel animate-slide-down"
        style={{
          width: '520px',
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
            <Zap size={16} color="#09090b" />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Custom Types Builder</span>
          </div>
          <button onClick={() => setCustomTypeModalOpen(false)} className="btn-icon" style={{ width: '24px', height: '24px' }}>
            <X size={15} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 18px' }}>
          <button
            onClick={() => setActiveTab('node')}
            style={{
              padding: '10px 14px',
              border: 'none',
              background: 'none',
              fontSize: '12px',
              fontWeight: activeTab === 'node' ? 600 : 500,
              color: activeTab === 'node' ? '#09090b' : 'var(--text-secondary)',
              borderBottom: `2px solid ${activeTab === 'node' ? '#09090b' : 'transparent'}`,
              cursor: 'pointer',
            }}
          >
            Custom Node Type
          </button>
          <button
            onClick={() => setActiveTab('relation')}
            style={{
              padding: '10px 14px',
              border: 'none',
              background: 'none',
              fontSize: '12px',
              fontWeight: activeTab === 'relation' ? 600 : 500,
              color: activeTab === 'relation' ? '#09090b' : 'var(--text-secondary)',
              borderBottom: `2px solid ${activeTab === 'relation' ? '#09090b' : 'transparent'}`,
              cursor: 'pointer',
            }}
          >
            Custom Relationship Type
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {activeTab === 'node' ? (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Node Type Label *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Game Character, Hardware Pin, Compiler Stage..."
                  value={typeName}
                  onChange={(e) => setTypeName(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-default)',
                    fontSize: '12px',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as NodeCategory)}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-default)',
                      fontSize: '12px',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
                      <option key={k} value={k}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Accent Shade
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      style={{ width: '32px', height: '32px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                    />
                    <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}>{color}</span>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Purpose of this domain primitive..."
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
            </>
          ) : (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Relationship Verb / Label *
                </label>
                <input
                  type="text"
                  placeholder="e.g. spawns, executes, compiles-to, encrypts..."
                  value={relName}
                  onChange={(e) => setRelName(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-default)',
                    fontSize: '12px',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Line Style
                  </label>
                  <select
                    value={lineStyle}
                    onChange={(e) => setLineStyle(e.target.value as any)}
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-default)',
                      fontSize: '12px',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <option value="solid">Solid Line</option>
                    <option value="dashed">Dashed Line</option>
                    <option value="dotted">Dotted Line</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Edge Shade
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="color"
                      value={relColor}
                      onChange={(e) => setRelColor(e.target.value)}
                      style={{ width: '32px', height: '32px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                    />
                    <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}>{relColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Semantic meaning of this relationship..."
                  value={relDescription}
                  onChange={(e) => setRelDescription(e.target.value)}
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
            </>
          )}
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
          <button onClick={() => setCustomTypeModalOpen(false)} className="btn">
            Cancel
          </button>
          <button
            onClick={activeTab === 'node' ? handleCreateNodeType : handleCreateRelType}
            className="btn btn-primary"
          >
            <Plus size={14} /> Add Definition
          </button>
        </div>
      </div>
    </div>
  );
};
