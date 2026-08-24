import React from 'react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleLink = (e: React.MouseEvent, route: string) => {
    e.preventDefault();
    if (route.startsWith('#')) {
      const el = document.querySelector(route);
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return; }
    }
    if (route.startsWith('http')) {
      window.open(route, '_blank', 'noopener,noreferrer');
      return;
    }
    onNavigate(route);
  };

  const FOOTER_COLUMNS = [
    {
      heading: 'Architecture',
      links: [
        { label: 'Spatial Model', route: '#features' },
        { label: 'Force Simulation', route: '#features' },
        { label: 'LOD Culling', route: '#features' },
        { label: 'Topology Parser', route: '#diagram' },
        { label: 'Cycle WASM', route: '#diagram' },
      ],
    },
    {
      heading: 'Platform',
      links: [
        { label: 'Web Studio', route: '/app' },
        { label: 'Windows Desktop', route: '/download' },
        { label: 'Portable Build', route: '/download' },
        { label: 'Electron 43', route: '/download' },
        { label: 'File Watcher', route: '#features' },
      ],
    },
    {
      heading: 'Resources',
      links: [
        { label: 'Documentation', route: '/docs' },
        { label: 'Getting Started', route: '/docs?doc=getting-started' },
        { label: 'Data Schemas', route: '/docs?doc=graph-data-model' },
        { label: 'Sync Specs', route: '/docs?doc=local-first-and-sync' },
        { label: 'Changelog', route: 'https://github.com/sagarmurkute/hupa/releases' },
      ],
    },
    {
      heading: 'Community',
      links: [
        { label: 'GitHub', route: 'https://github.com/sagarmurkute/hupa' },
        { label: 'Issues & RFCs', route: 'https://github.com/sagarmurkute/hupa/issues' },
        { label: 'Discussions', route: 'https://github.com/sagarmurkute/hupa/discussions' },
        { label: 'MIT License', route: 'https://github.com/sagarmurkute/hupa/blob/main/LICENSE' },
      ],
    },
  ];

  return (
    <footer className="neon-footer" role="contentinfo">
      <div className="container">
        <div className="neon-footer-grid">
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div className="brand-icon-neon">H</div>
              <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-white)' }}>HUPA</span>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.6, maxWidth: '28ch' }}>
              The Universal Spatial Graph Engine for Developers. Local-first speed with autonomous cloud sync.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: 'var(--neon-surface)', border: '1px solid var(--neon-border)', borderRadius: 20, fontSize: 12, color: 'var(--neon-green-text)', fontFamily: 'var(--mono)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--neon-green)' }} />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Links Cols */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} className="neon-footer-col">
              <h4>{col.heading}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.route} onClick={(e) => handleLink(e, link.route)}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer Bottom Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 28, fontSize: 13, color: 'var(--text-dim)', flexWrap: 'wrap', gap: 16 }}>
          <div>© {new Date().getFullYear()} HUPA Engine. Released under the MIT License.</div>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="https://github.com/sagarmurkute/hupa" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}>GitHub</a>
            <a href="/docs" onClick={(e) => handleLink(e, '/docs')} style={{ color: 'var(--text-muted)' }}>Docs</a>
            <a href="/download" onClick={(e) => handleLink(e, '/download')} style={{ color: 'var(--text-muted)' }}>Download</a>
            <a href="/app" onClick={(e) => handleLink(e, '/app')} style={{ color: 'var(--text-muted)' }}>Studio</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
