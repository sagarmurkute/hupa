import React, { useState, useEffect } from 'react';

const SUBSCRIBERS = [
  { label: 'Spatial Graph Viewport', tag: 'Visual Canvas' },
  { label: 'Topology DAG Inspector', tag: 'Cycle Validator' },
  { label: 'Local Store Transaction', tag: 'IndexedDB WAL' },
  { label: 'Cloud Replication Queue', tag: 'Sync Worker' },
];

export const ReactivitySection: React.FC = () => {
  const [count, setCount] = useState(3);
  const [reacting, setReacting] = useState(false);

  const trigger = () => {
    setReacting(true);
    setTimeout(() => setReacting(false), 600);
  };

  const inc = () => { setCount((c) => c + 1); trigger(); };
  const dec = () => { setCount((c) => Math.max(0, c - 1)); trigger(); };
  const reset = () => { setCount(0); trigger(); };

  useEffect(() => {
    const timer = setInterval(inc, 8000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="reactivity" aria-labelledby="reactivity-heading">
      <div className="container">
        <div className="reactivity-grid" data-reveal>
          {/* Left: Explanation */}
          <div>
            <h2 id="reactivity-heading">Reactive by default.</h2>
            <p className="lead">
              Every mutation to a graph node propagates instantly through HUPA's dependency
              tracker. Subsystems — spatial viewports, cycle validators, local storage, and sync queues — update without diffing,
              without scheduling, and without overhead.
            </p>
            <p className="lead" style={{ marginTop: 14 }}>
              State flows downward through typed contracts. The engine understands what changed
              and updates only the affected subsystems.
            </p>
          </div>

          {/* Right: Interactive demo (Ocean style, zero raw code) */}
          <div>
            {/* State card */}
            <div className="react-card">
              <div className="react-label">
                <span>Active Subsystems</span>
                <span>Reactive State</span>
              </div>

              <div className="state-line">
                <span>Connected Modules</span>
                <span style={{ fontWeight: 700 }}>{count} Active</span>
              </div>

              <div className="controls">
                <button className="ctrl-btn" onClick={dec} aria-label="Decrement">−</button>
                <div className={`count-display ${reacting ? 'is-reacting' : ''}`}>{count}</div>
                <button className="ctrl-btn" onClick={inc} aria-label="Increment">+</button>
                <button className="ctrl-btn" onClick={reset} aria-label="Reset" style={{ fontSize: 12 }}>↺</button>
              </div>
            </div>

            <div className={`dep-line ${reacting ? 'is-active' : ''}`} />

            {/* Subscribers card */}
            <div className="react-card">
              <div className="react-label">
                <span>Subscribers</span>
                <span>{SUBSCRIBERS.length} Subscribed</span>
              </div>

              <div className="react-nodes">
                {SUBSCRIBERS.map((sub) => (
                  <div key={sub.label} className={`react-node ${reacting ? 'is-reacting' : ''}`}>
                    <span className="val">{sub.label}</span>
                    <span className="tag">{sub.tag}</span>
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
