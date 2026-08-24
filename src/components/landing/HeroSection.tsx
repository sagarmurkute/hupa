import React, { useState } from 'react';
import { ArrowRight, Download, Zap, Activity, ShieldCheck } from 'lucide-react';


interface HeroSectionProps {
  onNavigate: (route: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [pulseCount, setPulseCount] = useState(148);
  const [selectedNode, setSelectedNode] = useState('API Gateway');

  return (
    <section className="neon-hero" aria-labelledby="hero-title">
      <div className="container">
        <div className="neon-hero-grid">
          {/* Left: Neon Headline & Value */}
          <div>
            <div className="neon-badge-pill">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--neon-green)', boxShadow: '0 0 10px var(--neon-green)' }} />
              <span>THE SPATIAL GRAPH ENGINE • V0.1.0</span>
            </div>

            <h1 id="hero-title" className="neon-title">
              The Spatial Engine <br />
              <span className="text-gradient-neon">for Developers.</span>
            </h1>

            <p className="neon-subtitle">
              HUPA turns complex software systems into an interactive, real-time spatial graph.
              Built for local-first speed, instant sync, and zero cloud lock-in.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
              <button
                onClick={() => onNavigate('/app')}
                className="btn-neon-primary"
                style={{ height: 48, padding: '0 26px', fontSize: 15 }}
              >
                <span>Start Building Free</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => onNavigate('/download')}
                className="btn-neon-secondary"
                style={{ height: 48, padding: '0 24px', fontSize: 15 }}
              >
                <Download size={16} />
                <span>Download for Windows</span>
              </button>
            </div>

            {/* Micro Stats */}
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', borderTop: '1px solid var(--neon-border)', paddingTop: 20 }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-white)', fontWeight: 700 }}>0ms Latency</div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Synchronous IDB Write</div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-white)', fontWeight: 700 }}>Auto-Sync</div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>350ms Debounce Queue</div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-white)', fontWeight: 700 }}>100% Open</div>
                <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>MIT License</div>
              </div>
            </div>
          </div>

          {/* Right: Neon Live Telemetry & Graph Canvas Card */}
          <div className="neon-hero-card" data-reveal>
            {/* Window bar */}
            <div style={{ padding: '12px 18px', background: 'var(--neon-surface)', borderBottom: '1px solid var(--neon-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f56' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ffbd2e' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#27c93f' }} />
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text-dim)' }}>
                hupa_spatial_engine.canvas
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--neon-green-text)', fontWeight: 700 }}>
                <Zap size={12} />
                <span>60 FPS</span>
              </div>
            </div>

            {/* Live Interactive Node Stage */}
            <div style={{ height: 380, position: 'relative', background: 'radial-gradient(circle at 50% 50%, var(--neon-surface) 0%, var(--neon-bg-card) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Animated SVG Connections */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <line x1="22%" y1="35%" x2="50%" y2="35%" stroke="var(--neon-green)" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="50%" y1="35%" x2="78%" y2="35%" stroke="var(--neon-green)" strokeWidth="2" />
                <line x1="50%" y1="35%" x2="50%" y2="70%" stroke="var(--neon-border)" strokeWidth="1.5" />
              </svg>

              {/* Node 1: Web Studio */}
              <div
                onClick={() => { setSelectedNode('Web Studio'); setPulseCount((c) => c + 1); }}
                style={{
                  position: 'absolute', left: '22%', top: '35%', transform: 'translate(-50%, -50%)',
                  background: 'var(--neon-surface)', border: selectedNode === 'Web Studio' ? '2px solid var(--neon-green)' : '1px solid var(--neon-border)',
                  boxShadow: selectedNode === 'Web Studio' ? '0 0 20px var(--neon-green-glow)' : 'none',
                  borderRadius: 10, padding: '10px 16px', cursor: 'pointer', textAlign: 'center', minWidth: 120,
                  transition: 'all 200ms',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-white)' }}>Web Studio</div>
                <div style={{ fontSize: 10.5, color: 'var(--neon-green-text)', marginTop: 2, fontFamily: 'var(--mono)' }}>CLIENT</div>
              </div>

              {/* Node 2: API Gateway */}
              <div
                onClick={() => { setSelectedNode('API Gateway'); setPulseCount((c) => c + 1); }}
                style={{
                  position: 'absolute', left: '50%', top: '35%', transform: 'translate(-50%, -50%)',
                  background: 'var(--neon-bg)', border: selectedNode === 'API Gateway' ? '2px solid var(--neon-green)' : '1px solid var(--neon-border)',
                  boxShadow: selectedNode === 'API Gateway' ? '0 0 24px var(--neon-green-glow)' : 'none',
                  borderRadius: 10, padding: '12px 18px', cursor: 'pointer', textAlign: 'center', minWidth: 130,
                  transition: 'all 200ms',
                }}
              >
                <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text-white)' }}>API Gateway</div>
                <div style={{ fontSize: 10.5, color: 'var(--neon-green-text)', marginTop: 2, fontFamily: 'var(--mono)' }}>gRPC ROUTER</div>
              </div>

              {/* Node 3: Postgres DB */}
              <div
                onClick={() => { setSelectedNode('Postgres DB'); setPulseCount((c) => c + 1); }}
                style={{
                  position: 'absolute', left: '78%', top: '35%', transform: 'translate(-50%, -50%)',
                  background: 'var(--neon-surface)', border: selectedNode === 'Postgres DB' ? '2px solid var(--neon-green)' : '1px solid var(--neon-border)',
                  boxShadow: selectedNode === 'Postgres DB' ? '0 0 20px var(--neon-green-glow)' : 'none',
                  borderRadius: 10, padding: '10px 16px', cursor: 'pointer', textAlign: 'center', minWidth: 120,
                  transition: 'all 200ms',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-white)' }}>Postgres DB</div>
                <div style={{ fontSize: 10.5, color: 'var(--neon-green-text)', marginTop: 2, fontFamily: 'var(--mono)' }}>STORAGE</div>
              </div>

              {/* Live telemetry bar */}
              <div
                style={{
                  position: 'absolute', bottom: 14, left: 14, right: 14,
                  background: 'var(--neon-surface)', border: '1px solid var(--neon-border)',
                  borderRadius: 8, padding: '10px 14px', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', fontSize: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Activity size={14} style={{ color: 'var(--neon-green)' }} />
                  <span>Selected Node: <strong style={{ color: 'var(--text-white)' }}>{selectedNode}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
                  <ShieldCheck size={14} style={{ color: 'var(--neon-green)' }} />
                  <span>{pulseCount} Telemetry Signals • 0ms Local Write</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
