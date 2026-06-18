import { gsap } from 'gsap';

// Adds a physical impact moment when a word "lands" during the slam-in animation
export function wordImpact(wordEl: Element) {
  // Micro screen shake via body transform
  gsap.to(document.body, {
    x: (Math.random() - 0.5) * 4,
    y: (Math.random() - 0.5) * 2,
    duration: 0.04,
    yoyo: true,
    repeat: 3,
    ease: 'power1.inOut',
    onComplete: () => gsap.set(document.body, { x: 0, y: 0 }),
  });

  // Gold chromatic split — clone the element, separate R/B channels briefly
  const el = wordEl as HTMLElement;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0) return;

  const clone = el.cloneNode(true) as HTMLElement;
  clone.style.cssText = `
    position: fixed;
    top: ${rect.top}px;
    left: ${rect.left}px;
    width: ${rect.width}px;
    height: ${rect.height}px;
    pointer-events: none;
    z-index: 9999;
    color: rgba(201,168,76,0.7);
    mix-blend-mode: screen;
    transform: translateX(3px);
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    letter-spacing: inherit;
  `;
  document.body.appendChild(clone);
  gsap.to(clone, {
    opacity: 0,
    x: 8,
    duration: 0.2,
    ease: 'power2.out',
    onComplete: () => clone.remove(),
  });
}
