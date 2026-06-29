'use client';
import { useState, useEffect, useRef } from 'react';

export function useCountUp(target: number, decimals = 0): [number, React.RefObject<HTMLElement | null>] {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLElement | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const duration = 1800;
            const start = performance.now();

            const tick = (now: number) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              // easeOut cubic
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = eased * target;
              setCount(parseFloat(current.toFixed(decimals)));
              if (progress < 1) {
                requestAnimationFrame(tick);
              } else {
                setCount(target);
              }
            };

            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, decimals]);

  return [count, ref];
}
