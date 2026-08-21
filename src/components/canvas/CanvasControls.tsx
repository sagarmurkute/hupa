import React from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  Magnet,
  Plus,
  Sparkles,
  Undo2,
  Redo2,
  FolderPlus,
} from 'lucide-react';

interface CanvasControlsProps {
  onAutoLayout: () => void;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({ onAutoLayout }) => {
  const {
    transform,
    zoomIn,
    zoomOut,
    resetZoom,
    zoomToFit,
    isGridVisible,
    toggleGrid,
    isSnapToGrid,
    toggleSnapToGrid,
    setNewNodeModalOpen,
    selectedNodeIds,
    groupSelectedNodes,
    undo,
    redo,
    undoStack,
    redoStack,
  } = useGraphStore();

  return (
    <div
      className="glass-panel"
      style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '4px 8px',
        zIndex: 35,
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      <button
        onClick={undo}
        disabled={undoStack.length === 0}
        className="btn-icon"
        title="Undo (Ctrl+Z)"
        style={{ opacity: undoStack.length === 0 ? 0.4 : 1 }}
      >
        <Undo2 size={15} />
      </button>

      <button
        onClick={redo}
        disabled={redoStack.length === 0}
        className="btn-icon"
        title="Redo (Ctrl+Shift+Z)"
        style={{ opacity: redoStack.length === 0 ? 0.4 : 1 }}
      >
        <Redo2 size={15} />
      </button>

      <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)', margin: '0 4px' }} />

      <button onClick={zoomOut} className="btn-icon" title="Zoom Out (Scroll Down)">
        <ZoomOut size={15} />
      </button>

      <button
        onClick={resetZoom}
        className="btn"
        style={{
          padding: '2px 6px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          minWidth: '46px',
        }}
        title="Reset Zoom to 100%"
      >
        {Math.round(transform.zoom * 100)}%
      </button>

      <button onClick={zoomIn} className="btn-icon" title="Zoom In (Scroll Up)">
        <ZoomIn size={15} />
      </button>

      <button onClick={zoomToFit} className="btn-icon" title="Fit to Screen (F)">
        <Maximize2 size={15} />
      </button>

      <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)', margin: '0 4px' }} />

      <button
        onClick={toggleGrid}
        className={`btn-icon ${isGridVisible ? 'active' : ''}`}
        title="Toggle Grid (G)"
      >
        <Grid size={15} />
      </button>

      <button
        onClick={toggleSnapToGrid}
        className={`btn-icon ${isSnapToGrid ? 'active' : ''}`}
        title="Toggle Snap to Grid"
      >
        <Magnet size={15} />
      </button>

      <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)', margin: '0 4px' }} />

      <button
        onClick={onAutoLayout}
        className="btn"
        style={{ gap: '4px', fontSize: '11px', padding: '4px 8px' }}
        title="Auto-arrange graph layout"
      >
        <Sparkles size={13} color="#09090b" />
        <span>Layout</span>
      </button>

      {selectedNodeIds.length >= 2 && (
        <button
          onClick={() => groupSelectedNodes('New Component Group')}
          className="btn"
          style={{ gap: '4px', fontSize: '11px', padding: '4px 8px' }}
          title="Group selected nodes"
        >
          <FolderPlus size={13} />
          <span>Group ({selectedNodeIds.length})</span>
        </button>
      )}

      <button
        onClick={() => setNewNodeModalOpen(true)}
        className="btn btn-primary"
        style={{ gap: '4px', fontSize: '11px', padding: '4px 10px', marginLeft: '4px' }}
      >
        <Plus size={14} />
        <span>Add Node</span>
      </button>
    </div>
  );
};
