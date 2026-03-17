'use client';

import { SPORTS } from '@/lib/data/sports';
import { CLEAN_EVENTS } from '@/lib/data/tickets';

// ── Derive counts from CLEAN_EVENTS (deduped) ───────────────────────────────

const sportMatchCounts: Record<string, number> = {};
CLEAN_EVENTS.forEach((e) => {
  sportMatchCounts[e.sport] = (sportMatchCounts[e.sport] || 0) + 1;
});

const TICKET_MAX_PRICE = 1000;

const partnerCounts: Record<string, number> = {};
CLEAN_EVENTS.forEach((e) => {
  const seen = new Set<string>();
  e.partners.forEach((p) => {
    if (!seen.has(p.partnerId)) {
      partnerCounts[p.partnerId] = (partnerCounts[p.partnerId] || 0) + 1;
      seen.add(p.partnerId);
    }
  });
});

const PARTNER_FILTERS = Object.entries(partnerCounts).map(([id, count]) => ({
  id,
  label: id === 'footballticketnet' ? 'FootballTicketNet' : id === 'awin' ? 'Awin' : id,
  icon: id === 'footballticketnet' ? '⚽' : '🌐',
  count,
}));

// ── Props ────────────────────────────────────────────────────────────────────

interface FilterPanelProps {
  selectedSports: string[];
  onSportsChange: (sports: string[]) => void;
  maxPrice: number;
  onMaxPriceChange: (price: number) => void;
  selectedPartners: string[];
  onPartnersChange: (partners: string[]) => void;
  onReset: () => void;
}

export default function FilterPanel({
  selectedSports,
  onSportsChange,
  maxPrice,
  onMaxPriceChange,
  selectedPartners,
  onPartnersChange,
  onReset,
}: FilterPanelProps) {
  const totalCount = CLEAN_EVENTS.length;
  const allSportsSelected = selectedSports.includes('all');

  const toggleAllSports = () => {
    if (allSportsSelected) {
      onSportsChange([]);
    } else {
      onSportsChange(['all']);
    }
  };

  const toggleSport = (slug: string) => {
    let next: string[];
    if (selectedSports.includes('all')) {
      next = [slug];
    } else if (selectedSports.includes(slug)) {
      next = selectedSports.filter((s) => s !== slug);
      if (next.length === 0) next = ['all'];
    } else {
      next = [...selectedSports, slug];
      if (next.length === SPORTS.filter((s) => (sportMatchCounts[s.slug] ?? 0) > 0).length) {
        next = ['all'];
      }
    }
    onSportsChange(next);
  };

  const togglePartner = (id: string) => {
    const next = selectedPartners.includes(id)
      ? selectedPartners.filter((p) => p !== id)
      : [...selectedPartners, id];
    onPartnersChange(next);
  };

  const pct = (maxPrice / TICKET_MAX_PRICE) * 100;

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
          onClick={onReset}
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
            {totalCount}
          </span>
        </div>

        {/* Scrollable Sports List */}
        <div
          className="sports-filter-scroll"
          style={{ maxHeight: '280px', overflowY: 'auto', paddingRight: '8px' }}
        >
          {SPORTS.filter((s) => (sportMatchCounts[s.slug] ?? 0) > 0).map((sport) => {
            const checked = selectedSports.includes(sport.slug) && !allSportsSelected;
            const matchCount = sportMatchCounts[sport.slug] ?? 0;
            return (
              <div
                key={sport.slug}
                onClick={() => toggleSport(sport.slug)}
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
                  {matchCount}
                </span>
              </div>
            );
          })}
        </div>

        <style>{`
          .sports-filter-scroll::-webkit-scrollbar { width: 4px; }
          .sports-filter-scroll::-webkit-scrollbar-track { background: transparent; }
          .sports-filter-scroll::-webkit-scrollbar-thumb { background: var(--border-gray); border-radius: 100px; }
          .sports-filter-scroll::-webkit-scrollbar-thumb:hover { background: var(--text-gray); }
        `}</style>
      </div>

      {/* Max Price */}
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
          max={TICKET_MAX_PRICE}
          step={10}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="price-slider"
          style={{ '--pct': `${pct}%` } as React.CSSProperties}
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
          <span>0</span>
          <span style={{ color: 'var(--primary)', fontWeight: 700 }}>
            {maxPrice >= TICKET_MAX_PRICE ? `${TICKET_MAX_PRICE}+` : `${maxPrice}`}
          </span>
          <span>{TICKET_MAX_PRICE}+</span>
        </div>
      </div>

      {/* Platform Partners */}
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
              <span style={{ fontSize: '16px', marginRight: '4px' }}>{opt.icon}</span>
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
          🎫 FootballTicketNet
        </div>
        <a
          href="https://footballticketnet.co.uk"
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
