import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import TicketsContainer from '@/components/home/TicketsContainer';
import PartnersStrip from '@/components/home/PartnersStrip';
import { buildMetadata, buildFootballEventsListJsonLd, SITE_keywords } from '@/lib/utils/seo';
import { getEventsBySport } from '@/lib/data/tickets';

export const metadata: Metadata = buildMetadata({
  title: 'Buy FIFA World Cup 2026 Tickets Online | Football 2026 Tickets Online  - Ticket-Nexus',
  path: '/',
  keywords: SITE_keywords,
});

export default function HomePage() {
  const today = new Date().toISOString().split('T')[0];
  const footballEvents = getEventsBySport('football')
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 12);

  const footballEventsJsonLd = buildFootballEventsListJsonLd(footballEvents);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(footballEventsJsonLd) }}
      />
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
