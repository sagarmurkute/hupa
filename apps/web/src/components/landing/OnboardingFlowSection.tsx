import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { gsap } from './useScrollReveal';

interface OnboardingFlowProps {
  onNavigate: (route: string) => void;
}

const ONBOARDING_STEPS = [
  {
    num: '01',
    title: 'Create an account',
    desc: 'Instant sign up with Better Auth or continue anonymously in guest offline mode.',
  },
  {
    num: '02',
    title: 'Create a project',
    desc: 'Start with a clean canvas or choose from production microservice and AI swarm templates.',
  },
  {
    num: '03',
    title: 'Build your graph',
    desc: 'Drop in service nodes, database schemas, message queues, and drag relationships between handles.',
  },
  {
    num: '04',
    title: 'Understand your system',
    desc: 'Analyze cycles, isolate bottlenecks, export SVG diagrams, and sync across your squad.',
  },
];

export const OnboardingFlowSection: React.FC<OnboardingFlowProps> = ({ onNavigate }) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.onboard-step-card',
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
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 56px' }}>
          <div className="land-section-label">Effortless Workflow</div>
          <h2 className="land-section-title" style={{ fontSize: 'clamp(32px, 4.5vw, 54px)', lineHeight: 1.08 }}>
            Get started in seconds.
          </h2>
          <p className="land-section-subtitle" style={{ fontSize: 17, maxWidth: 580, margin: '0 auto 28px' }}>
            No complicated configuration. Jump straight into the spatial editor.
          </p>
          <div>
            <button
              onClick={() => onNavigate('/app')}
              className="land-btn-primary"
              style={{ height: 46, padding: '0 26px', fontSize: 15 }}
            >
              <span>Get Started</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* 4 Steps Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
            maxWidth: 1100,
            margin: '0 auto',
          }}
        >
          {ONBOARDING_STEPS.map((step) => (
            <div
              key={step.num}
              className="onboard-step-card"
              style={{
                background: 'var(--land-bg-elevated)',
                border: '1px solid var(--land-border-2)',
                borderRadius: 14,
                padding: '28px 22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 'var(--land-shadow-sm)',
              }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 800, color: 'var(--land-text)', marginBottom: 14 }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--land-text)', margin: '0 0 10px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--land-text-2)', lineHeight: 1.6, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
