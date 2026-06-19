'use client';
import { useEffect, useRef } from 'react';

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {});
    const onEnded = () => v.play().catch(() => {});
    v.addEventListener('ended', onEnded);
    return () => v.removeEventListener('ended', onEnded);
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        pointerEvents: 'none',
      }}
    >
      <source src="/hero-video.mp4" type="video/mp4" />
    </video>
  );
}
