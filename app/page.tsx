import Navbar from '@/components/layout/Navbar';
import Hero from '@/components/sections/Hero';
import PartnersSection from '@/components/sections/PartnersSection';
import InstagramFeed from '@/components/sections/InstagramFeed';
import MembershipSection from '@/components/sections/MembershipSection';
import PlayerSpotlight from '@/components/sections/PlayerSpotlight';
import LeaderboardSection from '@/components/sections/LeaderboardSection';
import CommunityFeed from '@/components/sections/CommunityFeed';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import CommunityEthosSection from '@/components/sections/CommunityEthosSection';
import FAQSection from '@/components/sections/FAQSection';
import Footer from '@/components/layout/Footer';
import ChatBot from '@/components/ui/ChatBot';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <PartnersSection />
      <InstagramFeed />
      <HowItWorksSection />
      <MembershipSection />
      <PlayerSpotlight />
      <LeaderboardSection />
      <CommunityFeed limit={4} />
      <CommunityEthosSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
      <ChatBot />
    </main>
  );
}
