import React, { useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';
import { gsap } from './useScrollReveal';

export const OpenSourceSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.oss-pillar',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
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
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 48px' }}>
          <div className="land-section-label">100% Free & Open Source</div>
          <h2 className="land-section-title" style={{ fontSize: 'clamp(32px, 4.5vw, 54px)', lineHeight: 1.08 }}>
            Built in the open.
          </h2>
          <p className="land-section-subtitle" style={{ fontSize: 17, maxWidth: 580, margin: '0 auto 28px' }}>
            HUPA is licensed under the permissive MIT License. Inspect the codebase, build custom plugins, and self-host with full sovereignty.
          </p>
          <div>
            <a
              href="https://github.com/sagarmurkute/hupa"
              target="_blank"
              rel="noopener noreferrer"
              className="land-btn-primary"
              style={{ height: 46, padding: '0 26px', fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <span>View on GitHub</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* 4 Open Source Core Pillars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            maxWidth: 1040,
            margin: '0 auto',
          }}
        >
          <div className="oss-pillar" style={{ background: 'var(--land-bg-elevated)', border: '1px solid var(--land-border-2)', borderRadius: 12, padding: '24px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--land-text)', marginBottom: 6 }}>MIT License</div>
            <p style={{ fontSize: 12, color: 'var(--land-text-2)', lineHeight: 1.5, margin: 0 }}>
              Use freely for personal, commercial, or enterprise infrastructure projects.
            </p>
          </div>

          <div className="oss-pillar" style={{ background: 'var(--land-bg-elevated)', border: '1px solid var(--land-border-2)', borderRadius: 12, padding: '24px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--land-text)', marginBottom: 6 }}>No Vendor Lock-In</div>
            <p style={{ fontSize: 12, color: 'var(--land-text-2)', lineHeight: 1.5, margin: 0 }}>
              Standard open JSON data format. Export, import, and parse schemas anywhere.
            </p>
          </div>

          <div className="oss-pillar" style={{ background: 'var(--land-bg-elevated)', border: '1px solid var(--land-border-2)', borderRadius: 12, padding: '24px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--land-text)', marginBottom: 6 }}>Community Driven</div>
            <p style={{ fontSize: 12, color: 'var(--land-text-2)', lineHeight: 1.5, margin: 0 }}>
              RFCs, node type proposals, and feature discussions directly on GitHub.
            </p>
          </div>

          <div className="oss-pillar" style={{ background: 'var(--land-bg-elevated)', border: '1px solid var(--land-border-2)', borderRadius: 12, padding: '24px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--land-text)', marginBottom: 6 }}>Self-Hostable</div>
            <p style={{ fontSize: 12, color: 'var(--land-text-2)', lineHeight: 1.5, margin: 0 }}>
              Deploy the Express backend and Supabase Postgres schema in your own cloud.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
