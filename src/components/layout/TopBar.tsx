import React, { useState, useRef, useEffect } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { useAuthStore } from '../../store/useAuthStore';
import { BUILTIN_NODE_TYPES } from '../../constants/nodeTypes';
import { UNIVERSAL_TEMPLATES } from '../../constants/templates';
import { CustomSelect } from '../common/CustomSelect';
import {
  ChevronRight,
  Search,
  Download,
  Undo2,
  Redo2,
  HelpCircle,
  BarChart2,
  FolderGit2,
  Grid,
  Magnet,
  Sparkles,
  Plus,
  FolderPlus,
  Layers,
  LayoutTemplate,
  ArrowLeft,
  GitFork,
  User,
  Cloud,
  CloudUpload,
} from 'lucide-react';
import { syncEngine } from '../../lib/sync/syncEngine';
import { computeAutoLayout } from '../../utils/layout';

interface TopBarProps {
  onOpenCommandPalette: () => void;
  onOpenNewProject: () => void;
  onOpenStats: () => void;
  onOpenExport: () => void;
  onOpenShortcuts: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenCommandPalette,
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
    edges,
    activeGraphId,
    selectNode,
    setTransform,
    undo,
    redo,
    undoStack,
    redoStack,
    isGridVisible,
    toggleGrid,
    isSnapToGrid,
    toggleSnapToGrid,
    selectedNodeIds,
    groupSelectedNodes,
    setNewNodeModalOpen,
    resetToTemplate,
    views,
    activeViewId,
    setActiveView,
    updateMultipleNodePositions,
    zoomToFit,
    uploadProjectToCloud,
  } = useGraphStore();

  const { user, setAuthModalOpen } = useAuthStore();
  const [isUploadingToCloud, setIsUploadingToCloud] = useState(false);

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

  const activeProject = projects[activeProjectId];
  const currentNodes = Object.values(nodes).filter((n) => n.graphId === activeGraphId);
  const currentEdges = Object.values(edges).filter((e) => e.graphId === activeGraphId);
  const isInsideSubGraph = breadcrumbs.length > 1;

  const searchResults = currentNodes
    .filter((n) => {
      if (!searchQuery.trim()) return false;
      const q = searchQuery.toLowerCase();
      return (
        n.name.toLowerCase().includes(q) ||
        n.type.toLowerCase().includes(q) ||
        n.tags?.some((t) => t.toLowerCase().includes(q))
      );
    })
    .slice(0, 8);

  const projectOptions = [
    ...Object.values(projects).map((p) => ({
      value: p.id,
      label: p.name,
      description: `${p.isCloud ? '[Cloud] ' : '[Local] '}${p.domain || 'Project Architecture'}`,
      icon: p.isCloud ? (
        <Cloud size={12} color="var(--accent-indigo)" />
      ) : (
        <FolderGit2 size={12} color="var(--text-secondary)" />
      ),
    })),
    {
      value: '__new__',
      label: '+ New Architecture Project',
      description: 'Start fresh or initialize from starter template',
    },
  ];

  const handlePromoteToCloud = async () => {
    if (!activeProjectId || isUploadingToCloud) return;
    setIsUploadingToCloud(true);
    try {
      await uploadProjectToCloud(activeProjectId);
    } finally {
      setIsUploadingToCloud(false);
    }
  };

  const viewOptions = views.map((v) => ({
    value: v.id,
    label: v.name,
    description: v.description,
    icon: <Layers size={11} color="var(--text-secondary)" />,
  }));

  const templateOptions = [
    { value: '', label: 'Deploy Template...' },
    ...UNIVERSAL_TEMPLATES.map((t) => ({
      value: t.id,
      label: t.name,
      description: t.description,
      icon: <LayoutTemplate size={11} color="var(--accent-indigo)" />,
    })),
  ];

  const handleAutoLayout = () => {
    const newPositions = computeAutoLayout(currentNodes, currentEdges, 'hierarchical');
    updateMultipleNodePositions(newPositions);
    setTimeout(() => zoomToFit(), 40);
  };

  return (
    <header
      className="topbar"
      role="banner"
      aria-label="Application Top Bar"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        gap: '8px',
        overflow: 'hidden',
        minWidth: 0,
      }}
    >
      {/* 1. Left Section: Brand, Navigation / Subsystem Breadcrumbs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          minWidth: 0,
          flexShrink: 1,
          overflow: 'hidden',
        }}
      >
        {/* Brand */}
        <div className="logo-brand" title="HUPA — Hierarchical Universal Product Architecture" style={{ flexShrink: 0 }}>
          <div className="logo-badge" aria-hidden="true">H</div>
          <span style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>HUPA</span>
        </div>

        <span style={{ color: 'var(--border-subtle)', margin: '0 1px', fontSize: '13px', flexShrink: 0 }} aria-hidden="true">/</span>

        {/* Project Selector Dropdown */}
        <div style={{ width: '160px', flexShrink: 0 }} title="Current Architecture Project">
          <CustomSelect
            value={activeProjectId}
            options={projectOptions}
            onChange={(val) => {
              if (val === '__new__') {
                onOpenNewProject();
              } else {
                setActiveProject(val);
              }
            }}
            size="sm"
          />
        </div>

        {/* Normal Root View: Perspective Views Dropdown */}
        {!isInsideSubGraph && (
          <div style={{ width: '135px', flexShrink: 0 }} title="Perspective View Filter">
            <CustomSelect
              value={activeViewId}
              options={viewOptions}
              onChange={(val) => setActiveView(val)}
              size="sm"
            />
          </div>
        )}

        {/* Subsystem Mode: Clean Breadcrumb Trail with Quick Back Button */}
        {isInsideSubGraph && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(79, 70, 229, 0.05)',
              border: '1px solid rgba(79, 70, 229, 0.2)',
              borderRadius: '6px',
              padding: '2px 6px',
              minWidth: 0,
              flexShrink: 1,
              overflow: 'hidden',
            }}
            aria-label="Subsystem Graph Hierarchy"
          >
            {/* Quick Back to Parent Button */}
            <button
              onClick={() => navigateBreadcrumb(breadcrumbs.length - 2)}
              className="hupa-btn ghost"
              style={{
                height: '22px',
                padding: '0 6px',
                fontSize: '10.5px',
                color: 'var(--accent-indigo)',
                gap: '3px',
                fontWeight: 600,
                flexShrink: 0,
              }}
              title="Back to parent architecture graph"
            >
              <ArrowLeft size={11} /> Back
            </button>

            <span style={{ color: 'rgba(79, 70, 229, 0.3)', fontSize: '11px', flexShrink: 0 }}>|</span>

            {/* Breadcrumb path with ellipsis overflow protection */}
            <nav
              className="breadcrumbs-spatial"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                minWidth: 0,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
            >
              {breadcrumbs.map((item, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={item.graphId}>
                    {idx > 0 && <ChevronRight size={10} color="var(--text-muted)" style={{ flexShrink: 0 }} />}
                    <button
                      onClick={() => navigateBreadcrumb(idx)}
                      className={`breadcrumb-segment ${isLast ? 'current' : ''}`}
                      aria-current={isLast ? 'page' : undefined}
                      title={item.name}
                      style={{
                        padding: '2px 5px',
                        fontSize: '11px',
                        fontWeight: isLast ? 600 : 400,
                        color: isLast ? 'var(--accent-indigo)' : 'var(--text-secondary)',
                        maxWidth: isLast ? '160px' : '100px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      {isLast && <GitFork size={10} color="var(--accent-indigo)" style={{ flexShrink: 0 }} />}
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
                    </button>
                  </React.Fragment>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* 2. Center Section: Compact Search with ⌘K */}
      <div
        ref={searchContainerRef}
        style={{
          position: 'relative',
          width: '210px',
          flexShrink: 1,
          minWidth: '120px',
        }}
        role="search"
        aria-label="Search architecture nodes and components"
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '28px',
            border: '1px solid var(--border-subtle)',
            borderRadius: '6px',
            backgroundColor: 'var(--surface-subtle)',
            padding: '0 8px',
            gap: '5px',
            transition: 'border-color 0.12s ease, background-color 0.12s ease',
          }}
        >
          <Search size={11} color="var(--text-muted)" aria-hidden="true" style={{ flexShrink: 0 }} />
          <input
            placeholder="Search / ⌘K"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            aria-label="Search graph nodes"
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '11px',
              color: 'var(--text-primary)',
              width: '100%',
              minWidth: 0,
            }}
          />
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="Open Command Palette"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              flexShrink: 0,
            }}
          >
            <kbd
              style={{
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                padding: '1px 3px',
                borderRadius: '3px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
            >
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && searchResults.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '34px',
              left: 0,
              right: 0,
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-xl)',
              zIndex: 100,
              maxHeight: '280px',
              overflowY: 'auto',
              padding: '4px',
            }}
            role="listbox"
          >
            {searchResults.map((n) => {
              const typeDef = BUILTIN_NODE_TYPES[n.type] || BUILTIN_NODE_TYPES.custom;
              return (
                <div
                  key={n.id}
                  role="option"
                  aria-selected="false"
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
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '11.5px',
                    transition: 'background-color 0.1s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-subtle)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '9.5px',
                        fontFamily: 'var(--font-mono)',
                        padding: '1px 5px',
                        borderRadius: '3px',
                        backgroundColor: 'var(--surface-subtle)',
                        color: 'var(--text-secondary)',
                        fontWeight: 600,
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

      {/* 3. Right Section: Toolbar Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          flexShrink: 0,
        }}
        role="toolbar"
        aria-label="Graph Actions"
      >
        {/* Quick Add Node Button */}
        <button
          onClick={() => setNewNodeModalOpen(true)}
          className="hupa-btn primary"
          style={{ height: '26px', padding: '0 8px', fontSize: '11px', gap: '4px' }}
          title="Create New Node (N)"
          aria-label="Create New Architectural Node"
        >
          <Plus size={12} /> Node
        </button>

        {/* Group Selected Nodes Button */}
        {selectedNodeIds.length > 1 && (
          <button
            onClick={() => groupSelectedNodes()}
            className="hupa-btn"
            style={{ height: '26px', padding: '0 7px', fontSize: '11px', gap: '3px' }}
            title="Encapsulate selected nodes into subsystem boundary group"
            aria-label="Group selected nodes"
          >
            <FolderPlus size={12} /> Group ({selectedNodeIds.length})
          </button>
        )}

        {/* Hierarchical Auto-Layout */}
        <button
          onClick={handleAutoLayout}
          className="hupa-btn ghost icon-only"
          title="Compute Hierarchical DAG Auto-Layout"
          aria-label="Auto-arrange graph layout"
        >
          <Sparkles size={13} color="var(--accent-indigo)" />
        </button>

        {/* Grid Visibility Toggle */}
        <button
          onClick={toggleGrid}
          className={`hupa-btn ghost icon-only ${isGridVisible ? 'active' : ''}`}
          title={`Toggle Grid Matrix (G) — Currently ${isGridVisible ? 'ON' : 'OFF'}`}
          aria-label="Toggle background grid matrix"
          aria-pressed={isGridVisible}
          style={{
            backgroundColor: isGridVisible ? 'var(--surface-subtle)' : 'transparent',
            color: isGridVisible ? '#0f172a' : 'var(--text-muted)',
          }}
        >
          <Grid size={13} />
        </button>

        {/* Snap-to-Grid Toggle */}
        <button
          onClick={toggleSnapToGrid}
          className={`hupa-btn ghost icon-only ${isSnapToGrid ? 'active' : ''}`}
          title={`Toggle Snap to Grid — Currently ${isSnapToGrid ? 'ON' : 'OFF'}`}
          aria-label="Toggle snap to grid alignment"
          aria-pressed={isSnapToGrid}
          style={{
            backgroundColor: isSnapToGrid ? 'var(--surface-subtle)' : 'transparent',
            color: isSnapToGrid ? 'var(--accent-indigo)' : 'var(--text-muted)',
          }}
        >
          <Magnet size={13} />
        </button>

        <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-subtle)', margin: '0 2px' }} aria-hidden="true" />

        {/* Undo / Redo */}
        <button
          onClick={undo}
          disabled={undoStack.length === 0}
          className="hupa-btn ghost icon-only"
          title="Undo (Ctrl+Z)"
          aria-label="Undo last action"
        >
          <Undo2 size={13} />
        </button>

        <button
          onClick={redo}
          disabled={redoStack.length === 0}
          className="hupa-btn ghost icon-only"
          title="Redo (Ctrl+Shift+Z)"
          aria-label="Redo action"
        >
          <Redo2 size={13} />
        </button>

        <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-subtle)', margin: '0 2px' }} aria-hidden="true" />

        {/* Deploy Starter Template */}
        <div style={{ width: '130px' }} title="Deploy Starter Architectural Templates">
          <CustomSelect
            value=""
            placeholder="Templates"
            options={templateOptions}
            onChange={(templateId) => {
              if (templateId) {
                resetToTemplate(templateId);
              }
            }}
            size="sm"
          />
        </div>

        {/* Data Portability / Export */}
        <button
          onClick={onOpenExport}
          className="hupa-btn ghost"
          style={{ height: '26px', padding: '0 7px', fontSize: '11px', gap: '3px' }}
          title="Export / Import Architecture JSON"
          aria-label="Export or Import Architecture"
        >
          <Download size={12} /> Export
        </button>

        {/* Architecture Analytics */}
        <button
          onClick={onOpenStats}
          className="hupa-btn ghost icon-only"
          title="Architecture Topology Analytics & Cycles"
          aria-label="Open architecture stats and health analytics"
        >
          <BarChart2 size={13} />
        </button>

        {/* Keyboard Shortcuts */}
        <button
          onClick={onOpenShortcuts}
          className="hupa-btn ghost icon-only"
          title="Keyboard Shortcuts Cheatsheet (?)"
          aria-label="Open keyboard shortcuts cheatsheet"
        >
          <HelpCircle size={13} />
        </button>

        {/* Promote Local Project to Cloud Button (when signed in) */}
        {user && activeProject && !activeProject.isCloud && (
          <button
            onClick={handlePromoteToCloud}
            disabled={isUploadingToCloud}
            className="hupa-btn ghost"
            style={{
              height: '26px',
              padding: '0 8px',
              fontSize: '11px',
              gap: '4px',
              color: 'var(--accent-indigo)',
              fontWeight: 600,
              backgroundColor: 'rgba(79, 70, 229, 0.05)',
              border: '1px solid rgba(79, 70, 229, 0.2)',
            }}
            title="Upload and synchronize this local project to Supabase PostgreSQL"
            aria-label="Sync local project to cloud"
          >
            <CloudUpload size={12} />
            <span>{isUploadingToCloud ? 'Syncing...' : 'Sync to Cloud'}</span>
          </button>
        )}

        {/* Cloud Project Active Indicator */}
        {activeProject?.isCloud && (
          <button
            onClick={() => syncEngine.triggerSync()}
            className="hupa-btn ghost icon-only"
            title="Cloud Project (Synchronized with Supabase PostgreSQL) — Click to force sync"
            aria-label="Force synchronize cloud project"
            style={{ color: 'var(--accent-indigo)' }}
          >
            <Cloud size={13} />
          </button>
        )}

        <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--border-subtle)', margin: '0 2px' }} aria-hidden="true" />

        {/* Better Auth Account Button */}
        {user ? (
          <button
            onClick={() => setAuthModalOpen(true, 'account')}
            className="hupa-btn ghost"
            style={{
              height: '26px',
              padding: '0 8px',
              fontSize: '11px',
              gap: '6px',
              fontWeight: 600,
              backgroundColor: 'rgba(79, 70, 229, 0.08)',
              color: 'var(--accent-indigo)',
              border: '1px solid rgba(79, 70, 229, 0.2)',
            }}
            title={`Signed in as ${user.email}`}
            aria-label="Account Settings"
          >
            <span
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-indigo)',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: 700,
              }}
            >
              {user.name ? user.name[0].toUpperCase() : 'U'}
            </span>
            <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.name || user.email}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setAuthModalOpen(true, 'signin')}
            className="hupa-btn ghost"
            style={{
              height: '26px',
              padding: '0 8px',
              fontSize: '11px',
              gap: '4px',
              color: 'var(--text-secondary)',
            }}
            title="Sign in with Better Auth"
            aria-label="Sign In"
          >
            <User size={12} /> Sign In
          </button>
        )}
      </div>
    </header>
  );
};
