import React, { useEffect, useRef } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import {
  GitFork,
  Copy,
  Trash2,
  Sparkles,
  Maximize2,
  Plus,
  Edit,
  FolderPlus,
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
    selectedNodeIds,
    deleteNode,
    deleteEdge,
    duplicateSelectedNodes,
    drillIntoNode,
    groupSelectedNodes,
    setNewNodeModalOpen,
    zoomToFit,
    setInspectorOpen,
    setInspectorTab,
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

  return (
    <div
      ref={menuRef}
      className="glass-panel animate-slide-down"
      style={{
        position: 'fixed',
        left: `${Math.min(menuState.x, window.innerWidth - 200)}px`,
        top: `${Math.min(menuState.y, window.innerHeight - 260)}px`,
        width: '190px',
        backgroundColor: '#ffffff',
        padding: '4px',
        zIndex: 100,
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      }}
    >
      {/* Node Context Menu */}
      {menuState.type === 'node' && targetNode && (
        <>
          <div style={{ padding: '6px 8px', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)' }}>
            {targetNode.name}
          </div>

          <button
            onClick={() => {
              drillIntoNode(targetNode.id);
              onClose();
            }}
            className="btn"
            style={{ width: '100%', justifyContent: 'flex-start', border: 'none', padding: '6px 8px' }}
          >
            <GitFork size={13} color="#09090b" /> Drill into Subsystem
          </button>

          <button
            onClick={() => {
              setInspectorOpen(true);
              setInspectorTab('overview');
              onClose();
            }}
            className="btn"
            style={{ width: '100%', justifyContent: 'flex-start', border: 'none', padding: '6px 8px' }}
          >
            <Edit size={13} /> Inspect Properties
          </button>

          <button
            onClick={() => {
              duplicateSelectedNodes();
              onClose();
            }}
            className="btn"
            style={{ width: '100%', justifyContent: 'flex-start', border: 'none', padding: '6px 8px' }}
          >
            <Copy size={13} /> Duplicate Node
          </button>

          {selectedNodeIds.length >= 2 && (
            <button
              onClick={() => {
                groupSelectedNodes('New Component Group');
                onClose();
              }}
              className="btn"
              style={{ width: '100%', justifyContent: 'flex-start', border: 'none', padding: '6px 8px' }}
            >
              <FolderPlus size={13} /> Group Selected ({selectedNodeIds.length})
            </button>
          )}

          <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)', margin: '2px 0' }} />

          <button
            onClick={() => {
              deleteNode(targetNode.id);
              onClose();
            }}
            className="btn"
            style={{ width: '100%', justifyContent: 'flex-start', border: 'none', padding: '6px 8px', color: '#71717a' }}
          >
            <Trash2 size={13} /> Delete Node
          </button>
        </>
      )}

      {/* Edge Context Menu */}
      {menuState.type === 'edge' && (
        <>
          <button
            onClick={() => {
              if (menuState.targetId) deleteEdge(menuState.targetId);
              onClose();
            }}
            className="btn"
            style={{ width: '100%', justifyContent: 'flex-start', border: 'none', padding: '6px 8px', color: '#71717a' }}
          >
            <Trash2 size={13} /> Delete Relationship
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
            className="btn"
            style={{ width: '100%', justifyContent: 'flex-start', border: 'none', padding: '6px 8px' }}
          >
            <Plus size={13} color="#09090b" /> Create Node
          </button>

          {selectedNodeIds.length >= 2 && (
            <button
              onClick={() => {
                groupSelectedNodes('New Component Group');
                onClose();
              }}
              className="btn"
              style={{ width: '100%', justifyContent: 'flex-start', border: 'none', padding: '6px 8px' }}
            >
              <FolderPlus size={13} /> Group Selected ({selectedNodeIds.length})
            </button>
          )}

          <button
            onClick={() => {
              onAutoLayout();
              onClose();
            }}
            className="btn"
            style={{ width: '100%', justifyContent: 'flex-start', border: 'none', padding: '6px 8px' }}
          >
            <Sparkles size={13} color="#09090b" /> Auto-Layout Graph
          </button>

          <button
            onClick={() => {
              zoomToFit();
              onClose();
            }}
            className="btn"
            style={{ width: '100%', justifyContent: 'flex-start', border: 'none', padding: '6px 8px' }}
          >
            <Maximize2 size={13} /> Fit to Screen
          </button>
        </>
      )}
    </div>
  );
};
