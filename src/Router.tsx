import React, { useState, useEffect, useCallback } from 'react';
import { LandingPage } from './pages/LandingPage';
import { DocsPage } from './pages/DocsPage';
import { DownloadPage } from './pages/DownloadPage';
import App from './App';
import { useAuthStore } from './store/useAuthStore';

export const Router: React.FC = () => {
  const { setAuthModalOpen } = useAuthStore();

  // Determine initial route
  const getInitialRoute = (): { path: string; search: string } => {
    // If running inside Electron desktop app, default to /app editor
    if (typeof window !== 'undefined' && (window as any).electronAPI?.isDesktop) {
      return { path: '/app', search: '' };
    }

    if (typeof window === 'undefined') {
      return { path: '/', search: '' };
    }

    // Check hash-based routing first (e.g. /#/app or /#/docs)
    const hash = window.location.hash;
    if (hash.startsWith('#/')) {
      const hashPath = hash.slice(1).split('?')[0];
      const hashSearch = hash.includes('?') ? hash.slice(hash.indexOf('?')) : '';
      return { path: hashPath, search: hashSearch };
    }

    const path = window.location.pathname.replace(/\/$/, '') || '/';
    return { path, search: window.location.search };
  };

  const [currentLocation, setCurrentLocation] = useState<{ path: string; search: string }>(getInitialRoute);

  const navigate = useCallback((url: string) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    const [pathPart, searchPart] = url.split('?');
    const cleanPath = pathPart.replace(/\/$/, '') || '/';
    const cleanSearch = searchPart ? `?${searchPart}` : '';

    window.history.pushState({}, '', url);
    setCurrentLocation({ path: cleanPath, search: cleanSearch });
    window.scrollTo(0, 0);

    // If navigating to /app with auth param, open auth modal
    if (cleanPath === '/app' && cleanSearch.includes('auth=signin')) {
      setTimeout(() => setAuthModalOpen(true, 'signin'), 100);
    }
  }, [setAuthModalOpen]);

  useEffect(() => {
    const handlePopState = () => {
      const { path, search } = getInitialRoute();
      setCurrentLocation({ path, search });
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Parse doc query param if present
  const docParam = new URLSearchParams(currentLocation.search).get('doc') || undefined;

  // Route matching
  if (currentLocation.path === '/app' || currentLocation.path === '/app.html') {
    return <App />;
  }

  if (currentLocation.path === '/docs') {
    return <DocsPage onNavigate={navigate} initialDoc={docParam} />;
  }

  if (currentLocation.path === '/download') {
    return <DownloadPage onNavigate={navigate} />;
  }

  // Default to public landing page
  return <LandingPage onNavigate={navigate} />;
};

export default Router;
