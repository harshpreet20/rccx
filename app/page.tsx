'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ScrollContextProvider } from '@/lib/scrollContext';
import LoadingScreen from '@/components/layout/LoadingScreen';
import CustomCursor from '@/components/ui/CustomCursor';
import NavbarRCC from '@/components/layout/NavbarRCC';
import HeroRCC from '@/components/sections/HeroRCC';
import AboutRCC from '@/components/sections/AboutRCC';
import TournamentInvite from '@/components/sections/TournamentInvite';
import TournamentsRCC from '@/components/sections/TournamentsRCC';
import MemberRoster from '@/components/sections/MemberRoster';
import ActivityFeed from '@/components/sections/ActivityFeed';
import FooterRCC from '@/components/layout/FooterRCC';
import ScoreTicker from '@/components/ui/ScoreTicker';
import ChatBot from '@/components/ui/ChatBot';
import SupportModal from '@/components/ui/SupportModal';

// 3D scene — client-only, no SSR
const BadmintonScene = dynamic(
  () => import('@/components/3d/BadmintonScene'),
  { ssr: false, loading: () => null }
);

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [sweepKey, setSweepKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSweepKey(k => k + 1), 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollContextProvider>
      {/* 3D background canvas — fixed, z-0, warms up during loading screen */}
      <BadmintonScene />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <CustomCursor />
        {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
        <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.8s ease' }}>
          {/* Ambient gold sweep */}
          <div key={sweepKey} className="gold-sweep-overlay" />

          <NavbarRCC />

          <div data-scene-section="hero">
            <HeroRCC />
          </div>

          <ScoreTicker />

          <div data-scene-section="about">
            <AboutRCC />
          </div>

          <TournamentInvite />

          <div data-scene-section="tournament">
            <TournamentsRCC />
          </div>

          <div data-scene-section="roster">
            <MemberRoster />
          </div>

          <ActivityFeed />
          <FooterRCC />
          <ChatBot />
          <SupportModal />
        </div>
      </div>
    </ScrollContextProvider>
  );
}
