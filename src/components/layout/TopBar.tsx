import React, { useState, useRef, useEffect } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { BUILTIN_NODE_TYPES } from '../../constants/nodeTypes';
import {
  FolderGit2,
  ChevronRight,
  Search,
  Sparkles,
  Maximize2,
  Download,
  Plus,
  Undo2,
  Redo2,
  HelpCircle,
  BarChart2,
} from 'lucide-react';

interface TopBarProps {
  onOpenCommandPalette: () => void;
  onOpenNewProject: () => void;
  onOpenStats: () => void;
  onOpenExport: () => void;
  onOpenShortcuts: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenNewProject,
  onOpenStats,
  onOpenExport,
  onOpenShortcuts,
}) => {
  const {
    projects,
    activeProjectId,
    setActiveProject,
    breadcrumbs,
    navigateBreadcrumb,
    searchQuery,
    setSearchQuery,
    nodes,
    activeGraphId,
    selectNode,
    setTransform,
    setNewNodeModalOpen,
    zoomToFit,
    undo,
    redo,
    undoStack,
    redoStack,
    updateMultipleNodePositions,
    edges,
  } = useGraphStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close search dropdown
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as HTMLElement)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const handleAutoLayout = () => {
    const currentNodes = Object.values(nodes).filter((n) => n.graphId === activeGraphId);
    const currentEdges = Object.values(edges).filter((e) => e.graphId === activeGraphId);
    
    // Clean hierarchical layout
    const indeg: Record<string, number> = {};
    currentNodes.forEach((n) => (indeg[n.id] = 0));
    currentEdges.forEach((e) => (indeg[e.targetNodeId] = (indeg[e.targetNodeId] || 0) + 1));

    const layers: typeof currentNodes[] = [];
    const placed = new Set<string>();
    let cur = currentNodes.filter((n) => indeg[n.id] === 0);
    if (cur.length === 0) cur = currentNodes.slice(0, 3);

    while (cur.length > 0 && layers.length <= 10) {
      layers.push(cur);
      cur.forEach((n) => placed.add(n.id));
      const next: typeof currentNodes = [];
      cur.forEach((n) => {
        currentEdges.forEach((e) => {
          if (e.sourceNodeId === n.id && !placed.has(e.targetNodeId)) {
            const nn = currentNodes.find((x) => x.id === e.targetNodeId);
            if (nn && !next.some((x) => x.id === nn.id)) next.push(nn);
          }
        });
      });
      cur = next;
    }

    const unplaced = currentNodes.filter((n) => !placed.has(n.id));
    if (unplaced.length > 0) layers.push(unplaced);

    const newPositions: Record<string, { x: number; y: number }> = {};
    layers.forEach((layer, li) => {
      layer.forEach((n, ni) => {
        newPositions[n.id] = { x: 80 + ni * 290, y: 80 + li * 170 };
      });
    });

    updateMultipleNodePositions(newPositions);
    setTimeout(() => zoomToFit(), 60);
  };

  // Search matches
  const searchResults = Object.values(nodes)
    .filter((n) => n.graphId === activeGraphId)
    .filter((n) => {
      if (!searchQuery.trim()) return false;
      const q = searchQuery.toLowerCase();
      return n.name.toLowerCase().includes(q) || n.type.toLowerCase().includes(q) || n.tags?.some((t) => t.toLowerCase().includes(q));
    })
    .slice(0, 8);

  return (
    <header className="topbar">
      {/* Left: Brand, Project & Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
        {/* Brand */}
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => zoomToFit()}>
          <div className="logo-mark">H</div>
          <span>HUPA</span>
        </div>

        <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border)' }} />

        {/* Project Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <FolderGit2 size={15} color="var(--text2)" />
          <select
            value={activeProjectId}
            onChange={(e) => {
              if (e.target.value === '__new__') {
                onOpenNewProject();
              } else {
                setActiveProject(e.target.value);
              }
            }}
            style={{
              border: '1px solid var(--border)',
              borderRadius: '7px',
              padding: '3px 8px',
              fontSize: '12.5px',
              fontWeight: 600,
              color: 'var(--text)',
              backgroundColor: 'var(--bg2)',
              cursor: 'pointer',
              outline: 'none',
              maxWidth: '170px',
            }}
          >
            {Object.values(projects).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
            <option value="__new__">+ New Project...</option>
          </select>
        </div>

        <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border)' }} />

        {/* Breadcrumb Navigation */}
        <nav className="breadcrumbs">
          {breadcrumbs.map((item, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <div key={item.graphId} className="crumb" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {idx > 0 && <ChevronRight size={12} color="var(--text3)" />}
                <button
                  onClick={() => navigateBreadcrumb(idx)}
                  style={{
                    fontWeight: isLast ? 600 : 400,
                    color: isLast ? 'var(--text)' : 'var(--text2)',
                    background: isLast ? 'var(--bg2)' : 'transparent',
                  }}
                  title={item.name}
                >
                  {item.name}
                </button>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Center: Global Search Bar */}
      <div ref={searchContainerRef} className="search-wrap">
        <span style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text3)' }}>
          <Search size={14} />
        </span>
        <input
          placeholder="Search nodes, types, tags… (⌘K)"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearchOpen(true);
          }}
          onFocus={() => setIsSearchOpen(true)}
        />

        {/* Instant Search Results Dropdown */}
        {isSearchOpen && searchResults.length > 0 && (
          <div
            className="search-results animate-slide-down"
            style={{
              position: 'absolute',
              top: '42px',
              left: 0,
              right: 0,
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 50,
              maxHeight: '320px',
              overflowY: 'auto',
              padding: '4px',
            }}
          >
            {searchResults.map((n) => {
              const typeDef = BUILTIN_NODE_TYPES[n.type] || BUILTIN_NODE_TYPES.custom;
              return (
                <div
                  key={n.id}
                  onClick={() => {
                    selectNode(n.id);
                    setTransform((prev) => ({
                      x: window.innerWidth / 2 - (n.position.x + (n.size?.width || 210) / 2) * prev.zoom,
                      y: window.innerHeight / 2 - (n.position.y + (n.size?.height || 110) / 2) * prev.zoom,
                      zoom: Math.max(0.85, prev.zoom),
                    }));
                    setIsSearchOpen(false);
                  }}
                  style={{
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '7px',
                    cursor: 'pointer',
                    fontSize: '12.5px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="tag type" style={{ fontSize: '10px' }}>{typeDef.label}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{n.name}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text3)' }}>{n.status}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right: Quick Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          onClick={undo}
          disabled={undoStack.length === 0}
          className="btn small ghost"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={13} /> Undo
        </button>

        <button
          onClick={redo}
          disabled={redoStack.length === 0}
          className="btn small ghost"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 size={13} /> Redo
        </button>

        <span className="kbd" style={{ cursor: 'pointer' }} onClick={() => zoomToFit()} title="Fit to Screen (F)">
          F
        </span>

        <button onClick={() => zoomToFit()} className="btn small" title="Fit to Screen">
          <Maximize2 size={12} /> Fit
        </button>

        <button onClick={handleAutoLayout} className="btn small" title="Auto-layout DAG">
          <Sparkles size={12} color="var(--indigo)" /> Auto-layout
        </button>

        <button onClick={onOpenExport} className="btn small" title="Export JSON">
          <Download size={12} /> Export
        </button>

        <button onClick={onOpenStats} className="btn small" title="Analytics">
          <BarChart2 size={12} /> Analytics
        </button>

        <button onClick={onOpenShortcuts} className="btn small ghost" title="Shortcuts (?)">
          <HelpCircle size={14} />
        </button>

        <button onClick={() => setNewNodeModalOpen(true)} className="btn small primary" title="Add Node">
          <Plus size={13} /> Node
        </button>

        <div style={{ fontSize: '11px', color: 'var(--text3)', marginLeft: '4px', fontFamily: 'var(--mono)', whiteSpace: 'nowrap' }}>
          Saved • local
        </div>
      </div>
    </header>
  );
};
