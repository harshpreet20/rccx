'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  id: string;
  player_name: string;
  player_title: string;
  quote: string;
  rating: number;
  featured: boolean;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          color={i < rating ? '#D4AF37' : 'rgba(255,255,255,0.15)'}
          fill={i < rating ? '#D4AF37' : 'none'}
        />
      ))}
    </div>
  );
}

const TITLE_WORDS = ['WHAT', 'THEY', 'SAY'];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-15% 0px' });
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function fetchTestimonials() {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('featured', true);
      if (data) setTestimonials(data);
      setLoading(false);
    }
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    autoPlayRef.current = setInterval(() => {
      setDirection('right');
      setCurrentIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [testimonials.length]);

  function goNext() {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    setDirection('right');
    setCurrentIndex((i) => (i + 1) % testimonials.length);
  }

  function goPrev() {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    setDirection('left');
    setCurrentIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  }

  const slideVariants = {
    enter: (dir: string) => ({
      x: dir === 'right' ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
    exit: (dir: string) => ({
      x: dir === 'right' ? -60 : 60,
      opacity: 0,
      transition: { duration: 0.35 },
    }),
  };

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '80px clamp(16px, 5vw, 120px)',
        background: '#0a0a0f',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(194,24,24,0.06) 0%, rgba(212,175,55,0.03) 40%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <div style={{ display: 'inline-flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {TITLE_WORDS.map((word, wi) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 30, rotateX: -40 }}
              animate={
                isInView
                  ? {
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      transition: {
                        type: 'spring' as const,
                        stiffness: 200,
                        damping: 20,
                        delay: wi * 0.15,
                      },
                    }
                  : {}
              }
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-bebas)',
                fontSize: 'clamp(3rem, 6vw, 5rem)',
                color: wi === 1 ? undefined : '#e8e8ec',
                transform: 'skewX(-4deg)',
                lineHeight: 1,
              }}
              className={wi === 1 ? 'text-gradient-gold' : ''}
            >
              {word}
            </motion.span>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            fontFamily: 'var(--font-inter)',
            fontSize: '15px',
            color: '#888899',
            marginTop: '16px',
          }}
        >
          Stories from the court: the moments, the battles, the community.
        </motion.p>
      </div>

      {loading ? (
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            height: '300px',
            background: 'rgba(17,17,24,0.7)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        />
      ) : testimonials.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', color: '#888899', fontFamily: 'var(--font-inter)' }}>
          No testimonials yet.
        </div>
      ) : (
        <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative' }}>
          <div
            style={{
              background: 'rgba(17,17,24,0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '20px',
              padding: 'clamp(32px, 5vw, 60px)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-10px',
                left: '24px',
                fontFamily: 'Georgia, serif',
                fontSize: '120px',
                color: 'rgba(194,24,24,0.15)',
                lineHeight: 1,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              "
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={testimonials[currentIndex].id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ position: 'relative', zIndex: 1 }}
              >
                <div style={{ marginBottom: '20px' }}>
                  <StarRating rating={testimonials[currentIndex].rating} />
                </div>

                <blockquote
                  style={{
                    fontFamily: 'var(--font-dancing)',
                    fontSize: 'clamp(1.3rem, 2.5vw, 2rem)',
                    color: '#e8e8ec',
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                    marginBottom: '32px',
                  }}
                >
                  "{testimonials[currentIndex].quote}"
                </blockquote>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(194,24,24,0.3))',
                      border: '1px solid rgba(212,175,55,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'var(--font-bebas)',
                      fontSize: '1.4rem',
                      color: '#D4AF37',
                    }}
                  >
                    {testimonials[currentIndex].player_name.charAt(0)}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-montserrat)',
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#e8e8ec',
                      }}
                    >
                      {testimonials[currentIndex].player_name}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-inter)',
                        fontSize: '12px',
                        color: '#D4AF37',
                      }}
                    >
                      {testimonials[currentIndex].player_title}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {testimonials.length > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px',
                marginTop: '28px',
              }}
            >
              <button
                onClick={goPrev}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#888899',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,175,55,0.4)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#D4AF37';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#888899';
                }}
              >
                <ChevronLeft size={18} />
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > currentIndex ? 'right' : 'left');
                      setCurrentIndex(i);
                    }}
                    style={{
                      width: i === currentIndex ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      background: i === currentIndex ? '#D4AF37' : 'rgba(255,255,255,0.2)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                  />
                ))}
              </div>

              <button
                onClick={goNext}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#888899',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,175,55,0.4)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#D4AF37';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)';
                  (e.currentTarget as HTMLButtonElement).style.color = '#888899';
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
