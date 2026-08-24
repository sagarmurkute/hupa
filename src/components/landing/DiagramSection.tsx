import React, { useEffect, useRef } from 'react';
import { gsap } from './useScrollReveal';

const PIPELINE_STEPS = [
  { title: 'Source Files', desc: 'Walk directory tree, discover modules, and identify service boundaries', tag: 'Discovery', done: true },
  { title: 'Dependency Graph', desc: 'Construct directed acyclic graph of service relationships and protocol contracts', tag: 'DAG Resolution', done: true },
  { title: 'Spatial Layout', desc: 'Calculate force-directed physics layout for responsive 2D canvas navigation', tag: 'Force Sim', done: true },
  { title: 'Local Storage', desc: 'Write graph state to 10 IndexedDB tables with synchronous WAL buffer', tag: '< 0.12ms', done: true },
  { title: 'Cloud Sync', desc: 'Debounce, batch, and push state mutations to Supabase PostgreSQL', tag: '350ms Queue', done: false },
];

const FLOW_NODES = [
  'Source Files',
  'Discovery',
  'Topology',
  'Spatial Engine',
  'IndexedDB',
  'Cloud Sync',
];

export const DiagramSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const verticalRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Head reveal
      if (headRef.current) {
        gsap.fromTo(headRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: headRef.current, start: 'top 85%' },
          }
        );
      }

      // Vertical steps — sequential reveal synced to scroll
      if (verticalRef.current) {
        const steps = verticalRef.current.querySelectorAll('.land-pipeline-step');
        const dots = verticalRef.current.querySelectorAll('.land-pipeline-dot');
        const line = verticalRef.current.querySelector('.land-pipeline-line-fill') as HTMLElement;

        // Steps stagger in
        gsap.fromTo(steps,
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: verticalRef.current,
              start: 'top 75%',
            },
          }
        );

        // Line grows as we scroll through
        if (line) {
          gsap.fromTo(line,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: verticalRef.current,
                start: 'top 70%',
                end: 'bottom 50%',
                scrub: true,
              },
            }
          );
        }

        // Dots pulse as they enter
        dots.forEach((dot, i) => {
          gsap.fromTo(dot,
            { scale: 0 },
            {
              scale: 1,
              duration: 0.4,
              delay: i * 0.15,
              ease: 'back.out(2)',
              scrollTrigger: {
                trigger: dot,
                start: 'top 80%',
              },
            }
          );
        });
      }

      // Horizontal flow — nodes and connectors
      if (horizontalRef.current) {
        const nodes = horizontalRef.current.querySelectorAll('.land-pipeline-node');
        const connectors = horizontalRef.current.querySelectorAll('.land-pipeline-connector');

        gsap.fromTo(nodes,
          { opacity: 0, y: 20, scale: 0.9 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: horizontalRef.current,
              start: 'top 80%',
            },
          }
        );

        connectors.forEach((conn, i) => {
          gsap.fromTo(conn,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.3,
              delay: 0.08 * (i + 1) + 0.3,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: horizontalRef.current,
                start: 'top 80%',
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="architecture" className="land-section land-section-border">
      <div className="land-container">
        <div ref={headRef} className="land-pipeline-head" style={{ opacity: 0 }}>
          <div className="land-section-label">Pipeline</div>
          <h2 className="land-section-title">
            From source files<br />to spatial graph.
          </h2>
          <p className="land-section-desc" style={{ margin: '0 auto' }}>
            Five deterministic stages transform your codebase into an interactive 2D graph — each with sub-millisecond latency targets.
          </p>
        </div>

        {/* Vertical Pipeline */}
        <div ref={verticalRef} className="land-pipeline-vertical" style={{ position: 'relative' }}>
          {/* Animated fill line */}
          <div
            className="land-pipeline-line-fill"
            style={{
              position: 'absolute',
              left: 15,
              top: 0,
              bottom: 0,
              width: 1,
              background: 'var(--land-text-3)',
              transformOrigin: 'top',
              zIndex: 0,
            }}
          />

          {PIPELINE_STEPS.map((step) => (
            <div key={step.title} className={`land-pipeline-step ${step.done ? 'is-done' : ''}`}>
              <div className="land-pipeline-dot" style={{ transform: 'scale(0)' }} />
              <div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
              <span className="land-pipeline-tag">{step.tag}</span>
            </div>
          ))}
        </div>

        {/* Horizontal Data Flow */}
        <div style={{ marginTop: 72 }}>
          <h3 style={{
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--land-text-4)',
            fontFamily: 'var(--font-mono)',
            margin: '0 0 24px',
            textAlign: 'center',
          }}>
            Data Flow
          </h3>
          <div ref={horizontalRef} className="land-pipeline-flow">
            {FLOW_NODES.map((node, i) => (
              <React.Fragment key={node}>
                <div className="land-pipeline-node">
                  <h4>{node}</h4>
                </div>
                {i < FLOW_NODES.length - 1 && (
                  <div className="land-pipeline-connector" style={{ transformOrigin: 'left' }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
