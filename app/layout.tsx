import type { Metadata } from 'next';
import Script from 'next/script';
import { Montserrat, Inter, Bebas_Neue, Dancing_Script, Cormorant_Garamond, DM_Mono, Playfair_Display, Anton, Archivo } from 'next/font/google';
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

const cormorantGaramond = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const anton = Anton({
  variable: '--font-anton',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
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
      className={`${montserrat.variable} ${inter.variable} ${bebasNeue.variable} ${dancingScript.variable} ${cormorantGaramond.variable} ${dmMono.variable} ${playfairDisplay.variable} ${anton.variable} ${archivo.variable}`}
    >
      <head>
        <link rel="preload" href="/athlete.png" as="image" />
      </head>
      <body className="antialiased bg-[#0A1628] text-[#F5F0E8] overflow-x-hidden">
        {children}
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '240px',
            zIndex: 9999,
            pointerEvents: 'auto',
          }}
        >
          <div
            className="trustpilot-widget"
            data-locale="en-US"
            data-template-id="56278e9abfbbba0bdcd568bc"
            data-businessunit-id="6a3b7982b91e870cae95afe6"
            data-style-height="52px"
            data-style-width="100%"
            data-token="de43c10d-4002-4633-9385-b9b491f0dbbf"
          >
            <a href="https://www.trustpilot.com/review/racquetsclubcommunity.com" target="_blank" rel="noopener">Trustpilot</a>
          </div>
        </div>
        <Script
          src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
