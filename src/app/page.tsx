import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import DateFilterBar from '@/components/home/DateFilterBar';
import TicketsContainer from '@/components/home/TicketsContainer';
import PartnersStrip from '@/components/home/PartnersStrip';

export const metadata: Metadata = {
  title: 'Tickets nexus — Sports Ticket Comparison',
  description:
    'Compare sports ticket prices from the UK\'s top resale platforms. Find the best deals on football, cricket, horse racing, tennis, boxing, F1, rugby and golf tickets.',
  alternates: { canonical: 'https://www.ticket-nexus.com' },
};

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <DateFilterBar />

        <div className="main-content-pad" style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 40px 60px' }}>
          <TicketsContainer />
        </div>

        <PartnersStrip />
      </main>

      <Footer />
    </>
  );
}
