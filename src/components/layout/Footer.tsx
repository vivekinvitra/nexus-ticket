import Link from 'next/link';
import { SPORTS } from '@/lib/data/sports';

const LEGAL_LINKS = [
  { href: '/legal/terms', label: 'Terms & Conditions' },
  { href: '/legal/privacy', label: 'Privacy Policy' },
  { href: '/legal/cookies', label: 'Cookie Policy' },
  { href: '/legal/affiliate-disclosure', label: 'Affiliate Disclosure' },
];

const COMPANY_LINKS = [
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/news', label: 'News' },
  { href: '/sitemap.xml', label: 'Sitemap' },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--white)',
        borderTop: '1px solid var(--border-gray)',
        padding: '60px 40px 32px',
      }}
    >
      {/* ── Main grid ── */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingBottom: '40px',
          borderBottom: '1px solid var(--border-gray)',
        }}
        className="footer-main-grid"
      >
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
              fontSize: '26px',
              fontWeight: 700,
              marginBottom: '12px',
              color: 'var(--text-dark)',
            }}
          >
            <span style={{ color: 'var(--primary)' }}>Ticket</span>Nexus
          </div>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--text-gray)',
              lineHeight: 1.7,
              maxWidth: '300px',
              marginBottom: '20px',
            }}
          >
            The UK&apos;s leading sports ticket comparison site. We help fans find the best prices
            from trusted resale platforms — so you never overpay for a seat.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['𝕏', 'f', 'in', '▶'].map((icon, i) => (
              <button
                key={i}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  background: 'var(--light-gray)',
                  border: '1px solid var(--border-gray)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all .2s',
                  color: 'var(--text-dark)',
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Sports */}
        <div>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-dark)',
              marginBottom: '16px',
            }}
          >
            Sports
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {SPORTS.slice(0, 6).map((sport) => (
              <Link
                key={sport.slug}
                href={`/${sport.slug}`}
                style={{ fontSize: '14px', color: 'var(--text-gray)', transition: 'color .2s' }}
              >
                {sport.icon} {sport.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Partners */}
        <div>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-dark)',
              marginBottom: '16px',
            }}
          >
            Partners
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/partners" style={{ fontSize: '14px', color: 'var(--text-gray)' }}>
              All Partners
            </Link>
            <Link
              href="/partners/ticketmaster"
              style={{ fontSize: '14px', color: 'var(--text-gray)' }}
            >
              Ticketmaster
            </Link>
            <Link
              href="/partners/stubhub"
              style={{ fontSize: '14px', color: 'var(--text-gray)' }}
            >
              StubHub
            </Link>
            <Link
              href="/partners/viagogo"
              style={{ fontSize: '14px', color: 'var(--text-gray)' }}
            >
              Viagogo
            </Link>
            <Link
              href="/partners/seatgeek"
              style={{ fontSize: '14px', color: 'var(--text-gray)' }}
            >
              SeatGeek
            </Link>
            <Link
              href="/partners/ticketswap"
              style={{ fontSize: '14px', color: 'var(--text-gray)' }}
            >
              TicketSwap
            </Link>
          </div>
        </div>

        {/* Company */}
        <div>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-dark)',
              marginBottom: '16px',
            }}
          >
            Company
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {COMPANY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ fontSize: '14px', color: 'var(--text-gray)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--text-dark)',
              marginBottom: '16px',
            }}
          >
            Legal
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{ fontSize: '14px', color: 'var(--text-gray)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom ── */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingTop: '28px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '32px',
          flexWrap: 'wrap',
        }}
      >
        <p
          style={{
            fontSize: '12px',
            color: 'var(--text-gray)',
            lineHeight: 1.7,
            maxWidth: '720px',
          }}
        >
          <strong style={{ color: 'var(--text-dark)' }}>Affiliate Disclosure:</strong>{' '}
          TicketNexus Tickets earns a commission when you purchase tickets through links on this site.
          This does not affect the price you pay. We only partner with reputable, verified ticket
          sellers. Prices shown are indicative and may change at any time.
        </p>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {LEGAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ fontSize: '12px', color: 'var(--text-gray)', transition: 'color .2s' }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Copyright ── */}
      <div
        style={{
          fontSize: '12px',
          color: 'var(--text-gray)',
          maxWidth: '1280px',
          margin: '24px auto 0',
          paddingTop: '20px',
          borderTop: '1px solid var(--border-gray)',
          textAlign: 'center',
        }}
      >
        © {new Date().getFullYear()} Tickets nexus. All rights reserved. Made with{' '}
        <span style={{ color: 'var(--red)' }}>♥</span> for sports fans.
      </div>

    </footer>
  );
}
