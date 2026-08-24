import React, { useEffect, useRef } from 'react';
import { FolderTree, ArrowRight, Layers, Box, Cpu, Database, Network } from 'lucide-react';
import { gsap } from './useScrollReveal';

export const WhatIsHupaSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const folderBoxRef = useRef<HTMLDivElement>(null);
  const graphBoxRef = useRef<HTMLDivElement>(null);
  const connectorArrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Animate folder tree and graph system comparison on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 60%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo('.what-is-header',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
      )
      .fromTo(folderBoxRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.3'
      )
      .fromTo(connectorArrowRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' },
        '-=0.4'
      )
      .fromTo(graphBoxRef.current,
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo('.what-is-node',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.6)' },
        '-=0.4'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="what-is-hupa" ref={sectionRef} className="land-section" style={{ borderTop: '1px solid var(--land-border)', position: 'relative' }}>
      <div className="land-container">
        {/* Header */}
        <div className="what-is-header" style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 64px' }}>
          <div className="land-section-label">A New Paradigm for Software</div>
          <h2 className="land-section-title" style={{ fontSize: 'clamp(32px, 4.5vw, 54px)', lineHeight: 1.08 }}>
            Your project isn't a folder. It's a system.
          </h2>
          <p className="land-section-subtitle" style={{ fontSize: 17, maxWidth: 580, margin: '0 auto' }}>
            HUPA gives you a visual way to understand how everything fits together.
          </p>
        </div>

        {/* Conceptual Dual Visual */}
        <div ref={containerRef} style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: 32,
          alignItems: 'center',
          maxWidth: 1040,
          margin: '0 auto',
        }}>
          {/* Left: Traditional Flat Folders (The Blind Spot) */}
          <div
            ref={folderBoxRef}
            style={{
              background: 'var(--land-bg-elevated)',
              border: '1px solid var(--land-border-2)',
              borderRadius: 16,
              padding: 28,
              boxShadow: 'var(--land-shadow-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, borderBottom: '1px solid var(--land-border)', paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FolderTree size={16} style={{ color: 'var(--land-text-3)' }} />
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--land-text-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Traditional Filesystem
                </span>
              </div>
              <span style={{ fontSize: 11, color: 'var(--land-text-4)', fontFamily: 'var(--font-mono)' }}>Flat & Blind</span>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 2, color: 'var(--land-text-3)' }}>
              <div>📁 <span style={{ color: 'var(--land-text)' }}>src/</span></div>
              <div style={{ paddingLeft: 18 }}>📁 <span style={{ color: 'var(--land-text-2)' }}>api/</span> (Hidden routes)</div>
              <div style={{ paddingLeft: 18 }}>📁 <span style={{ color: 'var(--land-text-2)' }}>services/</span> (Coupled logic)</div>
              <div style={{ paddingLeft: 18 }}>📁 <span style={{ color: 'var(--land-text-2)' }}>database/</span> (Schema drift)</div>
              <div style={{ paddingLeft: 18 }}>📁 <span style={{ color: 'var(--land-text-2)' }}>workers/</span> (Untracked queues)</div>
              <div>📄 <span style={{ color: 'var(--land-text-4)' }}>package.json</span></div>
            </div>

            <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--land-border)', fontSize: 12, color: 'var(--land-text-4)', lineHeight: 1.5 }}>
              Hidden dependencies, implicit circular imports, and zero architectural clarity.
            </div>
          </div>

          {/* Center Connector */}
          <div ref={connectorArrowRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#ffffff',
              color: '#000000',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 4px 20px rgba(255, 255, 255, 0.2)',
            }}>
              <ArrowRight size={20} />
            </div>
          </div>

          {/* Right: HUPA System Graph (True Topology) */}
          <div
            ref={graphBoxRef}
            style={{
              background: 'var(--land-surface)',
              border: '1px solid var(--land-border-3)',
              borderRadius: 16,
              padding: 28,
              boxShadow: 'var(--land-shadow-lg)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, borderBottom: '1px solid var(--land-border)', paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Network size={16} style={{ color: 'var(--land-text)' }} />
                <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--land-text)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  HUPA Spatial System
                </span>
              </div>
              <span style={{ fontSize: 11, color: '#ffffff', fontFamily: 'var(--font-mono)', background: 'var(--land-surface-3)', padding: '2px 6px', borderRadius: 4 }}>
                100% Deterministic
              </span>
            </div>

            {/* Interactive Miniature Graph Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, position: 'relative' }}>
              <div className="what-is-node" style={{ background: 'var(--land-bg-elevated)', border: '1px solid var(--land-border-2)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Box size={13} style={{ color: '#ffffff' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--land-text)' }}>Gateway</span>
                </div>
                <span style={{ fontSize: 10, color: 'var(--land-text-3)', fontFamily: 'var(--font-mono)' }}>Ingress Router</span>
              </div>

              <div className="what-is-node" style={{ background: 'var(--land-bg-elevated)', border: '1px solid var(--land-border-2)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Cpu size={13} style={{ color: '#ffffff' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--land-text)' }}>Worker</span>
                </div>
                <span style={{ fontSize: 10, color: 'var(--land-text-3)', fontFamily: 'var(--font-mono)' }}>Async Job Consumer</span>
              </div>

              <div className="what-is-node" style={{ background: 'var(--land-bg-elevated)', border: '1px solid var(--land-border-2)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Layers size={13} style={{ color: '#ffffff' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--land-text)' }}>Auth Domain</span>
                </div>
                <span style={{ fontSize: 10, color: 'var(--land-text-3)', fontFamily: 'var(--font-mono)' }}>Better Auth Session</span>
              </div>

              <div className="what-is-node" style={{ background: 'var(--land-bg-elevated)', border: '1px solid var(--land-border-2)', borderRadius: 8, padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Database size={13} style={{ color: '#ffffff' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--land-text)' }}>Postgres DB</span>
                </div>
                <span style={{ fontSize: 10, color: 'var(--land-text-3)', fontFamily: 'var(--font-mono)' }}>Storage Tier</span>
              </div>
            </div>

            <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--land-border)', fontSize: 12, color: 'var(--land-text-2)', lineHeight: 1.5 }}>
              Explicit relationships, lifecycle status, cycle detection, and live data telemetry.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
