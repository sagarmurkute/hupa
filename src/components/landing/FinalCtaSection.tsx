import React from 'react';
import { ArrowRight, Download } from 'lucide-react';

interface FinalCtaSectionProps {
  onNavigate: (route: string) => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onNavigate }) => {
  return (
    <section className="neon-final-cta" aria-labelledby="final-cta-heading">
      <div className="container" data-reveal>
        <h2 id="final-cta-heading">
          Build your next system <br />
          <span className="text-gradient-neon">with HUPA.</span>
        </h2>
        <p>
          Open HUPA Studio instantly in your browser or download the native Windows desktop app.
          Zero sign-up required to start exploring and modeling your architecture.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
          <button
            className="btn-neon-primary"
            onClick={() => onNavigate('/app')}
            style={{ height: 48, padding: '0 28px', fontSize: 15 }}
          >
            <span>Start Building Free</span>
            <ArrowRight size={16} />
          </button>
          <button
            className="btn-neon-secondary"
            onClick={() => onNavigate('/download')}
            style={{ height: 48, padding: '0 26px', fontSize: 15 }}
          >
            <Download size={16} />
            <span>Download for Windows</span>
          </button>
        </div>
      </div>
    </section>
  );
};
