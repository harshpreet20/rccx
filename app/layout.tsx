import type { Metadata } from 'next';
import { Montserrat, Inter, Bebas_Neue, Dancing_Script } from 'next/font/google';
import './globals.css';

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
  title: "Racquets Club Community | Delhi's Invite-Only Badminton Community",
  description:
    "RCC is Delhi's invite-only badminton community for serious players. Regular games, skill-based matches, tournaments, and real connections.",
  keywords: 'badminton, Delhi, invite-only, community, RCC, Racquets Club, tournaments, sports',
  openGraph: {
    title: 'Racquets Club Community (RCC)',
    description: "Delhi's invite-only badminton community. Smash. Connect. Compete.",
    type: 'website',
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
      </body>
    </html>
  );
}
