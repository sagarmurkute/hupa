import React, { useEffect } from 'react';
import { useGraphStore } from '@hupa/state';
import { Keyboard, X } from 'lucide-react';

export const ShortcutsModal: React.FC = () => {
  const { isShortcutsModalOpen, setShortcutsModalOpen } = useGraphStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShortcutsModalOpen(false);
      }
    };
    if (isShortcutsModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShortcutsModalOpen, setShortcutsModalOpen]);

  if (!isShortcutsModalOpen) return null;

  const SHORTCUT_GROUPS = [
    {
      title: 'Canvas & Navigation',
      items: [
        { key: 'Space + Drag / Middle Click', desc: 'Pan canvas workspace' },
        { key: 'Mouse Wheel / Pinch', desc: 'Focal zoom in / out' },
        { key: 'F', desc: 'Zoom to fit all nodes' },
        { key: 'G', desc: 'Toggle background matrix grid' },
        { key: 'Shift + Drag', desc: 'Marquee multi-select nodes' },
        { key: 'Esc', desc: 'Clear selection / cancel connection' },
      ],
    },
    {
      title: 'Graph Editing & Commands',
      items: [
        { key: 'Ctrl/Cmd + K', desc: 'Open Command Palette' },
        { key: 'Ctrl + Z', desc: 'Undo last action' },
        { key: 'Ctrl + Shift + Z / Ctrl + Y', desc: 'Redo action' },
        { key: 'Delete / Backspace', desc: 'Delete selected nodes or edges' },
        { key: 'Double Click Node', desc: 'Drill down into subsystem graph' },
        { key: '?', desc: 'Open keyboard cheatsheet' },
      ],
    },
  ];

  return (
    <div className="modal-overlay" onClick={() => setShortcutsModalOpen(false)}>
      <div
        className="modal-dialog"
        style={{
          width: '520px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface-subtle)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Keyboard size={15} color="var(--text-primary)" />
            <span style={{ fontSize: '12.5px', fontWeight: 600 }}>Keyboard Shortcuts</span>
          </div>
          <button
            onClick={() => setShortcutsModalOpen(false)}
            className="hupa-btn ghost icon-only"
            style={{ width: '22px', height: '22px' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {SHORTCUT_GROUPS.map((grp) => (
            <div key={grp.title}>
              <div style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                {grp.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {grp.items.map((item) => (
                  <div
                    key={item.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '5px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--surface-subtle)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '11.5px',
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)' }}>{item.desc}</span>
                    <kbd
                      style={{
                        padding: '1px 5px',
                        borderRadius: '3px',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10.5px',
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
            padding: '10px 16px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--surface-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button onClick={() => setShortcutsModalOpen(false)} className="hupa-btn primary">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
