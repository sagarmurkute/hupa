import React, { useState } from 'react';
import { Compass, GitBranch, HardDrive, RefreshCw } from 'lucide-react';

interface TabItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  desc: string;
  specs: Array<{ label: string; value: string }>;
}

const TABS: TabItem[] = [
  {
    id: 'spatial',
    title: 'Spatial Zoom Engine',
    icon: <Compass size={16} />,
    subtitle: 'Continuous Level-of-Detail (LOD) Spatial Navigation',
    desc: 'Zoom seamlessly from a high-level cloud infrastructure view down into individual database tables and React components with 60 FPS Canvas 2D culling.',
    specs: [
      { label: 'Viewport Frame Budget', value: '< 16.6ms (60 FPS)' },
      { label: 'Max Node Rendering', value: '5,000+ Nodes' },
      { label: 'Physics Layout Engine', value: 'WASM Spring Physics' },
      { label: 'Zoom Scale Range', value: '0.1x to 10.0x LOD' },
    ],
  },
  {
    id: 'topology',
    title: 'DAG & Cycle Engine',
    icon: <GitBranch size={16} />,
    subtitle: 'Automated Dependency Validation & Contract Sorting',
    desc: 'Identify circular dependencies and broken protocol interfaces automatically using high-speed Compiled WASM Tarjan algorithms.',
    specs: [
      { label: 'Cycle Detection Algorithm', value: "Tarjan's SCC Algorithm" },
      { label: 'Dependency Ordering', value: 'Kahn Topological Sort' },
      { label: 'Validation Latency', value: '< 1ms Execution Time' },
      { label: 'Contract Enforcement', value: 'Bidirectional Input/Output' },
    ],
  },
  {
    id: 'storage',
    title: '0ms Local-First IDB',
    subtitle: 'Client-Side Synchronous Mutation Storage',
    icon: <HardDrive size={16} />,
    desc: 'Every coordinate move, node insertion, and schema edit commits to 10 local IndexedDB stores in under 0.12ms with zero main-thread jank.',
    specs: [
      { label: 'Synchronous Commit Speed', value: '< 0.12ms Local Write' },
      { label: 'IndexedDB Tables', value: '10 Structured Object Stores' },
      { label: 'Write-Ahead Logging', value: 'WAL Mutation Buffer' },
      { label: 'Offline Availability', value: '100% Offline Autonomous' },
    ],
  },
  {
    id: 'sync',
    title: 'Cloud Replication Queue',
    subtitle: '350ms Intelligent Micro-Transaction Debouncing',
    icon: <RefreshCw size={16} />,
    desc: 'A background worker batches state mutations into atomic micro-transactions and pushes to Supabase Postgres with exponential retry backoff.',
    specs: [
      { label: 'Batch Debounce Interval', value: '350ms Dynamic Throttle' },
      { label: 'Retry Strategy', value: 'Exponential Backoff' },
      { label: 'Conflict Strategy', value: 'Deterministic LWW + WAL' },
      { label: 'Cloud Target DB', value: 'Supabase PostgreSQL' },
    ],
  },
];

export const InteractiveProductTabsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('spatial');
  const current = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <section id="features" style={{ padding: '96px 0', borderBottom: '1px solid var(--neon-border)' }}>
      <div className="container">
        <div data-reveal>
          <div className="neon-badge-pill">
            <span>FEATURE SHOWCASE</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.6vw, 48px)', fontWeight: 800, color: 'var(--text-white)', letterSpacing: '-0.04em', margin: '0 0 12px' }}>
            Built for maximum developer velocity.
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', margin: 0, maxWidth: '54ch' }}>
            Click through HUPA's feature capabilities to see how our engine handles spatial navigation, local persistence, and cloud sync.
          </p>

          <div className="neon-tabs-wrap">
            {/* Tab buttons */}
            <div className="neon-tabs-bar">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`neon-tab-button ${tab.id === activeTab ? 'is-active' : ''}`}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    {tab.icon}
                    <span>{tab.title}</span>
                  </span>
                </button>
              ))}
            </div>

            {/* Tab content stage */}
            <div style={{ padding: '36px 32px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 40, alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-white)', margin: '0 0 12px' }}>
                  {current.subtitle}
                </h3>
                <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 28px' }}>
                  {current.desc}
                </p>

                <div style={{ display: 'grid', gap: 12 }}>
                  {current.specs.map((sp) => (
                    <div
                      key={sp.label}
                      style={{
                        display: 'flex', justifyContent: 'space-between', padding: '12px 16px',
                        background: 'var(--neon-surface)', border: '1px solid var(--neon-border)',
                        borderRadius: 8, fontSize: 13,
                      }}
                    >
                      <span style={{ color: 'var(--text-muted)' }}>{sp.label}</span>
                      <strong style={{ color: 'var(--neon-green-text)', fontFamily: 'var(--mono)' }}>{sp.value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Card Stage */}
              <div
                style={{
                  height: 280,
                  background: 'radial-gradient(circle at 50% 50%, var(--neon-surface) 0%, var(--neon-bg-card) 100%)',
                  border: '1px solid var(--neon-border)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 24,
                  position: 'relative',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>
                    {activeTab === 'spatial' ? '🔭' : activeTab === 'topology' ? '⚡' : activeTab === 'storage' ? '💾' : '🔄'}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-white)' }}>{current.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--neon-green-text)', fontFamily: 'var(--mono)', marginTop: 6 }}>
                    STATUS: ACTIVE ENGINE MODULE
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
