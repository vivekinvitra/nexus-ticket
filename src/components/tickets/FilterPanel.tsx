'use client';

import { useState } from 'react';
import { SPORTS } from '@/lib/data/sports';

const PARTNER_FILTERS = [
  { id: 'ticketmaster', label: 'Ticketmaster', count: 312 },
  { id: 'stubhub', label: 'StubHub', count: 287 },
  { id: 'viagogo', label: 'Viagogo', count: 245 },
  { id: 'seatgeek', label: 'SeatGeek', count: 178 },
  { id: 'ticketswap', label: 'TicketSwap', count: 132 },
];

const AVAILABILITY_FILTERS = [
  { id: 'high', label: 'Available', count: 512 },
  { id: 'low', label: 'Limited Seats', count: 148 },
  { id: 'sold-out', label: 'Sold Out', count: 85 },
];

interface FilterPanelProps {
  selectedSports: string[];
  onSportsChange: (sports: string[]) => void;
}

export default function FilterPanel({ selectedSports, onSportsChange }: FilterPanelProps) {
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [selectedAvail, setSelectedAvail] = useState<string[]>(['high', 'low']);
  const [maxPrice, setMaxPrice] = useState(300);

  const TOTAL_SPORTS_COUNT = SPORTS.reduce((sum, s) => sum + s.count, 0);
  const allSportsSelected = selectedSports.includes('all');

  const toggleAllSports = () => {
    if (allSportsSelected) {
      onSportsChange([]);
    } else {
      onSportsChange(['all']);
    }
  };

  const toggleSports = (slug: string) => {
    let newSelected: string[];
    
    if (selectedSports.includes('all')) {
      // If "All" is selected, deselect it and select only this sport
      newSelected = [slug];
    } else if (selectedSports.includes(slug)) {
      // If this sport is selected, deselect it
      newSelected = selectedSports.filter((s) => s !== slug);
      // If no sports left, select all
      if (newSelected.length === 0) {
        newSelected = ['all'];
      }
    } else {
      // If this sport is not selected, add it
      newSelected = [...selectedSports, slug];
      // Check if all individual sports are selected, if so select "all"
      if (newSelected.length === SPORTS.length) {
        newSelected = ['all'];
      }
    }
    
    onSportsChange(newSelected);
  };

  const togglePartner = (id: string) => {
    setSelectedPartners((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleAvail = (id: string) => {
    setSelectedAvail((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const resetAll = () => {
    onSportsChange(['all']);
    setSelectedPartners([]);
    setSelectedAvail(['high', 'low']);
    setMaxPrice(300);
  };

  return (
    <aside
      className="filter-sticky"
      style={{
        background: 'var(--white)',
        border: '1px solid var(--border-gray)',
        borderRadius: '12px',
        overflow: 'hidden',
        position: 'sticky',
        top: 'calc(var(--nav-h) + 70px)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '18px 20px',
          borderBottom: '1px solid var(--border-gray)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-dark)' }}>
          Filters
        </h3>
        <button
          onClick={resetAll}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontSize: '12px',
            color: 'var(--primary)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Reset All
        </button>
      </div>

      {/* Sports */}
      <div style={{ borderBottom: '1px solid var(--border-gray)', padding: '18px 20px' }}>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--text-dark)',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          Sports
        </div>

        {/* All Sports */}
        <div
          onClick={toggleAllSports}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 0',
            cursor: 'pointer',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '4px',
              border: `2px solid ${allSportsSelected ? 'var(--primary)' : 'var(--border-gray)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: allSportsSelected ? 'var(--primary)' : 'var(--white)',
              flexShrink: 0,
              transition: 'all .15s',
              color: 'var(--white)',
              fontSize: '11px',
              fontWeight: 700,
            }}
          >
            {allSportsSelected && '✓'}
          </div>
          <span style={{ fontSize: '16px', marginRight: '4px' }}>🏆</span>
          <span style={{ fontSize: '14px', color: 'var(--text-gray)', flex: 1, fontWeight: 600 }}>
            All Sports
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-gray)',
              background: 'var(--light-gray)',
              padding: '2px 8px',
              borderRadius: '100px',
            }}
          >
            {TOTAL_SPORTS_COUNT}
          </span>
        </div>

        {/* Scrollable Sports List */}
        <div
          className="sports-filter-scroll"
          style={{
            maxHeight: '280px',
            overflowY: 'auto',
            paddingRight: '8px',
          }}
        >
          {/* Individual Sports */}
          {SPORTS.map((sport, index) => {
            const checked = selectedSports.includes(sport.slug) && !allSportsSelected;
            return (
              <div
                key={sport.slug}
                onClick={() => toggleSports(sport.slug)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 0',
                  cursor: 'pointer',
                  opacity: index < 10 ? 1 : 0.9,
                }}
              >
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    border: `2px solid ${checked ? 'var(--primary)' : 'var(--border-gray)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: checked ? 'var(--primary)' : 'var(--white)',
                    flexShrink: 0,
                    transition: 'all .15s',
                    color: 'var(--white)',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  {checked && '✓'}
                </div>
                <span style={{ fontSize: '16px', marginRight: '4px' }}>{sport.icon}</span>
                <span style={{ fontSize: '14px', color: 'var(--text-gray)', flex: 1 }}>
                  {sport.name}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-gray)',
                    background: 'var(--light-gray)',
                    padding: '2px 8px',
                    borderRadius: '100px',
                  }}
                >
                  {sport.count}
                </span>
              </div>
            );
          })}
        </div>

        <style>{`
          .sports-filter-scroll::-webkit-scrollbar {
            width: 4px;
          }
          .sports-filter-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .sports-filter-scroll::-webkit-scrollbar-thumb {
            background: var(--border-gray);
            border-radius: 100px;
          }
          .sports-filter-scroll::-webkit-scrollbar-thumb:hover {
            background: var(--text-gray);
          }
        `}</style>
      </div>

      {/* Price Range */}
      <div style={{ borderBottom: '1px solid var(--border-gray)', padding: '18px 20px' }}>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--text-dark)',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          Max Price
        </div>
        <input
          type="range"
          min={0}
          max={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="price-slider"
          style={{ '--pct': `${(maxPrice / 500) * 100}%` } as React.CSSProperties}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'var(--text-gray)',
            marginTop: '8px',
            fontWeight: 500,
          }}
        >
          <span>£0</span>
          <span style={{ color: 'var(--primary)', fontWeight: 700 }}>£{maxPrice}</span>
          <span>£500+</span>
        </div>
      </div>

      {/* Availability */}
      <div style={{ borderBottom: '1px solid var(--border-gray)', padding: '18px 20px' }}>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--text-dark)',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          Availability
        </div>
        {AVAILABILITY_FILTERS.map((opt) => {
          const checked = selectedAvail.includes(opt.id);
          return (
            <div
              key={opt.id}
              onClick={() => toggleAvail(opt.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 0',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  border: `2px solid ${checked ? 'var(--primary)' : 'var(--border-gray)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: checked ? 'var(--primary)' : 'var(--white)',
                  flexShrink: 0,
                  transition: 'all .15s',
                  color: 'var(--white)',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                {checked && '✓'}
              </div>
              <span style={{ fontSize: '14px', color: 'var(--text-gray)', flex: 1 }}>
                {opt.label}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-gray)',
                  background: 'var(--light-gray)',
                  padding: '2px 8px',
                  borderRadius: '100px',
                }}
              >
                {opt.count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Partners */}
      <div style={{ borderBottom: '1px solid var(--border-gray)', padding: '18px 20px' }}>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--text-dark)',
            marginBottom: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          Platform
        </div>
        {PARTNER_FILTERS.map((opt) => {
          const checked = selectedPartners.includes(opt.id);
          return (
            <div
              key={opt.id}
              onClick={() => togglePartner(opt.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 0',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  border: `2px solid ${checked ? 'var(--primary)' : 'var(--border-gray)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: checked ? 'var(--primary)' : 'var(--white)',
                  flexShrink: 0,
                  transition: 'all .15s',
                  color: 'var(--white)',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                {checked && '✓'}
              </div>
              <span style={{ fontSize: '14px', color: 'var(--text-gray)', flex: 1 }}>
                {opt.label}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--text-gray)',
                  background: 'var(--light-gray)',
                  padding: '2px 8px',
                  borderRadius: '100px',
                }}
              >
                {opt.count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Affiliate Promo */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--primary-light), var(--accent-light))',
          border: '1px solid var(--primary)',
          borderRadius: '8px',
          padding: '16px',
          margin: '18px 20px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            color: 'var(--text-gray)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '6px',
          }}
        >
          Featured Partner
        </div>
        <div
          style={{
            fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--text-dark)',
            marginBottom: '10px',
          }}
        >
          🎫 Ticketmaster
        </div>
        <a
          href="https://ticketmaster.co.uk"
          target="_blank"
          rel="noopener noreferrer nofollow"
          style={{
            display: 'block',
            width: '100%',
            background: 'var(--primary)',
            color: 'var(--white)',
            fontSize: '13px',
            fontWeight: 600,
            padding: '10px',
            borderRadius: '8px',
            transition: 'all .2s',
            textAlign: 'center',
          }}
        >
          Visit Site →
        </a>
      </div>
    </aside>
  );
}
