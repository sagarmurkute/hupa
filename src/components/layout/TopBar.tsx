import React from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import {
  FolderGit2,
  ChevronRight,
  Search,
  Command,
  Download,
  BarChart2,
  RotateCcw,
  Layers,
  HelpCircle,
  Trash2,
} from 'lucide-react';

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
    deleteProject,
    breadcrumbs,
    navigateBreadcrumb,
    views,
    activeViewId,
    setActiveView,
    searchQuery,
    setSearchQuery,
    resetToTemplate,
  } = useGraphStore();

  const currentProject = projects[activeProjectId];
  const projectCount = Object.keys(projects).length;

  const handleDeleteCurrentProject = () => {
    if (!currentProject) return;
    if (window.confirm(`Are you sure you want to delete project "${currentProject.name}"? This action cannot be undone.`)) {
      deleteProject(activeProjectId);
    }
  };

  return (
    <header className="topbar">
      {/* Left Area: Brand & Project Switcher & Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              backgroundColor: '#09090b',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '12px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
          >
            H
          </div>
          <span style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.02em', color: '#09090b' }}>
            HUPA
          </span>
        </div>

        <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)' }} />

        {/* Project Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <FolderGit2 size={15} color="#09090b" />
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
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              backgroundColor: 'var(--bg-surface-subtle)',
              cursor: 'pointer',
              outline: 'none',
              maxWidth: '160px',
            }}
          >
            {Object.values(projects).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
            <option value="__new__">+ New Project...</option>
          </select>

          {projectCount > 1 && (
            <button
              onClick={handleDeleteCurrentProject}
              className="btn-icon"
              title={`Delete Project "${currentProject?.name}"`}
              style={{ width: '24px', height: '24px', color: '#71717a' }}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>

        <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)' }} />

        {/* Hierarchical Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumbs"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '12px',
          }}
        >
          {breadcrumbs.map((item, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={item.graphId}>
                {idx > 0 && <ChevronRight size={12} color="var(--text-subtle)" />}
                <button
                  onClick={() => navigateBreadcrumb(idx)}
                  style={{
                    background: isLast ? 'var(--bg-surface-subtle)' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '3px 6px',
                    fontSize: '12px',
                    fontWeight: isLast ? 600 : 400,
                    color: isLast ? '#09090b' : 'var(--text-secondary)',
                    cursor: isLast ? 'default' : 'pointer',
                    maxWidth: '180px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={item.name}
                >
                  {item.name}
                </button>
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Center Area: Perspective / View Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '2px 8px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-subtle)',
          }}
        >
          <Layers size={13} color="#09090b" />
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
            Perspective:
          </span>
          <select
            value={activeViewId}
            onChange={(e) => setActiveView(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {views.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Area: Search, Command Palette, Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Search Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            borderRadius: '6px',
            border: '1px solid var(--border-subtle)',
            backgroundColor: '#ffffff',
            width: '170px',
          }}
        >
          <Search size={13} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search graph..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '12px',
              width: '100%',
              background: 'transparent',
            }}
          />
        </div>

        {/* Command Palette Button */}
        <button
          onClick={onOpenCommandPalette}
          className="btn"
          title="Command Palette (Ctrl/Cmd + K)"
          style={{ gap: '6px', padding: '5px 10px' }}
        >
          <Command size={13} />
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>⌘K</span>
        </button>

        {/* Shortcuts modal */}
        <button
          onClick={onOpenShortcuts}
          className="btn-icon"
          title="Keyboard Shortcuts (?)"
        >
          <HelpCircle size={15} />
        </button>

        {/* Graph Stats */}
        <button
          onClick={onOpenStats}
          className="btn-icon"
          title="Graph Analytics & Topology Health"
        >
          <BarChart2 size={16} />
        </button>

        {/* Export / Import Project */}
        <button
          onClick={onOpenExport}
          className="btn-icon"
          title="Import / Export Project JSON"
        >
          <Download size={16} />
        </button>

        {/* Reset to Starter Template */}
        <button
          onClick={() => {
            if (window.confirm('Reset current workspace to standard fullstack template?')) {
              resetToTemplate('fullstack-web');
            }
          }}
          className="btn-icon"
          title="Reset to Starter Architecture Template"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </header>
  );
};
