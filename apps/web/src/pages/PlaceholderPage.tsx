import React, { useEffect } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { useSmoothScroll } from '../components/landing/useScrollReveal';
import '../styles/landing.css';

interface PlaceholderPageProps {
  title: string;
  category: string;
  description: string;
  onNavigate: (route: string) => void;
  actionRoute?: string;
  actionLabel?: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  category,
  description,
  onNavigate,
  actionRoute = '/app',
  actionLabel = 'Open HUPA Studio',
}) => {
  useSmoothScroll();

  useEffect(() => {
    document.title = `${title} — HUPA Architecture Studio`;
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="landing-root">
      <Navbar onNavigate={onNavigate} />

      <main className="land-subpage">
        <div className="land-container" style={{ paddingBottom: 100 }}>
          {/* Breadcrumb / Back button */}
          <div style={{ marginBottom: 32 }}>
            <button
              onClick={() => onNavigate('/')}
              className="land-btn-ghost"
              style={{ padding: '0 8px', fontSize: 13, gap: 6 }}
            >
              <ArrowLeft size={14} />
              <span>Back to Home</span>
            </button>
          </div>

          {/* Main Card */}
          <div
            style={{
              background: 'var(--land-bg-elevated)',
              border: '1px solid var(--land-border-2)',
              borderRadius: 16,
              padding: '64px 48px',
              maxWidth: 860,
              boxShadow: 'var(--land-shadow-lg)',
            }}
          >
            <div className="land-section-label" style={{ marginBottom: 12 }}>
              {category}
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 4vw, 48px)',
                fontWeight: 600,
                color: 'var(--land-text-hero)',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                margin: '0 0 20px',
              }}
            >
              {title}
            </h1>

            <p
              style={{
                fontSize: 16,
                color: 'var(--land-text-2)',
                lineHeight: 1.7,
                maxWidth: '65ch',
                marginBottom: 40,
                fontWeight: 400,
              }}
            >
              {description}
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => onNavigate(actionRoute)}
                className="land-btn-primary"
                style={{ height: 44, padding: '0 24px', fontSize: 14 }}
              >
                <span>{actionLabel}</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => onNavigate('/docs')}
                className="land-btn-secondary"
                style={{ height: 44, padding: '0 20px', fontSize: 14 }}
              >
                <span>Read Documentation</span>
              </button>

              <a
                href="https://github.com/sagarmurkute/hupa"
                target="_blank"
                rel="noopener noreferrer"
                className="land-btn-ghost"
                style={{ height: 44, padding: '0 16px', fontSize: 14 }}
              >
                <span>GitHub Repository</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default PlaceholderPage;
