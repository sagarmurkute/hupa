import React, { useEffect } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Footer } from '../components/landing/Footer';
import { Monitor, Globe, Download, ArrowRight, Check, Terminal } from 'lucide-react';
import '../styles/landing.css';


interface DownloadPageProps {
  onNavigate: (route: string) => void;
}

export const DownloadPage: React.FC<DownloadPageProps> = ({ onNavigate }) => {
  useEffect(() => {
    document.title = 'Download — HUPA Architecture Studio';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="landing-viewport">
      <Navbar onNavigate={onNavigate} />

      <main style={{ minHeight: '80vh', borderBottom: '1px solid #e5e5e5' }}>
        <div className="landing-container" style={{ padding: '4rem 2rem' }}>
          {/* Header */}
          <div style={{ maxWidth: '820px', marginBottom: '3.5rem' }}>
            <div className="section-kicker">
              <span>Downloads & Releases</span>
            </div>
            <h1 className="section-heading-large">
              Get HUPA for your platform.
            </h1>
            <p className="section-lead-text" style={{ marginTop: '1rem' }}>
              Choose between the instant browser-based Web Studio or the high-performance native Windows Desktop application.
            </p>
          </div>

          {/* 2-Column Primary Options */}
          <div className="editorial-grid-2" style={{ marginBottom: '4rem' }}>
            {/* 1. WINDOWS DESKTOP */}
            <div
              style={{
                border: '1px solid #000000',
                backgroundColor: '#0a0a0a',
                color: '#ffffff',
                padding: '3rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #262626', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Monitor size={20} />
                    <span style={{ fontFamily: 'var(--hupa-font-mono)', fontSize: '0.875rem', fontWeight: 700 }}>
                      WINDOWS 10 / 11
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--hupa-font-mono)',
                      fontSize: '0.6875rem',
                      backgroundColor: '#1f1f1f',
                      padding: '2px 8px',
                      border: '1px solid #333333',
                    }}
                  >
                    VERSION 0.1.0
                  </span>
                </div>

                <h2 style={{ fontFamily: 'var(--hupa-font-display)', fontSize: '1.85rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
                  HUPA Desktop for Windows
                </h2>

                <p style={{ fontSize: '0.9375rem', color: '#a3a3a3', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Native 64-bit Windows installer powered by Electron 43. Direct JSON project file system access, window state persistence, and native shortcuts.
                </p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: '#d4d4d4' }}>
                    <Check size={16} /> Native NSIS Installer (.exe) with Start Menu integration
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: '#d4d4d4' }}>
                    <Check size={16} /> Native File Dialogs (Open & Save architecture JSON)
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: '#d4d4d4' }}>
                    <Check size={16} /> 100% Offline Capability with local IndexedDB
                  </li>
                </ul>
              </div>

              <div>
                <a
                  href="https://github.com/sagarmurkute/hupa/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono-btn mono-btn-dark-primary"
                  style={{ width: '100%', padding: '0.95rem', fontSize: '0.9375rem', marginBottom: '1rem' }}
                >
                  <Download size={18} />
                  <span>Download HUPA-Setup-0.1.0.exe</span>
                </a>
                <div style={{ fontFamily: 'var(--hupa-font-mono)', fontSize: '0.6875rem', color: '#737373', textAlign: 'center' }}>
                  Target: Windows 10/11 x64 • SHA256 Verified Release
                </div>
              </div>
            </div>

            {/* 2. WEB APPLICATION */}
            <div
              style={{
                border: '1px solid #000000',
                backgroundColor: '#ffffff',
                padding: '3rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #e5e5e5', paddingBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Globe size={20} />
                    <span style={{ fontFamily: 'var(--hupa-font-mono)', fontSize: '0.875rem', fontWeight: 700 }}>
                      WEB STUDIO
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--hupa-font-mono)',
                      fontSize: '0.6875rem',
                      backgroundColor: '#f5f5f5',
                      padding: '2px 8px',
                      border: '1px solid #e5e5e5',
                    }}
                  >
                    ONLINE & OFFLINE
                  </span>
                </div>

                <h2 style={{ fontFamily: 'var(--hupa-font-display)', fontSize: '1.85rem', fontWeight: 700, color: '#000000', marginBottom: '1rem' }}>
                  HUPA Web Application
                </h2>

                <p style={{ fontSize: '0.9375rem', color: 'var(--hupa-gray-2)', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Launch HUPA directly in any modern web browser. 0ms local-first canvas operations with optional Supabase cloud synchronization.
                </p>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.5rem' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--hupa-gray-1)' }}>
                    <Check size={16} /> Instant zero-installation access
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--hupa-gray-1)' }}>
                    <Check size={16} /> Chromium, Firefox, and Safari support
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', color: 'var(--hupa-gray-1)' }}>
                    <Check size={16} /> Seamless cloud sync with Better Auth
                  </li>
                </ul>
              </div>

              <div>
                <button
                  onClick={() => onNavigate('/app')}
                  className="mono-btn mono-btn-primary"
                  style={{ width: '100%', padding: '0.95rem', fontSize: '0.9375rem', marginBottom: '1rem' }}
                >
                  <span>Launch Web Studio</span>
                  <ArrowRight size={18} />
                </button>
                <div style={{ fontFamily: 'var(--hupa-font-mono)', fontSize: '0.6875rem', color: '#737373', textAlign: 'center' }}>
                  Supported Browsers: Chrome 110+, Edge 110+, Firefox 115+, Safari 16+
                </div>
              </div>
            </div>
          </div>

          {/* Building from Source Guide */}
          <div style={{ border: '1px solid #e5e5e5', backgroundColor: '#fafafa', padding: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Terminal size={18} />
              <h3 style={{ fontFamily: 'var(--hupa-font-display)', fontSize: '1.25rem', fontWeight: 700 }}>
                Build Native Binary from Source
              </h3>
            </div>
            <p style={{ fontSize: '0.9375rem', color: 'var(--hupa-gray-2)', marginBottom: '1.5rem' }}>
              You can package the Windows desktop installer directly from the open source repository:
            </p>
            <pre
              style={{
                backgroundColor: '#000000',
                color: '#ffffff',
                padding: '1.25rem',
                fontFamily: 'var(--hupa-font-mono)',
                fontSize: '0.8125rem',
                lineHeight: 1.5,
                overflowX: 'auto',
                border: '1px solid #262626',
              }}
            >
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
