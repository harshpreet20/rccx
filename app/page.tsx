'use client';

import { useState, useEffect } from 'react';
import { ScrollContextProvider } from '@/lib/scrollContext';
import LoadingScreen from '@/components/layout/LoadingScreen';
import HeroVideo from '@/components/layout/HeroVideo';
import CustomCursor from '@/components/ui/CustomCursor';
import NavbarRCC from '@/components/layout/NavbarRCC';
import HeroRCC from '@/components/sections/HeroRCC';
import AboutRCC from '@/components/sections/AboutRCC';
import TournamentInvite from '@/components/sections/TournamentInvite';
import TournamentsRCC from '@/components/sections/TournamentsRCC';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import LeaderboardSection from '@/components/sections/LeaderboardSection';
import CommunityFeed from '@/components/sections/CommunityFeed';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import InstagramFeed from '@/components/sections/InstagramFeed';
import ActivityFeed from '@/components/sections/ActivityFeed';
import FooterRCC from '@/components/layout/FooterRCC';
import ScoreTicker from '@/components/ui/ScoreTicker';
import ChatBot from '@/components/ui/ChatBot';
import SupportModal from '@/components/ui/SupportModal';

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [sweepKey, setSweepKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSweepKey(k => k + 1), 20000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScrollContextProvider>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <CustomCursor />
        {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
        <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.8s ease' }}>
          {/* Ambient gold sweep */}
          <div key={sweepKey} className="gold-sweep-overlay" />

          <NavbarRCC />

          <div data-scene-section="hero" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
            <HeroVideo />
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

          <HowItWorksSection />
          <LeaderboardSection />
          <CommunityFeed />
          <TestimonialsSection />
          <InstagramFeed />
          <ActivityFeed />
          <FooterRCC />
          <ChatBot />
          <SupportModal />
        </div>
      </div>
    </ScrollContextProvider>
  );
}
