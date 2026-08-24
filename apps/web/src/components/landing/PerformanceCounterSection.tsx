import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from './useScrollReveal';

interface StatItem {
  number: string;
  numericEnd: number;
  suffix: string;
  prefix: string;
  title: string;
  desc: string;
}

const STATS: StatItem[] = [
  { number: '< 0.12ms', numericEnd: 0.12, suffix: 'ms', prefix: '< ', title: 'Local Commit Latency', desc: 'IndexedDB synchronous write' },
  { number: '60 FPS', numericEnd: 60, suffix: ' FPS', prefix: '', title: 'Canvas Rendering', desc: 'Hardware-accelerated viewport' },
  { number: '350ms', numericEnd: 350, suffix: 'ms', prefix: '', title: 'Sync Debounce', desc: 'Intelligent micro-transaction queue' },
  { number: '100%', numericEnd: 100, suffix: '%', prefix: '', title: 'Offline Autonomy', desc: 'Full availability without internet' },
];

export const PerformanceCounterSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const numberRefs = useRef<(HTMLDivElement | null)[]>([]);

  const animateCounters = useCallback(() => {
    if (hasAnimated) return;
    setHasAnimated(true);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    STATS.forEach((stat, i) => {
      const el = numberRefs.current[i];
      if (!el) return;

      if (prefersReduced) {
        el.textContent = stat.number;
        return;
      }

      const obj = { val: 0 };
      const isDecimal = stat.numericEnd < 1;

      gsap.to(obj, {
        val: stat.numericEnd,
        duration: 1.5,
        delay: i * 0.12,
        ease: 'power2.out',
        onUpdate: () => {
          const formatted = isDecimal ? obj.val.toFixed(2) : Math.round(obj.val).toString();
          el.textContent = `${stat.prefix}${formatted}${stat.suffix}`;
        },
      });
    });
  }, [hasAnimated]);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (headRef.current) {
        gsap.fromTo(headRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: headRef.current, start: 'top 85%' },
          }
        );
      }

      if (gridRef.current) {
        if (!prefersReduced) {
          gsap.fromTo(gridRef.current,
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
              scrollTrigger: {
                trigger: gridRef.current,
                start: 'top 80%',
                onEnter: animateCounters,
              },
            }
          );
        } else {
          animateCounters();
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [animateCounters]);

  return (
    <section ref={sectionRef} id="performance" className="land-section land-section-border">
      <div className="land-container">
        <div ref={headRef} style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto', opacity: 0 }}>
          <div className="land-section-label">Performance</div>
          <h2 className="land-section-title">
            Engineered for<br />extreme speed.
          </h2>
          <p className="land-section-desc" style={{ margin: '0 auto' }}>
            Every component benchmarked for sub-millisecond execution.
          </p>
        </div>

        <div ref={gridRef} className="land-stats-grid" style={{ opacity: 0 }}>
          {STATS.map((s, i) => (
            <div key={s.title} className="land-stat">
              <div
                ref={(el) => { numberRefs.current[i] = el; }}
                className="land-stat-number"
              >
                0
              </div>
              <div className="land-stat-title">{s.title}</div>
              <div className="land-stat-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
