import React, { useEffect, useRef, useState } from 'react';
import { ZoomIn } from 'lucide-react';
import { gsap, ScrollTrigger } from './useScrollReveal';

const ZOOM_LEVELS = [
  { level: '100%', title: 'Macro: Project Root', desc: 'Global architecture overview, high-level domains, and cloud deployment boundaries.' },
  { level: '250%', title: 'Mid: Application System', desc: 'Sub-graph container holding frontend clients, backend routers, and queue brokers.' },
  { level: '500%', title: 'Deep: Feature Module', desc: 'Real-time WebSocket handler, JWT auth middleware, and validation pipelines.' },
  { level: '1000%', title: 'Micro: Component & Query', desc: 'Individual TypeScript interface, PostgreSQL foreign key index, and edge cache TTL.' },
];

export const CinematicZoomSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const zoomStageRef = useRef<HTMLDivElement>(null);
  const [zoomStep, setZoomStep] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Pinned zoom scrub animation
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=2000',
        pin: zoomStageRef.current,
        scrub: 0.5,
        onUpdate: (self) => {
          const step = Math.min(3, Math.floor(self.progress * 4));
          setZoomStep(step);
        },
      });

      return () => trigger.kill();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{ position: 'relative', height: '2800px' }}>
      <div
        ref={zoomStageRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'var(--land-bg)',
          borderTop: '1px solid var(--land-border)',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        <div className="land-container">
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 40px' }}>
            <div className="land-section-label">Spatial Depth Hierarchy</div>
            <h2 className="land-section-title" style={{ fontSize: 'clamp(32px, 4.5vw, 54px)', lineHeight: 1.08 }}>
              From the whole system to the smallest detail.
            </h2>
            <p className="land-section-subtitle" style={{ fontSize: 17, maxWidth: 580, margin: '0 auto' }}>
              Zoom into infinite fidelity. Never lose global context while inspecting granular code-level interfaces.
            </p>
          </div>

          {/* Zoom Simulation Box */}
          <div
            style={{
              background: 'var(--land-bg-elevated)',
              border: '1px solid var(--land-border-3)',
              borderRadius: 16,
              padding: 32,
              maxWidth: 900,
              margin: '0 auto',
              boxShadow: 'var(--land-shadow-xl)',
              minHeight: 380,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Zoom metadata header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--land-border)', paddingBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ZoomIn size={16} style={{ color: 'var(--land-text)' }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--land-text)' }}>
                  {ZOOM_LEVELS[zoomStep].title}
                </span>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, background: '#ffffff', color: '#000000', padding: '3px 10px', borderRadius: 100, fontWeight: 700 }}>
                ZOOM {ZOOM_LEVELS[zoomStep].level}
              </span>
            </div>

            {/* Dynamic Scaled Canvas Visual */}
            <div style={{ position: 'relative', height: 220, display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
              {zoomStep === 0 && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ display: 'inline-flex', gap: 14 }}>
                    <div style={{ background: 'var(--land-surface)', border: '1px solid var(--land-border-2)', padding: '14px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Web Frontend</div>
                    <div style={{ background: '#ffffff', color: '#000000', padding: '14px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>API Gateway System</div>
                    <div style={{ background: 'var(--land-surface)', border: '1px solid var(--land-border-2)', padding: '14px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Database Cluster</div>
                  </div>
                  <div style={{ marginTop: 18, fontSize: 12, color: 'var(--land-text-3)', fontFamily: 'var(--font-mono)' }}>
                    Scroll to zoom into API Gateway System →
                  </div>
                </div>
              )}

              {zoomStep === 1 && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ background: 'var(--land-surface)', border: '1.5px solid #ffffff', padding: '20px 28px', borderRadius: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#ffffff', marginBottom: 6 }}>API Gateway System</div>
                    <div style={{ fontSize: 12, color: 'var(--land-text-2)', fontFamily: 'var(--font-mono)' }}>Contains 12 Sub-Services • Ingress Port 443</div>
                  </div>
                </div>
              )}

              {zoomStep === 2 && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ background: 'var(--land-surface)', border: '1.5px solid var(--land-border-3)', padding: '20px 28px', borderRadius: 12 }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--land-text)', marginBottom: 6 }}>JWT Authentication Middleware</div>
                    <div style={{ fontSize: 12, color: 'var(--land-text-2)', fontFamily: 'var(--font-mono)' }}>RS256 Validation • Rate Limit: 100 req/s</div>
                  </div>
                </div>
              )}

              {zoomStep === 3 && (
                <div style={{ textAlign: 'center', width: '100%', maxWidth: 500 }}>
                  <div style={{ background: '#000000', border: '1px solid var(--land-border-3)', padding: '16px 20px', borderRadius: 10, textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.6, color: 'var(--land-text-2)' }}>
                    <div><span style={{ color: '#ffffff', fontWeight: 600 }}>interface</span> SessionToken &#123;</div>
                    <div style={{ paddingLeft: 16 }}>userId: <span style={{ color: '#ffffff' }}>string</span>;</div>
                    <div style={{ paddingLeft: 16 }}>issuedAt: <span style={{ color: '#ffffff' }}>number</span>;</div>
                    <div style={{ paddingLeft: 16 }}>ttl: <span style={{ color: '#ffffff' }}>86400</span>;</div>
                    <div>&#125;</div>
                  </div>
                </div>
              )}
            </div>

            {/* Description footer */}
            <div style={{ borderTop: '1px solid var(--land-border)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--land-text-2)' }}>
                {ZOOM_LEVELS[zoomStep].desc}
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                {ZOOM_LEVELS.map((_, i) => (
                  <span
                    key={i}
                    style={{
                      width: zoomStep === i ? 20 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: zoomStep === i ? '#ffffff' : 'var(--land-border-2)',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
