'use client';

import { useState } from 'react';
import { ScrollContextProvider } from '@/lib/scrollContext';
import LoadingScreen from '@/components/layout/LoadingScreen';
import HeroVideo from '@/components/layout/HeroVideo';
import CustomCursor from '@/components/ui/CustomCursor';
import NavbarRCC from '@/components/layout/NavbarRCC';
import HeroRCC from '@/components/sections/HeroRCC';
import AboutRCC from '@/components/sections/AboutRCC';
import RCCByTheNumbers from '@/components/sections/RCCByTheNumbers';
import WhyRCCSection from '@/components/sections/WhyRCCSection';
import OurValuesSection from '@/components/sections/OurValuesSection';
import HudlePartnerSection from '@/components/sections/HudlePartnerSection';
import VenuesSection from '@/components/sections/VenuesSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import JoinCTASection from '@/components/sections/JoinCTASection';
import FooterRCC from '@/components/layout/FooterRCC';
import ScoreTicker from '@/components/ui/ScoreTicker';
import ChatBot from '@/components/ui/ChatBot';
import SupportModal from '@/components/ui/SupportModal';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <ScrollContextProvider>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <CustomCursor />
        {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
        <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}>
          <NavbarRCC />

          <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
            <HeroVideo />
            <HeroRCC />
          </div>

          <ScoreTicker />

          <AboutRCC />
          <RCCByTheNumbers />
          <WhyRCCSection />
          <OurValuesSection />
          <HudlePartnerSection />
          <VenuesSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <JoinCTASection />
          <FooterRCC />
          <ChatBot />
          <SupportModal />
        </div>
      </div>
    </ScrollContextProvider>
  );
}
