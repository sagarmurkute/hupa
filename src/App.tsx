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
    toggleGrid,
    undo,
    redo,
    selectedNodeIds,
    selectedEdgeIds,
    selectedGroupIds,
    deleteNode,
    deleteEdge,
    deleteGroup,
    clearSelection,
    selectAll,
    duplicateSelectedNodes,
    setCommandPaletteOpen,
    setNewNodeModalOpen,
    setNewProjectModalOpen,
    setCustomTypeModalOpen,
    setExportModalOpen,
    setStatsModalOpen,
    setShortcutsModalOpen,
    isCommandPaletteOpen,
    isNewNodeModalOpen,
    isNewProjectModalOpen,
    isCustomTypeModalOpen,
    isExportModalOpen,
    isStatsModalOpen,
    isShortcutsModalOpen,
    isRelationshipPickerOpen,
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
      const isInputActive =
        (e.target as HTMLElement).tagName === 'INPUT' ||
        (e.target as HTMLElement).tagName === 'TEXTAREA' ||
        (e.target as HTMLElement).tagName === 'SELECT' ||
        (e.target as HTMLElement).isContentEditable;

      const anyModalOpen =
        isCommandPaletteOpen ||
        isNewNodeModalOpen ||
        isNewProjectModalOpen ||
        isCustomTypeModalOpen ||
        isExportModalOpen ||
        isStatsModalOpen ||
        isShortcutsModalOpen ||
        isRelationshipPickerOpen;

      if (isInputActive) return;

      // Command palette: Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setCommandPaletteOpen(true);
        return;
      }

      // Select all: Ctrl+A / Cmd+A
      if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A') && !anyModalOpen) {
        e.preventDefault();
        selectAll();
        return;
      }

      // Duplicate: Ctrl+D / Cmd+D
      if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D') && !anyModalOpen) {
        e.preventDefault();
        duplicateSelectedNodes();
        return;
      }

      // Undo: Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'z' || e.key === 'Z')) ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y'))
      ) {
        e.preventDefault();
        redo();
        return;
      }

      if (anyModalOpen) return;

      // Shortcuts modal: '?'
      if (e.key === '?') {
        e.preventDefault();
        setShortcutsModalOpen(true);
        return;
      }

      // Delete selected: Delete or Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeIds.length > 0 || selectedEdgeIds.length > 0 || selectedGroupIds.length > 0) {
          e.preventDefault();
          selectedNodeIds.forEach((id) => deleteNode(id));
          selectedEdgeIds.forEach((id) => deleteEdge(id));
          selectedGroupIds.forEach((id) => deleteGroup(id));
          clearSelection();
        }
        return;
      }

      // Escape: clear selection
      if (e.key === 'Escape') {
        clearSelection();
        return;
      }

      // Fit to screen: F
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        zoomToFit();
        return;
      }

      // Toggle grid: G
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        toggleGrid();
        return;
      }

      // New Node: N
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setNewNodeModalOpen(true);
        return;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [
    undo,
    redo,
    setCommandPaletteOpen,
    setShortcutsModalOpen,
    setNewNodeModalOpen,
    selectedNodeIds,
    selectedEdgeIds,
    selectedGroupIds,
    deleteNode,
    deleteEdge,
    deleteGroup,
    clearSelection,
    selectAll,
    duplicateSelectedNodes,
    zoomToFit,
    toggleGrid,
    isCommandPaletteOpen,
    isNewNodeModalOpen,
    isNewProjectModalOpen,
    isCustomTypeModalOpen,
    isExportModalOpen,
    isStatsModalOpen,
    isShortcutsModalOpen,
    isRelationshipPickerOpen,
  ]);

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
