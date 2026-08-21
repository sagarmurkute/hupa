import React, { useState, useEffect, useRef } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { BUILTIN_NODE_TYPES } from '../../constants/nodeTypes';
import { DynamicIcon } from '../common/DynamicIcon';
import {
  Search,
  Plus,
  Layers,
  Sparkles,
  Maximize2,
  FolderPlus,
  Download,
  Zap,
  HelpCircle,
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    nodes,
    views,
    setActiveView,
    selectNode,
    setTransform,
    setNewNodeModalOpen,
    setNewProjectModalOpen,
    setCustomTypeModalOpen,
    setExportModalOpen,
    setStatsModalOpen,
    setShortcutsModalOpen,
    zoomToFit,
    toggleGrid,
    activeGraphId,
  } = useGraphStore();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  interface PaletteItem {
    id: string;
    title: string;
    subtitle?: string;
    category: 'actions' | 'views' | 'nodes';
    iconName?: string;
    iconComponent?: React.ComponentType<{ size?: number; color?: string }>;
    action: () => void;
  }

  const items: PaletteItem[] = [];

  // Actions
  items.push(
    {
      id: 'act-add-node',
      title: 'Create New Node',
      subtitle: 'Add a new architecture or code primitive',
      category: 'actions',
      iconComponent: Plus,
      action: () => setNewNodeModalOpen(true),
    },
    {
      id: 'act-fit',
      title: 'Fit Canvas to Screen',
      subtitle: 'Center and frame all graph nodes',
      category: 'actions',
      iconComponent: Maximize2,
      action: () => zoomToFit(),
    },
    {
      id: 'act-toggle-grid',
      title: 'Toggle Background Grid',
      subtitle: 'Switch between dot grid and plain canvas',
      category: 'actions',
      iconComponent: Layers,
      action: () => toggleGrid(),
    },
    {
      id: 'act-new-project',
      title: 'Create New Project',
      subtitle: 'Start a new visual system architecture',
      category: 'actions',
      iconComponent: FolderPlus,
      action: () => setNewProjectModalOpen(true),
    },
    {
      id: 'act-custom-type',
      title: 'Custom Types Builder',
      subtitle: 'Define custom node and edge specifications',
      category: 'actions',
      iconComponent: Zap,
      action: () => setCustomTypeModalOpen(true),
    },
    {
      id: 'act-shortcuts',
      title: 'Keyboard Shortcuts',
      subtitle: 'View complete cheatsheet of hotkeys',
      category: 'actions',
      iconComponent: HelpCircle,
      action: () => setShortcutsModalOpen(true),
    },
    {
      id: 'act-export',
      title: 'Export / Import Graph JSON',
      subtitle: 'Download or restore portable graph format',
      category: 'actions',
      iconComponent: Download,
      action: () => setExportModalOpen(true),
    },
    {
      id: 'act-stats',
      title: 'Graph Analytics & Health',
      subtitle: 'Inspect circular dependencies and metrics',
      category: 'actions',
      iconComponent: Sparkles,
      action: () => setStatsModalOpen(true),
    }
  );

  // Views
  views.forEach((v) => {
    items.push({
      id: `view-${v.id}`,
      title: `Switch to ${v.name}`,
      subtitle: v.description,
      category: 'views',
      iconName: v.icon,
      action: () => setActiveView(v.id),
    });
  });

  // Nodes in active graph
  Object.values(nodes)
    .filter((n) => n.graphId === activeGraphId)
    .forEach((n) => {
      const typeDef = BUILTIN_NODE_TYPES[n.type] || BUILTIN_NODE_TYPES.custom;
      items.push({
        id: `node-${n.id}`,
        title: n.name,
        subtitle: `${typeDef.label} • ${n.description?.slice(0, 60) || ''}`,
        category: 'nodes',
        iconName: typeDef.icon,
        action: () => {
          selectNode(n.id);
          setTransform((prev) => ({
            x: window.innerWidth / 2 - (n.position.x + (n.size?.width || 210) / 2) * prev.zoom,
            y: window.innerHeight / 2 - (n.position.y + (n.size?.height || 110) / 2) * prev.zoom,
            zoom: Math.max(0.8, prev.zoom),
          }));
        },
      });
    });

  // Filter items
  const filteredItems = items.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return item.title.toLowerCase().includes(q) || (item.subtitle && item.subtitle.toLowerCase().includes(q));
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
        setCommandPaletteOpen(false);
      }
    } else if (e.key === 'Escape') {
      setCommandPaletteOpen(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
      onClick={() => setCommandPaletteOpen(false)}
      onKeyDown={handleKeyDown}
    >
      <div
        className="glass-panel animate-slide-down"
        style={{
          width: '560px',
          maxHeight: '440px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
          boxShadow: 'var(--shadow-xl)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <Search size={16} color="var(--text-muted)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, view, or node name..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '13.5px',
              fontWeight: 500,
              color: 'var(--text-primary)',
            }}
          />
          <kbd
            style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
          {filteredItems.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
              No commands or nodes found matching "{query}"
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const IconComp = item.iconComponent;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    item.action();
                    setCommandPaletteOpen(false);
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '7px 10px',
                    borderRadius: '6px',
                    backgroundColor: isSelected ? '#0f172a' : 'transparent',
                    color: isSelected ? '#ffffff' : 'var(--text-primary)',
                    cursor: 'pointer',
                    transition: 'background var(--transition-fast)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '5px',
                        backgroundColor: isSelected ? 'rgba(255,255,255,0.15)' : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {IconComp ? (
                        <IconComp size={13} color={isSelected ? '#ffffff' : '#0f172a'} />
                      ) : (
                        <DynamicIcon name={item.iconName || 'Box'} size={13} color={isSelected ? '#ffffff' : '#0f172a'} />
                      )}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div
                        style={{
                          fontSize: '12.5px',
                          fontWeight: isSelected ? 600 : 500,
                          color: isSelected ? '#ffffff' : 'var(--text-primary)',
                        }}
                      >
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div
                          style={{
                            fontSize: '11px',
                            color: isSelected ? '#cbd5e1' : 'var(--text-muted)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '9.5px',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      color: isSelected ? '#94a3b8' : 'var(--text-subtle)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {item.category}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
