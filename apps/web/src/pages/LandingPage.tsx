import React, { useEffect } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { WhatIsHupaSection } from '../components/landing/WhatIsHupaSection';
import { ExperienceScrubSection } from '../components/landing/ExperienceScrubSection';
import { ConnectedEcosystemSection } from '../components/landing/ConnectedEcosystemSection';
import { UniversalProjectsSection } from '../components/landing/UniversalProjectsSection';
import { CinematicZoomSection } from '../components/landing/CinematicZoomSection';
import { StudioShowcaseSection } from '../components/landing/StudioShowcaseSection';
import { LocalFirstSection } from '../components/landing/LocalFirstSection';
import { CrossPlatformSection } from '../components/landing/CrossPlatformSection';
import { OpenSourceSection } from '../components/landing/OpenSourceSection';
import { OnboardingFlowSection } from '../components/landing/OnboardingFlowSection';
import { FinalConvergenceSection } from '../components/landing/FinalConvergenceSection';
import { Footer } from '../components/landing/Footer';
import { useSmoothScroll, useRevealObserver } from '../components/landing/useScrollReveal';
import { useTheme } from '../hooks/useTheme';
import '../styles/landing.css';

interface LandingPageProps {
  onNavigate: (route: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [theme, toggleTheme] = useTheme();

  // Initialize Lenis smooth scroll
  useSmoothScroll();

  // Fallback reveal observer for scroll elements
  useRevealObserver();

  useEffect(() => {
    document.title = 'HUPA — See Your Entire Project as a Spatial System';

    // Set meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content',
        'HUPA turns complex software architectures into an interactive visual system you can explore, understand, and manage. Local-first, offline-capable, open source.'
      );
    }
  }, []);

  return (
    <div className="landing-root">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      {/* Sticky Header with Navigation Dropdowns & Theme Toggle */}
      <Navbar onNavigate={onNavigate} theme={theme} onToggleTheme={toggleTheme} />

      {/* Main Content — 12 Cinematic Storytelling Sections */}
      <main id="main">
        {/* 1. HERO — "See your entire project." & progressive graph assembly */}
        <HeroSection onNavigate={onNavigate} />

        {/* 2. WHAT IS HUPA? — "Your project isn't a folder. It's a system." */}
        <WhatIsHupaSection />

        {/* 3. THE HUPA EXPERIENCE — Pinned 4-stage scrub: Explore → Connect → Understand → Organize */}
        <ExperienceScrubSection />

        {/* 4. EVERYTHING IS CONNECTED — Project → Systems → Components → Services → Dependencies → Resources */}
        <ConnectedEcosystemSection />

        {/* 5. BUILT FOR EVERY PROJECT — "One system for every kind of project." (Web, Mobile, AI, Backend, Infra, OSS, Teams) */}
        <UniversalProjectsSection />

        {/* 6. GO DEEPER — Signature cinematic spatial zoom from Macro to Micro */}
        <CinematicZoomSection />

        {/* 7. THE ACTUAL HUPA STUDIO — Real product UI: Canvas, Nodes, Inspector, Sidebar, Minimap */}
        <StudioShowcaseSection onNavigate={onNavigate} />

        {/* 8. LOCAL FIRST — "Your project stays with you." (Local → Offline → Sync → Cloud) */}
        <LocalFirstSection />

        {/* 9. WEB + DESKTOP — "Work wherever your project lives." (Web + Windows Desktop) */}
        <CrossPlatformSection onNavigate={onNavigate} />

        {/* 10. OPEN SOURCE — Built in the open (MIT, GitHub, Community) */}
        <OpenSourceSection />

        {/* 11. GET STARTED — 01 to 04 onboarding sequence */}
        <OnboardingFlowSection onNavigate={onNavigate} />

        {/* 12. FINAL EXPERIENCE — Grand graph convergence & "Understand your whole project." */}
        <FinalConvergenceSection onNavigate={onNavigate} />
      </main>

      {/* Complete Footer Sitemap */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

export default LandingPage;
