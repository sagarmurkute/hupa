import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from './useScrollReveal';

const SUBSCRIBERS = [
  { label: 'Spatial Graph Viewport', tag: 'Canvas' },
  { label: 'Topology DAG Inspector', tag: 'Validator' },
  { label: 'Local Store Transaction', tag: 'IDB WAL' },
  { label: 'Cloud Replication Queue', tag: 'Sync' },
];

export const ReactivitySection: React.FC = () => {
  const [count, setCount] = useState(3);
  const [isPulsing, setIsPulsing] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const trigger = useCallback(() => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 500);
  }, []);

  const inc = useCallback(() => { setCount((c) => c + 1); trigger(); }, [trigger]);
  const dec = useCallback(() => { setCount((c) => Math.max(0, c - 1)); trigger(); }, [trigger]);
  const reset = useCallback(() => { setCount(0); trigger(); }, [trigger]);

  // Auto-increment
  useEffect(() => {
    const timer = setInterval(inc, 8000);
    return () => clearInterval(timer);
  }, [inc]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      if (leftRef.current) {
        gsap.fromTo(leftRef.current,
          { opacity: 0, x: -40 },
          {
            opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: leftRef.current, start: 'top 80%' },
          }
        );
      }
      if (rightRef.current) {
        gsap.fromTo(rightRef.current,
          { opacity: 0, x: 40 },
          {
            opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: rightRef.current, start: 'top 80%' },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="land-section land-section-border">
      <div className="land-container">
        <div className="land-reactivity-grid">
          {/* Left: Explanation */}
          <div ref={leftRef} style={{ opacity: 0 }}>
            <div className="land-section-label">Reactivity</div>
            <h2 className="land-section-title" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}>
              Reactive<br />by default.
            </h2>
            <p className="land-section-desc" style={{ marginTop: 16 }}>
              Every mutation propagates instantly through HUPA's dependency tracker.
              Subsystems update without diffing, without scheduling, without overhead.
            </p>
            <p className="land-section-desc" style={{ marginTop: 14 }}>
              State flows downward through typed contracts. The engine understands what changed
              and updates only the affected subsystems.
            </p>
          </div>

          {/* Right: Interactive demo */}
          <div ref={rightRef} style={{ opacity: 0 }}>
            {/* State card */}
            <div className="land-react-card">
              <div className="land-react-header">
                <span>Active Subsystems</span>
                <span>Reactive State</span>
              </div>
              <div className="land-react-body">
                <div className="land-react-state-line">
                  <span>Connected Modules</span>
                  <span>{count} Active</span>
                </div>

                <div className="land-react-controls">
                  <button className="land-react-ctrl-btn" onClick={dec} aria-label="Decrement">−</button>
                  <div className={`land-react-count ${isPulsing ? 'is-pulsing' : ''}`}>{count}</div>
                  <button className="land-react-ctrl-btn" onClick={inc} aria-label="Increment">+</button>
                  <button className="land-react-ctrl-btn" onClick={reset} aria-label="Reset" style={{ fontSize: 14 }}>↺</button>
                </div>
              </div>
            </div>

            <div className={`land-react-connector ${isPulsing ? 'is-active' : ''}`} />

            {/* Subscribers card */}
            <div className="land-react-card">
              <div className="land-react-header">
                <span>Subscribers</span>
                <span>{SUBSCRIBERS.length} Listening</span>
              </div>
              <div className="land-react-body">
                {SUBSCRIBERS.map((sub) => (
                  <div key={sub.label} className={`land-react-subscriber ${isPulsing ? 'is-pulsing' : ''}`}>
                    <span className="land-react-subscriber-name">{sub.label}</span>
                    <span className="land-react-subscriber-tag">{sub.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
