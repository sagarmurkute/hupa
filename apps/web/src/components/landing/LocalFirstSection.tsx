import React, { useEffect, useRef } from 'react';
import { HardDrive, WifiOff, RefreshCw, Cloud } from 'lucide-react';
import { gsap } from './useScrollReveal';

const FLOW_STEPS = [
  {
    icon: <HardDrive size={20} />,
    title: 'Local IndexedDB',
    badge: '< 1ms Latency',
    desc: 'Every node addition, pan, and edge connection persists directly in browser IndexedDB. Zero network delays.',
  },
  {
    icon: <WifiOff size={20} />,
    title: 'Work Offline',
    badge: '100% Offline',
    desc: 'Design systems on planes, trains, or offline environments. HUPA never blocks you on server connectivity.',
  },
  {
    icon: <RefreshCw size={20} />,
    title: 'Autonomous Sync',
    badge: 'Debounced WAL',
    desc: 'Changes queue into a transactional Write-Ahead Log with 350ms mutation debouncing to eliminate network spam.',
  },
  {
    icon: <Cloud size={20} />,
    title: 'Cloud PostgreSQL',
    badge: 'Supabase BaaS',
    desc: 'When online, mutations replicate automatically to PostgreSQL cloud storage for cross-device backup.',
  },
];

export const LocalFirstSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.local-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.12,
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
          <div className="land-section-label">Local-First Speed</div>
          <h2 className="land-section-title" style={{ fontSize: 'clamp(32px, 4.5vw, 54px)', lineHeight: 1.08 }}>
            Your project stays with you.
          </h2>
          <p className="land-section-subtitle" style={{ fontSize: 17, maxWidth: 580, margin: '0 auto' }}>
            Instant offline performance on your device with optional seamless cloud replication.
          </p>
        </div>

        {/* 4-Step Horizontal Pipeline */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
            maxWidth: 1120,
            margin: '0 auto',
          }}
        >
          {FLOW_STEPS.map((step, idx) => (
            <div
              key={step.title}
              className="local-card"
              style={{
                background: 'var(--land-bg-elevated)',
                border: '1px solid var(--land-border-2)',
                borderRadius: 14,
                padding: '28px 22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--land-shadow-sm)',
                transition: 'border-color 0.2s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#ffffff';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--land-border-2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: '#ffffff', color: '#000000', display: 'grid', placeItems: 'center' }}>
                    {step.icon}
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, background: 'var(--land-surface-2)', color: '#ffffff', padding: '3px 8px', borderRadius: 100 }}>
                    {step.badge}
                  </span>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--land-text)', margin: '0 0 10px' }}>
                  {step.title}
                </h3>

                <p style={{ fontSize: 13, color: 'var(--land-text-2)', lineHeight: 1.6, margin: 0 }}>
                  {step.desc}
                </p>
              </div>

              <div style={{ marginTop: 24, paddingTop: 12, borderTop: '1px solid var(--land-border)', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--land-text-3)' }}>
                PHASE 0{idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
