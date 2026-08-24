import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { gsap } from './useScrollReveal';

export const TerminalDevExSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const commandText = 'git clone https://github.com/sagarmurkute/hupa.git && cd hupa && npm install && npm run dev';
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(commandText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Left content slides in
      if (leftRef.current) {
        gsap.fromTo(leftRef.current,
          { opacity: 0, x: -40 },
          {
            opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: leftRef.current, start: 'top 80%' },
          }
        );
      }

      // Terminal slides in from right
      if (termRef.current) {
        gsap.fromTo(termRef.current,
          { opacity: 0, x: 40, scale: 0.97 },
          {
            opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: termRef.current, start: 'top 80%' },
          }
        );
      }

      // Terminal lines type in sequentially
      if (linesRef.current) {
        const lines = linesRef.current.querySelectorAll('.term-line');
        gsap.fromTo(lines,
          { opacity: 0, x: -12 },
          {
            opacity: 1, x: 0,
            duration: 0.3,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: linesRef.current,
              start: 'top 75%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="terminal" className="land-section land-section-border">
      <div className="land-container">
        <div className="land-terminal-layout">
          <div ref={leftRef} style={{ opacity: 0 }}>
            <div className="land-section-label" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Terminal size={14} />
              <span>Getting Started</span>
            </div>
            <h2 className="land-section-title" style={{ fontSize: 'clamp(28px, 3.5vw, 44px)' }}>
              Up and running<br />
              in 30 seconds.
            </h2>
            <p className="land-section-desc" style={{ marginBottom: 28 }}>
              Clone the open-source repository and start HUPA in dev mode, or launch the Web Studio instantly.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="/app" className="land-btn-primary" style={{ height: 44, padding: '0 22px', fontSize: 14 }}>
                Launch Web Studio
              </a>
              <a href="https://github.com/sagarmurkute/hupa" target="_blank" rel="noopener noreferrer" className="land-btn-secondary" style={{ height: 44, padding: '0 20px', fontSize: 14 }}>
                View on GitHub
              </a>
            </div>
          </div>

          {/* Terminal Window */}
          <div ref={termRef} className="land-terminal-card" style={{ opacity: 0 }}>
            <div className="land-terminal-bar">
              <div className="land-terminal-dots">
                <div className="land-terminal-dots-inner">
                  <span /><span /><span />
                </div>
                <span style={{ marginLeft: 8 }}>hupa — bash</span>
              </div>
              <button onClick={handleCopy} className="land-terminal-copy">
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div ref={linesRef} className="land-terminal-body">
              <div className="term-line land-terminal-comment"># Clone the repository</div>
              <div className="term-line"><span className="land-terminal-prompt">$</span> git clone https://github.com/sagarmurkute/hupa.git</div>
              <div className="term-line land-terminal-comment" style={{ marginTop: 12 }}># Install dependencies & start</div>
              <div className="term-line"><span className="land-terminal-prompt">$</span> cd hupa && npm install</div>
              <div className="term-line"><span className="land-terminal-prompt">$</span> npm run dev</div>
              <div className="term-line land-terminal-success">
                ✓ Development server at http://localhost:5173
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
