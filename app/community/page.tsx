import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CommunityFeed from '@/components/sections/CommunityFeed';

export const metadata = {
  title: 'Community Feed | Racquets Club Community',
  description: 'Latest news, match results, achievements, and announcements from the RCC community.',
};

export default function CommunityPage() {
  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: 72 }}>
        <CommunityFeed />
      </div>
      <Footer />
    </main>
  );
}
