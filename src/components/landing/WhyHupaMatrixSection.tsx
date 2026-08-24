import React from 'react';
import { Check, X } from 'lucide-react';

const COMPARISONS = [
  { feature: '0ms Local-First Commits', hupa: true, drawio: false, readmes: false, confluence: false },
  { feature: 'Interactive Spatial Canvas', hupa: true, drawio: true, readmes: false, confluence: false },
  { feature: 'Automated Cycle & DAG Validation', hupa: true, drawio: false, readmes: false, confluence: false },
  { feature: 'Autonomous Cloud Sync (Postgres)', hupa: true, drawio: false, readmes: false, confluence: false },
  { feature: 'Native Windows & Web App', hupa: true, drawio: false, readmes: false, confluence: false },
  { feature: 'Zero Telemetry & 100% MIT Open Source', hupa: true, drawio: false, readmes: true, confluence: false },
];

export const WhyHupaMatrixSection: React.FC = () => {
  return (
    <section style={{ padding: '96px 0', borderBottom: '1px solid var(--neon-border)' }}>
      <div className="container">
        <div data-reveal>
          <div className="neon-badge-pill">
            <span>COMPARISON MATRIX</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.6vw, 44px)', fontWeight: 800, color: 'var(--text-white)', letterSpacing: '-0.04em', margin: '0 0 12px' }}>
            Why engineers choose HUPA.
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0, maxWidth: '54ch' }}>
            Traditional diagram tools and static readmes fall out of date quickly. See how HUPA compares.
          </p>

          <table className="matrix-table">
            <thead>
              <tr>
                <th>Capabilities & Features</th>
                <th className="hupa-col" style={{ color: 'var(--neon-green-text)' }}>HUPA Engine</th>
                <th>Draw.io / Lucid</th>
                <th>Static Markdown</th>
                <th>Confluence Docs</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISONS.map((row) => (
                <tr key={row.feature}>
                  <td style={{ color: 'var(--text-white)', fontWeight: 600 }}>{row.feature}</td>
                  <td className="hupa-col" style={{ textAlign: 'center' }}>
                    <Check size={18} style={{ color: 'var(--neon-green)' }} />
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {row.drawio ? <Check size={18} style={{ color: 'var(--text-muted)' }} /> : <X size={18} style={{ opacity: 0.3 }} />}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {row.readmes ? <Check size={18} style={{ color: 'var(--text-muted)' }} /> : <X size={18} style={{ opacity: 0.3 }} />}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {row.confluence ? <Check size={18} style={{ color: 'var(--text-muted)' }} /> : <X size={18} style={{ opacity: 0.3 }} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
