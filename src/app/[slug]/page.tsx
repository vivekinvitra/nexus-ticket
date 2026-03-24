import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CategoryContent from '@/components/category/CategoryContent';
import { SPORTS, getSportBySlug } from '@/lib/data/sports';
import { getEventsBySport } from '@/lib/data/tickets';
import { getNewsByCategory } from '@/lib/data/news';
import { buildMetadata, buildSportsEventsListJsonLd, SITE_URL } from '@/lib/utils/seo';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return SPORTS.map((sport) => ({ slug: sport.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sport = getSportBySlug(params.slug);
  if (!sport) return {};
  return buildMetadata({
    title: sport.metaTitle ?? `${sport.name} Tickets`,
    description: sport.metaDescription ?? sport.description,
    keywords: sport.metaKeywords,
    path: `/${sport.slug}`,
  });
}

const SPORT_WIKI_URLS: Record<string, string> = {
  football: 'https://en.wikipedia.org/wiki/Association_football',
  tennis: 'https://en.wikipedia.org/wiki/Tennis',
  cricket: 'https://en.wikipedia.org/wiki/Cricket',
  'horse-racing': 'https://en.wikipedia.org/wiki/Horse_racing',
  boxing: 'https://en.wikipedia.org/wiki/Boxing',
  'formula-1': 'https://en.wikipedia.org/wiki/Formula_One',
  rugby: 'https://en.wikipedia.org/wiki/Rugby_union',
  golf: 'https://en.wikipedia.org/wiki/Golf',
};

export default function CategoryPage({ params }: Props) {
  const sport = getSportBySlug(params.slug);
  if (!sport) notFound();

  const today = new Date().toISOString().split('T')[0];
  const upcomingEvents = getEventsBySport(sport.slug)
    .filter((e) => e.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 12);

  const eventsJsonLd = buildSportsEventsListJsonLd({
    listName: `Upcoming ${sport.name} Events`,
    description: sport.metaDescription ?? sport.description,
    pageUrl: `${SITE_URL}/${sport.slug}`,
    sportWikiUrl: SPORT_WIKI_URLS[sport.slug],
    events: upcomingEvents,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsJsonLd) }}
      />
      <Header />

      <main>
        {/* Category hero */}
        <div
          style={{
            background: 'var(--white)',
            borderBottom: '1px solid var(--border-gray)',
          }}
        >
          <div
            className="page-px sport-hero-inner"
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              paddingTop: '40px',
              paddingBottom: '32px',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}
            >
              <a
                href="/"
                style={{ fontSize: '13px', color: 'var(--text-gray)', textDecoration: 'none' }}
              >
                Home
              </a>
              <span style={{ color: 'var(--text-gray)', fontSize: '13px' }}>›</span>
              <span
                style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}
              >
                {sport.name}
              </span>
            </div>

            <div className="sport-hero-body">
              {/* Icon */}
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '16px',
                  background: 'var(--light-gray)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  flexShrink: 0,
                }}
              >
                {sport.icon}
              </div>

              {/* Title + description */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h1
                  className="sport-h1"
                  style={{
                    fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                    fontSize: '36px',
                    fontWeight: 700,
                    color: 'var(--text-dark)',
                    marginBottom: '6px',
                    marginTop: 0,
                  }}
                >
                  {sport.name} Tickets
                </h1>
                <p className="sport-hero-desc" style={{ fontSize: '16px', color: 'var(--text-gray)', maxWidth: '600px', margin: 0 }}>
                  {sport.description}
                </p>
              </div>

              {/* Badge */}
              <div className="sport-hero-badge">
                <div
                  style={{
                    background: 'var(--primary-light)',
                    color: 'var(--primary-dark)',
                    fontSize: '13px',
                    fontWeight: 600,
                    padding: '6px 14px',
                    borderRadius: '100px',
                    display: 'inline-block',
                  }}
                >
                  {sport.count} events listed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className="page-px sport-content-inner"
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            paddingTop: '32px',
            paddingBottom: '60px',
          }}
        >
          <CategoryContent
            sport={sport}
            allEvents={getEventsBySport(sport.slug)}
            newsArticles={getNewsByCategory(sport.slug)}
            today={today}
          />
        </div>
      </main>

      <Footer />
    </>
  );
}
