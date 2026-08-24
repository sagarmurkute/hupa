import React, { useEffect } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Monitor, Globe, Download, ArrowRight, Check, Terminal } from 'lucide-react';
import { useSmoothScroll } from '../components/landing/useScrollReveal';
import '../styles/landing.css';

interface DownloadPageProps {
  onNavigate: (route: string) => void;
}

export const DownloadPage: React.FC<DownloadPageProps> = ({ onNavigate }) => {
  useSmoothScroll();

  useEffect(() => {
    document.title = 'Download — HUPA Architecture Studio';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="landing-root">
      <Navbar onNavigate={onNavigate} />

      <main className="land-subpage">
        <div className="land-container">
          {/* Header */}
          <div className="land-subpage-header" style={{ maxWidth: 760 }}>
            <div className="land-section-label">Downloads & Releases</div>
            <h1 className="land-subpage-title">
              Get HUPA for your workflow.
            </h1>
            <p className="land-subpage-lead">
              Choose between the instant browser-based Web Studio or the high-performance native Windows Desktop application.
            </p>
          </div>

          {/* 2-Column Primary Options */}
          <div className="land-download-grid">
            {/* 1. WINDOWS DESKTOP */}
            <div className="land-download-card is-featured">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, borderBottom: '1px solid var(--land-border)', paddingBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Monitor size={18} style={{ color: 'var(--land-text)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, color: 'var(--land-text)' }}>
                      WINDOWS 10 / 11
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      backgroundColor: 'var(--land-surface-2)',
                      color: 'var(--land-text-3)',
                      padding: '3px 8px',
                      borderRadius: 4,
                      border: '1px solid var(--land-border)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    VERSION 0.1.0
                  </span>
                </div>

                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2.6vw, 30px)', fontWeight: 600, color: 'var(--land-text-hero)', marginBottom: 12, letterSpacing: '-0.02em' }}>
                  HUPA Desktop for Windows
                </h2>

                <p style={{ fontSize: 14, color: 'var(--land-text-2)', lineHeight: 1.65, marginBottom: 28, fontWeight: 300 }}>
                  Native 64-bit Windows installer powered by Electron 43. Direct JSON project file system access, window state persistence, and native keyboard shortcuts.
                </p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36, padding: 0 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--land-text-2)', fontWeight: 400 }}>
                    <Check size={15} style={{ color: 'var(--land-text)' }} /> Native NSIS Installer (.exe) with Start Menu integration
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--land-text-2)', fontWeight: 400 }}>
                    <Check size={15} style={{ color: 'var(--land-text)' }} /> Native File Dialogs (Open & Save architecture JSON)
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--land-text-2)', fontWeight: 400 }}>
                    <Check size={15} style={{ color: 'var(--land-text)' }} /> 100% Offline Capability with local IndexedDB
                  </li>
                </ul>
              </div>

              <div>
                <a
                  href="https://github.com/sagarmurkute/hupa/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="land-btn-primary"
                  style={{ width: '100%', height: 46, fontSize: 14, marginBottom: 12 }}
                >
                  <Download size={16} />
                  <span>Download HUPA-Setup-0.1.0.exe</span>
                </a>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--land-text-4)', textAlign: 'center' }}>
                  Target: Windows 10/11 x64 · SHA256 Verified Release
                </div>
              </div>
            </div>

            {/* 2. WEB APPLICATION */}
            <div className="land-download-card">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, borderBottom: '1px solid var(--land-border)', paddingBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Globe size={18} style={{ color: 'var(--land-text)' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, color: 'var(--land-text)' }}>
                      WEB STUDIO
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      backgroundColor: 'var(--land-surface)',
                      color: 'var(--land-text-3)',
                      padding: '3px 8px',
                      borderRadius: 4,
                      border: '1px solid var(--land-border)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    ONLINE & OFFLINE
                  </span>
                </div>

                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2.6vw, 30px)', fontWeight: 600, color: 'var(--land-text-hero)', marginBottom: 12, letterSpacing: '-0.02em' }}>
                  HUPA Web Application
                </h2>

                <p style={{ fontSize: 14, color: 'var(--land-text-2)', lineHeight: 1.65, marginBottom: 28, fontWeight: 300 }}>
                  Launch HUPA directly in any modern web browser. 0ms local-first canvas operations with optional Supabase cloud synchronization.
                </p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36, padding: 0 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--land-text-2)', fontWeight: 400 }}>
                    <Check size={15} style={{ color: 'var(--land-text)' }} /> Instant zero-installation access
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--land-text-2)', fontWeight: 400 }}>
                    <Check size={15} style={{ color: 'var(--land-text)' }} /> Chromium, Firefox, and Safari support
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--land-text-2)', fontWeight: 400 }}>
                    <Check size={15} style={{ color: 'var(--land-text)' }} /> Seamless cloud sync with Better Auth
                  </li>
                </ul>
              </div>

              <div>
                <button
                  onClick={() => onNavigate('/app')}
                  className="land-btn-secondary"
                  style={{ width: '100%', height: 46, fontSize: 14, marginBottom: 12 }}
                >
                  <span>Launch Web Studio</span>
                  <ArrowRight size={16} />
                </button>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--land-text-4)', textAlign: 'center' }}>
                  Supported: Chrome 110+, Edge 110+, Firefox 115+, Safari 16+
                </div>
              </div>
            </div>
          </div>

          {/* Building from Source Guide */}
          <div style={{ border: '1px solid var(--land-border)', background: 'var(--land-bg-elevated)', borderRadius: 16, padding: '36px 32px', marginBottom: 80 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <Terminal size={18} style={{ color: 'var(--land-text)' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--land-text-hero)', letterSpacing: '-0.015em', margin: 0 }}>
                Build Native Binary from Source
              </h3>
            </div>
            <p style={{ fontSize: 14, color: 'var(--land-text-2)', marginBottom: 20, fontWeight: 300 }}>
              You can package the Windows desktop installer directly from the open source repository:
            </p>
            <pre className="land-docs-code" style={{ margin: 0 }}>
              <code>{`# 1. Clone repository and install dependencies
git clone https://github.com/sagarmurkute/hupa.git
cd hupa
npm install

# 2. Package Windows NSIS Installer (.exe)
npm run package:win

# Output binary located at:
# dist-desktop/HUPA-Setup-0.1.0.exe`}</code>
            </pre>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default DownloadPage;
