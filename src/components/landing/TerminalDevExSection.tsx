import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

export const TerminalDevExSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const commandText = 'git clone https://github.com/sagarmurkute/hupa.git && cd hupa && npm install && npm run dev';

  const handleCopy = () => {
    navigator.clipboard.writeText(commandText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="terminal" style={{ padding: '96px 0', borderBottom: '1px solid var(--neon-border)' }}>
      <div className="container">
        <div data-reveal style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 48, alignItems: 'center' }}>
          <div>
            <div className="neon-badge-pill" style={{ marginBottom: 16 }}>
              <Terminal size={14} />
              <span>DEVELOPER GETTING STARTED</span>
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 3.6vw, 44px)', fontWeight: 800, color: 'var(--text-white)', letterSpacing: '-0.04em', margin: '0 0 16px' }}>
              Up and running in <br />
              <span className="text-gradient-neon">30 seconds.</span>
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 24px' }}>
              Clone the open-source repository and start HUPA in dev mode, or launch the Web Studio instantly in your browser.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href="/app" className="btn-neon-primary" style={{ height: 44, padding: '0 22px', fontSize: 14 }}>
                Launch Web Studio
              </a>
              <a href="https://github.com/sagarmurkute/hupa" target="_blank" rel="noopener noreferrer" className="btn-neon-secondary" style={{ height: 44, padding: '0 20px', fontSize: 14 }}>
                View GitHub Repository
              </a>
            </div>
          </div>

          {/* Terminal Window */}
          <div className="neon-terminal-card">
            <div className="terminal-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
                <span style={{ marginLeft: 8, opacity: 0.6 }}>hupa-cli — bash</span>
              </div>
              <button
                onClick={handleCopy}
                style={{
                  background: 'none', border: '1px solid var(--neon-border)', borderRadius: 4,
                  padding: '4px 8px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 11,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                {copied ? <Check size={12} style={{ color: 'var(--neon-green)' }} /> : <Copy size={12} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div style={{ padding: '24px', fontFamily: 'var(--mono)', fontSize: 13, lineHeight: 1.8, color: '#e2e8f0' }}>
              <div style={{ color: 'var(--text-dim)' }}># 1. Clone the repository</div>
              <div><span style={{ color: 'var(--neon-green)' }}>$</span> git clone https://github.com/sagarmurkute/hupa.git</div>
              <div style={{ color: 'var(--text-dim)', marginTop: 12 }}># 2. Install dependencies & start studio</div>
              <div><span style={{ color: 'var(--neon-green)' }}>$</span> cd hupa && npm install</div>
              <div><span style={{ color: 'var(--neon-green)' }}>$</span> npm run dev</div>
              <div style={{ color: 'var(--neon-green-text)', marginTop: 16, fontSize: 12 }}>
                ✓ Local development server active at http://localhost:5173
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
