import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import TicketsContainer from '@/components/home/TicketsContainer';
import PartnersStrip from '@/components/home/PartnersStrip';
import { buildMetadata } from '@/lib/utils/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Sports Ticket Comparison',
  path: '/',
});

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <div className="page-px" style={{ maxWidth: '1280px', margin: '0 auto', paddingTop: '32px', paddingBottom: '60px' }}>
          <TicketsContainer />
        </div>

        <PartnersStrip />
      </main>

      <Footer />
    </>
  );
}
