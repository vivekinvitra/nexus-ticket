import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PARTNERS } from '@/lib/data/partners';
import { buildMetadata } from '@/lib/utils/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Our Ticket Partners',
  description:
    'Discover all the trusted ticket platforms we compare. Read reviews, ratings, features and decide which partner is right for your next event.',
  path: '/partners',
});

export default function PartnersPage() {
  return (
    <>
      <Header />

      <main>
        {/* Page hero */}
        <div
          style={{
            background: 'var(--white)',
            borderBottom: '1px solid var(--border-gray)',
            padding: '50px 40px',
          }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
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
              Verified Partners
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                fontSize: '42px',
                fontWeight: 800,
                color: 'var(--text-dark)',
                marginBottom: '16px',
              }}
            >
              Our{' '}
              <span style={{ color: 'var(--primary)' }}>Trusted</span> Ticket Partners
            </h1>
            <p
              style={{
                fontSize: '17px',
                color: 'var(--text-gray)',
                maxWidth: '600px',
                margin: '0 auto',
                lineHeight: 1.7,
              }}
            >
              We only work with verified, reputable ticket platforms. Compare their features,
              ratings and specialties before you buy.
            </p>
          </div>
        </div>

        {/* Trust badges */}
        <div
          style={{
            background: 'var(--light-gray)',
            borderBottom: '1px solid var(--border-gray)',
            padding: '20px 40px',
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'center',
              gap: '48px',
              flexWrap: 'wrap',
            }}
          >
            {[
              { icon: '🔒', label: 'Secure Payments' },
              { icon: '✅', label: 'Verified Sellers' },
              { icon: '🛡️', label: 'Buyer Protection' },
            ].map(({ icon, label }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-dark)',
                }}
              >
                <span style={{ fontSize: '20px' }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Partners grid */}
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '48px 40px 80px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '28px',
            }}
            className="partners-grid"
          >
            {PARTNERS.map((partner) => (
              <Link
                key={partner.id}
                href={`/partners/${partner.slug}`}
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--border-gray)',
                  borderRadius: '12px',
                  padding: '28px',
                  display: 'block',
                  textDecoration: 'none',
                  transition: 'all .2s',
                  boxShadow: 'var(--shadow-sm)',
                }}
                className="partner-card"
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '12px',
                        background: 'var(--light-gray)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '26px',
                        flexShrink: 0,
                      }}
                    >
                      {partner.icon}
                    </div>
                    <div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                          fontSize: '18px',
                          fontWeight: 700,
                          color: 'var(--text-dark)',
                          marginBottom: '4px',
                        }}
                      >
                        {partner.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: '#f59e0b', fontSize: '14px' }}>★</span>
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: 'var(--text-dark)',
                          }}
                        >
                          {partner.rating}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-gray)' }}>
                          ({partner.reviewCount.toLocaleString()} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-gray)' }}>
                    Est. {partner.founded}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '14px',
                    color: 'var(--text-gray)',
                    lineHeight: 1.6,
                    marginBottom: '16px',
                  }}
                >
                  {partner.shortDesc}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {partner.features.slice(0, 3).map((f) => (
                    <span
                      key={f}
                      style={{
                        fontSize: '12px',
                        background: 'var(--primary-light)',
                        color: 'var(--primary-dark)',
                        padding: '4px 10px',
                        borderRadius: '100px',
                        fontWeight: 500,
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {partner.specialties.slice(0, 4).map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: '11px',
                        background: 'var(--light-gray)',
                        color: 'var(--text-gray)',
                        padding: '3px 8px',
                        borderRadius: '100px',
                        fontWeight: 500,
                        textTransform: 'capitalize',
                      }}
                    >
                      {s.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />

    </>
  );
}
