import React, { useState, useRef, useEffect } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { BUILTIN_NODE_TYPES } from '../../constants/nodeTypes';
import {
  ChevronRight,
  Search,
  Download,
  Undo2,
  Redo2,
  HelpCircle,
  BarChart2,
  FolderGit2,
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
    undo,
    redo,
    undoStack,
    redoStack,
  } = useGraphStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as HTMLElement)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

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
      {/* Left: Spatial Navigation Hierarchy */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        {/* Brand */}
        <div className="logo-brand">
          <div className="logo-badge">H</div>
          <span>HUPA</span>
        </div>

        <span style={{ color: 'var(--border-subtle)', margin: '0 2px' }}>/</span>

        {/* Project Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <FolderGit2 size={13} color="var(--text-secondary)" />
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
              border: 'none',
              backgroundColor: 'transparent',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              outline: 'none',
              padding: '2px 4px',
              borderRadius: '4px',
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

        {/* Breadcrumb Path */}
        {breadcrumbs.length > 1 && (
          <nav className="breadcrumbs-spatial">
            {breadcrumbs.map((item, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <div key={item.graphId} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ChevronRight size={11} color="var(--text-muted)" />
                  <button
                    onClick={() => navigateBreadcrumb(idx)}
                    className={`breadcrumb-segment ${isLast ? 'current' : ''}`}
                  >
                    {item.name}
                  </button>
                </div>
              );
            })}
          </nav>
        )}
      </div>

      {/* Center: Search & Command Palette Access */}
      <div ref={searchContainerRef} style={{ position: 'relative', width: '280px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '28px',
            border: '1px solid var(--border-subtle)',
            borderRadius: '5px',
            backgroundColor: 'var(--surface-subtle)',
            padding: '0 8px',
            gap: '6px',
          }}
        >
          <Search size={12} color="var(--text-muted)" />
          <input
            placeholder="Search graph (⌘K)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '11.5px',
              color: 'var(--text-primary)',
              flex: 1,
            }}
          />
        </div>

        {/* Live Search Autocomplete Dropdown */}
        {isSearchOpen && searchResults.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '32px',
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              boxShadow: 'var(--shadow-drawer)',
              zIndex: 60,
              maxHeight: '260px',
              overflowY: 'auto',
              padding: '3px',
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
                      x: window.innerWidth / 2 - (n.position.x + (n.size?.width || 240) / 2) * prev.zoom,
                      y: window.innerHeight / 2 - (n.position.y + (n.size?.height || 76) / 2) * prev.zoom,
                      zoom: Math.max(0.85, prev.zoom),
                    }));
                    setIsSearchOpen(false);
                  }}
                  style={{
                    padding: '6px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11.5px',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-subtle)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '9.5px',
                        fontFamily: 'var(--font-mono)',
                        padding: '1px 4px',
                        borderRadius: '3px',
                        backgroundColor: 'var(--surface-subtle)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {typeDef.label}
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{n.name}</span>
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {n.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right: Quick Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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

        <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--border-subtle)', margin: '0 2px' }} />

        <button onClick={onOpenExport} className="hupa-btn ghost" title="Data Portability / Export">
          <Download size={12} /> Export
        </button>

        <button onClick={onOpenStats} className="hupa-btn ghost" title="Architecture Topology Analytics">
          <BarChart2 size={12} /> Analytics
        </button>

        <button onClick={onOpenShortcuts} className="hupa-btn ghost icon-only" title="Keyboard Cheatsheet (?)">
          <HelpCircle size={13} />
        </button>
      </div>
    </header>
  );
};
