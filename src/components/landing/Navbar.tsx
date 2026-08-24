import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigate: (route: string) => void;
  theme?: string;
  onToggleTheme?: () => void;
}

const NAV_LINKS = [
  { label: 'Features', route: '#features' },
  { label: 'Architecture', route: '#architecture' },
  { label: 'Performance', route: '#performance' },
  { label: 'Docs', route: '/docs' },
  { label: 'Download', route: '/download' },
];

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, theme, onToggleTheme }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const handleLink = useCallback((e: React.MouseEvent, route: string) => {
    e.preventDefault();
    setIsMobileOpen(false);
    if (route.startsWith('#')) {
      const el = document.querySelector(route);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    if (route.startsWith('http')) {
      window.open(route, '_blank', 'noopener,noreferrer');
      return;
    }
    onNavigate(route);
  }, [onNavigate]);

  return (
    <header className={`land-header ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="land-header-inner">
        {/* Brand */}
        <a
          href="/"
          className="land-brand"
          onClick={(e) => handleLink(e, '/')}
        >
          <div className="land-brand-mark">H</div>
          <span>HUPA</span>
        </a>

        {/* Desktop Nav */}
        <nav className="land-nav" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.route}
              className="land-nav-link"
              onClick={(e) => handleLink(e, link.route)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="land-header-actions">
          <a
            href="https://github.com/sagarmurkute/hupa"
            target="_blank"
            rel="noopener noreferrer"
            className="land-btn-ghost"
            aria-label="View on GitHub"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span>GitHub</span>
          </a>

          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="land-btn-ghost"
              aria-label="Toggle theme"
              style={{ width: 36, height: 36, padding: 0, justifyContent: 'center' }}
            >
              {theme === 'dark' ? '☀' : '●'}
            </button>
          )}

          <button
            onClick={() => onNavigate('/app')}
            className="land-btn-primary"
            style={{ height: 36, padding: '0 16px', fontSize: 13 }}
          >
            Open Studio
          </button>

          {/* Mobile toggle */}
          <button
            className="land-mobile-toggle"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`land-mobile-menu ${isMobileOpen ? 'is-open' : ''}`}>
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.route}
            onClick={(e) => handleLink(e, link.route)}
          >
            {link.label}
          </a>
        ))}
        <button onClick={() => { setIsMobileOpen(false); onNavigate('/app'); }}>
          Open Studio →
        </button>
      </div>
    </header>
  );
};
