'use client';

import { useEffect } from 'react';
import type { TicketEvent } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils/format';

interface TicketModalProps {
  event: TicketEvent;
  onClose: () => void;
}

export default function TicketModal({ event, onClose }: TicketModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--white)',
          border: '1px solid var(--border-gray)',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '580px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: 'var(--shadow-lg)',
        }}
        className="modal-animate"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'var(--light-gray)',
            border: '1px solid var(--border-gray)',
            color: 'var(--text-gray)',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all .2s',
          }}
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Header */}
        <div style={{ padding: '32px 32px 0' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚽</div>
          <h2
            style={{
              fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--text-dark)',
              marginBottom: '6px',
            }}
          >
            {event.eventName}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-gray)' }}>{event.league}</p>
        </div>

        {/* Divider */}
        <div
          style={{ height: '1px', background: 'var(--border-gray)', margin: '24px 32px' }}
        />

        {/* Info grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            padding: '0 32px',
          }}
        >
          {[
            { label: 'Date', value: formatDate(event.date) },
            { label: 'Time', value: event.time },
            { label: 'Venue', value: event.venue },
            { label: 'City', value: event.city },
          ].map(({ label, value }) => (
            <div key={label}>
              <div
                style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-gray)',
                  marginBottom: '6px',
                  fontWeight: 700,
                }}
              >
                {label}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Price row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 32px',
          }}
        >
          <div style={{ fontSize: '14px', color: 'var(--text-gray)' }}>
            Tickets from:
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                fontSize: '36px',
                fontWeight: 700,
                color: 'var(--primary)',
              }}
            >
              {formatPrice(event.minPrice, event.currency)}
            </span>
            <small style={{ fontSize: '13px', color: 'var(--text-gray)', fontWeight: 400 }}>
              {' '}
              per ticket
            </small>
          </div>
        </div>

        {/* Partner buttons */}
        {event.partners.length > 0 && (
          <div style={{ padding: '0 32px 24px' }}>
            <div
              style={{
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-gray)',
                marginBottom: '14px',
                fontWeight: 700,
              }}
            >
              Compare Prices
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {event.partners.map((partner) => (
                <a
                  key={partner.partnerId}
                  href={partner.awDeepLink ?? `/partners/${partner.partnerId}`}
                  target={partner.awDeepLink ? '_blank' : undefined}
                  rel={partner.awDeepLink ? 'noopener noreferrer sponsored' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--light-gray)',
                    border: '1px solid var(--border-gray)',
                    borderRadius: '8px',
                    padding: '14px 16px',
                    cursor: 'pointer',
                    transition: 'all .2s',
                    textDecoration: 'none',
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {partner.awImageUrl ? (
                      <img
                        src={partner.awImageUrl}
                        alt={partner.partnerName}
                        width={36}
                        height={36}
                        style={{ borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-gray)', flexShrink: 0 }}
                      />
                    ) : (
                      <span style={{ fontSize: '22px' }}>{partner.partnerIcon}</span>
                    )}
                    <div>
                      <div
                        style={{
                          fontSize: '15px',
                          fontWeight: 600,
                          color: 'var(--text-dark)',
                        }}
                      >
                        {partner.partnerName}
                      </div>
                      {partner.tag && (
                        <div style={{ fontSize: '12px', color: 'var(--text-gray)' }}>
                          {partner.tag}
                        </div>
                      )}
                    </div>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                      fontSize: '22px',
                      fontWeight: 700,
                      color: partner.isBest ? 'var(--orange)' : 'var(--primary)',
                    }}
                  >
                    {formatPrice(partner.price, event.currency)}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div
          style={{
            padding: '0 32px 32px',
            fontSize: '12px',
            color: 'var(--text-gray)',
            lineHeight: 1.7,
          }}
        >
          Prices shown are indicative and may change at any time. TicketNexus earns an affiliate
          commission when you purchase via partner links. See our{' '}
          <a href="/company/affiliate-disclosure" style={{ color: 'var(--primary)' }}>
            Affiliate Disclosure
          </a>{' '}
          for details.
        </div>
      </div>
    </div>
  );
}
