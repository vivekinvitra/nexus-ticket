import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CLEAN_EVENTS, getEventBySlug, getRelatedEvents, toTicketSlug } from '@/lib/data/tickets';
import { getSportBySlug } from '@/lib/data/sports';
import { getNewsByCategory } from '@/lib/data/news';
import { buildMetadata, SITE_URL } from '@/lib/utils/seo';
import { newsImageVariant } from '@/lib/config/api';
import { formatPrice, formatDate, formatShortDate } from '@/lib/utils/format';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CLEAN_EVENTS.map((e) => ({ slug: toTicketSlug(e) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};

  const autoTitle = `${event.eventName} - ${event.league} Tickets — ${formatDate(event.date)}`;
  const autoDesc = event.description
    ? event.description.slice(0, 160)
    : `Buy ${event.eventName} tickets at ${event.venue}, ${event.city} on ${formatDate(event.date)}. Compare prices from trusted platforms. From ${formatPrice(event.minPrice, event.currency)}.`;
  const autoKeywords = [
    `${event.eventName} tickets`,
    `buy ${event.eventName} tickets`,
    `${event.league} tickets`,
    `${event.venue} tickets`,
    `${event.city} sports tickets`,
    `${event.league} ${formatDate(event.date)}`,
  ].join(', ');

  return buildMetadata({
    title: event.metaTitle ?? autoTitle,
    description: event.metaDescription ?? autoDesc,
    keywords: event.metaKeywords ?? autoKeywords,
    path: `/tickets/${slug}`,
    image: event.imageUrl,
  });
}

export default async function TicketPage({ params }: Props) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  const sport = getSportBySlug(event.sport);
  const isSoldOut = event.availability === 'sold-out';
  const relatedEvents = getRelatedEvents(event, 3);
  const allCategoryNews = await getNewsByCategory(event.sport);
  const relatedNews = event.leagueSlug
    ? allCategoryNews.filter((a) => a.leagueSlug === event.leagueSlug).slice(0, 3)
    : allCategoryNews.slice(0, 3);

  const availStyle = {
    high: { label: 'Available', color: 'var(--primary)', bg: 'var(--primary-light)' },
    low: { label: 'Limited Seats', color: 'var(--orange)', bg: 'var(--orange-light)' },
    'sold-out': { label: 'Sold Out', color: 'var(--text-gray)', bg: 'var(--light-gray)' },
  }[event.availability];

  // Schema.org Event JSON-LD
  const eventPageUrl = `${SITE_URL}/tickets/${slug}`;
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
  const [homeTeam, awayTeam] = event.eventName.includes(' vs ')
    ? event.eventName.split(' vs ').map((t) => t.trim())
    : [event.eventName, ''];
  const sportLabel = sport?.name ?? event.sport;

  const faqs = [
    {
      q: `Where can I buy ${event.eventName} tickets?`,
      a: `You can buy ${homeTeam} vs ${awayTeam} tickets through the verified resale platforms listed on this page. TicketNexus compares prices across all major ticket sellers so you can find the best deal for the ${event.league} match in one place.`,
    },
    {
      q: `How much are ${homeTeam} tickets?`,
      a: isSoldOut
        ? `Tickets for this ${homeTeam} match are currently sold out. Check back regularly as resale listings can appear at any time.`
        : `${homeTeam} tickets for this ${event.league} fixture start from ${formatPrice(event.minPrice, event.currency)}. Prices vary by seat category, platform, and how close to the event date you purchase.`,
    },
    {
      q: `How much are ${awayTeam} tickets?`,
      a: isSoldOut
        ? `Tickets for this ${awayTeam} away match are currently sold out. Check back regularly as resale listings can appear at any time.`
        : `${awayTeam} away tickets for this ${event.league} fixture start from ${formatPrice(event.minPrice, event.currency)}. Away ticket prices can vary — compare across our listed platforms to secure the best available deal.`,
    },
    {
      q: `Is it safe to buy resale ${sportLabel} tickets?`,
      a: `Yes — when purchased through reputable resale platforms. Every partner listed on TicketNexus is a verified seller that guarantees 100% authentic tickets and buyer protection. Always purchase through trusted platforms and avoid private sellers or social media listings.`,
    },
    {
      q: `Can I get a refund if ${event.eventName} is cancelled?`,
      a: `If the event is officially cancelled, most partner platforms offer a full refund to your original payment method. For postponed events, policies vary by platform — always check the seller's terms at the time of purchase.`,
    },
  ];

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  // SportsEvent schema
  const sportsEventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: event.eventName,
    description: event.description ?? overviewPara1,
    ...(absoluteImage ? { image: absoluteImage } : {}),
    startDate: `${event.date}T${event.time}:00`,
    url: eventPageUrl,
    location: {
      '@type': 'Place',
      name: event.venue,
      address: { '@type': 'PostalAddress', addressLocality: event.city },
    },
    organizer: { '@type': 'Organization', name: event.league },
    competitor: [
      { '@type': 'SportsTeam', name: homeTeam },
      ...(awayTeam ? [{ '@type': 'SportsTeam', name: awayTeam }] : []),
    ],
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

  // BreadcrumbList schema
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      ...(sport ? [{ '@type': 'ListItem', position: 2, name: sport.name, item: `${SITE_URL}/${sport.slug}` }] : []),
      ...(event.leagueSlug
        ? [{ '@type': 'ListItem', position: sport ? 3 : 2, name: event.league, item: `${SITE_URL}/${event.sport}/${event.leagueSlug}` }]
        : [{ '@type': 'ListItem', position: sport ? 3 : 2, name: event.league }]),
      { '@type': 'ListItem', position: sport ? 4 : 3, name: event.eventName, item: eventPageUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsEventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />

      <main style={{ background: 'var(--off-white)', minHeight: '100vh', overflowX: 'hidden' }}>

        {/* ── Page header ── */}
        <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border-gray)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 40px 28px' }} className="ticket-page-inner ticket-page-header-inner">

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
                className="ticket-hero-icon"
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
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                  }}
                  className="ticket-page-h1"
                >
                  {event.eventName} Tickets
                </h1>
              </div>
            </div>

            {/* Meta row */}
            <div className="ticket-meta-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '8px 16px', flexWrap: 'wrap', fontSize: '14px', color: 'var(--text-gray)', alignItems: 'center', minWidth: 0 }}>
                <span style={{ whiteSpace: 'nowrap' }}>📅 {formatDate(event.date)} · {event.time}</span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>📍 {event.venue}, {event.city}</span>
                <span style={{ whiteSpace: 'nowrap' }}>🏆 {event.league}</span>
              </div>
              {!isSoldOut && (
                <div className="ticket-meta-price" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              {/* <h2
                style={{
                  fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--text-dark)',
                  marginBottom: '16px',
                }}
              >
                Compare Ticket Prices
              </h2> */}

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
                          <div className="partner-compare-left" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
                          <div className="partner-compare-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div className="partner-price-wrap" style={{ textAlign: 'right' }}>
                              <div
                                className="partner-compare-price"
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
                              className="partner-buy-btn"
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
                className="ticket-overview-panel"
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
                  <span>📋</span> How to buy {event.eventName} {event.league} tickets
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {[overviewPara1, overviewPara2, overviewPara3].map((para, i) => (
                    <p key={i} style={{ fontSize: '15px', color: 'var(--text-gray)', lineHeight: 1.8, margin: 0 }}>
                      {para}
                    </p>
                  ))}
                </div>

                {/* Event date table */}
                <div style={{ marginTop: '28px', paddingTop: '24px' }}>
                  <h2
                    style={{
                      fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                      fontSize: '20px',
                      fontWeight: 700,
                      color: 'var(--text-dark)',
                      marginBottom: '16px',
                    }}
                  >
                    When is the {event.eventName} {event.league}?
                  </h2>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <tbody>
                      {[
                        { label: 'Date', value: formatDate(event.date) },
                        { label: 'Kick-off', value: event.time },
                        { label: 'Venue', value: event.venue },
                        { label: 'City', value: event.city },
                        { label: 'Competition', value: event.league },
                        { label: 'Tickets from', value: isSoldOut ? 'Sold Out' : formatPrice(event.minPrice, event.currency) },
                      ].map(({ label, value }) => (
                        <tr
                          key={label}
                          style={{ borderBottom: '1px solid var(--border-gray)' }}
                        >
                          <td
                            style={{
                              padding: '10px 12px 10px 0',
                              fontWeight: 700,
                              color: 'var(--text-gray)',
                              textTransform: 'uppercase',
                              fontSize: '11px',
                              letterSpacing: '0.05em',
                              width: '140px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {label}
                          </td>
                          <td
                            style={{
                              padding: '10px 0',
                              fontWeight: 600,
                              color: 'var(--text-dark)',
                            }}
                          >
                            {value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Buy Tickets CTA ── */}
              {!isSoldOut && (() => {
                const bestP = [...event.partners].sort((a, b) => a.price - b.price)[0];
                if (!bestP) return null;
                return (
                  <div style={{ marginBottom: '32px' }}>
                    <a
                      href={bestP.awDeepLink ?? `/partners/${bestP.partnerId}`}
                      target={bestP.awDeepLink ? '_blank' : undefined}
                      rel={bestP.awDeepLink ? 'noopener noreferrer sponsored' : undefined}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        background: 'var(--primary-dark)',
                        borderRadius: '12px',
                        padding: '20px 24px',
                        textDecoration: 'none',
                      }}
                    >
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '10px',
                          background: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '24px',
                          flexShrink: 0,
                        }}
                      >
                        {sport?.icon ?? '🎫'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                            fontSize: '15px',
                            fontWeight: 700,
                            color: '#ffffff',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {event.eventName}
                        </div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginTop: '2px', fontWeight: 500 }}>
                          {event.league}
                        </div>
                        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', marginTop: '4px', fontWeight: 600 }}>
                          tickets starts from {formatPrice(bestP.price, event.currency)}
                        </div>
                      </div>
                      <div
                        style={{
                          flexShrink: 0,
                          background: 'transparent',
                          border: '2px solid var(--primary)',
                          borderRadius: '50px',
                          padding: '10px 24px',
                          fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                          fontSize: '14px',
                          fontWeight: 700,
                          color: '#ffffff',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Buy now
                      </div>
                    </a>
                  </div>
                );
              })()}

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

              {/* ── FAQs ── */}
              <div style={{ marginTop: '40px' }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'var(--text-dark)',
                    marginBottom: '20px',
                  }}
                >
                  Frequently Asked Questions
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {faqs.map((faq, i) => (
                    <details
                      key={i}
                      style={{
                        background: 'var(--white)',
                        border: '1px solid var(--border-gray)',
                        borderRadius: '10px',
                        padding: '16px 20px',
                      }}
                    >
                      <summary
                        style={{
                          fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                          fontSize: '15px',
                          fontWeight: 600,
                          color: 'var(--text-dark)',
                          cursor: 'pointer',
                          listStyle: 'none',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        {faq.q}
                        <span style={{ fontSize: '18px', flexShrink: 0, color: 'var(--text-gray)' }}>+</span>
                      </summary>
                      <p
                        style={{
                          marginTop: '12px',
                          fontSize: '14px',
                          color: 'var(--text-gray)',
                          lineHeight: '1.65',
                          marginBottom: 0,
                        }}
                      >
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>

              {/* ── Related News ── */}
              {relatedNews.length > 0 && (
                <div style={{ marginTop: '40px' }}>
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
                    <span>📰</span> Related News
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {relatedNews.map((article) => (
                      <Link
                        key={article.id}
                        href={`/news/${article.slug}`}
                        style={{
                          display: 'flex',
                          gap: '16px',
                          alignItems: 'flex-start',
                          background: 'var(--white)',
                          border: '1px solid var(--border-gray)',
                          borderRadius: '10px',
                          padding: '16px',
                          textDecoration: 'none',
                          transition: 'all .2s',
                        }}
                        className="related-news-row"
                      >
                        <div
                          style={{
                            width: '80px',
                            height: '60px',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            position: 'relative',
                            background: 'var(--light-gray)',
                          }}
                        >
                          <img
                            src={newsImageVariant(article.imageUrl, 'w=80')}
                            alt={article.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                            {article.readTime} min read
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {article.title}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-gray)', marginTop: '4px' }}>
                            {article.author}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* ── Right: sticky event card ── */}
            <div>
              <div
                className="ticket-sidebar-card"
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
