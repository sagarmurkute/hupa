import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('HUPA Application Caught Error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('hupa_workspace_state_v1');
      localStorage.removeItem('upg_workspace_state_v1');
    } catch (e) {
      console.error(e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            fontFamily: "'Inter', sans-serif",
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '460px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              padding: '28px',
              boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '16px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0f172a',
              }}
            >
              <AlertTriangle size={24} />
            </div>

            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                Application State Recovery
              </h2>
              <p style={{ fontSize: '12.5px', color: '#64748b', marginTop: '6px', lineHeight: '1.4' }}>
                HUPA encountered an unexpected state error. You can restore the clean workspace template to continue.
              </p>
            </div>

            {this.state.error && (
              <div
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#334155',
                  fontFamily: 'monospace',
                  textAlign: 'left',
                  maxHeight: '100px',
                  overflowY: 'auto',
                }}
              >
                {this.state.error.message}
              </div>
            )}

            <button
              onClick={this.handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={14} /> Restore Clean Template
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
