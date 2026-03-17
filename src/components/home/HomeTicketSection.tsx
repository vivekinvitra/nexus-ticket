'use client';

import { SPORTS } from '@/lib/data/sports';
import { CLEAN_EVENTS } from '@/lib/data/tickets';
import TicketTable from '@/components/tickets/TicketTable';

type SortOption = 'date-soonest' | 'price-lowest' | 'price-highest' | 'availability';

interface HomeTicketSectionProps {
  selectedSports: string[];
  maxPrice: number;
  selectedPartners: string[];
  sortBy: SortOption;
}

export default function HomeTicketSection({ selectedSports, maxPrice, selectedPartners, sortBy }: HomeTicketSectionProps) {

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sportsToDisplay: string[] = selectedSports.includes('all')
    ? SPORTS.map((s) => s.slug)
    : selectedSports;

  const sportSections = sportsToDisplay.map((sportSlug) => {
    const sport = SPORTS.find((s) => s.slug === sportSlug);
    if (!sport) return null;
    let events = CLEAN_EVENTS.filter(
      (e) => e.sport === sportSlug && new Date(e.date) >= today
    );
    // Apply max price filter
    events = events.filter((e) => e.minPrice <= maxPrice);
    // Apply partner filter — keep event if it has at least one selected partner (or no filter active)
    if (selectedPartners.length > 0) {
      events = events.filter((e) =>
        e.partners.some((p) => selectedPartners.includes(p.partnerId))
      );
    }
    if (events.length === 0) return null;
    const currencies = [...new Set(events.map((e) => e.currency).filter(Boolean))];
    return { sport, events, icon: sport.icon, currencies };
  }).filter(Boolean);

  if (sportSections.length === 0) {
    return (
      <div
        style={{
          background: 'var(--white)',
          border: '1px solid var(--border-gray)',
          borderRadius: '12px',
          padding: '60px 40px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '16px', color: 'var(--text-gray)' }}>
          No tickets available for the selected sports. Please check back soon.
        </p>
      </div>
    );
  }

  return (
    <>
      {sportSections.map((section: any) => (
        <div key={section.sport.slug} style={{ marginBottom: '40px' }}>
          <TicketTable
            events={section.events}
            title={`${section.sport.name} Events`}
            sportIcon={section.icon}
            rounded={true}
            sortBy={sortBy}
            currencies={section.currencies}
          />
        </div>
      ))}
    </>
  );
}
