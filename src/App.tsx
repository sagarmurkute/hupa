import React, { useEffect, useState, useCallback } from 'react';
import { useGraphStore } from './store/useGraphStore';
import { TopBar } from './components/layout/TopBar';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { GraphCanvas } from './components/canvas/GraphCanvas';
import { NodeInspector } from './components/inspector/NodeInspector';
import { StatusBar } from './components/layout/StatusBar';
import { CommandPalette } from './components/modals/CommandPalette';
import { RelationshipPickerModal } from './components/modals/RelationshipPickerModal';
import { NewNodeModal } from './components/modals/NewNodeModal';
import { NewProjectModal } from './components/modals/NewProjectModal';
import { CustomTypeModal } from './components/modals/CustomTypeModal';
import { ExportImportModal } from './components/modals/ExportImportModal';
import { StatsModal } from './components/modals/StatsModal';
import { ShortcutsModal } from './components/modals/ShortcutsModal';
import { ContextMenu } from './components/modals/ContextMenu';
import type { ContextMenuState } from './components/modals/ContextMenu';
import { computeAutoLayout } from './utils/layout';

export const App: React.FC = () => {
  const {
    initialize,
    nodes,
    edges,
    activeGraphId,
    updateMultipleNodePositions,
    zoomToFit,
    undo,
    redo,
    setCommandPaletteOpen,
    setNewNodeModalOpen,
    setNewProjectModalOpen,
    setCustomTypeModalOpen,
    setExportModalOpen,
    setStatsModalOpen,
    setShortcutsModalOpen,
  } = useGraphStore();

  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    isOpen: false,
    type: 'canvas',
    x: 0,
    y: 0,
  });

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Command palette: Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      // Shortcuts modal: '?'
      if (e.key === '?' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        setShortcutsModalOpen(true);
      }
      // Undo: Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
        if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
          e.preventDefault();
          undo();
        }
      }
      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'z' || e.key === 'Z')) ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y'))
      ) {
        if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
          e.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [undo, redo, setCommandPaletteOpen, setShortcutsModalOpen]);

  // Auto Layout trigger
  const handleAutoLayout = useCallback(() => {
    const currentNodes = Object.values(nodes).filter((n) => n.graphId === activeGraphId);
    const currentEdges = Object.values(edges).filter((e) => e.graphId === activeGraphId);
    const newPositions = computeAutoLayout(currentNodes, currentEdges, 'hierarchical');
    updateMultipleNodePositions(newPositions);
    setTimeout(() => zoomToFit(), 50);
  }, [nodes, edges, activeGraphId, updateMultipleNodePositions, zoomToFit]);

  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <TopBar
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenNewProject={() => setNewProjectModalOpen(true)}
        onOpenStats={() => setStatsModalOpen(true)}
        onOpenExport={() => setExportModalOpen(true)}
        onOpenShortcuts={() => setShortcutsModalOpen(true)}
      />

      {/* Main Workspace Area */}
      <main className="workspace-area">
        {/* Left Sidebar */}
        <LeftSidebar
          onOpenNewNode={() => setNewNodeModalOpen(true)}
          onOpenCustomType={() => setCustomTypeModalOpen(true)}
        />

        {/* Infinite Graph Canvas */}
        <GraphCanvas
          onNodeContextMenu={(e, nodeId) => {
            setContextMenu({
              isOpen: true,
              type: 'node',
              x: e.clientX,
              y: e.clientY,
              targetId: nodeId,
            });
          }}
          onEdgeContextMenu={(e, edgeId) => {
            setContextMenu({
              isOpen: true,
              type: 'edge',
              x: e.clientX,
              y: e.clientY,
              targetId: edgeId,
            });
          }}
          onCanvasContextMenu={(e) => {
            setContextMenu({
              isOpen: true,
              type: 'canvas',
              x: e.clientX,
              y: e.clientY,
            });
          }}
          onAutoLayout={handleAutoLayout}
        />

        {/* Right Inspector */}
        <NodeInspector />
      </main>

      {/* Bottom Status Bar */}
      <StatusBar />

      {/* Modals & Dialogs */}
      <CommandPalette />
      <RelationshipPickerModal />
      <NewNodeModal />
      <NewProjectModal />
      <CustomTypeModal />
      <ExportImportModal />
      <StatsModal />
      <ShortcutsModal />
      <ContextMenu
        menuState={contextMenu}
        onClose={() => setContextMenu((prev) => ({ ...prev, isOpen: false }))}
        onAutoLayout={handleAutoLayout}
      />
    </div>
  );
};

export default App;
