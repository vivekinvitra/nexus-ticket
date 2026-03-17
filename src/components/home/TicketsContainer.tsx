'use client';

import { useState } from 'react';
import FilterPanel from '@/components/tickets/FilterPanel';
import HomeTicketSection from '@/components/home/HomeTicketSection';
import NewsSection from '@/components/home/NewsSection';
import { getFeaturedNews } from '@/lib/data/news';
import { TICKET_EVENTS } from '@/lib/data/tickets';

const TICKET_MAX_PRICE = 1000;

export default function TicketsContainer() {
  const [selectedSports, setSelectedSports] = useState<string[]>(['all']);
  const [maxPrice, setMaxPrice] = useState<number>(TICKET_MAX_PRICE);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);

  const handleReset = () => {
    setSelectedSports(['all']);
    setMaxPrice(TICKET_MAX_PRICE);
    setSelectedPartners([]);
  };

  return (
    <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', alignItems: 'start' }}>
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
        <HomeTicketSection
          selectedSports={selectedSports}
          maxPrice={maxPrice}
          selectedPartners={selectedPartners}
        />
        <NewsSection articles={getFeaturedNews()} />
      </div>
    </div>
  );
}
