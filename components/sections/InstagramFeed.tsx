'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { ExternalLink, Heart } from 'lucide-react';

interface InstagramPost {
  id: string;
  caption: string;
  image_url: string;
  post_url: string;
  likes: number;
  posted_at: string;
}

const FALLBACK_POSTS: InstagramPost[] = [
  { id: '1', caption: 'Sunday smash session. No mercy. 🏸🔥 #RCC #BadmintonDelhi', image_url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&q=80', post_url: 'https://www.instagram.com/racquetsclubcommunity/', likes: 847, posted_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: '2', caption: 'Champions of Smash Night #11. The court was theirs. 🏆 #SmashNight #RCC', image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80', post_url: 'https://www.instagram.com/racquetsclubcommunity/', likes: 1203, posted_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: '3', caption: 'That elevation. That power. Training never stops. ⚡ #RCCElite', image_url: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=600&q=80', post_url: 'https://www.instagram.com/racquetsclubcommunity/', likes: 934, posted_at: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: '4', caption: 'Early morning doubles. The best conversations happen on court. 🌅 #RCCFamily', image_url: 'https://images.unsplash.com/photo-1544717684-1e5e0a8cf519?w=600&q=80', post_url: 'https://www.instagram.com/racquetsclubcommunity/', likes: 678, posted_at: new Date(Date.now() - 11 * 86400000).toISOString() },
  { id: '5', caption: 'Corporate Cup Q1 champions. See you in Q2. 🥇 #CorporateCup #RCC', image_url: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?w=600&q=80', post_url: 'https://www.instagram.com/racquetsclubcommunity/', likes: 1456, posted_at: new Date(Date.now() - 18 * 86400000).toISOString() },
  { id: '6', caption: 'Net kills and net thrills. Drop shot queen Priya at training. 😤 #RCCElite', image_url: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=600&q=80', post_url: 'https://www.instagram.com/racquetsclubcommunity/', likes: 892, posted_at: new Date(Date.now() - 24 * 86400000).toISOString() },
];

function InstagramIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>(FALLBACK_POSTS);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-15% 0px' });

  useEffect(() => {
    async function fetchPosts() {
      // Try Instagram Graph API first
      try {
        const res = await fetch('/api/instagram');
        const json = (await res.json()) as { posts?: InstagramPost[]; source?: string };
        if (json.posts && json.posts.length > 0) {
          setPosts(json.posts);
          return;
        }
      } catch { /* fall through */ }

      // Fall back to manually-uploaded Supabase posts
      const { data } = await supabase
        .from('instagram_posts')
        .select('*')
        .order('posted_at', { ascending: false })
        .limit(6);
      if (data && data.length > 0) setPosts(data);
      // otherwise keep FALLBACK_POSTS already set as default state
    }
    fetchPosts();
  }, []);

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
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '400px',
        background: 'radial-gradient(ellipse, rgba(212,175,55,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <h2 style={{
          fontFamily: 'var(--font-bebas)',
          fontSize: 'clamp(3rem, 6vw, 5rem)',
          color: '#e8e8ec',
          transform: 'skewX(-4deg)',
          display: 'inline-block',
          lineHeight: 1,
        }}>
          FOLLOW THE{' '}
          <span className="text-gradient-gold">JOURNEY</span>
        </h2>
        <div style={{
          width: '60px',
          height: '3px',
          background: 'linear-gradient(to right, #D4AF37, #f0cc55)',
          margin: '16px auto 0',
          borderRadius: '2px',
        }} />
        <div style={{ textAlign: 'center' }}>
          <a
            href="https://www.instagram.com/racquetsclubcommunity/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '20px',
              fontFamily: 'var(--font-montserrat)',
              fontWeight: 700,
              fontSize: '15px',
              letterSpacing: '0.08em',
              color: '#FF6B35',
              textDecoration: 'none',
            }}
          >
            <InstagramIcon size={18} />
            @racquetsclubcommunity
          </a>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}
        className="instagram-grid"
      >
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </motion.div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <a
          href="https://www.instagram.com/racquetsclubcommunity/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 28px',
            background: 'transparent',
            border: '1px solid rgba(212,175,55,0.4)',
            borderRadius: '8px',
            fontFamily: 'var(--font-montserrat)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            color: '#D4AF37',
            textDecoration: 'none',
            textTransform: 'uppercase',
          }}
        >
          <InstagramIcon size={14} />
          View All on Instagram
        </a>
      </div>

    </section>
  );
}

function PostCard({ post }: { post: InstagramPost }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        aspectRatio: '1',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        border: hovered ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(255,255,255,0.07)',
        boxShadow: hovered ? '0 0 30px rgba(212,175,55,0.15), 0 0 60px rgba(194,24,24,0.1)' : 'none',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.image_url}
        alt={post.caption}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 0.4s ease',
        }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: hovered
          ? 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 100%)'
          : 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
        transition: 'background 0.3s',
      }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px' }}>
        <p style={{
          fontFamily: 'var(--font-inter)',
          fontSize: '12px',
          color: 'rgba(255,255,255,0.85)',
          lineHeight: 1.4,
          marginBottom: '8px',
          display: '-webkit-box',
          WebkitLineClamp: hovered ? 3 : 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {post.caption}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            fontFamily: 'var(--font-montserrat)', fontSize: '11px', color: '#D4AF37', fontWeight: 600,
          }}>
            <Heart size={11} fill="#D4AF37" stroke="none" />
            {post.likes?.toLocaleString()}
          </span>
          {hovered && (
            <a
              href={post.post_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontFamily: 'var(--font-montserrat)', fontSize: '10px',
                color: '#D4AF37', letterSpacing: '0.1em', textDecoration: 'none', fontWeight: 700,
              }}
            >
              VIEW <ExternalLink size={10} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
