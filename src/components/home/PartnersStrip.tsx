import Link from 'next/link';
import { PARTNERS } from '@/lib/data/partners';

export default function PartnersStrip() {
  return (
    <div
      style={{
        background: 'var(--white)',
        borderTop: '1px solid var(--border-gray)',
        borderBottom: '1px solid var(--border-gray)',
        padding: '32px 40px',
        marginTop: '60px',
      }}
      className="partners-strip"
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div
          style={{
            fontSize: '12px',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--text-gray)',
            textAlign: 'center',
            marginBottom: '20px',
            fontWeight: 600,
          }}
        >
          Our Trusted Ticket Partners
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {PARTNERS.map((partner) => (
            <Link
              key={partner.id}
              href={`/partners/${partner.slug}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--white)',
                border: '1px solid var(--border-gray)',
                borderRadius: '8px',
                padding: '10px 18px',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--text-dark)',
                cursor: 'pointer',
                transition: 'all .2s',
                whiteSpace: 'nowrap',
                boxShadow: 'var(--shadow-sm)',
                textDecoration: 'none',
              }}
              className="partner-chip"
            >
              <span style={{ fontSize: '18px' }}>{partner.icon}</span>
              {partner.name}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
