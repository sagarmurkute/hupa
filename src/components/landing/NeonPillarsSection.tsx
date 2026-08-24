import React, { useEffect, useRef } from 'react';
import { Zap, GitBranch, Cloud, Monitor } from 'lucide-react';
import { gsap, ScrollTrigger } from './useScrollReveal';

const PILLARS = [
  {
    number: '01',
    icon: <Zap size={22} />,
    title: '0ms Local Writes',
    desc: 'Every mutation commits synchronously to IndexedDB in under 0.12ms. Zero main-thread blocking. Your graph responds before your finger leaves the key.',
  },
  {
    number: '02',
    icon: <GitBranch size={22} />,
    title: 'Instant Topology',
    desc: 'WASM-accelerated cycle detection validates DAG relationships and protocol contracts in sub-millisecond frames. Know your architecture is sound.',
  },
  {
    number: '03',
    icon: <Cloud size={22} />,
    title: 'Autonomous Sync',
    desc: 'A background worker debounces edits into atomic micro-transactions and syncs to Supabase Postgres. Work offline, sync when ready.',
  },
  {
    number: '04',
    icon: <Monitor size={22} />,
    title: 'Web & Desktop',
    desc: 'Run as a zero-install browser app or launch the native Electron desktop app with local file watcher integration. Your choice.',
  },
];

export const NeonPillarsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Title reveal
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 85%',
            },
          }
        );
      }

      // Pillar cards — staggered reveal with scale
      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.land-pillar');
        gsap.fromTo(cards,
          { opacity: 0, y: 60, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
            },
          }
        );

        // Numbers — parallax counter-scroll on each card
        const numbers = gridRef.current.querySelectorAll('.land-pillar-number');
        numbers.forEach((num) => {
          gsap.to(num, {
            y: -20,
            ease: 'none',
            scrollTrigger: {
              trigger: num,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="pillars" className="land-section land-section-border">
      <div className="land-container">
        <div ref={titleRef} style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto', opacity: 0 }}>
          <div className="land-section-label">Architecture</div>
          <h2 className="land-section-title">
            Built for developers<br />
            who build systems.
          </h2>
          <p className="land-section-desc" style={{ margin: '0 auto' }}>
            Every component engineered for sub-millisecond responsiveness, offline autonomy, and seamless cloud sync.
          </p>
        </div>

        <div ref={gridRef} className="land-pillars-grid">
          {PILLARS.map((p) => (
            <div key={p.title} className="land-pillar">
              <div className="land-pillar-number">{p.number}</div>
              <div className="land-pillar-icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
