import React, { useState, useEffect } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { Zap, X, Plus } from 'lucide-react';
import type { NodeCategory } from '../../types/graph';
import { CATEGORY_LABELS } from '../../constants/nodeTypes';
import { CustomSelect } from '../common/CustomSelect';

const LINE_STYLE_OPTIONS = [
  { value: 'solid', label: 'Solid (Strong Structural)', badge: 'SYNC' },
  { value: 'dashed', label: 'Dashed (Async / Event)', badge: 'ASYNC' },
  { value: 'dotted', label: 'Dotted (Referential / Weak)', badge: 'REF' },
];

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
  const [color, setColor] = useState('#0f172a');
  const [description, setDescription] = useState('');

  // Relation type state
  const [relName, setRelName] = useState('');
  const [relColor, setRelColor] = useState('#0f172a');
  const [lineStyle, setLineStyle] = useState<'solid' | 'dashed' | 'dotted'>('solid');
  const [relDescription, setRelDescription] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCustomTypeModalOpen(false);
      }
    };
    if (isCustomTypeModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isCustomTypeModalOpen, setCustomTypeModalOpen]);

  if (!isCustomTypeModalOpen) return null;

  const categoryOptions = Object.entries(CATEGORY_LABELS).map(([catKey, catLabel]) => ({
    value: catKey,
    label: catLabel,
  }));

  const handleCreateNodeType = () => {
    if (!typeName.trim()) return;
    const typeKey = `custom-${typeName.trim().toLowerCase().replace(/\s+/g, '-')}`;
    addCustomNodeType({
      type: typeKey,
      label: typeName.trim(),
      category,
      color,
      badgeBg: '#f1f5f9',
      borderColor: color,
      icon: 'Box',
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
    <div className="modal-overlay" onClick={() => setCustomTypeModalOpen(false)}>
      <div
        className="modal-dialog"
        style={{
          width: '500px',
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
            <Zap size={15} color="var(--text-primary)" />
            <span style={{ fontSize: '12.5px', fontWeight: 600 }}>Custom Types Builder</span>
          </div>
          <button
            onClick={() => setCustomTypeModalOpen(false)}
            className="hupa-btn ghost icon-only"
            style={{ width: '22px', height: '22px' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 16px', backgroundColor: '#ffffff' }}>
          <button
            onClick={() => setActiveTab('node')}
            style={{
              padding: '8px 12px',
              border: 'none',
              background: 'none',
              fontSize: '12px',
              fontWeight: activeTab === 'node' ? 600 : 500,
              color: activeTab === 'node' ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: `2px solid ${activeTab === 'node' ? '#0f172a' : 'transparent'}`,
              cursor: 'pointer',
            }}
          >
            Custom Node Type
          </button>
          <button
            onClick={() => setActiveTab('relation')}
            style={{
              padding: '8px 12px',
              border: 'none',
              background: 'none',
              fontSize: '12px',
              fontWeight: activeTab === 'relation' ? 600 : 500,
              color: activeTab === 'relation' ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: `2px solid ${activeTab === 'relation' ? '#0f172a' : 'transparent'}`,
              cursor: 'pointer',
            }}
          >
            Custom Relationship Type
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeTab === 'node' ? (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '3px' }}>
                  Node Type Label *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Queue Consumer, Vault Secret, Lambda Function..."
                  value={typeName}
                  onChange={(e) => setTypeName(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '5px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                    fontWeight: 600,
                    outline: 'none',
                    backgroundColor: '#ffffff',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '3px' }}>
                    Category
                  </label>
                  <CustomSelect
                    value={category}
                    options={categoryOptions}
                    onChange={(val) => setCategory(val as NodeCategory)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '3px' }}>
                    Color Accent
                  </label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{
                      width: '100%',
                      height: '28px',
                      padding: '2px 4px',
                      borderRadius: '5px',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      backgroundColor: '#ffffff',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '3px' }}>
                  Description
                </label>
                <textarea
                  placeholder="Architectural role of this custom type..."
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
                    resize: 'none',
                    backgroundColor: '#ffffff',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '6px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                <button onClick={() => setCustomTypeModalOpen(false)} className="hupa-btn">
                  Cancel
                </button>
                <button onClick={handleCreateNodeType} disabled={!typeName.trim()} className="hupa-btn primary">
                  <Plus size={12} /> Register Node Type
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '3px' }}>
                  Relationship Label *
                </label>
                <input
                  type="text"
                  placeholder="e.g. encrypts, proxies, synchronizes-with..."
                  value={relName}
                  onChange={(e) => setRelName(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '5px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '12px',
                    fontWeight: 600,
                    outline: 'none',
                    backgroundColor: '#ffffff',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '3px' }}>
                    Line Style
                  </label>
                  <CustomSelect
                    value={lineStyle}
                    options={LINE_STYLE_OPTIONS}
                    onChange={(val) => setLineStyle(val as any)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '3px' }}>
                    Color
                  </label>
                  <input
                    type="color"
                    value={relColor}
                    onChange={(e) => setRelColor(e.target.value)}
                    style={{
                      width: '100%',
                      height: '28px',
                      padding: '2px 4px',
                      borderRadius: '5px',
                      border: '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      backgroundColor: '#ffffff',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '3px' }}>
                  Description
                </label>
                <textarea
                  placeholder="Semantic meaning of this relation..."
                  value={relDescription}
                  onChange={(e) => setRelDescription(e.target.value)}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '5px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '11.5px',
                    outline: 'none',
                    resize: 'none',
                    backgroundColor: '#ffffff',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '6px', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                <button onClick={() => setCustomTypeModalOpen(false)} className="hupa-btn">
                  Cancel
                </button>
                <button onClick={handleCreateRelType} disabled={!relName.trim()} className="hupa-btn primary">
                  <Plus size={12} /> Register Relationship
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
