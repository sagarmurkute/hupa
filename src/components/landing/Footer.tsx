import React, { useEffect, useRef } from 'react';
import { gsap } from './useScrollReveal';

interface FooterProps {
  onNavigate: (route: string) => void;
}

const FOOTER_COLUMNS = [
  {
    heading: 'Architecture',
    links: [
      { label: 'Spatial Model', route: '#features' },
      { label: 'Force Simulation', route: '#features' },
      { label: 'LOD Culling', route: '#features' },
      { label: 'Topology Parser', route: '#architecture' },
      { label: 'Cycle Detection', route: '#architecture' },
    ],
  },
  {
    heading: 'Platform',
    links: [
      { label: 'Web Studio', route: '/app' },
      { label: 'Windows Desktop', route: '/download' },
      { label: 'Portable Build', route: '/download' },
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

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const footerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      if (gridRef.current) {
        const cols = gridRef.current.children;
        gsap.fromTo(cols,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 90%',
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="land-footer" role="contentinfo">
      <div className="land-container">
        <div ref={gridRef} className="land-footer-grid">
          {/* Brand Column */}
          <div>
            <div className="land-footer-brand">
              <div className="land-brand-mark">H</div>
              <span className="land-footer-brand-text">HUPA</span>
            </div>
            <p className="land-footer-desc">
              The spatial graph engine for developers. Local-first speed with autonomous cloud sync.
            </p>
            <div className="land-footer-status">
              <span className="land-footer-status-dot" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Link Columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} className="land-footer-col">
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

        {/* Bottom bar */}
        <div className="land-footer-bottom">
          <div>© {new Date().getFullYear()} HUPA Engine. MIT License.</div>
          <div className="land-footer-bottom-links">
            <a href="https://github.com/sagarmurkute/hupa" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="/docs" onClick={(e) => handleLink(e, '/docs')}>Docs</a>
            <a href="/download" onClick={(e) => handleLink(e, '/download')}>Download</a>
            <a href="/app" onClick={(e) => handleLink(e, '/app')}>Studio</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
