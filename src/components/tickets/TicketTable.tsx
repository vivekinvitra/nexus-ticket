'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { TicketEvent } from '@/lib/types';
import { formatPrice, formatShortDate } from '@/lib/utils/format';
import { getSportBySlug } from '@/lib/data/sports';
import { toTicketSlug } from '@/lib/data/tickets';

interface TicketTableProps {
  events: TicketEvent[];
  title?: string;
  sportIcon?: string;
  rounded?: boolean;
  sortBy?: 'date-soonest' | 'price-lowest' | 'price-highest' | 'availability';
  currencies?: string[];
}

export default function TicketTable({
  events,
  title = 'Upcoming Events',
  sportIcon = '🎫',
  rounded = true,
  sortBy = 'date-soonest',
  currencies = [],
}: TicketTableProps) {
  const [visibleCount, setVisibleCount] = useState(20);

  // Sort events based on sortBy prop
  const sortedEvents = [...events].sort((a, b) => {
    switch (sortBy) {
      case 'price-lowest':
        return a.minPrice - b.minPrice;
      case 'price-highest':
        return b.minPrice - a.minPrice;
      case 'availability':
        const availOrder = { high: 0, low: 1, 'sold-out': 2 };
        return availOrder[a.availability] - availOrder[b.availability];
      case 'date-soonest':
      default:
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  });

  const visibleEvents = sortedEvents.slice(0, visibleCount);

  return (
    <>
      {/* Section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>{sportIcon}</span>
          <h2
            style={{
              fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--text-dark)',
            }}
          >
            {title}
          </h2>
          <span
            style={{
              background: 'var(--primary-light)',
              color: 'var(--primary-dark)',
              fontSize: '12px',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '100px',
            }}
          >
            {events.length} events
          </span>
          {currencies.length > 0 && currencies.map((c) => (
            <span
              key={c}
              style={{
                background: 'var(--light-gray)',
                color: 'var(--text-gray)',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 8px',
                borderRadius: '100px',
                border: '1px solid var(--border-gray)',
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: 'var(--white)',
          border: '1px solid var(--border-gray)',
          borderRadius: rounded ? '12px' : '0 0 12px 12px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '40px',
        }}
      >
        {/* Table head */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '3.5fr 1.1fr 1fr 1fr 1fr 1fr',
            gap: '16px',
            padding: '14px 24px',
            background: 'var(--light-gray)',
            borderBottom: '1px solid var(--border-gray)',
          }}
          className="ticket-table-head"
        >
          {['Event', 'Date & Time', 'Venue', 'Availability', 'Price From', ''].map((h) => (
            <div
              key={h}
              className={h === 'Venue' ? 'ticket-venue' : undefined}
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-gray)',
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Rows */}
        {visibleEvents.length === 0 ? (
          <div
            style={{
              padding: '60px 24px',
              textAlign: 'center',
              color: 'var(--text-gray)',
              fontSize: '15px',
            }}
          >
            No events found for the selected filters.
          </div>
        ) : (
          visibleEvents.map((event) => (
            <TicketRow key={event.id} event={event} />
          ))
        )}
      </div>

      {/* Load more */}
      {visibleCount < sortedEvents.length && (
        <div style={{ padding: '20px 0', textAlign: 'center' }}>
          <button
            onClick={() => setVisibleCount((c) => c + 20)}
            style={{
              background: 'var(--white)',
              border: '1px solid var(--border-gray)',
              color: 'var(--text-dark)',
              fontSize: '14px',
              fontWeight: 500,
              padding: '10px 28px',
              borderRadius: '8px',
              transition: 'all .2s',
              cursor: 'pointer',
            }}
          >
            Load More Events
          </button>
        </div>
      )}

    </>
  );
}

function TicketRow({ event }: { event: TicketEvent }) {
  const isSoldOut = event.availability === 'sold-out';
  const sportIcon = getSportBySlug(event.sport)?.icon ?? '🎫';
  const ticketSlug = toTicketSlug(event);

  const availStyle = {
    high: { color: 'var(--primary)', dot: 'var(--primary)', label: 'Available' },
    low: { color: 'var(--orange)', dot: 'var(--orange)', label: 'Limited' },
    'sold-out': { color: 'var(--text-gray)', dot: 'var(--border-gray)', label: 'Sold Out' },
  }[event.availability];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '3.5fr 1.1fr 1fr 1fr 1fr 1fr',
        gap: '16px',
        padding: '18px 24px',
        borderBottom: '1px solid var(--border-gray)',
        alignItems: 'center',
        cursor: isSoldOut ? 'default' : 'pointer',
        transition: 'all .15s',
        position: 'relative',
        opacity: isSoldOut ? 0.5 : 1,
        background: event.featured ? 'var(--primary-light)' : undefined,
      }}
      className="ticket-row"
    >
      {/* Left accent bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '4px',
          background: event.featured ? 'var(--primary)' : 'transparent',
          transition: 'background .15s',
        }}
        className="row-accent"
      />

      {/* Event */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            flexShrink: 0,
            background: 'var(--light-gray)',
          }}
        >
          {sportIcon}
        </div>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--text-dark)',
              wordBreak: 'break-word',
            }}
          >
            {event.eventName}
            {event.featured && (
              <span
                style={{
                  background: 'var(--primary)',
                  color: 'var(--white)',
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: '100px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  marginLeft: '8px',
                }}
              >
                HOT
              </span>
            )}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-gray)', marginTop: '2px' }}>
            {event.leagueSlug ? (
              <Link
                href={`/${event.sport}/${event.leagueSlug}`}
                onClick={(e) => e.stopPropagation()}
                style={{ color: 'var(--text-gray)', textDecoration: 'none' }}
                className="league-link"
              >
                {event.league}
              </Link>
            ) : (
              event.league
            )}
          </div>
        </div>
      </div>

      {/* Date */}
      <div style={{ whiteSpace: 'nowrap' }}>
        <div style={{ fontSize: '14px', color: 'var(--text-dark)', fontWeight: 500 }}>
          {formatShortDate(event.date)}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-gray)', fontWeight: 400, marginTop: '2px' }}>
          {event.time}
        </div>
      </div>

      {/* Venue */}
      <div className="ticket-venue" style={{ fontSize: '13px', color: 'var(--text-gray)' }}>
        {event.venue}
        {event.city && event.city !== event.venue && (
          <div style={{ fontSize: '11px', marginTop: '2px' }}>{event.city}</div>
        )}
      </div>

      {/* Availability */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          fontWeight: 500,
          color: availStyle.color,
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: availStyle.dot,
            flexShrink: 0,
          }}
        />
        {availStyle.label}
      </div>

      {/* Price */}
      <div>
        <div
          style={{
            fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
            fontSize: '22px',
            fontWeight: 700,
            color: 'var(--primary)',
            lineHeight: 1,
          }}
        >
          {formatPrice(event.minPrice, event.currency)}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: 'var(--text-gray)',
            fontWeight: 400,
            marginTop: '3px',
          }}
        >
          per ticket{event.currency ? ` · ${event.currency}` : ''}
        </div>
      </div>

      {/* Action */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {isSoldOut ? (
          <span
            style={{
              background: 'var(--border-gray)',
              color: 'var(--text-gray)',
              fontSize: '13px',
              fontWeight: 600,
              padding: '9px 18px',
              borderRadius: '8px',
              whiteSpace: 'nowrap',
            }}
          >
            Sold Out
          </span>
        ) : (
          <Link
            href={`/tickets/${ticketSlug}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--primary)',
              color: 'var(--white)',
              fontSize: '13px',
              fontWeight: 600,
              padding: '9px 18px',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
            }}
          >
            Get Tickets →
          </Link>
        )}
      </div>

    </div>
  );
}
