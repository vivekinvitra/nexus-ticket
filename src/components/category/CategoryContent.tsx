'use client';

import { useState } from 'react';
import FilterPanel from '@/components/tickets/FilterPanel';
import TicketTable from '@/components/tickets/TicketTable';
import type { TicketEvent } from '@/lib/types';
import type { SportCategory } from '@/lib/types';

const TICKET_MAX_PRICE = 1000;

interface CategoryContentProps {
  sport: SportCategory;
  allEvents: TicketEvent[];
}

export default function CategoryContent({ sport, allEvents }: CategoryContentProps) {
  const [selectedSports, setSelectedSports] = useState<string[]>(['all']);
  const [maxPrice, setMaxPrice] = useState<number>(TICKET_MAX_PRICE);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);

  const handleReset = () => {
    setSelectedSports(['all']);
    setMaxPrice(TICKET_MAX_PRICE);
    setSelectedPartners([]);
  };

  // Filter upcoming events only
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter events based on this category + active filters
  let categoryEvents = allEvents.filter((e) => new Date(e.date) >= today);
  categoryEvents = categoryEvents.filter((e) => e.minPrice <= maxPrice);
  if (selectedPartners.length > 0) {
    categoryEvents = categoryEvents.filter((e) =>
      e.partners.some((p) => selectedPartners.includes(p.partnerId))
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: '32px',
        alignItems: 'start',
      }}
      className="content-grid"
    >
      <FilterPanel
        selectedSports={selectedSports}
        onSportsChange={setSelectedSports}
        maxPrice={maxPrice}
        onMaxPriceChange={setMaxPrice}
        selectedPartners={selectedPartners}
        onPartnersChange={setSelectedPartners}
        onReset={handleReset}
      />
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
