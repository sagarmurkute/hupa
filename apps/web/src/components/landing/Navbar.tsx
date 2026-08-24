import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface NavbarProps {
  onNavigate: (route: string) => void;
  theme?: string;
  onToggleTheme?: () => void;
}

interface NavDropdownItem {
  label: string;
  route: string;
  desc?: string;
}

interface NavCategory {
  label: string;
  items: NavDropdownItem[];
}

const NAV_CATEGORIES: NavCategory[] = [
  {
    label: 'Product',
    items: [
      { label: 'HUPA Studio', route: '/app', desc: 'Full spatial architectural IDE' },
      { label: 'Graph Editor', route: '/app', desc: 'Interactive 2D node & edge canvas' },
      { label: 'Project Management', route: '/app', desc: 'Multi-graph hierarchies & views' },
      { label: 'Collaboration', route: '/solutions/teams', desc: 'Real-time & team architecture' },
      { label: 'Import & Export', route: '/app', desc: 'JSON, PNG, SVG & schema interchange' },
      { label: 'Templates', route: '/templates', desc: 'Microservices, AI swarms, event-driven' },
    ],
  },
  {
    label: 'Solutions',
    items: [
      { label: 'Software Projects', route: '/solutions/software-projects' },
      { label: 'Web Applications', route: '/solutions/web-applications' },
      { label: 'Mobile Applications', route: '/solutions/mobile-applications' },
      { label: 'AI Projects', route: '/solutions/ai-projects' },
      { label: 'APIs & Backend', route: '/solutions/apis-backend' },
      { label: 'Infrastructure', route: '/solutions/infrastructure' },
      { label: 'Open Source Projects', route: '/solutions/open-source' },
      { label: 'Teams', route: '/solutions/teams' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { label: 'Documentation', route: '/docs' },
      { label: 'Guides', route: '/docs?doc=getting-started' },
      { label: 'Examples', route: '/examples' },
      { label: 'Templates', route: '/templates' },
      { label: 'Changelog', route: 'https://github.com/sagarmurkute/hupa/releases' },
      { label: 'Blog', route: '/blog' },
      { label: 'Community', route: 'https://github.com/sagarmurkute/hupa/discussions' },
      { label: 'Help Center', route: '/help' },
    ],
  },
  {
    label: 'Developers',
    items: [
      { label: 'Developer Docs', route: '/docs?doc=architecture' },
      { label: 'API Reference', route: '/docs?doc=graph-data-model' },
      { label: 'SDK', route: '/docs?doc=desktop-application' },
      { label: 'CLI', route: '/cli' },
      { label: 'Integrations', route: '/integrations' },
      { label: 'Plugins', route: '/plugins' },
      { label: 'GitHub', route: 'https://github.com/sagarmurkute/hupa' },
      { label: 'Contributing', route: 'https://github.com/sagarmurkute/hupa/blob/main/CONTRIBUTING.md' },
      { label: 'Roadmap', route: '/roadmap' },
    ],
  },
  {
    label: 'Company',
    items: [
      { label: 'About HUPA', route: '/about' },
      { label: 'Open Source', route: 'https://github.com/sagarmurkute/hupa/blob/main/LICENSE' },
      { label: 'Security', route: '/security' },
      { label: 'Privacy', route: '/privacy' },
      { label: 'Terms', route: '/terms' },
      { label: 'Contact', route: '/contact' },
    ],
  },
];

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, theme: propTheme, onToggleTheme }) => {
  const [internalTheme, toggleInternalTheme] = useTheme();
  const activeTheme = propTheme || internalTheme;
  const handleToggleTheme = onToggleTheme || toggleInternalTheme;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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
    setActiveDropdown(null);

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

        {/* Desktop Nav with Dropdowns */}
        <nav className="land-nav" aria-label="Main navigation">
          {NAV_CATEGORIES.map((cat) => (
            <div
              key={cat.label}
              className="land-nav-item"
              onMouseEnter={() => setActiveDropdown(cat.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className="land-nav-link"
                onClick={() => setActiveDropdown(activeDropdown === cat.label ? null : cat.label)}
                aria-expanded={activeDropdown === cat.label}
              >
                <span>{cat.label}</span>
                <ChevronDown size={12} style={{ opacity: 0.7, marginTop: 1 }} />
              </button>

              {/* Dropdown Menu */}
              <div className={`land-nav-dropdown-menu ${activeDropdown === cat.label ? 'is-open' : ''}`}>
                {cat.items.map((item) => (
                  <a
                    key={item.label}
                    href={item.route}
                    className="land-dropdown-link"
                    onClick={(e) => handleLink(e, item.route)}
                  >
                    <div style={{ color: 'var(--land-text-hero)', fontWeight: 500 }}>{item.label}</div>
                    {item.desc && (
                      <div style={{ fontSize: 11, color: 'var(--land-text-4)', marginTop: 2 }}>
                        {item.desc}
                      </div>
                    )}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="land-header-actions">
          {/* GitHub */}
          <a
            href="https://github.com/sagarmurkute/hupa"
            target="_blank"
            rel="noopener noreferrer"
            className="land-btn-ghost"
            aria-label="View on GitHub"
            style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span className="hidden-mobile">GitHub</span>
          </a>

          {/* Sign In */}
          <button
            onClick={() => onNavigate('/app?auth=signin')}
            className="land-btn-ghost"
            style={{ fontSize: 13, padding: '0 12px' }}
          >
            Sign In
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={handleToggleTheme}
            className="land-theme-toggle"
            aria-label={`Switch to ${activeTheme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${activeTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {activeTheme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Get Started */}
          <button
            onClick={() => onNavigate('/app')}
            className="land-btn-primary"
            style={{ height: 36, padding: '0 16px', fontSize: 13 }}
          >
            Get Started
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
      <div className={`land-mobile-menu ${isMobileOpen ? 'is-open' : ''}`} style={{ overflowY: 'auto', maxHeight: 'calc(100vh - var(--land-header-h))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--land-border)' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--land-text)' }}>Appearance</span>
          <button
            onClick={handleToggleTheme}
            className="land-theme-toggle"
            aria-label="Toggle Theme"
          >
            {activeTheme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        {NAV_CATEGORIES.map((cat) => (
          <div key={cat.label} style={{ marginBottom: 16 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--land-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              {cat.label}
            </div>
            <div style={{ display: 'grid', gap: 6 }}>
              {cat.items.map((item) => (
                <a
                  key={item.label}
                  href={item.route}
                  onClick={(e) => handleLink(e, item.route)}
                  style={{ fontSize: 14, padding: '6px 0', borderBottom: 'none', color: 'var(--land-text-2)' }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        ))}
        <div style={{ marginTop: 24, display: 'grid', gap: 10 }}>
          <button onClick={() => { setIsMobileOpen(false); onNavigate('/app?auth=signin'); }} className="land-btn-secondary" style={{ width: '100%' }}>
            Sign In
          </button>
          <button onClick={() => { setIsMobileOpen(false); onNavigate('/app'); }} className="land-btn-primary" style={{ width: '100%' }}>
            Get Started →
          </button>
        </div>
      </div>
    </header>
  );
};

