import React from 'react';

const VERTICAL_STEPS = [
  { title: 'Scan Project Files', desc: 'Walk directory tree, discover modules, and identify service boundaries', tag: 'Filesystem Discovery', done: true },
  { title: 'Analyze Dependency Graph', desc: 'Construct directed acyclic graph of service relationships and protocol contracts', tag: 'DAG Resolution', done: true },
  { title: 'Compute Spatial Positions', desc: 'Calculate force-directed physics layout for responsive 2D canvas navigation', tag: 'Force Simulation', done: true },
  { title: 'Commit to Local Storage', desc: 'Write graph state to 10 IndexedDB tables with synchronous WAL buffer', tag: '< 0.12ms IDB Commit', done: true },
  { title: 'Background Cloud Sync', desc: 'Debounce, batch, and push state mutations to Supabase PostgreSQL', tag: '350ms Sync Queue', done: false },
];

const HORIZONTAL_NODES = [
  { title: 'Source Files', desc: 'Project files & packages' },
  { title: 'Discovery', desc: 'Module extraction' },
  { title: 'Topology', desc: 'Dependency graph' },
  { title: 'Spatial Engine', desc: 'Force layout' },
  { title: 'IndexedDB', desc: 'Local persistence' },
  { title: 'Cloud Sync', desc: 'Postgres replication' },
];

export const DiagramSection: React.FC = () => (
  <section id="diagram" className="diagram-section" aria-labelledby="diagram-heading">
    <div className="container">
      <div className="diagram-head" data-reveal>
        <h2 id="diagram-heading">From source files to spatial graph.</h2>
        <p>
          HUPA's transformation pipeline converts your project codebase into an interactive 2D graph
          through five deterministic stages — each with sub-millisecond latency targets.
        </p>
      </div>

      {/* Vertical transformation pipeline (Ocean style) */}
      <div className="vertical-flow" data-reveal>
        {VERTICAL_STEPS.map((step) => (
          <div key={step.title} className={`vf-step ${step.done ? 'is-done' : ''}`}>
            <div className="vf-dot" />
            <div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
            <span className="vf-tag">{step.tag}</span>
          </div>
        ))}
      </div>

      {/* Horizontal build flow (Ocean style) */}
      <div style={{ marginTop: 64 }} data-reveal>
        <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 24px' }}>
          Data pipeline
        </h3>
        <div className="horizontal-flow">
          {HORIZONTAL_NODES.map((node, i) => (
            <React.Fragment key={node.title}>
              <div className="hf-node">
                <h4>{node.title}</h4>
                <p>{node.desc}</p>
              </div>
              {i < HORIZONTAL_NODES.length - 1 && <div className="hf-arrow" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  </section>
);
