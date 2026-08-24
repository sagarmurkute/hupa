import React, { useEffect, useRef } from 'react';
import { useGraphStore } from '@hupa/state';
import { BUILTIN_RELATIONSHIP_TYPES } from '@hupa/shared';
import {
  GitFork,
  Copy,
  Trash2,
  Sparkles,
  Maximize2,
  Plus,
  Edit,
  FolderPlus,
  ArrowLeftRight,
} from 'lucide-react';

export interface ContextMenuState {
  isOpen: boolean;
  type: 'node' | 'edge' | 'canvas';
  x: number;
  y: number;
  targetId?: string;
}

interface ContextMenuProps {
  menuState: ContextMenuState;
  onClose: () => void;
  onAutoLayout: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  menuState,
  onClose,
  onAutoLayout,
}) => {
  const {
    nodes,
    edges,
    selectedNodeIds,
    deleteNode,
    deleteEdge,
    updateEdge,
    duplicateSelectedNodes,
    drillIntoNode,
    groupSelectedNodes,
    setNewNodeModalOpen,
    zoomToFit,
    setInspectorOpen,
    setInspectorTab,
    addNode,
    addEdge,
  } = useGraphStore();

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as HTMLElement)) {
        onClose();
      }
    };
    if (menuState.isOpen) {
      window.addEventListener('mousedown', handleClickOutside);
    }
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [menuState.isOpen, onClose]);

  if (!menuState.isOpen) return null;

  const targetNode = menuState.targetId ? nodes[menuState.targetId] : null;
  const targetEdge = menuState.targetId ? edges[menuState.targetId] : null;

  return (
    <div
      ref={menuRef}
      className="glass-panel animate-slide-down"
      style={{
        position: 'fixed',
        left: `${Math.min(menuState.x, window.innerWidth - 220)}px`,
        top: `${Math.min(menuState.y, window.innerHeight - 340)}px`,
        width: '210px',
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(16px)',
        padding: '5px',
        zIndex: 100,
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        borderRadius: '8px',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {/* Node Context Menu */}
      {menuState.type === 'node' && targetNode && (
        <>
          <div
            style={{
              padding: '6px 8px',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              borderBottom: '1px solid var(--border-subtle)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {targetNode.name}
          </div>

          <button
            onClick={() => {
              drillIntoNode(targetNode.id);
              onClose();
            }}
            className="hupa-btn ghost small"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <GitFork size={12} color="var(--accent-indigo)" /> Drill into Subsystem ↗
          </button>

          <button
            onClick={() => {
              const newChildId = addNode({
                name: `${targetNode.name} Child`,
                type: targetNode.type,
                position: { x: targetNode.position.x + 40, y: targetNode.position.y + 120 },
              });
              addEdge(targetNode.id, newChildId, 'contains', 'contains');
              onClose();
            }}
            className="hupa-btn ghost small"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Plus size={12} /> Create Child Node
          </button>

          <button
            onClick={() => {
              setInspectorOpen(true);
              setInspectorTab('overview');
              onClose();
            }}
            className="hupa-btn ghost small"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Edit size={12} /> Inspect Properties
          </button>

          <button
            onClick={() => {
              duplicateSelectedNodes();
              onClose();
            }}
            className="hupa-btn ghost small"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Copy size={12} /> Duplicate Node
          </button>

          {selectedNodeIds.length >= 2 && (
            <button
              onClick={() => {
                groupSelectedNodes('New Component Group');
                onClose();
              }}
              className="hupa-btn ghost small"
              style={{ width: '100%', justifyContent: 'flex-start' }}
            >
              <FolderPlus size={12} /> Group Selected ({selectedNodeIds.length})
            </button>
          )}

          <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '2px 0' }} />

          <button
            onClick={() => {
              deleteNode(targetNode.id);
              onClose();
            }}
            className="hupa-btn ghost small danger"
            style={{ width: '100%', justifyContent: 'flex-start', color: '#e11d48' }}
          >
            <Trash2 size={12} /> Delete Node
          </button>
        </>
      )}

      {/* Edge Context Menu */}
      {menuState.type === 'edge' && targetEdge && (
        <>
          <div
            style={{
              padding: '6px 8px',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-muted)',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            Relationship: {targetEdge.label || targetEdge.type}
          </div>

          <button
            onClick={() => {
              updateEdge(targetEdge.id, {
                sourceNodeId: targetEdge.targetNodeId,
                targetNodeId: targetEdge.sourceNodeId,
              });
              onClose();
            }}
            className="hupa-btn ghost small"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <ArrowLeftRight size={12} /> Swap Direction
          </button>

          <div style={{ padding: '4px 8px', fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Set Relation Type
          </div>

          <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1px' }}>
            {Object.values(BUILTIN_RELATIONSHIP_TYPES).slice(0, 8).map((rel) => (
              <button
                key={rel.type}
                onClick={() => {
                  updateEdge(targetEdge.id, {
                    type: rel.type,
                    label: rel.label,
                    color: rel.color,
                  });
                  onClose();
                }}
                className="hupa-btn ghost small"
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  fontWeight: targetEdge.type === rel.type ? 600 : 400,
                  fontSize: '11px',
                  padding: '3px 8px',
                }}
              >
                <span>{rel.label}</span>
                {targetEdge.type === rel.type && <span>•</span>}
              </button>
            ))}
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '2px 0' }} />

          <button
            onClick={() => {
              deleteEdge(targetEdge.id);
              onClose();
            }}
            className="hupa-btn ghost small danger"
            style={{ width: '100%', justifyContent: 'flex-start', color: '#e11d48' }}
          >
            <Trash2 size={12} /> Delete Relationship
          </button>
        </>
      )}

      {/* Canvas Context Menu */}
      {menuState.type === 'canvas' && (
        <>
          <button
            onClick={() => {
              setNewNodeModalOpen(true);
              onClose();
            }}
            className="hupa-btn ghost small"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Plus size={12} /> Create Node Here
          </button>

          {selectedNodeIds.length >= 2 && (
            <button
              onClick={() => {
                groupSelectedNodes('New Component Group');
                onClose();
              }}
              className="hupa-btn ghost small"
              style={{ width: '100%', justifyContent: 'flex-start' }}
            >
              <FolderPlus size={12} /> Group Selected ({selectedNodeIds.length})
            </button>
          )}

          <button
            onClick={() => {
              onAutoLayout();
              onClose();
            }}
            className="hupa-btn ghost small"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Sparkles size={12} color="var(--accent-indigo)" /> Auto-Layout Graph
          </button>

          <button
            onClick={() => {
              zoomToFit();
              onClose();
            }}
            className="hupa-btn ghost small"
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Maximize2 size={12} /> Fit to Screen
          </button>
        </>
      )}
    </div>
  );
};
