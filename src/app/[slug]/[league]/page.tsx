import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TicketTable from '@/components/tickets/TicketTable';
import { LEAGUES, getLeagueBySlug, getLeaguesBySport } from '@/lib/data/leagues';
import { SPORTS, getSportBySlug } from '@/lib/data/sports';
import { getEventsByLeague } from '@/lib/data/tickets';
import { buildMetadata } from '@/lib/utils/seo';

interface Props {
  params: { slug: string; league: string };
}

export async function generateStaticParams() {
  return LEAGUES.map((l) => ({ slug: l.sportSlug, league: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const league = getLeagueBySlug(params.league);
  const sport = getSportBySlug(params.slug);
  if (!league || !sport) return {};
  return buildMetadata({
    title: `${league.name} Tickets`,
    description: league.description,
    path: `/${sport.slug}/${league.slug}`,
  });
}

export default function LeaguePage({ params }: Props) {
  const sport = getSportBySlug(params.slug);
  const league = getLeagueBySlug(params.league);

  if (!sport || !league || league.sportSlug !== sport.slug) notFound();

  const events = getEventsByLeague(league.slug);
  const siblingLeagues = getLeaguesBySport(sport.slug).filter((l) => l.slug !== league.slug);

  return (
    <>
      <Header />

      <main>
        {/* League Hero */}
        <div
          style={{
            position: 'relative',
            background: league.bg,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
          }}
        >
          {/* Banner image with dark overlay */}
          <img
            src={league.imageUrl}
            alt={league.name}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              opacity: 0.25,
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '40px 40px 36px',
            }}
          >
            {/* Breadcrumb */}
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}
            >
              <Link
                href="/"
                style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
              >
                Home
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>›</span>
              <Link
                href={`/${sport.slug}`}
                style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}
              >
                {sport.name}
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>›</span>
              <span style={{ fontSize: '13px', color: league.color, fontWeight: 600 }}>
                {league.name}
              </span>
            </div>

            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: 'rgba(255,255,255,0.08)',
                  border: `2px solid ${league.color}50`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '40px',
                  flexShrink: 0,
                }}
              >
                {league.icon}
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: `${league.color}20`,
                    color: league.color,
                    borderRadius: '100px',
                    padding: '4px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    marginBottom: '10px',
                    border: `1px solid ${league.color}40`,
                  }}
                >
                  {sport.icon} {sport.name}
                </div>

                <h1
                  style={{
                    fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                    fontSize: '34px',
                    fontWeight: 800,
                    color: '#ffffff',
                    marginBottom: '10px',
                    lineHeight: 1.15,
                  }}
                >
                  {league.name} Tickets
                </h1>

                <p
                  style={{
                    fontSize: '15px',
                    color: 'rgba(255,255,255,0.6)',
                    maxWidth: '680px',
                    lineHeight: 1.7,
                  }}
                >
                  {league.longDescription}
                </p>
              </div>

              <div style={{ flexShrink: 0, textAlign: 'right' }}>
                <div
                  style={{
                    background: `${league.color}20`,
                    color: league.color,
                    fontSize: '13px',
                    fontWeight: 700,
                    padding: '8px 18px',
                    borderRadius: '100px',
                    border: `1px solid ${league.color}40`,
                    display: 'inline-block',
                    marginBottom: '8px',
                  }}
                >
                  {league.count} events listed
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                  Prices updated every 5 min
                </div>
              </div>
            </div>

            {/* Sibling leagues */}
            {siblingLeagues.length > 0 && (
              <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginRight: '12px' }}>
                  Also in {sport.name}:
                </span>
                {siblingLeagues.map((sl) => (
                  <Link
                    key={sl.slug}
                    href={`/${sport.slug}/${sl.slug}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'rgba(255,255,255,0.06)',
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '12px',
                      fontWeight: 500,
                      padding: '5px 12px',
                      borderRadius: '100px',
                      border: '1px solid rgba(255,255,255,0.1)',
                      marginRight: '8px',
                      textDecoration: 'none',
                    }}
                  >
                    {sl.icon} {sl.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Events */}
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '36px 40px 60px',
          }}
        >
          {events.length > 0 ? (
            <TicketTable
              events={events}
              title={`${league.name} Events`}
              sportIcon={league.icon}
              rounded={true}
            />
          ) : (
            <div
              style={{
                background: 'var(--white)',
                border: '1px solid var(--border-gray)',
                borderRadius: '12px',
                padding: '60px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '60px', marginBottom: '16px' }}>{league.icon}</div>
              <h2
                style={{
                  fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: 'var(--text-dark)',
                  marginBottom: '8px',
                }}
              >
                No {league.name} tickets listed yet
              </h2>
              <p style={{ color: 'var(--text-gray)', fontSize: '15px', marginBottom: '24px' }}>
                Tickets go on sale closer to the event — check back soon or browse all {sport.name} events.
              </p>
              <Link
                href={`/${sport.slug}`}
                style={{
                  background: 'var(--primary)',
                  color: '#fff',
                  padding: '11px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Browse All {sport.name} Tickets
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
