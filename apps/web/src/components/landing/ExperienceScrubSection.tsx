import React, { useEffect, useRef, useState } from 'react';
import { Compass, GitMerge, Search, Network } from 'lucide-react';
import { gsap, ScrollTrigger } from './useScrollReveal';

const STAGES = [
  {
    step: '01',
    title: 'Explore',
    headline: 'Explore your system with spatial freedom.',
    description: 'Navigate infinite 2D canvas planes with zero latency. Seamlessly dive into nested sub-graphs, microservice clusters, and module boundaries.',
    icon: <Compass size={18} />,
  },
  {
    step: '02',
    title: 'Connect',
    headline: 'Connect services with deterministic precision.',
    description: 'Draw typed architectural relationships directly between node handles. Model REST calls, gRPC streams, event triggers, and database reads.',
    icon: <GitMerge size={18} />,
  },
  {
    step: '03',
    title: 'Understand',
    headline: 'Understand cycles, bottlenecks, and flows.',
    description: 'Autonomous Tarjan algorithms detect circular dependencies in real time. Isolate unassigned tasks, analyze node in/out degrees, and eliminate architectural drift.',
    icon: <Search size={18} />,
  },
  {
    step: '04',
    title: 'Organize',
    headline: 'Organize across domains and perspectives.',
    description: 'Apply instant hierarchical, tree, or radial auto-layouts. Filter unified views by Architecture, Security, Dependency, or AI perspective in one click.',
    icon: <Network size={18} />,
  },
];

export const ExperienceScrubSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Pinned ScrollTrigger scrubbing through 4 stages
      const pinTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=2400',
        pin: pinRef.current,
        scrub: 0.5,
        onUpdate: (self) => {
          const stageIndex = Math.min(3, Math.floor(self.progress * 4));
          setActiveStage(stageIndex);
        },
      });

      return () => pinTrigger.kill();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={containerRef} style={{ position: 'relative', height: '3200px' }}>
      <div
        ref={pinRef}
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
          {/* Header pill */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
            <div className="land-section-label">The HUPA Experience</div>
            <div style={{ display: 'flex', gap: 12 }}>
              {STAGES.map((s, idx) => (
                <button
                  key={s.title}
                  onClick={() => setActiveStage(idx)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 100,
                    fontSize: 12,
                    fontFamily: 'var(--font-mono)',
                    background: activeStage === idx ? '#ffffff' : 'var(--land-surface)',
                    color: activeStage === idx ? '#000000' : 'var(--land-text-3)',
                    border: '1px solid',
                    borderColor: activeStage === idx ? '#ffffff' : 'var(--land-border-2)',
                    fontWeight: activeStage === idx ? 700 : 500,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                >
                  {s.step} • {s.title}
                </button>
              ))}
            </div>
          </div>

          {/* 2-Column Pinned Visual Story */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48, alignItems: 'center' }}>
            {/* Story Text */}
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                color: 'var(--land-text-3)',
                marginBottom: 12,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                STAGE {STAGES[activeStage].step} — {STAGES[activeStage].title}
              </div>

              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(28px, 3.5vw, 44px)',
                  fontWeight: 600,
                  color: 'var(--land-text-hero)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.03em',
                  margin: '0 0 20px',
                  transition: 'all 0.3s ease',
                }}
              >
                {STAGES[activeStage].headline}
              </h2>

              <p
                style={{
                  fontSize: 16,
                  color: 'var(--land-text-2)',
                  lineHeight: 1.7,
                  maxWidth: '50ch',
                  marginBottom: 32,
                  transition: 'all 0.3s ease',
                }}
              >
                {STAGES[activeStage].description}
              </p>

              {/* Stage Highlights */}
              <div style={{ display: 'grid', gap: 10 }}>
                {activeStage === 0 && (
                  <div style={{ fontSize: 13, color: 'var(--land-text-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffffff' }} />
                    Infinite 2D canvas with seamless pan and smooth zoom
                  </div>
                )}
                {activeStage === 1 && (
                  <div style={{ fontSize: 13, color: 'var(--land-text-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffffff' }} />
                    22+ built-in protocol & relationship types
                  </div>
                )}
                {activeStage === 2 && (
                  <div style={{ fontSize: 13, color: 'var(--land-text-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffffff' }} />
                    Live cycle detection highlighting blocking loops
                  </div>
                )}
                {activeStage === 3 && (
                  <div style={{ fontSize: 13, color: 'var(--land-text-3)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffffff' }} />
                    Topological auto-layout with DAG ordering
                  </div>
                )}
              </div>
            </div>

            {/* Dynamic Morphing Graph Visual */}
            <div
              style={{
                background: 'var(--land-bg-elevated)',
                border: '1px solid var(--land-border-3)',
                borderRadius: 16,
                padding: 24,
                boxShadow: 'var(--land-shadow-xl)',
                minHeight: 440,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Stage Top Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--land-border)', paddingBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: '#ffffff', color: '#000000', display: 'grid', placeItems: 'center' }}>
                    {STAGES[activeStage].icon}
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, color: 'var(--land-text)' }}>
                    {STAGES[activeStage].title.toUpperCase()} MODE
                  </span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--land-text-3)' }}>
                  SCRUB PROGRESS: {Math.round((activeStage + 1) * 25)}%
                </span>
              </div>

              {/* Dynamic State Diagram Canvas */}
              <div style={{ position: 'relative', height: 320, display: 'grid', placeItems: 'center' }}>
                {activeStage === 0 && (
                  /* EXPLORE VISUAL */
                  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 40, top: 40, background: 'var(--land-surface)', border: '1px solid var(--land-border-2)', padding: '12px 16px', borderRadius: 8 }}>
                      <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--land-text)' }}>Ecosystem Core</div>
                      <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--land-text-3)' }}>Root Sub-Graph</div>
                    </div>
                    <div style={{ position: 'absolute', right: 40, bottom: 40, background: 'var(--land-surface)', border: '1px solid var(--land-border-2)', padding: '12px 16px', borderRadius: 8 }}>
                      <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--land-text)' }}>Edge Gateways</div>
                      <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--land-text-3)' }}>Nested Sub-Graph</div>
                    </div>
                    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                      <path d="M 160 70 C 260 70, 240 250, 360 250" stroke="#ffffff" strokeWidth="2" strokeDasharray="6 6" fill="none" opacity="0.5" />
                    </svg>
                  </div>
                )}

                {activeStage === 1 && (
                  /* CONNECT VISUAL */
                  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 30, top: 120, background: 'var(--land-surface)', border: '1px solid var(--land-border-3)', padding: '10px 14px', borderRadius: 8 }}>
                      <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--land-text)' }}>Auth Service</div>
                      <div style={{ fontSize: 10, color: 'var(--land-text-3)' }}>Handles: [top, right, bottom]</div>
                    </div>
                    <div style={{ position: 'absolute', right: 30, top: 120, background: '#ffffff', color: '#000000', border: '1px solid #ffffff', padding: '10px 14px', borderRadius: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: 12, color: '#000000' }}>User Database</div>
                      <div style={{ fontSize: 10, color: '#333333' }}>Target Handle: [left]</div>
                    </div>
                    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                      <path d="M 150 145 C 240 145, 260 145, 360 145" stroke="#ffffff" strokeWidth="2.5" fill="none" />
                      <text x="230" y="135" fill="#ffffff" fontSize="10" fontFamily="monospace" textAnchor="middle">authenticates</text>
                    </svg>
                  </div>
                )}

                {activeStage === 2 && (
                  /* UNDERSTAND (CYCLE DETECTION) VISUAL */
                  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 80, top: 30, background: 'var(--land-surface)', border: '1.5px solid #ffffff', padding: '10px 14px', borderRadius: 8 }}>
                      <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--land-text)' }}>Node A</div>
                    </div>
                    <div style={{ position: 'absolute', right: 80, top: 30, background: 'var(--land-surface)', border: '1.5px solid #ffffff', padding: '10px 14px', borderRadius: 8 }}>
                      <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--land-text)' }}>Node B</div>
                    </div>
                    <div style={{ position: 'absolute', left: '50%', bottom: 30, transform: 'translateX(-50%)', background: '#ffffff', color: '#000000', padding: '10px 14px', borderRadius: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: 12, color: '#000000' }}>Tarjan Cycle Detector</div>
                      <div style={{ fontSize: 10, color: '#333333' }}>Cycles Found: 0 (DAG Safe)</div>
                    </div>
                    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                      <path d="M 160 50 L 340 50" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.6" />
                      <path d="M 370 70 L 270 200" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.6" />
                      <path d="M 230 200 L 130 70" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.6" />
                    </svg>
                  </div>
                )}

                {activeStage === 3 && (
                  /* ORGANIZE (AUTO-LAYOUT) VISUAL */
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 20 }}>
                      <div style={{ background: 'var(--land-surface)', border: '1px solid var(--land-border-2)', padding: '8px 14px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>Tier 1: Clients</div>
                      <div style={{ background: 'var(--land-surface)', border: '1px solid var(--land-border-2)', padding: '8px 14px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>Tier 2: Edge</div>
                    </div>
                    <div style={{ display: 'flex', gap: 20 }}>
                      <div style={{ background: '#ffffff', color: '#000000', padding: '8px 14px', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>Tier 3: Core API Services</div>
                      <div style={{ background: 'var(--land-surface)', border: '1px solid var(--land-border-2)', padding: '8px 14px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>Tier 4: Storage</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress dots footer */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, paddingTop: 12, borderTop: '1px solid var(--land-border)' }}>
                {STAGES.map((_, i) => (
                  <span
                    key={i}
                    style={{
                      width: activeStage === i ? 24 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: activeStage === i ? '#ffffff' : 'var(--land-border-2)',
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
