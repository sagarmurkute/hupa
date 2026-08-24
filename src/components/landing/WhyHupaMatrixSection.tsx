import React, { useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';
import { gsap } from './useScrollReveal';

const COMPARISONS = [
  { feature: '0ms Local-First Commits', hupa: true, drawio: false, readmes: false, confluence: false },
  { feature: 'Interactive Spatial Canvas', hupa: true, drawio: true, readmes: false, confluence: false },
  { feature: 'Automated DAG Validation', hupa: true, drawio: false, readmes: false, confluence: false },
  { feature: 'Autonomous Cloud Sync', hupa: true, drawio: false, readmes: false, confluence: false },
  { feature: 'Native Desktop & Web App', hupa: true, drawio: false, readmes: false, confluence: false },
  { feature: '100% MIT Open Source', hupa: true, drawio: false, readmes: true, confluence: false },
];

export const WhyHupaMatrixSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

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

      if (tableRef.current) {
        const rows = tableRef.current.querySelectorAll('tbody tr');
        gsap.fromTo(rows,
          { opacity: 0, x: -20 },
          {
            opacity: 1, x: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: tableRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="land-section land-section-border">
      <div className="land-container">
        <div ref={headRef} style={{ opacity: 0 }}>
          <div className="land-section-label">Comparison</div>
          <h2 className="land-section-title">
            Why engineers choose HUPA.
          </h2>
          <p className="land-section-desc">
            Traditional diagram tools and static readmes fall out of date. HUPA stays in sync with your system.
          </p>
        </div>

        <table ref={tableRef} className="land-matrix">
          <thead>
            <tr>
              <th>Capability</th>
              <th className="hupa-col" style={{ textAlign: 'center' }}>HUPA</th>
              <th style={{ textAlign: 'center' }}>Draw.io / Lucid</th>
              <th style={{ textAlign: 'center' }}>Markdown</th>
              <th style={{ textAlign: 'center' }}>Confluence</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISONS.map((row) => (
              <tr key={row.feature}>
                <td style={{ fontWeight: 600, color: 'var(--land-text)' }}>{row.feature}</td>
                <td className="hupa-col" style={{ textAlign: 'center' }}>
                  <Check size={18} style={{ color: 'var(--land-text-hero)' }} />
                </td>
                <td style={{ textAlign: 'center' }}>
                  {row.drawio ? <Check size={18} style={{ color: 'var(--land-text-3)' }} /> : <X size={18} style={{ opacity: 0.2 }} />}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {row.readmes ? <Check size={18} style={{ color: 'var(--land-text-3)' }} /> : <X size={18} style={{ opacity: 0.2 }} />}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {row.confluence ? <Check size={18} style={{ color: 'var(--land-text-3)' }} /> : <X size={18} style={{ opacity: 0.2 }} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
