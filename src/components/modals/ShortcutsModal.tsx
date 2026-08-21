import React from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { Keyboard, X } from 'lucide-react';

export const ShortcutsModal: React.FC = () => {
  const { isShortcutsModalOpen, setShortcutsModalOpen } = useGraphStore();

  if (!isShortcutsModalOpen) return null;

  const SHORTCUT_GROUPS = [
    {
      title: 'Canvas & Navigation',
      items: [
        { key: 'Space + Drag / Middle Click', desc: 'Pan canvas' },
        { key: 'Mouse Wheel / Pinch', desc: 'Zoom in / out at cursor' },
        { key: 'F', desc: 'Zoom to fit all nodes on screen' },
        { key: 'G', desc: 'Toggle background grid dots' },
        { key: 'Shift + Drag', desc: 'Marquee multi-select nodes' },
        { key: 'Esc', desc: 'Clear selection / cancel connection' },
      ],
    },
    {
      title: 'Graph Editing',
      items: [
        { key: 'Ctrl/Cmd + K', desc: 'Open Command Palette' },
        { key: 'Ctrl + Z', desc: 'Undo last mutation' },
        { key: 'Ctrl + Shift + Z / Ctrl + Y', desc: 'Redo mutation' },
        { key: 'Delete / Backspace', desc: 'Delete selected nodes or edges' },
        { key: 'Double Click Node', desc: 'Drill down into subsystem sub-graph' },
        { key: '?', desc: 'Open keyboard shortcuts cheatsheet' },
      ],
    },
  ];

  return (
    <div className="modal-backdrop" onClick={() => setShortcutsModalOpen(false)}>
      <div
        className="glass-panel animate-slide-down"
        style={{
          width: '540px',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg-surface-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Keyboard size={16} color="#09090b" />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>Keyboard Shortcuts</span>
          </div>
          <button onClick={() => setShortcutsModalOpen(false)} className="btn-icon" style={{ width: '24px', height: '24px' }}>
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {SHORTCUT_GROUPS.map((grp) => (
            <div key={grp.title}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                {grp.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {grp.items.map((item) => (
                  <div
                    key={item.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-surface-subtle)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '12px',
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)' }}>{item.desc}</span>
                    <kbd
                      style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #d4d4d8',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 18px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button onClick={() => setShortcutsModalOpen(false)} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
