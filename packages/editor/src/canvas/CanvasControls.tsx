import React from 'react';
import { useGraphStore } from '@hupa/state';
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
    <div className="floating-dock">
      <button
        onClick={undo}
        disabled={undoStack.length === 0}
        className="hupa-btn ghost icon-only"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 size={13} />
      </button>

      <button
        onClick={redo}
        disabled={redoStack.length === 0}
        className="hupa-btn ghost icon-only"
        title="Redo (Ctrl+Shift+Z)"
      >
        <Redo2 size={13} />
      </button>

      <div className="dock-divider" />

      <button onClick={zoomOut} className="hupa-btn ghost icon-only" title="Zoom Out">
        <ZoomOut size={13} />
      </button>

      <button
        onClick={resetZoom}
        className="hupa-btn ghost"
        style={{
          padding: '0 6px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          minWidth: '44px',
        }}
        title="Reset Zoom to 100%"
      >
        {Math.round(transform.zoom * 100)}%
      </button>

      <button onClick={zoomIn} className="hupa-btn ghost icon-only" title="Zoom In">
        <ZoomIn size={13} />
      </button>

      <button onClick={zoomToFit} className="hupa-btn ghost icon-only" title="Fit to Screen (F)">
        <Maximize2 size={13} />
      </button>

      <div className="dock-divider" />

      <button
        onClick={toggleGrid}
        className={`hupa-btn ghost icon-only ${isGridVisible ? 'primary' : ''}`}
        style={{
          backgroundColor: isGridVisible ? '#0f172a' : 'transparent',
          color: isGridVisible ? '#ffffff' : 'var(--text-secondary)',
        }}
        title="Toggle Background Grid (G)"
      >
        <Grid size={13} />
      </button>

      <button
        onClick={toggleSnapToGrid}
        className={`hupa-btn ghost icon-only ${isSnapToGrid ? 'primary' : ''}`}
        style={{
          backgroundColor: isSnapToGrid ? '#0f172a' : 'transparent',
          color: isSnapToGrid ? '#ffffff' : 'var(--text-secondary)',
        }}
        title="Toggle Snap to Grid"
      >
        <Magnet size={13} />
      </button>

      <div className="dock-divider" />

      <button
        onClick={onAutoLayout}
        className="hupa-btn ghost"
        title="Auto-arrange graph layout"
      >
        <Sparkles size={12} color="var(--accent-indigo)" />
        <span>Layout</span>
      </button>

      {selectedNodeIds.length >= 2 && (
        <button
          onClick={() => groupSelectedNodes('New Component Group')}
          className="hupa-btn ghost"
          title="Group selected nodes"
        >
          <FolderPlus size={12} />
          <span>Group ({selectedNodeIds.length})</span>
        </button>
      )}

      <button
        onClick={() => setNewNodeModalOpen(true)}
        className="hupa-btn primary"
        style={{ marginLeft: '2px' }}
      >
        <Plus size={12} />
        <span>Add Node</span>
      </button>
    </div>
  );
};
