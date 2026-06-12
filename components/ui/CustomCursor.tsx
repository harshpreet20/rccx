'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.05, ease: 'none' });
      gsap.to(ring, { x: mouseX, y: mouseY, duration: 0.18, ease: 'power2.out' });
    };

    const onEnterInteractive = () => {
      gsap.to(dot, { scale: 1.8, backgroundColor: '#C9A84C', duration: 0.2 });
      gsap.to(ring, { scale: 0.6, borderColor: 'rgba(201,168,76,0.8)', duration: 0.2 });
    };

    const onLeaveInteractive = () => {
      gsap.to(dot, { scale: 1, backgroundColor: '#F5F0E8', duration: 0.2 });
      gsap.to(ring, { scale: 1, borderColor: 'rgba(201,168,76,0.3)', duration: 0.2 });
    };

    const onMouseDown = () => {
      gsap.to([dot, ring], { scale: 0.7, duration: 0.1 });
    };
    const onMouseUp = () => {
      gsap.to(dot, { scale: 1, duration: 0.3, ease: 'back.out(2)' });
      gsap.to(ring, { scale: 1, duration: 0.4, ease: 'back.out(1.5)' });
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const interactives = document.querySelectorAll('a, button, [data-cursor-interactive]');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', onEnterInteractive);
      el.addEventListener('mouseleave', onLeaveInteractive);
    });

    document.body.style.cursor = 'none';

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      interactives.forEach(el => {
        el.removeEventListener('mouseenter', onEnterInteractive);
        el.removeEventListener('mouseleave', onLeaveInteractive);
      });
      document.body.style.cursor = '';
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: -3,
          left: -3,
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: '#F5F0E8',
          pointerEvents: 'none',
          zIndex: 99999,
          mixBlendMode: 'difference',
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: -12,
          left: -12,
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: '1px solid rgba(201,168,76,0.3)',
          pointerEvents: 'none',
          zIndex: 99998,
        }}
      />
    </>
  );
}
