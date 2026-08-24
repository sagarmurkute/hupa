import React, { useState } from 'react';

interface MegaItem { label: string; desc: string; route: string }
interface MegaCategory {
  title: string;
  description: string;
  columns: Array<{ heading: string; items: MegaItem[] }>;
}

const MEGA: Record<string, MegaCategory> = {
  Architecture: {
    title: 'Spatial Architecture',
    description: 'Explore the high-performance graph primitives powering HUPA.',
    columns: [
      { heading: 'Core Engine', items: [
        { label: 'Spatial Model', desc: 'Typed 2D graph primitives', route: '#features' },
        { label: 'LOD Navigation', desc: 'Multi-scale viewport zoom', route: '#features' },
        { label: 'Topology Engine', desc: 'Acyclic DAG parser', route: '#diagram' },
        { label: 'WASM Cycle Core', desc: 'Tarjan algorithm in WASM', route: '#diagram' },
      ]},
      { heading: 'Rendering', items: [
        { label: 'Canvas 2D Pipeline', desc: '60 FPS hardware engine', route: '#features' },
        { label: 'Force Simulation', desc: 'Spring physics layout', route: '#features' },
        { label: 'Edge Routing', desc: 'Directional Bezier curves', route: '#features' },
      ]},
    ],
  },
  Platform: {
    title: 'Cross-Platform Studio',
    description: 'Run instantly in your web browser or launch native desktop autonomy.',
    columns: [
      { heading: 'Environments', items: [
        { label: 'Web Studio', desc: 'Browser canvas & cloud sync', route: '/app' },
        { label: 'Windows Desktop', desc: 'Native Electron 43 app', route: '/download' },
        { label: 'Portable (.exe)', desc: 'Zero-install standalone', route: '/download' },
      ]},
      { heading: 'Tooling', items: [
        { label: 'File Watcher', desc: 'Direct filesystem sync', route: '#features' },
        { label: 'Telemetry CLI', desc: 'Terminal metrics', route: '#terminal' },
      ]},
    ],
  },
  'Sync Engine': {
    title: 'Local-First Storage',
    description: 'Deterministic offline persistence with sub-millisecond local writes.',
    columns: [
      { heading: 'Client Store', items: [
        { label: 'IndexedDB 3.0', desc: '10 structured object stores', route: '#pillars' },
        { label: 'WAL Buffer', desc: 'Synchronous mutation log', route: '#pillars' },
        { label: '350ms Debouncer', desc: 'Atomic batch queue', route: '#pillars' },
      ]},
      { heading: 'Cloud Sync', items: [
        { label: 'Supabase Postgres', desc: 'ACID relational backup', route: '#pillars' },
        { label: 'Better Auth', desc: 'Cryptographic sessions', route: '#features' },
      ]},
    ],
  },
  Docs: {
    title: 'Developer Documentation',
    description: 'Everything you need to integrate, model, and deploy with HUPA.',
    columns: [
      { heading: 'Learn', items: [
        { label: 'Documentation', desc: 'Architecture guides', route: '/docs' },
        { label: 'Getting Started', desc: 'First graph in 30s', route: '/docs?doc=getting-started' },
        { label: 'Data Schemas', desc: 'Node & edge contracts', route: '/docs?doc=graph-data-model' },
      ]},
      { heading: 'Specs', items: [
        { label: 'Sync Specs', desc: 'IDB & Postgres replication', route: '/docs?doc=local-first-and-sync' },
        { label: 'Changelog', desc: 'Release history', route: 'https://github.com/sagarmurkute/hupa/releases' },
      ]},
    ],
  },
};

const NAV_KEYS = Object.keys(MEGA);

interface NavbarProps {
  onNavigate: (route: string) => void;
  theme?: string;
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, theme, onToggleTheme }) => {
  const [activeMega, setActiveMega] = useState<string | null>(null);

  const handleLink = (e: React.MouseEvent, route: string) => {
    e.preventDefault();
    setActiveMega(null);
    if (route.startsWith('#')) {
      const el = document.querySelector(route);
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; }
    }
    onNavigate(route);
  };

  return (
    <header className="site-header" onMouseLeave={() => setActiveMega(null)}>
      <div className="header-inner">
        {/* Brand */}
        <div className="brand-mark">
          <a href="/" onClick={(e) => handleLink(e, '/')} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="brand-icon-neon">H</div>
            <span>HUPA</span>
          </a>
        </div>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          <ul>
            {NAV_KEYS.map((key) => (
              <li key={key} onMouseEnter={() => setActiveMega(key)}>
                <button className="nav-link-item" aria-expanded={activeMega === key}>
                  <span>{key}</span>
                  <span style={{ fontSize: 10, opacity: 0.6 }}>▾</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="header-right">
          <a
            href="https://github.com/sagarmurkute/hupa"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon-secondary"
            style={{ height: 36, padding: '0 14px', fontSize: 13 }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span>★ 1.2k</span>
          </a>

          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="btn-neon-secondary"
              style={{ width: 36, height: 36, padding: 0 }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          )}

          <button onClick={() => onNavigate('/app')} className="btn-neon-primary" style={{ height: 36, padding: '0 16px', fontSize: 13 }}>
            <span>Open Studio</span>
          </button>
        </div>
      </div>

      {/* Mega Menus */}
      {NAV_KEYS.map((key) => {
        const cat = MEGA[key];
        return (
          <div key={key} className={`mega-dropdown ${activeMega === key ? 'is-open' : ''}`}>
            <div className="mega-dropdown-inner">
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 8px', color: 'var(--text-white)' }}>{cat.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>{cat.description}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
                {cat.columns.map((col) => (
                  <div key={col.heading}>
                    <h4 style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--neon-green-text)', margin: '0 0 12px', textTransform: 'uppercase' }}>
                      {col.heading}
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
                      {col.items.map((item) => (
                        <li key={item.label}>
                          <a href={item.route} onClick={(e) => handleLink(e, item.route)} style={{ display: 'block' }}>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-white)' }}>{item.label}</div>
                            <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{item.desc}</div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </header>
  );
};
