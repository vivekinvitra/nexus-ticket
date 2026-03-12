import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Tickets nexus — Sports Ticket Comparison',
    template: '%s | Tickets nexus',
  },
  description:
    'Compare sports ticket prices from the UK\'s top resale platforms. Find the best deals on football, cricket, horse racing, tennis, boxing, F1, rugby and golf tickets.',
  keywords: [
    'sports tickets',
    'ticket comparison',
    'football tickets',
    'cricket tickets',
    'Premier League tickets',
    'Wimbledon tickets',
    'F1 tickets',
    'cheap tickets UK',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'TicketNexus',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
