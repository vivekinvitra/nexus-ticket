import Link from 'next/link';
import Icon from '@/components/common/Icon';

export default function Hero() {
  return (
    <section
      style={{
        background: 'var(--white)',
        borderBottom: '1px solid var(--border-gray)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '50px 40px',
          display: 'grid',
          gridTemplateColumns: '1fr 420px',
          gap: '60px',
          alignItems: 'center',
        }}
        className="hero-grid"
      >
        {/* Left */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--primary-light)',
              color: 'var(--primary-dark)',
              borderRadius: '100px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '20px',
            }}
          >
            <span
              style={{ fontSize: '8px' }}
              className="animate-pulse-dot"
            >
              ●
            </span>
            Live prices updated every 5 minutes
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
              fontSize: '44px',
              fontWeight: 800,
              lineHeight: 1.1,
              color: 'var(--text-dark)',
              marginBottom: '16px',
            }}
            className="hero-h1"
          >
            Find the{' '}
            <span style={{ color: 'var(--primary)' }}>Best Sports</span>
            <br />
            Ticket Prices
          </h1>

          <p
            style={{
              fontSize: '17px',
              color: 'var(--text-gray)',
              lineHeight: 1.7,
              marginBottom: '28px',
              maxWidth: '520px',
            }}
          >
            Compare ticket prices from Ticketmaster, StubHub, Viagogo and more — all in one
            place. Never overpay for your favourite sport again.
          </p>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link
              href="/category/football"
              style={{
                background: 'var(--primary)',
                color: 'var(--white)',
                fontSize: '15px',
                fontWeight: 600,
                padding: '12px 28px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all .2s',
              }}
            >
              Browse Tickets
              <Icon name="arrow-right" size={16} />
            </Link>
            <Link
              href="/partners"
              style={{
                background: 'transparent',
                color: 'var(--text-dark)',
                fontSize: '15px',
                fontWeight: 500,
                padding: '11px 26px',
                borderRadius: '8px',
                border: '1px solid var(--border-gray)',
                transition: 'all .2s',
              }}
            >
              Our Partners
            </Link>
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: '32px',
              marginTop: '36px',
              paddingTop: '28px',
              borderTop: '1px solid var(--border-gray)',
            }}
          >
            {[
              { val: '745+', label: 'Live Events' },
              { val: '6', label: 'Partner Sites' },
              { val: '£0', label: 'Booking Fee' },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                    fontSize: '32px',
                    fontWeight: 700,
                    color: 'var(--text-dark)',
                    lineHeight: 1,
                  }}
                >
                  <span style={{ color: 'var(--primary)' }}>{stat.val}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-gray)', marginTop: '4px' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: decorative */}
        <div
          style={{
            background: 'var(--light-gray)',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
            height: '360px',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(135deg, var(--primary-light) 0%, var(--accent-light) 100%)',
              opacity: 0.4,
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              textAlign: 'center',
              padding: '40px',
            }}
          >
            <div style={{ fontSize: '80px', marginBottom: '16px', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}>
              🏟️
            </div>
            <div
              style={{
                fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--text-dark)',
                marginBottom: '8px',
              }}
            >
              8 Sports Categories
            </div>
            <div style={{ fontSize: '14px', color: 'var(--text-gray)', fontWeight: 500 }}>
              Football · Cricket · F1 · Tennis & more
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
