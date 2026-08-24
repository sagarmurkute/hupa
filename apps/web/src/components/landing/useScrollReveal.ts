import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes Lenis smooth scrolling and connects it to GSAP's ticker.
 * Returns a ref to the Lenis instance for external control.
 */
export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Connect Lenis to GSAP's ticker for perfect sync
    const onRaf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onRaf);

    // Keep ScrollTrigger in sync
    lenis.on('scroll', ScrollTrigger.update);

    // Disable GSAP's built-in lag smoothing so Lenis controls timing
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onRaf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}

/**
 * Master scroll reveal observer for [data-reveal] elements.
 * Provides basic reveal for elements not managed by GSAP timelines.
 */
export function useRevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    if (els.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/**
 * Creates a GSAP ScrollTrigger-driven text reveal animation.
 * Splits text into lines/words and staggers their appearance.
 */
export function useTextReveal(
  ref: React.RefObject<HTMLElement | null>,
  options?: { delay?: number; duration?: number }
) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.style.opacity = '1';
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          y: 40,
          filter: 'blur(4px)',
        },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: options?.duration ?? 1,
          delay: options?.delay ?? 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ctx.revert();
  }, [ref, options?.delay, options?.duration]);
}

/**
 * Creates a parallax effect on an element relative to scroll.
 */
export function useParallax(
  ref: React.RefObject<HTMLElement | null>,
  speed: number = 0.3,
  direction: 'y' | 'x' = 'y'
) {
  useEffect(() => {
    if (!ref.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        [direction]: () => speed * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, [ref, speed, direction]);
}

/**
 * Stagger-reveal children of a container as they enter viewport.
 */
export function useStaggerReveal(
  ref: React.RefObject<HTMLElement | null>,
  childSelector: string = ':scope > *',
  options?: { stagger?: number; y?: number; duration?: number }
) {
  useEffect(() => {
    if (!ref.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const children = ref.current.querySelectorAll(childSelector);
    if (children.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        children,
        {
          opacity: 0,
          y: options?.y ?? 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: options?.duration ?? 0.8,
          stagger: options?.stagger ?? 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ctx.revert();
  }, [ref, childSelector, options?.stagger, options?.y, options?.duration]);
}

export { gsap, ScrollTrigger };
