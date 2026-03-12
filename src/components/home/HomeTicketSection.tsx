'use client';

import { useState } from 'react';
import { SPORTS } from '@/lib/data/sports';
import { TICKET_EVENTS } from '@/lib/data/tickets';
import TicketTable from '@/components/tickets/TicketTable';

interface HomeTicketSectionProps {
  selectedSports: string[];
}

type SortOption = 'date-soonest' | 'price-lowest' | 'price-highest' | 'availability';

export default function HomeTicketSection({ selectedSports }: HomeTicketSectionProps) {
  const [sortBy, setSortBy] = useState<SortOption>('date-soonest');

  const sportsToDisplay: string[] = selectedSports.includes('all')
    ? SPORTS.map((s) => s.slug)
    : selectedSports;

  const sportSections = sportsToDisplay.map((sportSlug) => {
    const sport = SPORTS.find((s) => s.slug === sportSlug);
    if (!sport) return null;
    const events = TICKET_EVENTS.filter((e) => e.sport === sportSlug);
    if (events.length === 0) return null;
    return { sport, events, icon: sport.icon };
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '30px',
          paddingRight: '4px',
        }}
      >
        <span style={{ fontSize: '13px', color: 'var(--text-gray)', fontWeight: 500 }}>
          Sort by:
        </span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          style={{
            background: 'var(--white)',
            border: '1px solid var(--border-gray)',
            borderRadius: '8px',
            color: 'var(--text-dark)',
            fontSize: '13px',
            padding: '7px 12px',
            outline: 'none',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          <option value="date-soonest">Date (Soonest)</option>
          <option value="price-lowest">Price (Lowest)</option>
          <option value="price-highest">Price (Highest)</option>
          <option value="availability">Availability</option>
        </select>
      </div>

      {sportSections.map((section: any) => (
        <div key={section.sport.slug} style={{ marginBottom: '40px' }}>
          <TicketTable
            events={section.events}
            title={`${section.sport.name} Events`}
            sportIcon={section.icon}
            rounded={true}
            sortBy={sortBy}
          />
        </div>
      ))}
    </>
  );
}
