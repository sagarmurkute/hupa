import React, { useState, useEffect, useCallback } from 'react';
import { LandingPage } from './pages/LandingPage';
import { DocsPage } from './pages/DocsPage';
import { DownloadPage } from './pages/DownloadPage';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { App } from '@hupa/editor';
import { useAuthStore } from '@hupa/state';

interface RouteDefinition {
  title: string;
  category: string;
  description: string;
  actionRoute?: string;
  actionLabel?: string;
}

const STATIC_ROUTES: Record<string, RouteDefinition> = {
  // Product
  '/templates': {
    category: 'Product & Architecture',
    title: 'Architecture Templates',
    description: 'Pre-configured architectural blueprints: Microservices mesh, Event-Driven architectures, Sagar Ecosystem, and AI agent swarms.',
    actionRoute: '/app',
    actionLabel: 'Launch in Studio',
  },
  // Solutions
  '/solutions/software-projects': {
    category: 'Solutions',
    title: 'Software Architecture Projects',
    description: 'Model modular monoliths, distributed microservices, service boundaries, and dependency graphs with zero latency.',
    actionRoute: '/app',
    actionLabel: 'Create Software Graph',
  },
  '/solutions/web-applications': {
    category: 'Solutions',
    title: 'Web Application Architecture',
    description: 'Visualize client-server boundaries, SSR/SSG workflows, edge caches, state stores, and REST/GraphQL APIs.',
    actionRoute: '/app',
    actionLabel: 'Design Web Stack',
  },
  '/solutions/mobile-applications': {
    category: 'Solutions',
    title: 'Mobile Architecture',
    description: 'Structure native and cross-platform mobile apps with clear offline-first caching and sync boundaries.',
    actionRoute: '/app',
    actionLabel: 'Open Mobile Workspace',
  },
  '/solutions/ai-projects': {
    category: 'Solutions',
    title: 'AI & Multi-Agent Systems',
    description: 'Map autonomous agent networks, prompt pipelines, vector databases, toolchains, and LLM inference flows with automated cycle detection.',
    actionRoute: '/app',
    actionLabel: 'Model AI Graph',
  },
  '/solutions/apis-backend': {
    category: 'Solutions',
    title: 'APIs & Backend Systems',
    description: 'Design robust backend topographies, gRPC/REST endpoints, message queues, and relational/document databases in unified graphs.',
    actionRoute: '/app',
    actionLabel: 'Start Backend Map',
  },
  '/solutions/infrastructure': {
    category: 'Solutions',
    title: 'Cloud Infrastructure & Networks',
    description: 'Document VPC networks, Kubernetes clusters, serverless functions, API gateways, and multi-region deployments.',
    actionRoute: '/app',
    actionLabel: 'Map Infrastructure',
  },
  '/solutions/open-source': {
    category: 'Solutions',
    title: 'Open Source Projects',
    description: 'HUPA is 100% open-source under the MIT license. Build architectural documentation that lives directly in your repository.',
    actionRoute: '/docs',
    actionLabel: 'Read Documentation',
  },
  '/solutions/teams': {
    category: 'Solutions',
    title: 'Engineering Teams & Collaboration',
    description: 'Eliminate architectural drift across engineering squads with deterministic spatial diagrams and local-first speed.',
    actionRoute: '/app',
    actionLabel: 'Collaborate in Studio',
  },
  // Resources
  '/examples': {
    category: 'Resources',
    title: 'Architecture Examples',
    description: 'Explore community-tested architecture graphs, system topologies, and real-world software system diagrams.',
    actionRoute: '/app',
    actionLabel: 'Explore Examples',
  },
  '/blog': {
    category: 'Resources',
    title: 'HUPA Engineering Blog',
    description: 'Technical articles on local-first database architecture, IndexedDB WAL engines, spatial canvas rendering, and DAG analysis.',
    actionRoute: '/docs',
    actionLabel: 'Read Tech Specs',
  },
  '/help': {
    category: 'Resources',
    title: 'Help & Support Center',
    description: 'Guides and FAQs for installing HUPA Desktop, exporting high-res schemas, managing cloud replication, and debugging graphs.',
    actionRoute: '/docs?doc=getting-started',
    actionLabel: 'Getting Started Guide',
  },
  // Developers
  '/cli': {
    category: 'Developers',
    title: 'HUPA CLI Tool',
    description: 'Command line utilities for verifying graph schemas, automating builds, and generating static visual assets in CI/CD pipelines.',
    actionRoute: '/docs',
    actionLabel: 'CLI Documentation',
  },
  '/integrations': {
    category: 'Developers',
    title: 'Ecosystem Integrations',
    description: 'Seamless integration with GitHub Actions, VS Code, Mermaid diagrams, Terraform configs, and Docker Compose files.',
    actionRoute: '/docs',
    actionLabel: 'View Integrations',
  },
  '/plugins': {
    category: 'Developers',
    title: 'Plugin & Extension API',
    description: 'Extend HUPA with custom node renderers, layout optimization algorithms, and external database introspection plugins.',
    actionRoute: '/docs?doc=architecture',
    actionLabel: 'Developer Guide',
  },
  '/roadmap': {
    category: 'Developers',
    title: 'Product Roadmap',
    description: 'Upcoming milestones: Real-time peer collaboration, 3D topology views, AI clustering, and native macOS/Linux desktop packages.',
    actionRoute: '/app',
    actionLabel: 'Try Current Release',
  },
  // Company
  '/about': {
    category: 'Company',
    title: 'About HUPA',
    description: 'HUPA was created to give software architects and developers a spatial, ultra-responsive tool to understand and design complex systems without cognitive overload.',
    actionRoute: '/app',
    actionLabel: 'Launch Studio',
  },
  '/security': {
    category: 'Company',
    title: 'Security Policy',
    description: 'Local-first by default. All graphs and state are saved directly in local IndexedDB. Cloud synchronization requires explicit user opt-in and authentication.',
    actionRoute: '/docs?doc=local-first-and-sync',
    actionLabel: 'Security & Sync Specs',
  },
  '/privacy': {
    category: 'Company',
    title: 'Privacy Policy',
    description: 'We respect developer privacy. We do not collect telemetry, track private architecture graphs, or monetize user data.',
    actionRoute: '/app',
    actionLabel: 'Use Offline Studio',
  },
  '/terms': {
    category: 'Company',
    title: 'Terms of Service',
    description: 'Standard terms for HUPA Studio, Desktop software distribution, and cloud synchronization services under the MIT License.',
    actionRoute: '/download',
    actionLabel: 'Download Desktop App',
  },
  '/contact': {
    category: 'Company',
    title: 'Contact & Support',
    description: 'Connect with the HUPA core development team, submit bug reports, or discuss enterprise deployments.',
    actionRoute: '/docs',
    actionLabel: 'Browse Documentation',
  },
};

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

  // Subpage matching
  if (STATIC_ROUTES[currentLocation.path]) {
    const routeInfo = STATIC_ROUTES[currentLocation.path];
    return (
      <PlaceholderPage
        title={routeInfo.title}
        category={routeInfo.category}
        description={routeInfo.description}
        onNavigate={navigate}
        actionRoute={routeInfo.actionRoute}
        actionLabel={routeInfo.actionLabel}
      />
    );
  }

  // Default to public landing page
  return <LandingPage onNavigate={navigate} />;
};

export default Router;
