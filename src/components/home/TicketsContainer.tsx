'use client';

import { useState } from 'react';
import FilterPanel from '@/components/tickets/FilterPanel';
import HomeTicketSection from '@/components/home/HomeTicketSection';
import NewsSection from '@/components/home/NewsSection';
import { getFeaturedNews } from '@/lib/data/news';

const TICKET_MAX_PRICE = 1000;

export default function TicketsContainer({ today }: { today: string }) {
  const [selectedSports, setSelectedSports] = useState<string[]>(['all']);
  const [maxPrice, setMaxPrice] = useState<number>(TICKET_MAX_PRICE);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'date-soonest' | 'price-lowest' | 'price-highest' | 'availability'>('date-soonest');

  const handleReset = () => {
    setSelectedSports(['all']);
    setMaxPrice(TICKET_MAX_PRICE);
    setSelectedPartners([]);
  };

  // Count active filters for badge
  const activeFilterCount =
    (selectedSports.includes('all') ? 0 : selectedSports.length) +
    (maxPrice < TICKET_MAX_PRICE ? 1 : 0) +
    selectedPartners.length;

  return (
    <>
      {/* ── Mobile toolbar: Filters + Sort on one row ── */}
      <div className="mobile-filter-bar" style={{ display: 'none' }}>
        {/* Filters toggle */}
        <button
          onClick={() => setShowMobileFilters(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--white)',
            border: '1px solid var(--border-gray)',
            borderRadius: '8px',
            padding: '9px 14px',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-dark)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '15px' }}>🎚️</span>
          Filters
          {activeFilterCount > 0 && (
            <span style={{
              background: 'var(--primary)',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: '100px',
            }}>
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Sort dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: 500, whiteSpace: 'nowrap' }}>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            style={{
              background: 'var(--white)',
              border: '1px solid var(--border-gray)',
              borderRadius: '8px',
              color: 'var(--text-dark)',
              fontSize: '13px',
              padding: '8px 10px',
              outline: 'none',
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            <option value="date-soonest">Soonest</option>
            <option value="price-lowest">Price ↑</option>
            <option value="price-highest">Price ↓</option>
            <option value="availability">Available</option>
          </select>
        </div>
      </div>

      {/* ── Mobile filter overlay backdrop ── */}
      {showMobileFilters && (
        <div
          className="mobile-filter-backdrop"
          onClick={() => setShowMobileFilters(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.45)',
            zIndex: 800,
          }}
        />
      )}

      {/* ── Mobile filter drawer ── */}
      <div
        className={`mobile-filter-drawer${showMobileFilters ? ' open' : ''}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '300px',
          maxWidth: '85vw',
          zIndex: 801,
          overflowY: 'auto',
          background: 'var(--off-white)',
          transform: showMobileFilters ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s ease',
          boxShadow: showMobileFilters ? '4px 0 20px rgba(0,0,0,0.15)' : 'none',
        }}
      >
        {/* Drawer header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: 'var(--white)',
          borderBottom: '1px solid var(--border-gray)',
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-dark)' }}>
            🎚️ Filters
          </span>
          <button
            onClick={() => setShowMobileFilters(false)}
            style={{
              background: 'var(--light-gray)',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-dark)',
              cursor: 'pointer',
            }}
          >
            ✕ Close
          </button>
        </div>

        <div style={{ padding: '16px' }}>
          <FilterPanel
            selectedSports={selectedSports}
            onSportsChange={setSelectedSports}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            selectedPartners={selectedPartners}
            onPartnersChange={setSelectedPartners}
            onReset={handleReset}
          />
        </div>
      </div>

      {/* ── Desktop layout: sidebar + content ── */}
      <div className="content-grid" style={{ display: 'grid', gap: '32px', alignItems: 'start' }}>
        {/* Desktop filter sidebar — hidden on mobile */}
        <div className="desktop-filter-col">
          <FilterPanel
            selectedSports={selectedSports}
            onSportsChange={setSelectedSports}
            maxPrice={maxPrice}
            onMaxPriceChange={setMaxPrice}
            selectedPartners={selectedPartners}
            onPartnersChange={setSelectedPartners}
            onReset={handleReset}
          />
        </div>

        <div>
          {/* Desktop sort bar */}
          <div
            className="desktop-sort-bar"
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
            }}
          >
            <span style={{ fontSize: '13px', color: 'var(--text-gray)', fontWeight: 500 }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
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

          <HomeTicketSection
            selectedSports={selectedSports}
            maxPrice={maxPrice}
            selectedPartners={selectedPartners}
            sortBy={sortBy}
            today={today}
          />
          <NewsSection articles={getFeaturedNews()} />
        </div>
      </div>
    </>
  );
}
