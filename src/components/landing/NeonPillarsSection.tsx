import React from 'react';
import { Zap, GitBranch, Cloud, Monitor } from 'lucide-react';

const PILLARS = [
  {
    icon: <Zap size={22} />,
    title: '0ms Local Write Speed',
    desc: 'Mutations commit in under 0.12ms to 10 structured IndexedDB stores with zero main-thread blocking.',
  },
  {
    icon: <GitBranch size={22} />,
    title: 'Instant Topology Branching',
    desc: 'WASM-accelerated cycle detection validates DAG relationships and contracts in sub-millisecond frames.',
  },
  {
    icon: <Cloud size={22} />,
    title: 'Bottomless Cloud Replication',
    desc: 'An autonomous 350ms queue debounces edits into atomic micro-transactions and syncs to Supabase Postgres.',
  },
  {
    icon: <Monitor size={22} />,
    title: 'Native Desktop & Web Canvas',
    desc: 'Run as a zero-install browser PWA or launch the Electron 43 Windows app with local file watcher integration.',
  },
];

export const NeonPillarsSection: React.FC = () => {
  return (
    <section id="pillars" style={{ padding: '96px 0', borderBottom: '1px solid var(--neon-border)' }}>
      <div className="container">
        <div data-reveal style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto' }}>
          <div className="neon-badge-pill" style={{ margin: '0 auto 16px' }}>
            <span>THE 4 ARCHITECTURAL PILLARS</span>
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, color: 'var(--text-white)', letterSpacing: '-0.04em', margin: '0 0 16px' }}>
            The Architecture Tool for <br />
            <span className="text-gradient-neon">Modern Developers.</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
            Designed from the ground up for sub-millisecond responsiveness, offline autonomy, and seamless cloud sync.
          </p>
        </div>

        <div className="neon-pillars-grid" data-reveal>
          {PILLARS.map((p) => (
            <div key={p.title} className="neon-pillar-card">
              <div>
                <div className="neon-pillar-icon">{p.icon}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
