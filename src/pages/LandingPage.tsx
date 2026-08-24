import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { LogoCloudSection } from '../components/landing/LogoCloudSection';
import { NeonPillarsSection } from '../components/landing/NeonPillarsSection';
import { InteractiveProductTabsSection } from '../components/landing/InteractiveProductTabsSection';
import { DiagramSection } from '../components/landing/DiagramSection';
import { WhyHupaMatrixSection } from '../components/landing/WhyHupaMatrixSection';
import { PerformanceCounterSection } from '../components/landing/PerformanceCounterSection';
import { TerminalDevExSection } from '../components/landing/TerminalDevExSection';
import { FinalCtaSection } from '../components/landing/FinalCtaSection';
import { Footer } from '../components/landing/Footer';
import { useRevealObserver } from '../components/landing/useScrollReveal';
import '../styles/landing.css';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('hupa-theme') || 'dark';
  });

  useRevealObserver();

  useEffect(() => {
    document.title = 'HUPA — The Universal Spatial Engine for Developers';
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

      {/* 1. Neon Sticky Header */}
      <Navbar onNavigate={onNavigate} theme={theme} onToggleTheme={toggleTheme} />

      {/* Main Content Stream (Neon.com Layout Architecture) */}
      <main id="main">
        {/* 2. Hero Section with Live Telemetry Card */}
        <HeroSection onNavigate={onNavigate} />

        {/* 3. Logo Cloud / Trust Bar */}
        <LogoCloudSection />

        {/* 4. The 4 Neon Architecture Virtues */}
        <NeonPillarsSection />

        {/* 5. Interactive Product Tabs Showcase */}
        <InteractiveProductTabsSection />

        {/* 6. Transformation Pipeline Diagram */}
        <DiagramSection />

        {/* 7. Comparison Matrix (Why HUPA?) */}
        <WhyHupaMatrixSection />

        {/* 8. Scale & Speed Performance Counters */}
        <PerformanceCounterSection />

        {/* 9. Developer Getting Started CLI & Terminal */}
        <TerminalDevExSection />

        {/* 10. Closing Banner CTA */}
        <FinalCtaSection onNavigate={onNavigate} />
      </main>

      {/* 11. Multi-Column Developer Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default LandingPage;
