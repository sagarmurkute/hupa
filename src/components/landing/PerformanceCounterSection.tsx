import React from 'react';

const STATS = [
  { number: '< 0.12ms', title: 'Local Commit Latency', desc: 'IndexedDB 3.0 synchronous write WAL' },
  { number: '60 FPS', title: 'Canvas Rendering', desc: 'Hardware-accelerated viewport zoom' },
  { number: '350ms', title: 'Sync Debounce', desc: 'Intelligent micro-transaction queue' },
  { number: '100%', title: 'Offline Autonomy', desc: 'Full availability with zero internet' },
];

export const PerformanceCounterSection: React.FC = () => {
  return (
    <section style={{ padding: '96px 0', borderBottom: '1px solid var(--neon-border)' }}>
      <div className="container">
        <div data-reveal style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
          <div className="neon-badge-pill" style={{ margin: '0 auto 16px' }}>
            <span>PERFORMANCE BENCHMARKS</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.6vw, 48px)', fontWeight: 800, color: 'var(--text-white)', letterSpacing: '-0.04em', margin: '0 0 12px' }}>
            Engineered for extreme performance.
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0 }}>
            Every component in HUPA is benchmarked for sub-millisecond execution.
          </p>
        </div>

        <div className="neon-stats-grid" data-reveal>
          {STATS.map((s) => (
            <div key={s.title} className="neon-stat-box">
              <div className="number">{s.number}</div>
              <div className="title">{s.title}</div>
              <div className="desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
