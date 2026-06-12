import type { Metadata } from 'next';
import { Montserrat, Inter, Bebas_Neue, Dancing_Script } from 'next/font/google';
import './globals.css';
import SupportModal from '@/components/ui/SupportModal';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  variable: '--font-bebas',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const dancingScript = Dancing_Script({
  variable: '--font-dancing',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Racquets Club Community | Badminton Community in West Delhi – Paschim Vihar & Janakpuri",
  description:
    "RCC is West Delhi's invite-only badminton community. We play at JLDAV School Paschim Vihar & DTEA Janakpuri. Tournaments, ladder leagues, and real competitive badminton.",
  keywords: 'badminton West Delhi, badminton Paschim Vihar, badminton Janakpuri, RCC, Racquets Club Community, invite-only badminton Delhi, badminton club Delhi, JLDAV Paschim Vihar badminton, DTEA Janakpuri badminton, Delhi badminton community',
  openGraph: {
    title: 'Racquets Club Community (RCC) – West Delhi Badminton',
    description: "West Delhi's invite-only badminton community. Paschim Vihar & Janakpuri. Smash. Connect. Compete.",
    type: 'website',
    siteName: 'Racquets Club Community',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Racquets Club Community – West Delhi Badminton',
    description: "West Delhi's elite invite-only badminton community. JLDAV Paschim Vihar & DTEA Janakpuri.",
  },
  other: {
    'geo.region': 'IN-DL',
    'geo.placename': 'Paschim Vihar, West Delhi',
    'geo.position': '28.6741;77.0886',
    'ICBM': '28.6741, 77.0886',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${inter.variable} ${bebasNeue.variable} ${dancingScript.variable}`}
    >
      <head>
      </head>
      <body className="antialiased bg-[#0a0a0f] text-[#e8e8ec] overflow-x-hidden">
        {children}
        <SupportModal />
      </body>
    </html>
  );
}
