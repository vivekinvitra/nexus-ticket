'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '@/components/common/Icon';
import { SPORTS } from '@/lib/data/sports';
import { CLEAN_EVENTS, SPORT_EVENT_COUNTS, toTicketSlug } from '@/lib/data/tickets';
import { getSportBySlug } from '@/lib/data/sports';
import { formatPrice, formatShortDate } from '@/lib/utils/format';
import SportsNav from './SportsNav';
import type { TicketEvent } from '@/lib/types';

function searchEvents(query: string): TicketEvent[] {
  if (query.trim().length < 2) return [];
  const q = query.toLowerCase();
  return CLEAN_EVENTS.filter(
    (e) =>
      e.eventName.toLowerCase().includes(q) ||
      e.league.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q) ||
      e.city.toLowerCase().includes(q)
  ).slice(0, 7);
}

interface SearchBoxProps {
  isMobile?: boolean;
  onNavigate?: () => void;
}

function SearchBox({ isMobile, onNavigate }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TicketEvent[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Update results on query change
  useEffect(() => {
    const hits = searchEvents(query);
    setResults(hits);
    setOpen(hits.length > 0);
    setActiveIdx(-1);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setResults([]);
    setActiveIdx(-1);
  }, []);

  function handleSelect(event: TicketEvent) {
    router.push(`/tickets/${toTicketSlug(event)}`);
    close();
    onNavigate?.();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      handleSelect(results[activeIdx]);
    } else if (e.key === 'Escape') {
      close();
    }
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: isMobile ? '100%' : undefined }}>
      {/* Input */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: open ? 'var(--white)' : 'var(--light-gray)',
          border: open ? '1px solid var(--primary)' : '1px solid var(--border-gray)',
          borderRadius: open ? '8px 8px 0 0' : '8px',
          padding: isMobile ? '10px 14px' : '8px 12px',
          transition: 'all .2s',
          width: isMobile ? '100%' : undefined,
          boxSizing: 'border-box',
        }}
      >
        <Icon name="search" size={15} className="shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search events, teams, venues…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'var(--text-dark)',
            fontSize: '13px',
            width: isMobile ? '100%' : '180px',
          }}
          autoComplete="off"
        />
        {query && (
          <button
            onClick={close}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              color: 'var(--text-gray)',
              fontSize: '15px',
              lineHeight: 1,
              flexShrink: 0,
            }}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--white)',
            border: '1px solid var(--primary)',
            borderTop: 'none',
            borderRadius: '0 0 10px 10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          {results.map((event, idx) => {
            const sport = getSportBySlug(event.sport);
            const isSoldOut = event.availability === 'sold-out';
            const isActive = idx === activeIdx;
            return (
              <button
                key={event.id}
                onMouseDown={() => handleSelect(event)}
                onMouseEnter={() => setActiveIdx(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '10px 14px',
                  background: isActive ? 'var(--primary-light)' : 'var(--white)',
                  border: 'none',
                  borderBottom: idx < results.length - 1 ? '1px solid var(--border-gray)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background .1s',
                }}
              >
                {/* Sport icon */}
                <span
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: 'var(--light-gray)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0,
                  }}
                >
                  {sport?.icon ?? '🎫'}
                </span>

                {/* Event info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--text-dark)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {event.eventName}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-gray)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {formatShortDate(event.date)} · {event.venue}, {event.city}
                  </div>
                </div>

                {/* Price / badge */}
                <div style={{ flexShrink: 0, textAlign: 'right' }}>
                  {isSoldOut ? (
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-gray)', background: 'var(--light-gray)', padding: '2px 8px', borderRadius: '100px' }}>
                      Sold Out
                    </span>
                  ) : (
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>
                      {formatPrice(event.minPrice, event.currency)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {/* Footer hint */}
          <div style={{ padding: '8px 14px', background: 'var(--off-white)', borderTop: '1px solid var(--border-gray)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-gray)' }}>
              ↑↓ navigate · Enter select · Esc close
            </span>
          </div>
        </div>
      )}

      {/* No results */}
      {open && results.length === 0 && query.trim().length >= 2 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--white)',
            border: '1px solid var(--primary)',
            borderTop: 'none',
            borderRadius: '0 0 10px 10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 1000,
            padding: '16px 14px',
            fontSize: '13px',
            color: 'var(--text-gray)',
          }}
        >
          No events found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header>
      {/* ── Single sticky nav bar ── */}
      <nav
        className="nav-bar-pad"
        style={{
          height: 'var(--nav-h)',
          background: 'var(--white)',
          borderBottom: '1px solid var(--border-gray)',
          position: 'sticky',
          top: 0,
          zIndex: 900,
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'visible',
        }}
      >
        {/* ── Mobile hamburger — leftmost on mobile, hidden on desktop ── */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: 'none',
            padding: '8px',
            color: 'var(--text-dark)',
            border: 'none',
            flexShrink: 0,
            marginRight: '4px',
          }}
          className="md:hidden"
          aria-label="Toggle menu"
        >
          <Icon name={mobileOpen ? 'x' : 'menu'} size={22} />
        </button>

        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
            fontSize: '22px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flexShrink: 0,
            color: 'var(--text-dark)',
            marginRight: '8px',
            textDecoration: 'none',
          }}
        >
          <span style={{ color: 'var(--primary)' }}>Ticket</span>Nexus
        </Link>

        {/* Sports + News Navigation — desktop only */}
        <SportsNav />

        {/* Right: search + CTA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0,
            marginLeft: 'auto',
          }}
        >
          {/* Desktop search with autosuggest */}
          <div className="hidden md:flex">
            <SearchBox />
          </div>

          {/* Get Tickets — desktop + mobile */}
          <Link
            href="/football"
            style={{
              background: 'var(--primary)',
              color: 'var(--white)',
              fontSize: '13px',
              fontWeight: 600,
              padding: '9px 18px',
              borderRadius: '8px',
              transition: 'all .2s',
              textDecoration: 'none',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            Get Tickets
          </Link>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div
          style={{
            background: 'var(--white)',
            borderBottom: '1px solid var(--border-gray)',
            padding: '16px 20px',
            boxShadow: 'var(--shadow)',
          }}
        >
          {/* Mobile search with autosuggest */}
          <div style={{ marginBottom: '12px' }}>
            <SearchBox isMobile onNavigate={() => setMobileOpen(false)} />
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {SPORTS.map((sport) => (
              <Link
                key={sport.slug}
                href={`/${sport.slug}`}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: 'var(--text-gray)',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all .2s',
                }}
              >
                <span style={{ fontSize: '18px', width: '24px' }}>{sport.icon}</span>
                {sport.name}
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-gray)',
                    background: 'var(--light-gray)',
                    padding: '2px 8px',
                    borderRadius: '100px',
                  }}
                >
                  {SPORT_EVENT_COUNTS[sport.slug] ?? 0}
                </span>
              </Link>
            ))}

            <div style={{ height: '1px', background: 'var(--border-gray)', margin: '8px 0' }} />

            <Link
              href="/news"
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                fontSize: '15px',
                fontWeight: 500,
                color: 'var(--text-gray)',
                padding: '10px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              📰 News
            </Link>
            <Link
              href="/partners"
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                fontSize: '15px',
                fontWeight: 500,
                color: 'var(--text-gray)',
                padding: '10px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              🤝 Partners
            </Link>
          </nav>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: '8px',
                border: '1px solid var(--border-gray)',
                background: 'transparent',
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--text-dark)',
              }}
            >
              Sign In
            </button>
            <Link
              href="/football"
              onClick={() => setMobileOpen(false)}
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: '8px',
                background: 'var(--primary)',
                color: 'var(--white)',
                fontSize: '14px',
                fontWeight: 600,
                textAlign: 'center',
                textDecoration: 'none',
              }}
            >
              Get Tickets
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
