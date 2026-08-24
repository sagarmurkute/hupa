import React, { useEffect, useRef } from 'react';
import { ArrowRight, Download } from 'lucide-react';
import { gsap, ScrollTrigger } from './useScrollReveal';

interface FinalCtaSectionProps {
  onNavigate: (route: string) => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ onNavigate }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // Scale up from the distance as the user approaches
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 0.5,
        },
      });

      tl.fromTo(titleRef.current,
        { opacity: 0, scale: 0.9, y: 40, filter: 'blur(4px)' },
        { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', duration: 1 }
      );

      tl.fromTo(descRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.5'
      );

      tl.fromTo(actionsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 },
        '-=0.3'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="land-cta land-section-border" aria-labelledby="final-cta-heading">
      <h2 ref={titleRef} id="final-cta-heading" className="land-cta-title" style={{ opacity: 0 }}>
        Build your next system<br />
        <span className="land-cta-title-dim">with HUPA.</span>
      </h2>
      <p ref={descRef} className="land-cta-desc" style={{ opacity: 0 }}>
        Open HUPA Studio instantly in your browser or download the native Windows desktop app.
        Zero sign-up required.
      </p>
      <div ref={actionsRef} className="land-cta-actions" style={{ opacity: 0 }}>
        <button
          className="land-btn-primary"
          onClick={() => onNavigate('/app')}
          style={{ height: 52, padding: '0 32px', fontSize: 16 }}
        >
          <span>Start Building</span>
          <ArrowRight size={18} />
        </button>
        <button
          className="land-btn-secondary"
          onClick={() => onNavigate('/download')}
          style={{ height: 52, padding: '0 28px', fontSize: 16 }}
        >
          <Download size={18} />
          <span>Download for Windows</span>
        </button>
      </div>
    </section>
  );
};
