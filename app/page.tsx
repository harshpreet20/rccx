'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
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

// Existing components kept for compatibility
import ChatBot from '@/components/ui/ChatBot';
import SupportModal from '@/components/ui/SupportModal';

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [sweepKey, setSweepKey] = useState(0);

  useEffect(() => {
    // Periodic gold sweep
    const interval = setInterval(() => setSweepKey(k => k + 1), 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <CustomCursor />
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease' }}>
        {/* Ambient gold sweep */}
        <div key={sweepKey} className="gold-sweep-overlay" />

        <NavbarRCC />
        <HeroRCC />
        <ScoreTicker />
        <AboutRCC />
        <TournamentInvite />
        <TournamentsRCC />
        <MemberRoster />
        <ActivityFeed />
        <FooterRCC />
        <ChatBot />
        <SupportModal />
      </div>
    </>
  );
}
