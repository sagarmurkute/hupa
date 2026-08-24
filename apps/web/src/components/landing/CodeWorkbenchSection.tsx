import React, { useState, useEffect, useRef } from 'react';
import { gsap } from './useScrollReveal';

interface SchemaTab {
  title: string;
  filename: string;
  category: string;
  specs: Array<{ key: string; value: string; desc: string }>;
}

const TABS: Record<string, SchemaTab> = {
  'Graph Model': {
    title: 'Universal Graph Schema',
    filename: 'schema/graph_model.spec',
    category: 'Spatial Data Layer',
    specs: [
      { key: 'Node Identity', value: 'UUID v4 + Namespace', desc: 'Global unique identifier for distributed sync' },
      { key: 'Coordinate System', value: 'Float64 (X, Y, Z, LOD)', desc: 'Continuous sub-pixel spatial coordinates' },
      { key: 'Protocol Contracts', value: 'HTTP, gRPC, WSS, SQL', desc: 'Strict bidirectional edge interface typing' },
      { key: 'Runtime Target', value: 'V8 / WASM / Native', desc: 'Execution environment metadata' },
    ],
  },
  'Local Engine': {
    title: 'IndexedDB 3.0 Store',
    filename: 'engine/local_storage.spec',
    category: 'Zero-Latency Persistence',
    specs: [
      { key: 'Write Latency', value: '< 0.12ms Sync', desc: 'Zero main-thread blocking' },
      { key: 'Object Stores', value: '10 Transactional', desc: 'Projects, Nodes, Edges, Viewports, WAL' },
      { key: 'WAL Buffer', value: 'Append-Only Log', desc: 'Crash-resilient mutation management' },
      { key: 'Offline Policy', value: '100% Autonomous', desc: 'Full availability without network' },
    ],
  },
  'Sync Queue': {
    title: 'Queue Worker',
    filename: 'sync/queue_worker.spec',
    category: 'Cloud Replication',
    specs: [
      { key: 'Debounce Window', value: '350ms Throttle', desc: 'Prevents network thrashing during drag' },
      { key: 'Batch Mode', value: 'Atomic Micro-Tx', desc: 'All-or-nothing cloud consistency' },
      { key: 'Retry Strategy', value: 'Exp Backoff 1-30s', desc: 'Resilient reconnection' },
      { key: 'Cloud Target', value: 'Supabase PG', desc: 'ACID relational persistence' },
    ],
  },
  'Topology': {
    title: 'DAG & Cycle Engine',
    filename: 'wasm/topology.spec',
    category: 'Graph Algorithms',
    specs: [
      { key: 'Cycle Detection', value: "Tarjan's SCC", desc: 'Circular dependency identification' },
      { key: 'Topo Sort', value: 'Kahn Algorithm', desc: 'Deterministic compilation ordering' },
      { key: 'Performance', value: '< 1ms / 5K nodes', desc: 'Compiled WASM core' },
      { key: 'Memory', value: '< 2.4 MB Heap', desc: 'Zero GC pauses' },
    ],
  },
};

const TAB_KEYS = Object.keys(TABS);

export const CodeWorkbenchSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(TAB_KEYS[0]);
  const current = TABS[activeTab];
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const specsContainerRef = useRef<HTMLDivElement>(null);

  // Animate spec rows on tab change
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !specsContainerRef.current) return;

    const rows = specsContainerRef.current.querySelectorAll('.land-spec-row');
    gsap.fromTo(rows,
      { opacity: 0, x: -16 },
      {
        opacity: 1, x: 0,
        duration: 0.35,
        stagger: 0.06,
        ease: 'power2.out',
      }
    );
  }, [activeTab]);

  // Frame entrance
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      if (frameRef.current) {
        gsap.fromTo(frameRef.current,
          { opacity: 0, y: 60, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: frameRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="code" className="land-section land-section-border">
      <div className="land-container">
        <div className="land-code-head">
          <div>
            <div className="land-section-label">Specifications</div>
            <h2 className="land-section-title" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}>
              Architecture specs.
            </h2>
          </div>
          <div className="land-code-tabs">
            {TAB_KEYS.map((key) => (
              <button
                key={key}
                className={`land-code-tab ${key === activeTab ? 'is-active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {key}
              </button>
            ))}
          </div>
        </div>

        <div ref={frameRef} className="land-code-frame" style={{ opacity: 0 }}>
          <div className="land-code-topbar">
            <div className="land-code-dots">
              <span /><span /><span />
            </div>
            <span className="land-code-filename">{current.filename}</span>
            <span className="land-code-category">{current.category}</span>
          </div>
          <div className="land-code-body">
            <div ref={specsContainerRef} style={{ display: 'grid', gap: 8 }}>
              {current.specs.map((item) => (
                <div key={item.key} className="land-spec-row">
                  <div>
                    <div className="land-spec-key">{item.key}</div>
                    <div className="land-spec-desc">{item.desc}</div>
                  </div>
                  <div className="land-spec-val">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
