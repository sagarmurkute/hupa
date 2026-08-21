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
  CornerDownLeft,
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
      inputRef.current?.focus();
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

  const items: PaletteItem[] = [
    {
      id: 'act-add-node',
      title: 'Create Architectural Node',
      subtitle: 'Add a new component primitive to the graph',
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
      subtitle: 'Switch between matrix grid and plain workspace',
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
      subtitle: 'Define custom node and relationship specifications',
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
    },
  ];

  // Perspectives
  views.forEach((v) => {
    items.push({
      id: `view-${v.id}`,
      title: `Switch to Perspective: ${v.name}`,
      subtitle: v.description,
      category: 'views',
      iconName: v.icon || 'Layers',
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
        subtitle: `${typeDef.label} • ${n.description || 'No description'}`,
        category: 'nodes',
        iconName: typeDef.icon || 'Box',
        action: () => {
          selectNode(n.id);
          setTransform((prev) => ({
            x: window.innerWidth / 2 - (n.position.x + (n.size?.width || 240) / 2) * prev.zoom,
            y: window.innerHeight / 2 - (n.position.y + (n.size?.height || 76) / 2) * prev.zoom,
            zoom: Math.max(0.85, prev.zoom),
          }));
        },
      });
    });

  const filteredItems = items.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return item.title.toLowerCase().includes(q) || (item.subtitle && item.subtitle.toLowerCase().includes(q));
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
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
    <div className="modal-overlay" onClick={() => setCommandPaletteOpen(false)}>
      <div
        className="modal-dialog"
        style={{
          width: '560px',
          maxHeight: '440px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: '#ffffff',
          }}
        >
          <Search size={15} color="var(--text-muted)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command, search nodes, or switch perspectives..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '13px',
              fontWeight: 500,
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
            }}
          />
          <kbd
            style={{
              padding: '1px 5px',
              borderRadius: '3px',
              backgroundColor: 'var(--surface-subtle)',
              border: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-muted)',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div style={{ padding: '6px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {filteredItems.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            const IconComponent = item.iconComponent;
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
                  gap: '10px',
                  padding: '8px 10px',
                  borderRadius: '5px',
                  backgroundColor: isSelected ? 'var(--surface-subtle)' : 'transparent',
                  border: isSelected ? '1px solid var(--border-subtle)' : '1px solid transparent',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    backgroundColor: isSelected ? '#0f172a' : 'var(--surface-subtle)',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  {IconComponent ? (
                    <IconComponent size={13} />
                  ) : item.iconName ? (
                    <DynamicIcon name={item.iconName} size={13} color={isSelected ? '#ffffff' : 'var(--text-secondary)'} />
                  ) : (
                    <Layers size={13} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title}
                  </div>
                  {item.subtitle && (
                    <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.subtitle}
                    </div>
                  )}
                </div>

                {isSelected && <CornerDownLeft size={12} color="var(--text-muted)" />}
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
              No commands or nodes matching "{query}"
            </div>
          )}
        </div>

        {/* Footer info */}
        <div
          style={{
            padding: '6px 14px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--surface-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '10.5px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <span>↑↓ to navigate • ↵ to execute</span>
          <span>{filteredItems.length} results</span>
        </div>
      </div>
    </div>
  );
};
