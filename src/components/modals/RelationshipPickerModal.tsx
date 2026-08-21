import React, { useState, useEffect } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { BUILTIN_RELATIONSHIP_TYPES } from '../../constants/relationshipTypes';
import { GitFork, X, ArrowRight, Check } from 'lucide-react';

export const RelationshipPickerModal: React.FC = () => {
  const {
    isRelationshipPickerOpen,
    relationshipPickerContext,
    closeRelationshipPicker,
    addEdge,
    nodes,
  } = useGraphStore();

  const [selectedType, setSelectedType] = useState<string>('uses');
  const [customLabel, setCustomLabel] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeRelationshipPicker();
      } else if (e.key === 'Enter') {
        handleConfirm();
      }
    };
    if (isRelationshipPickerOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRelationshipPickerOpen, selectedType, customLabel]);

  if (!isRelationshipPickerOpen || !relationshipPickerContext) return null;

  const { sourceNodeId, targetNodeId, sourceHandle, targetHandle } = relationshipPickerContext;
  const sourceNode = nodes[sourceNodeId];
  const targetNode = nodes[targetNodeId];

  if (!sourceNode || !targetNode) return null;

  const handleConfirm = () => {
    addEdge(
      sourceNodeId,
      targetNodeId,
      selectedType,
      customLabel.trim() || undefined,
      sourceHandle,
      targetHandle
    );
    closeRelationshipPicker();
  };

  const handleQuickSelect = (type: string) => {
    addEdge(
      sourceNodeId,
      targetNodeId,
      type,
      customLabel.trim() || undefined,
      sourceHandle,
      targetHandle
    );
    closeRelationshipPicker();
  };

  return (
    <div className="modal-backdrop" onClick={closeRelationshipPicker}>
      <div
        className="glass-panel animate-slide-down"
        style={{
          width: '460px',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '10px',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-xl)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '10px 14px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GitFork size={14} color="var(--indigo)" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>Create Connection</span>
          </div>
          <button onClick={closeRelationshipPicker} className="btn-icon" style={{ width: '22px', height: '22px' }}>
            <X size={13} />
          </button>
        </div>

        {/* Source -> Target banner */}
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '12px',
          }}
        >
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{sourceNode.name}</span>
          <ArrowRight size={12} color="var(--text3)" />
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{targetNode.name}</span>
        </div>

        {/* Relationship Types Grid */}
        <div style={{ padding: '12px 14px', maxHeight: '240px', overflowY: 'auto' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text3)', marginBottom: '6px', textTransform: 'uppercase' }}>
            Choose Relationship Type (Double click for quick connect)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            {Object.values(BUILTIN_RELATIONSHIP_TYPES).map((rel) => {
              const isSelected = selectedType === rel.type;
              return (
                <div
                  key={rel.type}
                  onClick={() => setSelectedType(rel.type)}
                  onDoubleClick={() => handleQuickSelect(rel.type)}
                  style={{
                    padding: '8px 10px',
                    border: `1px solid ${isSelected ? 'var(--indigo)' : 'var(--border)'}`,
                    backgroundColor: isSelected ? 'var(--indigo-light)' : 'var(--bg2)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    transition: 'all 0.1s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: isSelected ? 'var(--indigo)' : 'var(--text)' }}>
                      {rel.label}
                    </span>
                    {isSelected && <Check size={12} color="var(--indigo)" />}
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text2)', lineHeight: '1.2' }}>
                    {rel.description}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Label input & actions */}
        <div
          style={{
            padding: '10px 14px',
            borderTop: '1px solid var(--border)',
            backgroundColor: 'var(--bg2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <input
            placeholder="Custom relationship label (optional)"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            style={{
              flex: 1,
              height: '28px',
              border: '1px solid var(--border)',
              borderRadius: '5px',
              padding: '0 8px',
              fontSize: '11.5px',
              backgroundColor: '#ffffff',
            }}
          />
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={closeRelationshipPicker} className="btn small">
              Cancel
            </button>
            <button onClick={handleConfirm} className="btn small primary">
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
