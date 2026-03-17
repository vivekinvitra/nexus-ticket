import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CLEAN_EVENTS, getEventBySlug, getRelatedEvents, toTicketSlug } from '@/lib/data/tickets';
import { getSportBySlug } from '@/lib/data/sports';
import { buildMetadata, SITE_URL } from '@/lib/utils/seo';
import { formatPrice, formatDate, formatShortDate } from '@/lib/utils/format';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return CLEAN_EVENTS.map((e) => ({ slug: toTicketSlug(e) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = getEventBySlug(params.slug);
  if (!event) return {};
  const metaDesc = event.description
    ? event.description.slice(0, 160)
    : `Buy ${event.eventName} tickets at ${event.venue}, ${event.city} on ${formatDate(event.date)}. Compare prices from top platforms. From ${formatPrice(event.minPrice, event.currency)}.`;
  return buildMetadata({
    title: `${event.eventName} Tickets — ${formatDate(event.date)}`,
    description: metaDesc,
    path: `/tickets/${params.slug}`,
    image: event.imageUrl,
  });
}

export default function TicketPage({ params }: Props) {
  const event = getEventBySlug(params.slug);
  if (!event) notFound();

  const sport = getSportBySlug(event.sport);
  const isSoldOut = event.availability === 'sold-out';
  const relatedEvents = getRelatedEvents(event, 3);

  const availStyle = {
    high: { label: 'Available', color: 'var(--primary)', bg: 'var(--primary-light)' },
    low: { label: 'Limited Seats', color: 'var(--orange)', bg: 'var(--orange-light)' },
    'sold-out': { label: 'Sold Out', color: 'var(--text-gray)', bg: 'var(--light-gray)' },
  }[event.availability];

  // Schema.org Event JSON-LD
  const eventPageUrl = `${SITE_URL}/tickets/${params.slug}`;
  const absoluteImage = event.imageUrl
    ? event.imageUrl.startsWith('http') ? event.imageUrl : `${SITE_URL}${event.imageUrl}`
    : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.eventName,
    description: event.description,
    ...(absoluteImage ? { image: absoluteImage } : {}),
    startDate: `${event.date}T${event.time}:00`,
    location: {
      '@type': 'Place',
      name: event.venue,
      address: { '@type': 'PostalAddress', addressLocality: event.city },
    },
    organizer: { '@type': 'Organization', name: event.league },
    offers: isSoldOut
      ? [{ '@type': 'Offer', availability: 'https://schema.org/SoldOut', price: event.minPrice, priceCurrency: event.currency ?? 'GBP' }]
      : event.partners.map((p) => ({
          '@type': 'Offer',
          seller: { '@type': 'Organization', name: p.partnerName },
          price: p.price,
          priceCurrency: event.currency ?? 'GBP',
          availability: 'https://schema.org/InStock',
          url: p.awDeepLink ?? eventPageUrl,
        })),
  };

  // Build 3 overview paragraphs
  const overviewPara1 = event.description ??
    `${event.eventName} is a highly anticipated ${event.league} fixture taking place at ${event.venue} in ${event.city} on ${formatDate(event.date)}.`;
  const overviewPara2 = `${event.venue} is one of the premier sporting venues in ${event.city}, offering fans an unforgettable atmosphere. This ${sport?.name ?? 'sporting'} event is part of the ${event.league} season and attracts supporters from across the country.`;
  const overviewPara3 = `Tickets for ${event.eventName} are ${isSoldOut ? 'currently sold out' : `available from ${formatPrice(event.minPrice, event.currency)} per ticket`}. We compare prices across all major resale and official platforms so you can find the best deal without the hassle.`;

  // Build FAQ items
  const faqs = [
    {
      q: `When and where is ${event.eventName}?`,
      a: `${event.eventName} takes place on ${formatDate(event.date)} at ${event.time}, held at ${event.venue}, ${event.city}.`,
    },
    {
      q: `How much do tickets cost?`,
      a: isSoldOut
        ? `Unfortunately all tickets for this event have sold out. Check back for any resale listings.`
        : `Tickets start from ${formatPrice(event.minPrice, event.currency)} per person. Prices vary by seat category and platform — use our comparison tool above to find the best available price.`,
    },
    {
      q: `Are the tickets guaranteed?`,
      a: `Yes. All partner platforms listed on TicketNexus are verified and guarantee 100% authentic tickets. You will receive your tickets via email or mobile app ahead of the event.`,
    },
    {
      q: `Can I get a refund if the event is cancelled?`,
      a: `If the event is officially cancelled, most partner platforms offer a full refund to your original payment method. Postponed events may vary by platform — always check the seller's terms at time of purchase.`,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main style={{ background: 'var(--off-white)', minHeight: '100vh' }}>

        {/* ── Page header ── */}
        <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border-gray)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 40px 28px' }} className="ticket-page-inner">

            {/* Breadcrumb */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-gray)', marginBottom: '20px', flexWrap: 'wrap' }}>
              <Link href="/" style={{ color: 'var(--text-gray)' }}>Home</Link>
              <span>›</span>
              {sport && <Link href={`/${sport.slug}`} style={{ color: 'var(--text-gray)' }}>{sport.name}</Link>}
              {sport && <span>›</span>}
              {event.leagueSlug ? (
                <Link href={`/${event.sport}/${event.leagueSlug}`} style={{ color: 'var(--text-gray)' }}>{event.league}</Link>
              ) : (
                <span style={{ color: 'var(--text-gray)' }}>{event.league}</span>
              )}
              <span>›</span>
              <span style={{ color: 'var(--text-dark)', fontWeight: 600 }}>{event.eventName}</span>
            </nav>

            {/* Icon + badge + H1 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '14px',
                  background: 'var(--light-gray)',
                  border: '1px solid var(--border-gray)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  flexShrink: 0,
                }}
              >
                {sport?.icon ?? '🎫'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <span
                    style={{
                      background: 'var(--primary-light)',
                      color: 'var(--primary-dark)',
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '3px 12px',
                      borderRadius: '100px',
                    }}
                  >
                    {event.league}
                  </span>
                  <span
                    style={{
                      background: availStyle.bg,
                      color: availStyle.color,
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '3px 12px',
                      borderRadius: '100px',
                    }}
                  >
                    {availStyle.label}
                  </span>
                </div>
                <h1
                  style={{
                    fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                    fontSize: '32px',
                    fontWeight: 800,
                    color: 'var(--text-dark)',
                    lineHeight: 1.2,
                    margin: 0,
                  }}
                  className="ticket-page-h1"
                >
                  {event.eventName}
                </h1>
              </div>
            </div>

            {/* Meta row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '14px', color: 'var(--text-gray)', alignItems: 'center' }}>
                <span>📅 {formatDate(event.date)} · {event.time}</span>
                <span>📍 {event.venue}, {event.city}</span>
                <span>🏆 {event.league}</span>
              </div>
              {!isSoldOut && (
                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-gray)' }}>Tickets from</span>
                  <span
                    style={{
                      fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                      fontSize: '30px',
                      fontWeight: 800,
                      color: 'var(--primary)',
                      lineHeight: 1,
                    }}
                  >
                    {formatPrice(event.minPrice, event.currency)}
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 40px 80px' }} className="ticket-page-inner">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }} className="ticket-page-grid">

            {/* ── Left column ── */}
            <div>

              {/* Compare Prices */}
              <h2
                style={{
                  fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--text-dark)',
                  marginBottom: '16px',
                }}
              >
                Compare Ticket Prices
              </h2>

              {isSoldOut ? (
                <div
                  style={{
                    background: 'var(--white)',
                    border: '1px solid var(--border-gray)',
                    borderRadius: '12px',
                    padding: '48px',
                    textAlign: 'center',
                    marginBottom: '40px',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '12px' }}>😔</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '8px' }}>
                    Sold Out
                  </h3>
                  <p style={{ color: 'var(--text-gray)', fontSize: '14px' }}>
                    All tickets for this event have sold out. Check back for any resales.
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px' }}>
                    {event.partners
                      .sort((a, b) => a.price - b.price)
                      .map((partner, idx) => (
                        <a
                          key={partner.partnerId}
                          href={partner.awDeepLink ?? `/partners/${partner.partnerId}`}
                          target={partner.awDeepLink ? '_blank' : undefined}
                          rel={partner.awDeepLink ? 'noopener noreferrer sponsored' : undefined}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'var(--white)',
                            border: idx === 0 ? '2px solid var(--primary)' : '1px solid var(--border-gray)',
                            borderRadius: '12px',
                            padding: '20px 24px',
                            textDecoration: 'none',
                            transition: 'all .2s',
                            position: 'relative',
                          }}
                          className="partner-compare-row"
                        >
                          {idx === 0 && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '-1px',
                                left: '20px',
                                background: 'var(--primary)',
                                color: '#fff',
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '3px 10px',
                                borderRadius: '0 0 6px 6px',
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                              }}
                            >
                              Best Price
                            </div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            {partner.awImageUrl ? (
                              <img
                                src={partner.awImageUrl}
                                alt={partner.partnerName}
                                width={44}
                                height={44}
                                style={{ borderRadius: '8px', objectFit: 'cover', border: '1px solid var(--border-gray)', flexShrink: 0 }}
                              />
                            ) : (
                              <span style={{ fontSize: '28px' }}>{partner.partnerIcon}</span>
                            )}
                            <div>
                              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-dark)' }}>
                                {partner.partnerName}
                              </div>
                              {partner.tag && (
                                <div style={{ fontSize: '12px', color: 'var(--text-gray)', marginTop: '2px' }}>
                                  {partner.tag}
                                </div>
                              )}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ textAlign: 'right' }}>
                              <div
                                style={{
                                  fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                                  fontSize: '28px',
                                  fontWeight: 700,
                                  color: idx === 0 ? 'var(--primary)' : 'var(--text-dark)',
                                  lineHeight: 1,
                                }}
                              >
                                {formatPrice(partner.price, event.currency)}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text-gray)', marginTop: '3px' }}>
                                per ticket{event.currency ? ` · ${event.currency}` : ''}
                              </div>
                            </div>
                            <div
                              style={{
                                background: idx === 0 ? 'var(--primary)' : 'var(--light-gray)',
                                color: idx === 0 ? '#fff' : 'var(--text-dark)',
                                fontSize: '13px',
                                fontWeight: 600,
                                padding: '10px 20px',
                                borderRadius: '8px',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              Buy Now →
                            </div>
                          </div>
                        </a>
                      ))}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-gray)', marginBottom: '40px', lineHeight: 1.7 }}>
                    Prices are indicative and may change. TicketNexus earns an affiliate commission on purchases via partner links. See our{' '}
                    <Link href="/company/affiliate-disclosure" style={{ color: 'var(--primary)' }}>Affiliate Disclosure</Link>.
                  </p>
                </>
              )}

              {/* ── Event Overview ── */}
              <div
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--border-gray)',
                  borderRadius: '12px',
                  padding: '32px',
                  marginBottom: '40px',
                }}
              >
                <h2
                  style={{
                    fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--text-dark)',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <span>📋</span> Event Overview
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[overviewPara1, overviewPara2, overviewPara3].map((para, i) => (
                    <p key={i} style={{ fontSize: '15px', color: 'var(--text-gray)', lineHeight: 1.8, margin: 0 }}>
                      {para}
                    </p>
                  ))}
                </div>

                {/* Quick facts grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '16px',
                    marginTop: '24px',
                    paddingTop: '24px',
                    borderTop: '1px solid var(--border-gray)',
                  }}
                  className="overview-facts-grid"
                >
                  {[
                    { label: 'Date', value: formatDate(event.date) },
                    { label: 'Kick-off', value: event.time },
                    { label: 'Venue', value: event.venue },
                    { label: 'City', value: event.city },
                    { label: 'Competition', value: event.league },
                    { label: 'From', value: isSoldOut ? 'Sold Out' : formatPrice(event.minPrice, event.currency) },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div style={{ fontSize: '11px', color: 'var(--text-gray)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                        {label}
                      </div>
                      <div style={{ fontSize: '14px', color: 'var(--text-dark)', fontWeight: 600 }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Related Matches ── */}
              {relatedEvents.length > 0 && (
                <div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                      fontSize: '20px',
                      fontWeight: 700,
                      color: 'var(--text-dark)',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span>🎟️</span> Related Matches
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {relatedEvents.map((rel) => {
                      const relSport = getSportBySlug(rel.sport);
                      const relSoldOut = rel.availability === 'sold-out';
                      const relAvail = {
                        high: { label: 'Available', color: 'var(--primary)' },
                        low: { label: 'Limited', color: 'var(--orange)' },
                        'sold-out': { label: 'Sold Out', color: 'var(--text-gray)' },
                      }[rel.availability];
                      return (
                        <Link
                          key={rel.id}
                          href={`/tickets/${toTicketSlug(rel)}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            background: 'var(--white)',
                            border: '1px solid var(--border-gray)',
                            borderRadius: '10px',
                            padding: '16px 20px',
                            textDecoration: 'none',
                            transition: 'all .2s',
                          }}
                          className="related-match-row"
                        >
                          <div
                            style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '10px',
                              background: 'var(--light-gray)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '20px',
                              flexShrink: 0,
                            }}
                          >
                            {relSport?.icon ?? '🎫'}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {rel.eventName}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-gray)', marginTop: '2px' }}>
                              {formatShortDate(rel.date)} · {rel.venue}
                            </div>
                          </div>
                          <div style={{ flexShrink: 0, textAlign: 'right' }}>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: relSoldOut ? 'var(--text-gray)' : 'var(--primary)' }}>
                              {relSoldOut ? 'Sold Out' : formatPrice(rel.minPrice, rel.currency)}
                            </div>
                            <div style={{ fontSize: '11px', color: relAvail.color, marginTop: '2px', fontWeight: 600 }}>
                              {relAvail.label}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* ── Right: sticky event card ── */}
            <div>
              <div
                style={{
                  background: 'var(--white)',
                  border: '1px solid var(--border-gray)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'sticky',
                  top: 'calc(var(--nav-h) + 20px)',
                }}
              >
                <div
                  style={{
                    padding: '18px 20px',
                    borderBottom: '1px solid var(--border-gray)',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--text-dark)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Event Details
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { icon: '📅', label: 'Date', value: formatDate(event.date) },
                    { icon: '🕐', label: 'Kick-off', value: event.time },
                    { icon: '🏟️', label: 'Venue', value: event.venue },
                    { icon: '📍', label: 'City', value: event.city },
                    { icon: '🏆', label: 'Competition', value: event.league },
                  ].map(({ icon, label, value }) => (
                    <div key={label} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '16px', marginTop: '1px' }}>{icon}</span>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--text-gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {label}
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--text-dark)', fontWeight: 500, marginTop: '2px' }}>
                          {value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {!isSoldOut && (
                  <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-gray)', background: 'var(--primary-light)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--primary-dark)', fontWeight: 600, marginBottom: '4px' }}>
                      Best available price
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                        fontSize: '32px',
                        fontWeight: 800,
                        color: 'var(--primary)',
                        lineHeight: 1,
                        marginBottom: '12px',
                      }}
                    >
                      {formatPrice(event.minPrice, event.currency)}
                    </div>
                    <a
                      href="#compare"
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        background: 'var(--primary)',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 700,
                        padding: '12px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                      }}
                    >
                      Compare All Prices →
                    </a>
                  </div>
                )}

                {sport && (
                  <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-gray)' }}>
                    <Link
                      href={`/${sport.slug}`}
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        background: 'var(--light-gray)',
                        color: 'var(--text-dark)',
                        fontSize: '13px',
                        fontWeight: 600,
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-gray)',
                      }}
                    >
                      ← More {sport.name} Tickets
                    </Link>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
