import React, { useState } from 'react';

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
      { key: 'Node Identity', value: 'UUID v4 + Namespace Prefix', desc: 'Global unique identifier for distributed sync' },
      { key: 'Coordinate System', value: 'Float64 (X, Y, Zoom, LOD)', desc: 'Continuous sub-pixel spatial coordinates' },
      { key: 'Protocol Contracts', value: 'HTTP, gRPC, WSS, SQL, Queue', desc: 'Strict bidirectional edge interface typing' },
      { key: 'Runtime Target', value: 'V8 / WASM / Cloud / Native', desc: 'Execution environment metadata' },
    ],
  },
  'Local Engine': {
    title: 'IndexedDB 3.0 Store',
    filename: 'engine/local_storage.spec',
    category: 'Zero-Latency Persistence',
    specs: [
      { key: 'Write Latency', value: '< 0.12ms Synchronous', desc: 'Zero main-thread blocking' },
      { key: 'Object Stores', value: '10 Transactional Tables', desc: 'Projects, Nodes, Edges, Viewports, Sync WAL' },
      { key: 'WAL Buffer', value: 'Append-Only Mutation Log', desc: 'Crash-resilient local state management' },
      { key: 'Offline Policy', value: '100% Autonomous Operation', desc: 'Full editor availability without network' },
    ],
  },
  'Sync Queue': {
    title: 'Autonomous Queue Worker',
    filename: 'sync/queue_worker.spec',
    category: 'Cloud Replication Engine',
    specs: [
      { key: 'Debounce Window', value: '350ms Dynamic Throttle', desc: 'Prevents network thrashing during continuous drag' },
      { key: 'Batch Packaging', value: 'Atomic Micro-Transactions', desc: 'All-or-nothing cloud consistency' },
      { key: 'Retry Strategy', value: 'Exponential Backoff (1s-30s)', desc: 'Resilient network reconnection' },
      { key: 'Cloud Target', value: 'Supabase PostgreSQL', desc: 'ACID relational persistence' },
    ],
  },
  'Topology WASM': {
    title: 'DAG & Cycle Engine',
    filename: 'wasm/topology_engine.spec',
    category: 'High-Speed Graph Algorithms',
    specs: [
      { key: 'Cycle Detection', value: "Tarjan's SCC Algorithm", desc: 'Instant circular dependency identification' },
      { key: 'Topological Sort', value: 'Kahn DAG Resolution', desc: 'Deterministic compilation ordering' },
      { key: 'Performance', value: 'Sub-1ms on 5,000 Nodes', desc: 'High-speed compiled WASM core' },
      { key: 'Memory Footprint', value: '< 2.4 MB Heap', desc: 'Zero garbage collection pauses' },
    ],
  },
};

const TAB_KEYS = Object.keys(TABS);

export const CodeWorkbenchSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(TAB_KEYS[0]);
  const current = TABS[activeTab];

  return (
    <section id="code" className="code-section" aria-labelledby="code-heading">
      <div className="container">
        <div data-reveal>
          <div className="code-head">
            <h2 id="code-heading">Architecture specifications.</h2>
            <div className="code-tabs">
              {TAB_KEYS.map((key) => (
                <button
                  key={key}
                  className={`code-tab ${key === activeTab ? 'is-active' : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          <div className="code-frame">
            <div className="code-topbar">
              <div className="dots"><i /><i /><i /></div>
              <span>{current.filename}</span>
              <span style={{ color: 'var(--text-2)' }}>{current.category}</span>
            </div>
            <div className="code-body" style={{ padding: '24px 28px' }}>
              <div style={{ display: 'grid', gap: 16 }}>
                {current.specs.map((item) => (
                  <div
                    key={item.key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '14px 18px',
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      flexWrap: 'wrap',
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
                        {item.key}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2 }}>
                        {item.desc}
                      </div>
                    </div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
