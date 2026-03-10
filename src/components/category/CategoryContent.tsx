'use client';

import { useState } from 'react';
import FilterPanel from '@/components/tickets/FilterPanel';
import TicketTable from '@/components/tickets/TicketTable';
import type { TicketEvent } from '@/lib/types';
import type { SportCategory } from '@/lib/types';

interface CategoryContentProps {
  sport: SportCategory;
  allEvents: TicketEvent[];
}

export default function CategoryContent({ sport, allEvents }: CategoryContentProps) {
  const [selectedSports, setSelectedSports] = useState<string[]>(['all']);

  // Filter events based on this category
  const categoryEvents = allEvents.filter((e) => e.sport === sport.slug);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '32px',
        alignItems: 'start',
      }}
      className="content-grid"
    >
      <FilterPanel selectedSports={selectedSports} onSportsChange={setSelectedSports} />
      <div>
        {categoryEvents.length > 0 ? (
          <TicketTable
            events={categoryEvents}
            title={`${sport.name} Events`}
            sportIcon={sport.icon}
            rounded={true}
          />
        ) : (
          <div
            style={{
              background: 'var(--white)',
              border: '1px solid var(--border-gray)',
              borderRadius: '12px',
              padding: '60px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>{sport.icon}</div>
            <h2
              style={{
                fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--text-dark)',
                marginBottom: '8px',
              }}
            >
              No {sport.name} tickets available
            </h2>
            <p style={{ color: 'var(--text-gray)', fontSize: '15px' }}>
              Check back soon — {sport.name} tickets are added regularly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
