import React from 'react';

const METRICS = [
  { num: '0.1ms', label: 'Local Commit Latency', desc: 'IndexedDB 3.0 synchronous writes' },
  { num: '60 FPS', label: 'Canvas 2D Rendering', desc: 'Hardware-accelerated viewport' },
  { num: '350ms', label: 'Intelligent Debounce', desc: 'Zero network traffic spikes' },
  { num: '100%', label: 'Offline Ready', desc: 'Works with zero internet connection' },
];

export const PerformanceSection: React.FC = () => {
  return (
    <section className="landing-section" aria-labelledby="perf-heading">
      <div className="container">
        <div data-reveal style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto' }}>
          <div className="section-kicker">Performance Standards</div>
          <h2 id="perf-heading" className="section-title">
            Zero lag. Pure speed.
          </h2>
          <p className="section-desc" style={{ margin: '0 auto' }}>
            Engineered with a direct HTML5 Canvas 2D engine to bypass virtual DOM reconciliation bottlenecks.
          </p>
        </div>

        <div className="stats-grid" data-reveal>
          {METRICS.map((m) => (
            <div key={m.label} className="stat-box">
              <div className="num">{m.num}</div>
              <div className="label">{m.label}</div>
              <div className="desc">{m.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
