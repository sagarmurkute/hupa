import React, { useEffect, useRef } from 'react';
import { Globe, Monitor, ArrowRight, Check } from 'lucide-react';
import { gsap } from './useScrollReveal';

interface CrossPlatformProps {
  onNavigate: (route: string) => void;
}

export const CrossPlatformSection: React.FC<CrossPlatformProps> = ({ onNavigate }) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.platform-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="land-section" style={{ borderTop: '1px solid var(--land-border)', position: 'relative' }}>
      <div className="land-container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 60px' }}>
          <div className="land-section-label">Cross-Platform Runtime</div>
          <h2 className="land-section-title" style={{ fontSize: 'clamp(32px, 4.5vw, 54px)', lineHeight: 1.08 }}>
            Work wherever your project lives.
          </h2>
          <p className="land-section-subtitle" style={{ fontSize: 17, maxWidth: 580, margin: '0 auto' }}>
            Instant browser access or native Windows desktop performance with full local filesystem persistence.
          </p>
        </div>

        {/* 2-Column Comparison & CTAs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24,
            maxWidth: 960,
            margin: '0 auto',
          }}
        >
          {/* Card 1: HUPA Web */}
          <div
            className="platform-card"
            style={{
              background: 'var(--land-bg-elevated)',
              border: '1px solid var(--land-border-2)',
              borderRadius: 16,
              padding: '36px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--land-shadow-md)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#ffffff', color: '#000000', display: 'grid', placeItems: 'center' }}>
                    <Globe size={20} />
                  </div>
                  <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--land-text)' }}>
                    HUPA Web
                  </span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--land-text-3)', background: 'var(--land-surface-2)', padding: '3px 8px', borderRadius: 4 }}>
                  Zero Install
                </span>
              </div>

              <p style={{ fontSize: 14, color: 'var(--land-text-2)', lineHeight: 1.6, marginBottom: 24 }}>
                Instant browser runtime. IndexedDB storage engine, frictionless cloud sync, and cross-browser spatial canvas.
              </p>

              <div style={{ display: 'grid', gap: 10, fontSize: 13, color: 'var(--land-text-2)', marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Check size={15} style={{ color: '#ffffff' }} />
                  <span>Runs in Chrome, Edge, Safari, Firefox</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Check size={15} style={{ color: '#ffffff' }} />
                  <span>Instant URL sharing & cloud replication</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Check size={15} style={{ color: '#ffffff' }} />
                  <span>Export JSON, PNG, SVG & Mermaid diagrams</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/app')}
              className="land-btn-secondary"
              style={{ width: '100%', height: 44, fontSize: 14, justifyContent: 'center' }}
            >
              <span>Launch Web Studio</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Card 2: HUPA Desktop (Windows) */}
          <div
            className="platform-card"
            style={{
              background: 'var(--land-surface)',
              border: '1.5px solid #ffffff',
              borderRadius: 16,
              padding: '36px 28px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--land-shadow-lg)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#ffffff', color: '#000000', display: 'grid', placeItems: 'center' }}>
                    <Monitor size={20} />
                  </div>
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#ffffff' }}>
                    HUPA Desktop
                  </span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#000000', background: '#ffffff', padding: '3px 8px', borderRadius: 4, fontWeight: 700 }}>
                  Windows Native
                </span>
              </div>

              <p style={{ fontSize: 14, color: 'var(--land-text-2)', lineHeight: 1.6, marginBottom: 24 }}>
                Native Electron desktop application with direct local disk `.hupa` file saving, window controls, and offline sovereignty.
              </p>

              <div style={{ display: 'grid', gap: 10, fontSize: 13, color: 'var(--land-text-2)', marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Check size={15} style={{ color: '#ffffff' }} />
                  <span>Native Windows 10 & 11 executable (x64)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Check size={15} style={{ color: '#ffffff' }} />
                  <span>Local file open/save dialogs (.hupa JSON)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Check size={15} style={{ color: '#ffffff' }} />
                  <span>Hardware-accelerated 60 FPS canvas</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('/download')}
              className="land-btn-primary"
              style={{ width: '100%', height: 44, fontSize: 14, justifyContent: 'center' }}
            >
              <span>Download for Windows →</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
