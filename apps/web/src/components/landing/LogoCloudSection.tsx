import React from 'react';

const LOGOS = [
  'React 19',
  'TypeScript 6',
  'Electron 43',
  'Supabase',
  'IndexedDB',
  'Vite 8',
  'WASM',
  'PostgreSQL',
  'Better Auth',
  'Zustand',
];

export const LogoCloudSection: React.FC = () => {
  // Duplicate for seamless loop
  const items = [...LOGOS, ...LOGOS];

  return (
    <section className="land-trust">
      <div className="land-container">
        <div className="land-trust-label">Built with production-grade primitives</div>
      </div>
      <div style={{ overflow: 'hidden' }}>
        <div className="land-trust-track">
          {items.map((name, i) => (
            <div key={`${name}-${i}`} className="land-trust-item">
              <span style={{ opacity: 0.3 }}>◆</span>
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
