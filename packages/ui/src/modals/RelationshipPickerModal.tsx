import React, { useState, useEffect, useCallback } from 'react';
import { useGraphStore } from '@hupa/state';
import { BUILTIN_RELATIONSHIP_TYPES } from '@hupa/shared';
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

  const handleConfirm = useCallback(() => {
    if (!relationshipPickerContext) return;
    const { sourceNodeId, targetNodeId, sourceHandle, targetHandle } = relationshipPickerContext;
    addEdge(
      sourceNodeId,
      targetNodeId,
      selectedType,
      customLabel.trim() || undefined,
      sourceHandle,
      targetHandle
    );
    closeRelationshipPicker();
  }, [relationshipPickerContext, selectedType, customLabel, addEdge, closeRelationshipPicker]);

  const handleQuickSelect = useCallback((type: string) => {
    if (!relationshipPickerContext) return;
    const { sourceNodeId, targetNodeId, sourceHandle, targetHandle } = relationshipPickerContext;
    addEdge(
      sourceNodeId,
      targetNodeId,
      type,
      customLabel.trim() || undefined,
      sourceHandle,
      targetHandle
    );
    closeRelationshipPicker();
  }, [relationshipPickerContext, customLabel, addEdge, closeRelationshipPicker]);

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
  }, [isRelationshipPickerOpen, closeRelationshipPicker, handleConfirm]);

  if (!isRelationshipPickerOpen || !relationshipPickerContext) return null;

  const { sourceNodeId, targetNodeId } = relationshipPickerContext;
  const sourceNode = nodes[sourceNodeId];
  const targetNode = nodes[targetNodeId];

  if (!sourceNode || !targetNode) return null;

  return (
    <div className="modal-overlay" onClick={closeRelationshipPicker}>
      <div
        className="modal-dialog"
        style={{
          width: '480px',
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
            <GitFork size={15} color="var(--accent-indigo)" />
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Create Semantic Relationship
            </span>
          </div>
          <button
            onClick={closeRelationshipPicker}
            className="hupa-btn ghost icon-only"
            style={{ width: '22px', height: '22px' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Source -> Target banner */}
        <div
          style={{
            padding: '10px 16px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            fontSize: '12px',
          }}
        >
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{sourceNode.name}</span>
          <ArrowRight size={13} color="var(--text-muted)" />
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{targetNode.name}</span>
        </div>

        {/* Relationship Types Grid */}
        <div style={{ padding: '14px 16px', maxHeight: '250px', overflowY: 'auto' }}>
          <div style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
            Select Relationship (Double click to quickly connect)
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
                    border: `1px solid ${isSelected ? '#0f172a' : 'var(--border-subtle)'}`,
                    backgroundColor: isSelected ? 'var(--surface-subtle)' : '#ffffff',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    boxShadow: isSelected ? '0 0 0 1px #0f172a' : 'none',
                    transition: 'all 0.1s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {rel.label}
                    </span>
                    {isSelected && <Check size={13} color="#0f172a" />}
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', lineHeight: '1.25' }}>
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
            padding: '12px 16px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--surface-subtle)',
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
              border: '1px solid var(--border-subtle)',
              borderRadius: '5px',
              padding: '0 8px',
              fontSize: '11.5px',
              backgroundColor: '#ffffff',
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={closeRelationshipPicker} className="hupa-btn">
              Cancel
            </button>
            <button onClick={handleConfirm} className="hupa-btn primary">
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
