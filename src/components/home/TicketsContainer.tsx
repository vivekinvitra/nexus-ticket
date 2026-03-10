'use client';

import { useState } from 'react';
import FilterPanel from '@/components/tickets/FilterPanel';
import HomeTicketSection from '@/components/home/HomeTicketSection';
import NewsSection from '@/components/home/NewsSection';
import { NEWS_ARTICLES } from '@/lib/data/news';

export default function TicketsContainer() {
  const [selectedSports, setSelectedSports] = useState<string[]>(['all']);

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
        <HomeTicketSection selectedSports={selectedSports} />
        <NewsSection articles={NEWS_ARTICLES.slice(0, 3)} />
      </div>
    </div>
  );
}
