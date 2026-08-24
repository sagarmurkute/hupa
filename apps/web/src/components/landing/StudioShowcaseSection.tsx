import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from './useScrollReveal';

interface StudioShowcaseProps {
  onNavigate: (route: string) => void;
}

export const StudioShowcaseSection: React.FC<StudioShowcaseProps> = ({ onNavigate }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const studioFrameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(studioFrameRef.current,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
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
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 48px' }}>
          <div className="land-section-label">Real Spatial IDE</div>
          <h2 className="land-section-title" style={{ fontSize: 'clamp(32px, 4.5vw, 54px)', lineHeight: 1.08 }}>
            The actual HUPA Studio.
          </h2>
          <p className="land-section-subtitle" style={{ fontSize: 17, maxWidth: 580, margin: '0 auto 28px' }}>
            A complete spatial developer environment designed from the ground up for software architects.
          </p>
          <div>
            <button
              onClick={() => onNavigate('/app')}
              className="land-btn-primary"
              style={{ height: 46, padding: '0 26px', fontSize: 15 }}
            >
              <span>Open HUPA Studio</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Real Product Interface Mockup Frame */}
        <div
          ref={studioFrameRef}
          style={{
            background: 'var(--land-bg-elevated)',
            border: '1px solid var(--land-border-3)',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: 'var(--land-shadow-xl)',
            maxWidth: 1120,
            margin: '0 auto',
          }}
        >
          {/* 1. Studio TopBar */}
          <div
            style={{
              height: 44,
              background: 'var(--land-surface)',
              borderBottom: '1px solid var(--land-border-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: 5, background: '#ffffff', color: '#000000', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 11 }}>
                H
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                <span style={{ color: 'var(--land-text-3)' }}>Sagar Ecosystem</span>
                <span style={{ color: 'var(--land-text-4)' }}>/</span>
                <span style={{ color: '#ffffff', fontWeight: 600 }}>Architecture Graph</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, background: 'var(--land-surface-2)', padding: '3px 8px', borderRadius: 4, color: 'var(--land-text-3)' }}>
                Ctrl + K Palette
              </span>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffffff' }} />
              <span style={{ fontSize: 11, color: 'var(--land-text-2)', fontFamily: 'var(--font-mono)' }}>Synced (Local-First)</span>
            </div>
          </div>

          {/* 2. Workspace 3-Pane Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 260px', height: 420, background: '#000000' }}>
            {/* Left Sidebar Pane */}
            <div style={{ background: 'var(--land-bg-elevated)', borderRight: '1px solid var(--land-border)', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--land-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  PERSPECTIVE VIEWS
                </div>
                <div style={{ display: 'grid', gap: 4 }}>
                  <div style={{ background: '#ffffff', color: '#000000', padding: '6px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>Unified Graph</div>
                  <div style={{ color: 'var(--land-text-2)', padding: '6px 10px', fontSize: 12 }}>Architecture View</div>
                  <div style={{ color: 'var(--land-text-2)', padding: '6px 10px', fontSize: 12 }}>Dependency Tree</div>
                  <div style={{ color: 'var(--land-text-2)', padding: '6px 10px', fontSize: 12 }}>AI Topologies</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--land-text-3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  NODE PALETTE
                </div>
                <div style={{ display: 'grid', gap: 4, fontSize: 11, color: 'var(--land-text-3)' }}>
                  <div>+ Add Microservice</div>
                  <div>+ Add Database Tier</div>
                  <div>+ Add AI Agent</div>
                  <div>+ Add API Endpoint</div>
                </div>
              </div>
            </div>

            {/* Center Interactive Graph Canvas */}
            <div style={{ position: 'relative', overflow: 'hidden', background: '#000000', display: 'grid', placeItems: 'center' }}>
              {/* Grid dots */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

              {/* Node Cards on Canvas */}
              <div style={{ position: 'relative', width: 420, height: 260 }}>
                {/* Node A */}
                <div style={{ position: 'absolute', left: 20, top: 40, background: 'var(--land-surface)', border: '1.5px solid var(--land-border-3)', padding: '12px 14px', borderRadius: 10, width: 140, boxShadow: 'var(--land-shadow-md)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--land-text)' }}>Gateway</div>
                  <div style={{ fontSize: 10, color: 'var(--land-text-3)', fontFamily: 'var(--font-mono)' }}>Fastify Ingress</div>
                </div>

                {/* Node B */}
                <div style={{ position: 'absolute', right: 20, top: 120, background: '#ffffff', color: '#000000', border: '1px solid #ffffff', padding: '12px 14px', borderRadius: 10, width: 150, boxShadow: '0 10px 30px rgba(255,255,255,0.2)' }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#000000' }}>PostgreSQL Cluster</div>
                  <div style={{ fontSize: 10, color: '#333333', fontFamily: 'var(--font-mono)' }}>Master + 2 Replicas</div>
                </div>

                {/* Connecting SVG */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                  <path d="M 160 70 C 220 70, 220 150, 270 150" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.6" />
                </svg>

                {/* Minimap Box in Corner */}
                <div style={{ position: 'absolute', right: 10, bottom: 10, width: 90, height: 60, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--land-border-2)', borderRadius: 6 }}>
                  <div style={{ width: 24, height: 18, border: '1px solid #ffffff', margin: '14px auto' }} />
                </div>
              </div>
            </div>

            {/* Right Inspector Pane */}
            <div style={{ background: 'var(--land-bg-elevated)', borderLeft: '1px solid var(--land-border)', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid var(--land-border)', paddingBottom: 8 }}>
                NODE INSPECTOR
              </div>

              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                <div style={{ color: 'var(--land-text-3)', marginBottom: 2 }}>SELECTED ENTITY</div>
                <div style={{ color: '#ffffff', fontWeight: 600 }}>PostgreSQL Cluster</div>
              </div>

              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                <div style={{ color: 'var(--land-text-3)', marginBottom: 2 }}>STATUS</div>
                <div style={{ color: '#ffffff', background: 'var(--land-surface-2)', padding: '2px 6px', borderRadius: 4, display: 'inline-block' }}>Active • Connected</div>
              </div>

              <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)' }}>
                <div style={{ color: 'var(--land-text-3)', marginBottom: 2 }}>IN-DEGREE / OUT-DEGREE</div>
                <div style={{ color: 'var(--land-text-2)' }}>4 In / 2 Out</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
