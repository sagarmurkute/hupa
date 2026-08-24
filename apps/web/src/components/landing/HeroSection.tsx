import React, { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, Layers, Box, Cpu, Database, Server } from 'lucide-react';
import { gsap } from './useScrollReveal';

interface HeroSectionProps {
  onNavigate: (route: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const graphFrameRef = useRef<HTMLDivElement>(null);

  // SVG and Node refs for assembly animation
  const edgePath1 = useRef<SVGPathElement>(null);
  const edgePath2 = useRef<SVGPathElement>(null);
  const edgePath3 = useRef<SVGPathElement>(null);
  const edgePath4 = useRef<SVGPathElement>(null);
  const edgePath5 = useRef<SVGPathElement>(null);

  const node1 = useRef<HTMLDivElement>(null);
  const node2 = useRef<HTMLDivElement>(null);
  const node3 = useRef<HTMLDivElement>(null);
  const node4 = useRef<HTMLDivElement>(null);
  const node5 = useRef<HTMLDivElement>(null);
  const node6 = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // 1. Text & CTA entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(eyebrowRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.6 }
      )
      .fromTo(headlineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.3'
      )
      .fromTo(subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.4'
      )
      .fromTo(actionsRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      )
      .fromTo(graphFrameRef.current,
        { opacity: 0, scale: 0.94, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'expo.out' },
        '-=0.5'
      );

      // 2. Progressive Graph Assembly: Nodes pop -> Edges draw -> Group forms -> Stabilizes
      const nodes = [node1.current, node2.current, node3.current, node4.current, node5.current, node6.current];
      const edges = [edgePath1.current, edgePath2.current, edgePath3.current, edgePath4.current, edgePath5.current];

      // Stage A: Nodes appear with anticipation
      tl.fromTo(nodes,
        { opacity: 0, scale: 0.5, y: 15 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.8)',
        },
        '-=0.3'
      );

      // Stage B: Relationships draw
      edges.forEach((edge) => {
        if (edge) {
          const length = edge.getTotalLength ? edge.getTotalLength() : 300;
          gsap.set(edge, { strokeDasharray: length, strokeDashoffset: length });
          tl.to(edge, {
            strokeDashoffset: 0,
            duration: 0.8,
            ease: 'power2.inOut',
          }, '-=0.4');
        }
      });

      // Stage C: Group bounding box forms
      tl.fromTo(groupRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' },
        '-=0.3'
      );

      // Stage D: Ambient floating animation on the assembled graph
      gsap.to(graphFrameRef.current, {
        y: -10,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="land-hero">
      <div className="land-hero-bg" />

      <div className="land-hero-content">
        <div className="land-hero-layout">
          {/* Left Column — Typography & CTAs */}
          <div style={{ textAlign: 'left' }}>
            <div ref={eyebrowRef} className="land-hero-eyebrow">
              <span className="land-hero-eyebrow-dot" />
              <span>Universal Project Graph Engine</span>
            </div>

            <h1 ref={headlineRef} className="land-hero-title">
              See your entire project.
            </h1>

            <p ref={subtitleRef} className="land-hero-subtitle">
              HUPA turns complex projects into an interactive visual system you can understand, explore, and manage.
            </p>

            <div ref={actionsRef} className="land-hero-actions">
              <button
                onClick={() => onNavigate('/app')}
                className="land-btn-primary"
                style={{ height: 46, padding: '0 26px', fontSize: 15 }}
              >
                <span>Get Started</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('what-is-hupa');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="land-btn-secondary"
                style={{ height: 46, padding: '0 22px', fontSize: 15 }}
              >
                <span>Explore HUPA</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="land-hero-stats">
              <div>
                <div className="land-hero-stat-value">&lt; 1ms</div>
                <div className="land-hero-stat-label">Local-First Latency</div>
              </div>
              <div>
                <div className="land-hero-stat-value">60 FPS</div>
                <div className="land-hero-stat-label">Spatial Canvas</div>
              </div>
              <div>
                <div className="land-hero-stat-value">100%</div>
                <div className="land-hero-stat-label">Open Source (MIT)</div>
              </div>
            </div>
          </div>

          {/* Right Column — Progressive Auto-Assembling Graph */}
          <div className="land-hero-visual">
            <div ref={graphFrameRef} className="land-hero-graph-frame" style={{ minHeight: 460, position: 'relative' }}>
              {/* Studio Canvas Simulation Header */}
              <div style={{
                height: 38,
                borderBottom: '1px solid var(--land-border-2)',
                background: 'var(--land-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 14px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffffff', opacity: 0.6 }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--land-text)', fontWeight: 500 }}>
                    hupa://ecosystem/main-graph
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--land-text-3)', padding: '2px 6px', background: 'var(--land-surface-2)', borderRadius: 4 }}>
                    LIVE TOPOLOGY
                  </span>
                </div>
              </div>

              {/* Spatial Graph Area */}
              <div style={{ position: 'relative', height: 420, overflow: 'hidden', background: 'var(--land-bg-elevated)' }}>
                {/* SVG Connections Layer */}
                <svg
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
                  viewBox="0 0 540 420"
                >
                  <defs>
                    <marker id="hero-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="#ffffff" opacity="0.6" />
                    </marker>
                  </defs>
                  {/* Edges */}
                  <path ref={edgePath1} d="M 120 110 C 180 110, 180 190, 240 190" stroke="#ffffff" strokeWidth="1.8" strokeOpacity="0.45" fill="none" markerEnd="url(#hero-arrow)" />
                  <path ref={edgePath2} d="M 120 270 C 180 270, 180 190, 240 190" stroke="#ffffff" strokeWidth="1.8" strokeOpacity="0.45" fill="none" markerEnd="url(#hero-arrow)" />
                  <path ref={edgePath3} d="M 330 190 C 380 190, 380 120, 430 120" stroke="#ffffff" strokeWidth="1.8" strokeOpacity="0.45" fill="none" markerEnd="url(#hero-arrow)" />
                  <path ref={edgePath4} d="M 330 190 C 380 190, 380 260, 430 260" stroke="#ffffff" strokeWidth="1.8" strokeOpacity="0.45" fill="none" markerEnd="url(#hero-arrow)" />
                  <path ref={edgePath5} d="M 430 120 C 470 120, 470 330, 240 330" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="4 4" fill="none" />
                </svg>

                {/* Subsystem Group Box */}
                <div
                  ref={groupRef}
                  style={{
                    position: 'absolute',
                    left: 200,
                    top: 130,
                    width: 320,
                    height: 250,
                    border: '1px dashed var(--land-border-3)',
                    borderRadius: 12,
                    background: 'rgba(255, 255, 255, 0.02)',
                    zIndex: 0,
                    padding: '8px 12px',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--land-text-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Core Services Subsystem
                  </span>
                </div>

                {/* Nodes */}
                {/* Node 1: Web Client */}
                <div
                  ref={node1}
                  style={{
                    position: 'absolute',
                    left: 24,
                    top: 80,
                    width: 110,
                    background: 'var(--land-surface)',
                    border: '1px solid var(--land-border-3)',
                    borderRadius: 8,
                    padding: '8px 10px',
                    zIndex: 2,
                    boxShadow: 'var(--land-shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Box size={13} style={{ color: 'var(--land-text)' }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--land-text)' }}>Web App</span>
                  </div>
                  <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--land-text-3)' }}>Next.js 15</span>
                </div>

                {/* Node 2: Mobile Client */}
                <div
                  ref={node2}
                  style={{
                    position: 'absolute',
                    left: 24,
                    top: 240,
                    width: 110,
                    background: 'var(--land-surface)',
                    border: '1px solid var(--land-border-3)',
                    borderRadius: 8,
                    padding: '8px 10px',
                    zIndex: 2,
                    boxShadow: 'var(--land-shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Layers size={13} style={{ color: 'var(--land-text)' }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--land-text)' }}>Mobile</span>
                  </div>
                  <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--land-text-3)' }}>React Native</span>
                </div>

                {/* Node 3: Gateway / Core Orchestrator */}
                <div
                  ref={node3}
                  style={{
                    position: 'absolute',
                    left: 220,
                    top: 160,
                    width: 120,
                    background: '#ffffff',
                    color: '#000000',
                    border: '1px solid #ffffff',
                    borderRadius: 8,
                    padding: '10px 12px',
                    zIndex: 3,
                    boxShadow: '0 8px 24px rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Cpu size={14} style={{ color: '#000000' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#000000' }}>API Gateway</span>
                  </div>
                  <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: '#333333', fontWeight: 500 }}>
                    HUPA Router • Active
                  </span>
                </div>

                {/* Node 4: AI Inference Engine */}
                <div
                  ref={node4}
                  style={{
                    position: 'absolute',
                    left: 410,
                    top: 90,
                    width: 110,
                    background: 'var(--land-surface)',
                    border: '1px solid var(--land-border-3)',
                    borderRadius: 8,
                    padding: '8px 10px',
                    zIndex: 2,
                    boxShadow: 'var(--land-shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Sparkles size={13} style={{ color: 'var(--land-text)' }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--land-text)' }}>AI Agent</span>
                  </div>
                  <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--land-text-3)' }}>Swarm Node</span>
                </div>

                {/* Node 5: Postgres Database */}
                <div
                  ref={node5}
                  style={{
                    position: 'absolute',
                    left: 410,
                    top: 230,
                    width: 110,
                    background: 'var(--land-surface)',
                    border: '1px solid var(--land-border-3)',
                    borderRadius: 8,
                    padding: '8px 10px',
                    zIndex: 2,
                    boxShadow: 'var(--land-shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Database size={13} style={{ color: 'var(--land-text)' }} />
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--land-text)' }}>Storage</span>
                  </div>
                  <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', color: 'var(--land-text-3)' }}>PostgreSQL</span>
                </div>

                {/* Node 6: Cloud Sync Engine */}
                <div
                  ref={node6}
                  style={{
                    position: 'absolute',
                    left: 215,
                    top: 310,
                    width: 120,
                    background: 'var(--land-surface)',
                    border: '1px solid var(--land-border-3)',
                    borderRadius: 8,
                    padding: '6px 10px',
                    zIndex: 2,
                    boxShadow: 'var(--land-shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Server size={12} style={{ color: 'var(--land-text)' }} />
                    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--land-text)' }}>Sync Daemon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
