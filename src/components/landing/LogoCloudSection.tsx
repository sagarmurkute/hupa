import React from 'react';

const LOGOS = [
  { name: 'TypeScript 5.8', icon: '⚡' },
  { name: 'Electron 43', icon: '💻' },
  { name: 'Supabase Postgres', icon: '⚡' },
  { name: 'IndexedDB 3.0', icon: '💾' },
  { name: 'Vite 6', icon: '🚀' },
  { name: 'React 18', icon: '⚛️' },
  { name: 'WASM Core', icon: '🛠️' },
];

export const LogoCloudSection: React.FC = () => {
  return (
    <section className="logo-cloud-section">
      <div className="container">
        <div className="logo-cloud-text">BUILT WITH MODERN DEVELOPER ENGINE PRIMITIVES</div>
        <div className="logo-cloud-grid">
          {LOGOS.map((logo) => (
            <div key={logo.name} className="logo-item">
              <span>{logo.icon}</span>
              <span>{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
