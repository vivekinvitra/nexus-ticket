import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { PARTNERS, getPartnerBySlug } from '@/lib/data/partners';
import { buildMetadata } from '@/lib/utils/seo';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return PARTNERS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const partner = getPartnerBySlug(params.slug);
  if (!partner) return {};
  return buildMetadata({
    title: partner.metaTitle ?? `${partner.name} Review | TicketNexus`,
    description: partner.metaDescription ?? partner.shortDesc,
    keywords: partner.metaKeywords,
    path: `/partners/${partner.slug}`,
  });
}

export default function PartnerDetailPage({ params }: Props) {
  const partner = getPartnerBySlug(params.slug);
  if (!partner) notFound();

  return (
    <>
      <Header />

      <main>
        {/* Breadcrumb */}
        <div
          style={{
            background: 'var(--white)',
            borderBottom: '1px solid var(--border-gray)',
            padding: '16px 40px',
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
            }}
          >
            <Link href="/" style={{ color: 'var(--text-gray)', textDecoration: 'none' }}>
              Home
            </Link>
            <span style={{ color: 'var(--text-gray)' }}>›</span>
            <Link href="/partners" style={{ color: 'var(--text-gray)', textDecoration: 'none' }}>
              Partners
            </Link>
            <span style={{ color: 'var(--text-gray)' }}>›</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{partner.name}</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 40px 80px' }}>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '48px' }}
            className="partner-detail-grid"
          >
            {/* Main */}
            <div>
              {/* Partner header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  marginBottom: '32px',
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '16px',
                    background: 'var(--light-gray)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '38px',
                    flexShrink: 0,
                    border: '1px solid var(--border-gray)',
                  }}
                >
                  {partner.icon}
                </div>
                <div>
                  <h1
                    style={{
                      fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                      fontSize: '32px',
                      fontWeight: 800,
                      color: 'var(--text-dark)',
                      marginBottom: '8px',
                    }}
                  >
                    {partner.name}
                  </h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#f59e0b', fontSize: '18px' }}>★</span>
                    <span
                      style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-dark)' }}
                    >
                      {partner.rating}/5
                    </span>
                    <span style={{ fontSize: '14px', color: 'var(--text-gray)' }}>
                      ({partner.reviewCount.toLocaleString()} reviews)
                    </span>
                    <span style={{ fontSize: '13px', color: 'var(--text-gray)' }}>
                      · Est. {partner.founded}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <section style={{ marginBottom: '36px' }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--text-dark)',
                    marginBottom: '12px',
                  }}
                >
                  About {partner.name}
                </h2>
                <p
                  style={{
                    fontSize: '15px',
                    color: 'var(--text-gray)',
                    lineHeight: 1.8,
                  }}
                >
                  {partner.description}
                </p>
              </section>

              {/* Key features */}
              <section style={{ marginBottom: '36px' }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--text-dark)',
                    marginBottom: '16px',
                  }}
                >
                  Key Features
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  {partner.features.map((f) => (
                    <div
                      key={f}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 16px',
                        background: 'var(--light-gray)',
                        borderRadius: '8px',
                        fontSize: '14px',
                        color: 'var(--text-dark)',
                        fontWeight: 500,
                      }}
                    >
                      <span style={{ color: 'var(--primary)', fontWeight: 700 }}>✓</span>
                      {f}
                    </div>
                  ))}
                </div>
              </section>

              {/* Pros & Cons */}
              <section>
                <h2
                  style={{
                    fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--text-dark)',
                    marginBottom: '16px',
                  }}
                >
                  Pros &amp; Cons
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div
                    style={{
                      background: 'var(--primary-light)',
                      border: '1px solid var(--primary)',
                      borderRadius: '12px',
                      padding: '20px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: 'var(--primary-dark)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: '12px',
                      }}
                    >
                      ✅ Pros
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {partner.pros.map((p) => (
                        <li
                          key={p}
                          style={{ fontSize: '14px', color: 'var(--text-dark)', display: 'flex', gap: '8px' }}
                        >
                          <span style={{ color: 'var(--primary)', flexShrink: 0 }}>+</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    style={{
                      background: '#fff1f2',
                      border: '1px solid #fecdd3',
                      borderRadius: '12px',
                      padding: '20px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#be123c',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: '12px',
                      }}
                    >
                      ⚠️ Cons
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {partner.cons.map((c) => (
                        <li
                          key={c}
                          style={{ fontSize: '14px', color: 'var(--text-dark)', display: 'flex', gap: '8px' }}
                        >
                          <span style={{ color: '#ef4444', flexShrink: 0 }}>–</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <aside>
              {/* CTA */}
              <div
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--border-gray)',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '24px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div
                  style={{ fontSize: '14px', color: 'var(--text-gray)', marginBottom: '16px' }}
                >
                  Visit their official site to browse tickets:
                </div>
                <a
                  href={partner.merchantredirecturl ?? partner.website}
                  target="_blank"
                  rel="noopener noreferrer nofollow sponsored"
                  style={{
                    display: 'block',
                    width: '100%',
                    background: 'var(--primary)',
                    color: 'var(--white)',
                    fontSize: '15px',
                    fontWeight: 700,
                    padding: '14px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    transition: 'all .2s',
                    marginBottom: '12px',
                  }}
                >
                  Visit {partner.name} →
                </a>
                <p
                  style={{ fontSize: '11px', color: 'var(--text-gray)', textAlign: 'center', lineHeight: 1.5 }}
                >
                  Affiliate link — we may earn a commission at no extra cost to you.
                </p>
              </div>

              {/* Quick Info */}
              <div
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--border-gray)',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--text-dark)',
                    marginBottom: '16px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Quick Info
                </h3>

                <InfoRow label="Specialties">
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {partner.specialties.map((s) => (
                      <span
                        key={s}
                        style={{
                          fontSize: '11px',
                          background: 'var(--light-gray)',
                          color: 'var(--text-gray)',
                          padding: '3px 8px',
                          borderRadius: '100px',
                          textTransform: 'capitalize',
                        }}
                      >
                        {s.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </InfoRow>

                <InfoRow label="Payment">
                  <p style={{ fontSize: '13px', color: 'var(--text-gray)' }}>
                    {partner.paymentMethods.join(', ')}
                  </p>
                </InfoRow>

                <InfoRow label="Delivery">
                  <p style={{ fontSize: '13px', color: 'var(--text-gray)' }}>
                    {partner.deliveryOptions.join(', ')}
                  </p>
                </InfoRow>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div
        style={{
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--text-gray)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '6px',
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}
