import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function revealSection(trigger: Element, targets: string) {
  gsap.fromTo(
    trigger.querySelectorAll(targets),
    { opacity: 0, y: 50, filter: 'blur(6px)' },
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1.1,
      stagger: 0.12,
      ease: 'power3.out',
      scrollTrigger: {
        trigger,
        start: 'top 60%',
        once: true,
      },
    }
  );
}
