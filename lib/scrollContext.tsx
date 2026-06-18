'use client';

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollContextValue {
  scrollProgress: React.MutableRefObject<number>;
  sectionProgress: React.MutableRefObject<number[]>;
  lenisRef: React.MutableRefObject<Lenis | null>;
}

const ScrollContext = createContext<ScrollContextValue | null>(null);

export function ScrollContextProvider({ children }: { children: ReactNode }) {
  const scrollProgress = useRef(0);
  const sectionProgress = useRef([0, 0, 0, 0, 0]);
  const lenisRef = useRef<Lenis | null>(null);
  const sectionBoundaries = useRef<number[]>([]);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenisRef.current = lenis;

    const computeBoundaries = () => {
      const totalH = document.body.scrollHeight - window.innerHeight;
      if (totalH <= 0) return;
      const sections = document.querySelectorAll('[data-scene-section]');
      const bounds: number[] = [];
      sections.forEach((el) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        bounds.push((rect.top + window.scrollY) / totalH);
      });
      sectionBoundaries.current = bounds;
    };

    const ro = new ResizeObserver(computeBoundaries);
    ro.observe(document.body);
    // Delay initial compute until fonts/images load
    setTimeout(computeBoundaries, 500);

    lenis.on('scroll', ({ progress }: { progress: number }) => {
      scrollProgress.current = progress;
      ScrollTrigger.update();

      // Per-section progress
      const bounds = sectionBoundaries.current;
      if (bounds.length >= 2) {
        const step = 1 / Math.max(bounds.length, 1);
        for (let i = 0; i < 5; i++) {
          const start = bounds[i] ?? i * step;
          const end = bounds[i + 1] ?? (i + 1) * step;
          const range = end - start;
          sectionProgress.current[i] = range > 0
            ? Math.max(0, Math.min(1, (progress - start) / range))
            : 0;
        }
      }
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      ro.disconnect();
    };
  }, []);

  return (
    <ScrollContext.Provider value={{ scrollProgress, sectionProgress, lenisRef }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollContext() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error('useScrollContext must be used inside ScrollContextProvider');
  return ctx;
}
