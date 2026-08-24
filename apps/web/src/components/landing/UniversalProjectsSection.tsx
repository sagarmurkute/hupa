import React, { useState, useEffect, useRef } from 'react';
import { Globe, Smartphone, Sparkles, Server, Cloud, Terminal, Users, User } from 'lucide-react';
import { gsap } from './useScrollReveal';

interface ProjectCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  tagline: string;
  nodes: Array<{ name: string; type: string; status: string }>;
  edgesCount: number;
}

const CATEGORIES: ProjectCategory[] = [
  {
    id: 'web',
    name: 'Web Applications',
    icon: <Globe size={15} />,
    tagline: 'Client-server boundaries, SSR/SSG workflows, edge caches, state stores, and REST/GraphQL APIs.',
    nodes: [
      { name: 'Next.js App', type: 'page', status: 'active' },
      { name: 'Zustand Store', type: 'module', status: 'completed' },
      { name: 'Vercel Edge', type: 'deployment', status: 'active' },
      { name: 'Tailwind CSS', type: 'component', status: 'completed' },
    ],
    edgesCount: 6,
  },
  {
    id: 'mobile',
    name: 'Mobile Applications',
    icon: <Smartphone size={15} />,
    tagline: 'Native and cross-platform mobile apps with clear offline-first caching and sync boundaries.',
    nodes: [
      { name: 'React Native', type: 'component', status: 'active' },
      { name: 'SQLite Storage', type: 'database', status: 'completed' },
      { name: 'Push Gateway', type: 'service', status: 'in-progress' },
      { name: 'Expo Router', type: 'module', status: 'completed' },
    ],
    edgesCount: 5,
  },
  {
    id: 'ai',
    name: 'AI Projects',
    icon: <Sparkles size={15} />,
    tagline: 'Multi-agent networks, vector databases, prompt toolchains, and LLM inference flows with cycle detection.',
    nodes: [
      { name: 'Agent Swarm', type: 'ai-agent', status: 'active' },
      { name: 'Pinecone Vector', type: 'database', status: 'active' },
      { name: 'Ollama Llama3', type: 'ai-model', status: 'completed' },
      { name: 'Tool Chain', type: 'ai-tool', status: 'in-progress' },
    ],
    edgesCount: 9,
  },
  {
    id: 'backend',
    name: 'Backend & APIs',
    icon: <Server size={15} />,
    tagline: 'Model RPC interfaces, message brokers, caching tiers, and relational/document databases.',
    nodes: [
      { name: 'Fastify API', type: 'service', status: 'active' },
      { name: 'Redis PubSub', type: 'event', status: 'completed' },
      { name: 'PostgreSQL DB', type: 'database', status: 'active' },
      { name: 'BullMQ Worker', type: 'task', status: 'active' },
    ],
    edgesCount: 8,
  },
  {
    id: 'infra',
    name: 'Infrastructure',
    icon: <Cloud size={15} />,
    tagline: 'Document VPC networks, Kubernetes clusters, serverless functions, gateways, and multi-region deployments.',
    nodes: [
      { name: 'K8s Cluster', type: 'server', status: 'active' },
      { name: 'NGINX Ingress', type: 'endpoint', status: 'completed' },
      { name: 'AWS S3 Bucket', type: 'database', status: 'active' },
      { name: 'Terraform Plan', type: 'deployment', status: 'completed' },
    ],
    edgesCount: 7,
  },
  {
    id: 'oss',
    name: 'Open Source',
    icon: <Terminal size={15} />,
    tagline: '100% open-source under the MIT license. Architectural documentation that lives in your repo.',
    nodes: [
      { name: 'Core Engine', type: 'package', status: 'active' },
      { name: 'Graph Math', type: 'library', status: 'completed' },
      { name: 'Docs Portal', type: 'page', status: 'completed' },
      { name: 'CLI Tool', type: 'module', status: 'in-progress' },
    ],
    edgesCount: 6,
  },
  {
    id: 'personal',
    name: 'Personal Projects',
    icon: <User size={15} />,
    tagline: 'Solo side projects and indie apps built with structured thinking from day one.',
    nodes: [
      { name: 'Indie SaaS', type: 'product', status: 'in-progress' },
      { name: 'Stripe Billing', type: 'integration', status: 'completed' },
      { name: 'Supabase BaaS', type: 'database', status: 'active' },
      { name: 'Landing Page', type: 'page', status: 'completed' },
    ],
    edgesCount: 5,
  },
  {
    id: 'teams',
    name: 'Engineering Teams',
    icon: <Users size={15} />,
    tagline: 'Synchronize architectural diagrams across engineering squads with zero latency and cloud backup.',
    nodes: [
      { name: 'Squad Alpha', type: 'organization', status: 'active' },
      { name: 'Squad Beta', type: 'organization', status: 'active' },
      { name: 'Shared Libs', type: 'package', status: 'completed' },
      { name: 'Design Tokens', type: 'module', status: 'completed' },
    ],
    edgesCount: 10,
  },
];

export const UniversalProjectsSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState('web');
  const sectionRef = useRef<HTMLElement>(null);
  const activeCategory = CATEGORIES.find((c) => c.id === selectedId) || CATEGORIES[0];

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.universal-header',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="land-section" style={{ borderTop: '1px solid var(--land-border)', position: 'relative' }}>
      <div className="land-container">
        {/* Header */}
        <div className="universal-header" style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 56px' }}>
          <div className="land-section-label">Universal Applicability</div>
          <h2 className="land-section-title" style={{ fontSize: 'clamp(32px, 4.5vw, 54px)', lineHeight: 1.08 }}>
            One system for every kind of project.
          </h2>
          <p className="land-section-subtitle" style={{ fontSize: 17, maxWidth: 580, margin: '0 auto' }}>
            Whether you are designing an AI agent network, a high-throughput backend, or a cross-platform mobile app.
          </p>
        </div>

        {/* Category Pills Switcher */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 40 }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedId(cat.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: 100,
                fontSize: 13,
                fontFamily: 'var(--font-body)',
                background: selectedId === cat.id ? '#ffffff' : 'var(--land-surface)',
                color: selectedId === cat.id ? '#000000' : 'var(--land-text-2)',
                border: '1px solid',
                borderColor: selectedId === cat.id ? '#ffffff' : 'var(--land-border-2)',
                fontWeight: selectedId === cat.id ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Topology Showcase Box */}
        <div
          style={{
            background: 'var(--land-bg-elevated)',
            border: '1px solid var(--land-border-3)',
            borderRadius: 16,
            padding: '36px 32px',
            maxWidth: 960,
            margin: '0 auto',
            boxShadow: 'var(--land-shadow-lg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, borderBottom: '1px solid var(--land-border)', paddingBottom: 16 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--land-text)' }}>
                  {activeCategory.name}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, background: 'var(--land-surface-2)', padding: '2px 8px', borderRadius: 4, color: 'var(--land-text-3)' }}>
                  {activeCategory.edgesCount} CONNECTED RELATIONSHIPS
                </span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--land-text-2)', marginTop: 6, margin: 0, lineHeight: 1.5 }}>
                {activeCategory.tagline}
              </p>
            </div>
          </div>

          {/* Rendered Nodes in Selected Category */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {activeCategory.nodes.map((n) => (
              <div
                key={n.name}
                style={{
                  background: 'var(--land-surface)',
                  border: '1px solid var(--land-border-2)',
                  borderRadius: 10,
                  padding: '16px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: 90,
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--land-text)' }}>
                  {n.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--land-text-3)', textTransform: 'uppercase' }}>
                    {n.type}
                  </span>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#ffffff', background: 'var(--land-surface-3)', padding: '2px 6px', borderRadius: 4 }}>
                    {n.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
