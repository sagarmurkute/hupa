import React, { useState } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { BUILTIN_RELATIONSHIP_TYPES } from '../../constants/relationshipTypes';
import { GitFork, X, ArrowRight } from 'lucide-react';

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

  return (
    <div className="modal-backdrop" onClick={closeRelationshipPicker}>
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
            <GitFork size={16} color="#09090b" />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Create Relationship</span>
          </div>
          <button onClick={closeRelationshipPicker} className="btn-icon" style={{ width: '24px', height: '24px' }}>
            <X size={15} />
          </button>
        </div>

        {/* Source -> Target banner */}
        <div
          style={{
            padding: '12px 18px',
            backgroundColor: '#f4f4f5',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
            {sourceNode.name}
          </span>
          <ArrowRight size={14} color="#09090b" />
          <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
            {targetNode.name}
          </span>
        </div>

        {/* Relationship Types Grid */}
        <div style={{ padding: '16px 18px', maxHeight: '300px', overflowY: 'auto' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
            Select Relationship Type
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {Object.values(BUILTIN_RELATIONSHIP_TYPES).map((rel) => {
              const isSelected = selectedType === rel.type;
              return (
                <div
                  key={rel.type}
                  onClick={() => setSelectedType(rel.type)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: `1.5px solid ${isSelected ? '#09090b' : 'var(--border-subtle)'}`,
                    backgroundColor: isSelected ? '#09090b' : '#ffffff',
                    color: isSelected ? '#ffffff' : 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: isSelected ? '#ffffff' : '#09090b',
                      }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: isSelected ? '#ffffff' : 'var(--text-primary)' }}>
                      {rel.label}
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', color: isSelected ? '#d4d4d8' : 'var(--text-muted)', lineHeight: '1.3' }}>
                    {rel.description}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Optional Custom Label */}
          <div style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
              Custom Edge Label (Optional)
            </label>
            <input
              type="text"
              placeholder={`Default: ${selectedType}`}
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--border-default)',
                fontSize: '12px',
              }}
            />
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
          <button onClick={closeRelationshipPicker} className="btn">
            Cancel
          </button>
          <button onClick={handleConfirm} className="btn btn-primary">
            Create Relationship
          </button>
        </div>
      </div>
    </div>
  );
};
