'use client';

import { useState } from 'react';
import FilterPanel from '@/components/tickets/FilterPanel';
import HomeTicketSection from '@/components/home/HomeTicketSection';
import NewsSection from '@/components/home/NewsSection';
import { getFeaturedNews } from '@/lib/data/news';

export default function TicketsContainer() {
  const [selectedSports, setSelectedSports] = useState<string[]>(['all']);

  return (
    <div className="content-grid" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', alignItems: 'start' }}>
        <FilterPanel selectedSports={selectedSports} onSportsChange={setSelectedSports} />
        <div>
          <HomeTicketSection selectedSports={selectedSports} />
          <NewsSection articles={getFeaturedNews()} />
        </div>
      </div>
  );
}
