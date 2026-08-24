import React, { useEffect, useRef } from 'react';
import { ArrowRight, ExternalLink, Network, Box, Database, Server, Sparkles } from 'lucide-react';
import { gsap } from './useScrollReveal';

interface FinalConvergenceProps {
  onNavigate: (route: string) => void;
}

export const FinalConvergenceSection: React.FC<FinalConvergenceProps> = ({ onNavigate }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const convergenceContainerRef = useRef<HTMLDivElement>(null);
  const centerHubRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Convergence animation: peripheral nodes pull in towards the center hub
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 50%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo('.final-header',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
      )
      .fromTo('.converge-node',
        { opacity: 0, scale: 0.4, x: (i) => (i % 2 === 0 ? -60 : 60), y: (i) => (i < 2 ? -40 : 40) },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'expo.out',
        },
        '-=0.3'
      )
      .fromTo(centerHubRef.current,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.8)' },
        '-=0.6'
      )
      .fromTo('.converge-edge',
        { opacity: 0 },
        { opacity: 0.6, duration: 0.6, stagger: 0.1 },
        '-=0.4'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="land-section" style={{ borderTop: '1px solid var(--land-border)', paddingBottom: 100, position: 'relative', overflow: 'hidden' }}>
      <div className="land-container">
        {/* Header */}
        <div className="final-header" style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 48px' }}>
          <div className="land-section-label">Unified System Convergence</div>
          <h2 className="land-section-title" style={{ fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 1.05 }}>
            Understand your whole project.
          </h2>
          <p className="land-section-subtitle" style={{ fontSize: 18, maxWidth: 580, margin: '0 auto 36px' }}>
            Turn architectural complexity into a spatial system you can explore with confidence.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
            <button
              onClick={() => onNavigate('/app')}
              className="land-btn-primary"
              style={{ height: 48, padding: '0 28px', fontSize: 15 }}
            >
              <span>Start with HUPA</span>
              <ArrowRight size={16} />
            </button>

            <a
              href="https://github.com/sagarmurkute/hupa"
              target="_blank"
              rel="noopener noreferrer"
              className="land-btn-secondary"
              style={{ height: 48, padding: '0 24px', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <span>Explore GitHub</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* Converging Grand Ecosystem Graph */}
        <div
          ref={convergenceContainerRef}
          style={{
            position: 'relative',
            height: 380,
            maxWidth: 860,
            margin: '0 auto',
            background: 'var(--land-bg-elevated)',
            border: '1px solid var(--land-border-3)',
            borderRadius: 20,
            boxShadow: 'var(--land-shadow-xl)',
            overflow: 'hidden',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {/* SVG Connector Web */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <line className="converge-edge" x1="180" y1="80" x2="430" y2="190" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 4" />
            <line className="converge-edge" x1="680" y1="80" x2="430" y2="190" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 4" />
            <line className="converge-edge" x1="180" y1="300" x2="430" y2="190" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 4" />
            <line className="converge-edge" x1="680" y1="300" x2="430" y2="190" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="4 4" />
          </svg>

          {/* Center Hub: Unified Project */}
          <div
            ref={centerHubRef}
            style={{
              zIndex: 10,
              background: '#ffffff',
              color: '#000000',
              padding: '16px 24px',
              borderRadius: 12,
              textAlign: 'center',
              boxShadow: '0 12px 40px rgba(255,255,255,0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
              <Network size={18} style={{ color: '#000000' }} />
              <span style={{ fontSize: 15, fontWeight: 800, color: '#000000' }}>Unified Architecture</span>
            </div>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#333333', fontWeight: 600 }}>
              HUPA Spatial Graph Core
            </span>
          </div>

          {/* Peripheral Converging Nodes */}
          {/* Top Left */}
          <div className="converge-node" style={{ position: 'absolute', left: 40, top: 40, background: 'var(--land-surface)', border: '1px solid var(--land-border-3)', padding: '10px 14px', borderRadius: 8, zIndex: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--land-text)' }}>
              <Box size={13} style={{ color: '#ffffff' }} />
              <span>Web & Mobile</span>
            </div>
          </div>

          {/* Top Right */}
          <div className="converge-node" style={{ position: 'absolute', right: 40, top: 40, background: 'var(--land-surface)', border: '1px solid var(--land-border-3)', padding: '10px 14px', borderRadius: 8, zIndex: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--land-text)' }}>
              <Sparkles size={13} style={{ color: '#ffffff' }} />
              <span>AI Agents</span>
            </div>
          </div>

          {/* Bottom Left */}
          <div className="converge-node" style={{ position: 'absolute', left: 40, bottom: 40, background: 'var(--land-surface)', border: '1px solid var(--land-border-3)', padding: '10px 14px', borderRadius: 8, zIndex: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--land-text)' }}>
              <Server size={13} style={{ color: '#ffffff' }} />
              <span>APIs & Workers</span>
            </div>
          </div>

          {/* Bottom Right */}
          <div className="converge-node" style={{ position: 'absolute', right: 40, bottom: 40, background: 'var(--land-surface)', border: '1px solid var(--land-border-3)', padding: '10px 14px', borderRadius: 8, zIndex: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--land-text)' }}>
              <Database size={13} style={{ color: '#ffffff' }} />
              <span>PostgreSQL & Caches</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
