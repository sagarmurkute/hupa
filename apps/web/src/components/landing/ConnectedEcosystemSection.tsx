import React, { useEffect, useRef } from 'react';
import { Layers, Box, Cpu, Database, Server, GitBranch } from 'lucide-react';
import { gsap } from './useScrollReveal';

const TIERS = [
  { level: '01', name: 'Project Root', type: 'project', icon: <Layers size={14} />, desc: 'Top-level system boundary and architectural root' },
  { level: '02', name: 'Sub-Systems', type: 'system', icon: <Box size={14} />, desc: 'Domain modules, gateways, and microservices mesh' },
  { level: '03', name: 'Components', type: 'component', icon: <Cpu size={14} />, desc: 'Functional controllers, message brokers, and event streams' },
  { level: '04', name: 'Services', type: 'service', icon: <Server size={14} />, desc: 'RPC routines, auth validators, and background workers' },
  { level: '05', name: 'Dependencies', type: 'dependency', icon: <GitBranch size={14} />, desc: 'External npm packages, SDKs, and third-party APIs' },
  { level: '06', name: 'Resources', type: 'resource', icon: <Database size={14} />, desc: 'PostgreSQL tables, Redis caches, and S3 object storage' },
];

export const ConnectedEcosystemSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.tier-node-card');

      // Staggered reveal of hierarchical tiers and live drawing of connector lines
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 50%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo('.connected-header',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      )
      .fromTo(cards,
        { opacity: 0, y: 30, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: 'back.out(1.5)',
        },
        '-=0.2'
      );

      // Draw SVG interconnecting path lines
      pathRefs.current.forEach((path) => {
        if (path) {
          const len = path.getTotalLength ? path.getTotalLength() : 200;
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
          tl.to(path, { strokeDashoffset: 0, duration: 0.6, ease: 'power2.inOut' }, '-=0.3');
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="land-section" style={{ borderTop: '1px solid var(--land-border)', position: 'relative' }}>
      <div className="land-container">
        {/* Header */}
        <div className="connected-header" style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 64px' }}>
          <div className="land-section-label">Architectural Continuum</div>
          <h2 className="land-section-title" style={{ fontSize: 'clamp(32px, 4.5vw, 54px)', lineHeight: 1.08 }}>
            Everything is connected.
          </h2>
          <p className="land-section-subtitle" style={{ fontSize: 17, maxWidth: 580, margin: '0 auto' }}>
            From high-level system umbrella to microsecond database queries — every relationship is visual, tracked, and verifiable.
          </p>
        </div>

        {/* Dynamic Tier Progression Grid */}
        <div
          ref={containerRef}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 20,
            maxWidth: 1100,
            margin: '0 auto',
            position: 'relative',
          }}
        >
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="tier-node-card"
              style={{
                background: 'var(--land-bg-elevated)',
                border: '1px solid var(--land-border-2)',
                borderRadius: 14,
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--land-shadow-sm)',
                transition: 'border-color 0.2s ease, transform 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--land-border-2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 6, background: '#ffffff', color: '#000000', display: 'grid', placeItems: 'center' }}>
                      {tier.icon}
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--land-text)' }}>
                      {tier.name}
                    </span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--land-text-3)', background: 'var(--land-surface-2)', padding: '2px 8px', borderRadius: 100 }}>
                    LEVEL {tier.level}
                  </span>
                </div>

                <p style={{ fontSize: 13, color: 'var(--land-text-2)', lineHeight: 1.6, margin: 0 }}>
                  {tier.desc}
                </p>
              </div>

              <div style={{ marginTop: 20, paddingTop: 12, borderTop: '1px solid var(--land-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--land-text-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  TYPE: {tier.type}
                </span>
                <span style={{ fontSize: 11, color: '#ffffff', fontWeight: 500 }}>
                  Active Links →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
