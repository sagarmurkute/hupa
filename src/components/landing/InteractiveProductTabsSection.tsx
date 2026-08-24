import React, { useEffect, useRef } from 'react';
import { Compass, GitBranch, HardDrive, RefreshCw } from 'lucide-react';
import { gsap } from './useScrollReveal';

interface FeatureData {
  id: string;
  step: string;
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  desc: string;
  specs: Array<{ label: string; value: string }>;
}

const FEATURES: FeatureData[] = [
  {
    id: 'spatial',
    step: '01 / 04',
    title: 'Visualize',
    icon: <Compass size={20} />,
    subtitle: 'Spatial Zoom Engine',
    desc: 'Zoom seamlessly from a high-level infrastructure view down into individual database tables and React components. 60 FPS Canvas 2D with continuous Level-of-Detail culling.',
    specs: [
      { label: 'Viewport Budget', value: '< 16.6ms' },
      { label: 'Max Nodes', value: '5,000+' },
      { label: 'Physics Engine', value: 'WASM' },
      { label: 'Zoom Range', value: '0.1x – 10x' },
    ],
  },
  {
    id: 'topology',
    step: '02 / 04',
    title: 'Connect',
    icon: <GitBranch size={20} />,
    subtitle: 'DAG & Cycle Engine',
    desc: 'Identify circular dependencies and broken protocol interfaces automatically using compiled WASM Tarjan algorithms. Understand how everything fits together.',
    specs: [
      { label: 'Cycle Detection', value: "Tarjan's SCC" },
      { label: 'Dependency Sort', value: 'Kahn DAG' },
      { label: 'Validation', value: '< 1ms' },
      { label: 'Contracts', value: 'Bidirectional' },
    ],
  },
  {
    id: 'storage',
    step: '03 / 04',
    title: 'Persist',
    icon: <HardDrive size={20} />,
    subtitle: '0ms Local-First Storage',
    desc: 'Every coordinate move, node insertion, and schema edit commits to 10 local IndexedDB stores in under 0.12ms with zero main-thread jank. Work offline, always.',
    specs: [
      { label: 'Write Speed', value: '< 0.12ms' },
      { label: 'IDB Tables', value: '10 Stores' },
      { label: 'WAL Buffer', value: 'Crash-Safe' },
      { label: 'Offline', value: '100%' },
    ],
  },
  {
    id: 'sync',
    step: '04 / 04',
    title: 'Sync',
    icon: <RefreshCw size={20} />,
    subtitle: 'Cloud Replication Queue',
    desc: 'A background worker batches state mutations into atomic micro-transactions and pushes to Supabase Postgres with exponential retry backoff. Seamless.',
    specs: [
      { label: 'Debounce', value: '350ms' },
      { label: 'Retry', value: 'Exponential' },
      { label: 'Conflict', value: 'LWW + WAL' },
      { label: 'Cloud DB', value: 'PostgreSQL' },
    ],
  },
];

export const InteractiveProductTabsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinnedRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const stepLabelRef = useRef<HTMLDivElement>(null);
  const titleLabelRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const specsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    if (!sectionRef.current || !pinnedRef.current) return;

    const isMobile = window.innerWidth <= 1024;
    if (isMobile) return; // Skip pinning on mobile

    const ctx = gsap.context(() => {
      const featureCount = FEATURES.length;

      // Pin the section and scrub through features
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${featureCount * 100}%`,
          pin: pinnedRef.current,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      // Animate through each feature
      FEATURES.forEach((feature, i) => {
        if (i === 0) return; // First is already visible

        const pos = i / featureCount;

        // Crossfade content
        tl.to({}, {
          duration: 1 / featureCount,
          onStart: () => {
            // Update step
            if (stepLabelRef.current) {
              gsap.to(stepLabelRef.current, {
                opacity: 0, y: -8, duration: 0.15,
                onComplete: () => {
                  if (stepLabelRef.current) {
                    stepLabelRef.current.textContent = feature.step;
                    gsap.to(stepLabelRef.current, { opacity: 1, y: 0, duration: 0.15 });
                  }
                }
              });
            }

            // Update title
            if (titleLabelRef.current) {
              gsap.to(titleLabelRef.current, {
                opacity: 0, y: -10, duration: 0.2,
                onComplete: () => {
                  if (titleLabelRef.current) {
                    titleLabelRef.current.textContent = feature.title;
                    gsap.to(titleLabelRef.current, { opacity: 1, y: 0, duration: 0.2 });
                  }
                }
              });
            }

            // Update subtitle
            if (subtitleRef.current) {
              gsap.to(subtitleRef.current, {
                opacity: 0, duration: 0.15,
                onComplete: () => {
                  if (subtitleRef.current) {
                    subtitleRef.current.textContent = feature.subtitle;
                    gsap.to(subtitleRef.current, { opacity: 1, duration: 0.15 });
                  }
                }
              });
            }

            // Update desc
            if (descRef.current) {
              gsap.to(descRef.current, {
                opacity: 0, duration: 0.15,
                onComplete: () => {
                  if (descRef.current) {
                    descRef.current.textContent = feature.desc;
                    gsap.to(descRef.current, { opacity: 1, duration: 0.15 });
                  }
                }
              });
            }

            // Update specs
            if (specsRef.current) {
              const specEls = specsRef.current.querySelectorAll('.land-feature-spec');
              gsap.to(specEls, {
                opacity: 0, x: -10, stagger: 0.03, duration: 0.12,
                onComplete: () => {
                  feature.specs.forEach((spec, si) => {
                    if (specEls[si]) {
                      const labelEl = specEls[si].querySelector('.land-feature-spec-label');
                      const valEl = specEls[si].querySelector('.land-feature-spec-value');
                      if (labelEl) labelEl.textContent = spec.label;
                      if (valEl) valEl.textContent = spec.value;
                    }
                  });
                  gsap.to(specEls, { opacity: 1, x: 0, stagger: 0.03, duration: 0.12 });
                }
              });
            }

            // Update visual icon
            if (visualRef.current) {
              const iconIdx = ['🔭', '⚡', '💾', '🔄'];
              const names = FEATURES.map(f => f.subtitle);
              const icon = visualRef.current.querySelector('.land-feature-visual-icon');
              const name = visualRef.current.querySelector('.land-feature-visual-name');
              const status = visualRef.current.querySelector('.land-feature-visual-status');

              gsap.to(visualRef.current, {
                scale: 0.98, opacity: 0.7, duration: 0.15,
                onComplete: () => {
                  if (icon) icon.textContent = iconIdx[i];
                  if (name) name.textContent = names[i];
                  if (status) status.textContent = `MODULE ${String(i + 1).padStart(2, '0')} · ACTIVE`;
                  gsap.to(visualRef.current, { scale: 1, opacity: 1, duration: 0.15 });
                }
              });
            }

            // Update progress bar
            if (progressRef.current) {
              gsap.to(progressRef.current, {
                width: `${((i + 1) / featureCount) * 100}%`,
                duration: 0.3,
                ease: 'power2.out',
              });
            }
          },
        }, pos);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const first = FEATURES[0];

  return (
    <section ref={sectionRef} id="features" className="land-section land-section-border land-features-pin">
      <div ref={pinnedRef} className="land-features-sticky">
        <div className="land-container">
          {/* Progress bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--land-border)' }}>
            <div
              ref={progressRef}
              style={{
                height: '100%',
                width: '25%',
                background: 'var(--land-text-3)',
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          <div className="land-features-layout">
            {/* Left: Feature Meta */}
            <div className="land-feature-meta">
              <div ref={stepLabelRef} className="land-feature-step-indicator">{first.step}</div>
              <h2 ref={titleLabelRef} className="land-feature-title">{first.title}</h2>
              <h3 ref={subtitleRef} style={{ fontSize: 16, fontWeight: 600, color: 'var(--land-text-2)', margin: '0 0 12px', fontFamily: 'var(--font-body)' }}>
                {first.subtitle}
              </h3>
              <p ref={descRef} className="land-feature-desc">{first.desc}</p>

              <div ref={specsRef} className="land-feature-specs">
                {first.specs.map((sp) => (
                  <div key={sp.label} className="land-feature-spec">
                    <span className="land-feature-spec-label">{sp.label}</span>
                    <span className="land-feature-spec-value">{sp.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual */}
            <div ref={visualRef} className="land-feature-visual">
              <div className="land-feature-visual-label">
                <div className="land-feature-visual-icon" style={{ filter: 'grayscale(1)', opacity: 0.3 }}>🔭</div>
                <div className="land-feature-visual-name">{first.subtitle}</div>
                <div className="land-feature-visual-status">MODULE 01 · ACTIVE</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
