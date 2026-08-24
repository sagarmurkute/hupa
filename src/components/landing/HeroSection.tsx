import React, { useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Download } from 'lucide-react';
import { gsap, ScrollTrigger } from './useScrollReveal';

interface HeroSectionProps {
  onNavigate: (route: string) => void;
}

const GRAPH_NODES = [
  { id: 'gateway', label: 'API Gateway', tag: 'ROUTER', x: '50%', y: '30%' },
  { id: 'web', label: 'Web Studio', tag: 'CLIENT', x: '20%', y: '28%' },
  { id: 'db', label: 'Postgres DB', tag: 'STORAGE', x: '80%', y: '28%' },
  { id: 'auth', label: 'Auth Service', tag: 'SECURITY', x: '32%', y: '58%' },
  { id: 'sync', label: 'Sync Engine', tag: 'WORKER', x: '68%', y: '58%' },
  { id: 'idb', label: 'IndexedDB', tag: 'LOCAL', x: '50%', y: '72%' },
];

const GRAPH_EDGES = [
  { from: 'web', to: 'gateway' },
  { from: 'gateway', to: 'db' },
  { from: 'gateway', to: 'auth' },
  { from: 'gateway', to: 'sync' },
  { from: 'sync', to: 'idb' },
  { from: 'auth', to: 'idb' },
];

// Convert percentage positions to SVG coordinates
function getNodeCenter(x: string, y: string) {
  return {
    x: parseFloat(x),
    y: parseFloat(y),
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const graphFrameRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<HTMLDivElement>(null);
  const edgesRef = useRef<SVGSVGElement>(null);
  const telemetryRef = useRef<HTMLDivElement>(null);

  // Cinematic entrance timeline
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      // Immediately show everything
      [eyebrowRef, titleRef, subtitleRef, actionsRef, statsRef, graphFrameRef].forEach(ref => {
        if (ref.current) ref.current.style.opacity = '1';
      });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Set initial states
      gsap.set([
        eyebrowRef.current,
        titleRef.current,
        subtitleRef.current,
        actionsRef.current,
        statsRef.current,
      ], { opacity: 0, y: 40 });

      gsap.set(graphFrameRef.current, { opacity: 0, y: 60, scale: 0.95 });

      // Phase 1: Environment appears
      tl.to(graphFrameRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        delay: 0.2,
      });

      // Phase 2: Graph nodes appear — staggered
      if (nodesRef.current) {
        const nodes = nodesRef.current.querySelectorAll('.land-graph-node');
        gsap.set(nodes, { opacity: 0, scale: 0.6, y: 20 });
        tl.to(nodes, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'back.out(1.4)',
        }, '-=0.6');
      }

      // Phase 3: Edge lines draw
      if (edgesRef.current) {
        const lines = edgesRef.current.querySelectorAll('line');
        lines.forEach(line => {
          const length = Math.sqrt(
            Math.pow(parseFloat(line.getAttribute('x2') || '0') - parseFloat(line.getAttribute('x1') || '0'), 2) +
            Math.pow(parseFloat(line.getAttribute('y2') || '0') - parseFloat(line.getAttribute('y1') || '0'), 2)
          );
          gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        });
        tl.to(edgesRef.current.querySelectorAll('line'), {
          strokeDashoffset: 0,
          duration: 0.8,
          stagger: 0.06,
          ease: 'power2.inOut',
        }, '-=0.3');
      }

      // Phase 4: Telemetry bar slides in
      gsap.set(telemetryRef.current, { opacity: 0, y: 10 });
      tl.to(telemetryRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
      }, '-=0.2');

      // Phase 5: Text reveals — headline first
      tl.to(eyebrowRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
      }, '-=0.8');

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, '-=0.6');

      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
      }, '-=0.5');

      tl.to(actionsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      }, '-=0.4');

      tl.to(statsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
      }, '-=0.3');

      // Parallax on scroll — graph moves slower
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress;
          if (graphFrameRef.current) {
            gsap.set(graphFrameRef.current, {
              y: progress * 80,
              scale: 1 - progress * 0.05,
            });
          }
          if (titleRef.current) {
            gsap.set(titleRef.current, { y: progress * -30 });
          }
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleHighlight = useCallback((nodeId: string) => {
    if (!nodesRef.current) return;
    const nodes = nodesRef.current.querySelectorAll('.land-graph-node');
    nodes.forEach(node => {
      if (node.getAttribute('data-node-id') === nodeId) {
        node.classList.add('is-active');
      } else {
        node.classList.remove('is-active');
      }
    });
  }, []);

  return (
    <section ref={heroRef} className="land-hero" aria-labelledby="hero-title">
      {/* Atmospheric background light */}
      <div className="land-hero-bg" />

      <div className="land-hero-content">
        <div className="land-hero-layout">
          {/* Left: Headline & Value Proposition */}
          <div>
            <div ref={eyebrowRef} className="land-hero-eyebrow" style={{ opacity: 0 }}>
              <span className="land-hero-eyebrow-dot" />
              <span>SPATIAL GRAPH ENGINE · V0.1.0</span>
            </div>

            <h1 ref={titleRef} id="hero-title" className="land-hero-title" style={{ opacity: 0 }}>
              See your entire<br />
              project.<br />
              <span className="land-hero-title-dim">Understand it.</span>
            </h1>

            <p ref={subtitleRef} className="land-hero-subtitle" style={{ opacity: 0 }}>
              HUPA transforms complex software systems into an interactive spatial graph.
              Local-first speed. Zero cloud lock-in. Everything connected.
            </p>

            <div ref={actionsRef} className="land-hero-actions" style={{ opacity: 0 }}>
              <button
                onClick={() => onNavigate('/app')}
                className="land-btn-primary"
                style={{ height: 48, padding: '0 28px', fontSize: 15 }}
              >
                <span>Start Building</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => onNavigate('/download')}
                className="land-btn-secondary"
                style={{ height: 48, padding: '0 24px', fontSize: 15 }}
              >
                <Download size={16} />
                <span>Download for Windows</span>
              </button>
            </div>

            <div ref={statsRef} className="land-hero-stats" style={{ opacity: 0 }}>
              <div>
                <div className="land-hero-stat-value">0ms</div>
                <div className="land-hero-stat-label">Local Commit Latency</div>
              </div>
              <div>
                <div className="land-hero-stat-value">60 FPS</div>
                <div className="land-hero-stat-label">Canvas Rendering</div>
              </div>
              <div>
                <div className="land-hero-stat-value">100%</div>
                <div className="land-hero-stat-label">Offline Ready</div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Graph Visualization */}
          <div className="land-hero-visual">
            <div ref={graphFrameRef} className="land-hero-graph-frame" style={{ opacity: 0 }}>
              {/* Window chrome */}
              <div className="land-hero-graph-titlebar">
                <div className="land-hero-graph-dots">
                  <span /><span /><span />
                </div>
                <div className="land-hero-graph-label">hupa — spatial_engine.canvas</div>
                <div className="land-hero-graph-label">60 FPS</div>
              </div>

              {/* Graph Canvas */}
              <div className="land-hero-graph-canvas">
                {/* SVG Edge Lines */}
                <svg
                  ref={edgesRef}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}
                >
                  {GRAPH_EDGES.map((edge, i) => {
                    const from = GRAPH_NODES.find(n => n.id === edge.from)!;
                    const to = GRAPH_NODES.find(n => n.id === edge.to)!;
                    const f = getNodeCenter(from.x, from.y);
                    const t = getNodeCenter(to.x, to.y);
                    return (
                      <line
                        key={i}
                        x1={`${f.x}%`}
                        y1={`${f.y}%`}
                        x2={`${t.x}%`}
                        y2={`${t.y}%`}
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="1"
                      />
                    );
                  })}
                </svg>

                {/* Graph Nodes */}
                <div ref={nodesRef}>
                  {GRAPH_NODES.map((node) => (
                    <div
                      key={node.id}
                      data-node-id={node.id}
                      className="land-graph-node"
                      onMouseEnter={() => handleHighlight(node.id)}
                      onMouseLeave={() => handleHighlight('')}
                      style={{
                        left: node.x,
                        top: node.y,
                        transform: 'translate(-50%, -50%)',
                        opacity: 0,
                      }}
                    >
                      <div className="land-graph-node-title">{node.label}</div>
                      <div className="land-graph-node-tag">{node.tag}</div>
                    </div>
                  ))}
                </div>

                {/* Telemetry bar */}
                <div ref={telemetryRef} className="land-hero-telemetry" style={{ opacity: 0 }}>
                  <div className="land-hero-telemetry-left">
                    <span>6 Nodes · 6 Relationships</span>
                  </div>
                  <div className="land-hero-telemetry-right">
                    <span>IDB: 0ms · Sync: Ready</span>
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
