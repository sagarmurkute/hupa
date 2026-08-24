import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { LogoCloudSection } from '../components/landing/LogoCloudSection';
import { NeonPillarsSection } from '../components/landing/NeonPillarsSection';
import { InteractiveProductTabsSection } from '../components/landing/InteractiveProductTabsSection';
import { DiagramSection } from '../components/landing/DiagramSection';
import { CodeWorkbenchSection } from '../components/landing/CodeWorkbenchSection';
import { WhyHupaMatrixSection } from '../components/landing/WhyHupaMatrixSection';
import { PerformanceCounterSection } from '../components/landing/PerformanceCounterSection';
import { ReactivitySection } from '../components/landing/ReactivitySection';
import { TerminalDevExSection } from '../components/landing/TerminalDevExSection';
import { FinalCtaSection } from '../components/landing/FinalCtaSection';
import { Footer } from '../components/landing/Footer';
import { useSmoothScroll, useRevealObserver } from '../components/landing/useScrollReveal';
import '../styles/landing.css';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('hupa-theme') || 'dark';
  });

  // Initialize Lenis smooth scroll
  useSmoothScroll();

  // Fallback reveal observer for elements not managed by GSAP
  useRevealObserver();

  useEffect(() => {
    document.title = 'HUPA — The Spatial Graph Engine for Developers';

    // Set meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content',
        'Model, understand, and navigate complex software systems as one connected spatial graph. Local-first, offline-capable, open source.'
      );
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hupa-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="landing-root">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      {/* 1. Sticky Glass Header */}
      <Navbar onNavigate={onNavigate} theme={theme} onToggleTheme={toggleTheme} />

      {/* Main Content — Scroll Storytelling */}
      <main id="main">
        {/* 2. Hero — Cinematic opening, graph assembles */}
        <HeroSection onNavigate={onNavigate} />

        {/* 3. Trust Bar — Tech stack marquee */}
        <LogoCloudSection />

        {/* 4. Architecture Pillars — 4 capabilities */}
        <NeonPillarsSection />

        {/* 5. Feature Showcase — Pinned scroll section */}
        <InteractiveProductTabsSection />

        {/* 6. Reactivity — Live state demo */}
        <ReactivitySection />

        {/* 7. Pipeline Diagram — Animated data flow */}
        <DiagramSection />

        {/* 8. Code Workbench — Architecture specs */}
        <CodeWorkbenchSection />

        {/* 9. Comparison — Why HUPA */}
        <WhyHupaMatrixSection />

        {/* 10. Performance — Animated counters */}
        <PerformanceCounterSection />

        {/* 11. Terminal — Getting started */}
        <TerminalDevExSection />

        {/* 12. Final CTA — Convergent */}
        <FinalCtaSection onNavigate={onNavigate} />
      </main>

      {/* 13. Footer — End of experience */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default LandingPage;
