import React, { useEffect, useRef } from 'react';
import { gsap } from './useScrollReveal';

interface FooterProps {
  onNavigate: (route: string) => void;
}

const FOOTER_COLUMNS = [
  {
    heading: 'Product',
    links: [
      { label: 'HUPA Studio', route: '/app' },
      { label: 'Graph Editor', route: '/app' },
      { label: 'Project Management', route: '/app' },
      { label: 'Collaboration', route: '/solutions/teams' },
      { label: 'Import & Export', route: '/app' },
      { label: 'Templates', route: '/templates' },
      { label: 'Windows Desktop', route: '/download' },
    ],
  },
  {
    heading: 'Solutions',
    links: [
      { label: 'Software Projects', route: '/solutions/software-projects' },
      { label: 'Web Applications', route: '/solutions/web-applications' },
      { label: 'Mobile Applications', route: '/solutions/mobile-applications' },
      { label: 'AI Projects', route: '/solutions/ai-projects' },
      { label: 'APIs & Backend', route: '/solutions/apis-backend' },
      { label: 'Infrastructure', route: '/solutions/infrastructure' },
      { label: 'Open Source', route: '/solutions/open-source' },
      { label: 'Teams', route: '/solutions/teams' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Documentation', route: '/docs' },
      { label: 'Getting Started', route: '/docs?doc=getting-started' },
      { label: 'Architecture Specs', route: '/docs?doc=architecture' },
      { label: 'Data Model', route: '/docs?doc=graph-data-model' },
      { label: 'Sync Protocols', route: '/docs?doc=local-first-and-sync' },
      { label: 'Examples', route: '/examples' },
      { label: 'Changelog', route: 'https://github.com/sagarmurkute/hupa/releases' },
      { label: 'Blog', route: '/blog' },
      { label: 'Community', route: 'https://github.com/sagarmurkute/hupa/discussions' },
      { label: 'Help Center', route: '/help' },
    ],
  },
  {
    heading: 'Developers',
    links: [
      { label: 'Developer Docs', route: '/docs?doc=architecture' },
      { label: 'API Reference', route: '/docs?doc=graph-data-model' },
      { label: 'Desktop SDK', route: '/docs?doc=desktop-application' },
      { label: 'CLI Tool', route: '/cli' },
      { label: 'Integrations', route: '/integrations' },
      { label: 'Plugins', route: '/plugins' },
      { label: 'GitHub Repository', route: 'https://github.com/sagarmurkute/hupa' },
      { label: 'Contributing Guide', route: 'https://github.com/sagarmurkute/hupa/blob/main/CONTRIBUTING.md' },
      { label: 'Roadmap', route: '/roadmap' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About HUPA', route: '/about' },
      { label: 'Open Source (MIT)', route: 'https://github.com/sagarmurkute/hupa/blob/main/LICENSE' },
      { label: 'Security Policy', route: '/security' },
      { label: 'Privacy Policy', route: '/privacy' },
      { label: 'Terms of Service', route: '/terms' },
      { label: 'Contact', route: '/contact' },
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
        {/* Sitemap Grid */}
        <div ref={gridRef} className="land-footer-grid" style={{ gridTemplateColumns: '1.2fr repeat(5, 1fr)', gap: 32 }}>
          {/* Brand Column */}
          <div>
            <div className="land-footer-brand">
              <div className="land-brand-mark">H</div>
              <span className="land-footer-brand-text">HUPA</span>
            </div>
            <p className="land-footer-desc">
              The spatial graph engine for software architecture. Local-first speed with autonomous cloud replication.
            </p>
            <div className="land-footer-status">
              <span className="land-footer-status-dot" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Categorized Columns */}
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
          <div>© {new Date().getFullYear()} HUPA Engine. Distributed under the MIT License.</div>
          <div className="land-footer-bottom-links">
            <a href="https://github.com/sagarmurkute/hupa" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="/docs" onClick={(e) => handleLink(e, '/docs')}>Docs</a>
            <a href="/download" onClick={(e) => handleLink(e, '/download')}>Download</a>
            <a href="/security" onClick={(e) => handleLink(e, '/security')}>Security</a>
            <a href="/privacy" onClick={(e) => handleLink(e, '/privacy')}>Privacy</a>
            <a href="/terms" onClick={(e) => handleLink(e, '/terms')}>Terms</a>
            <a href="/app" onClick={(e) => handleLink(e, '/app')}>Studio</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
