import type { Metadata } from 'next';

const SITE_NAME = 'Ticket-Nexus';
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ticket-nexus.com').replace(/\/$/, '');
const SITE_DESC =
  "Book sports tickets online for FIFA World Cup 2026, Champions League, Premier League & cricket matches. Secure checkout, best deals and Best prices, secure booking & instant confirmation on Ticket Nexus.";
export const SITE_keywords = "FIFA World Cup 2026 tickets, UEFA Champions League 2026 tickets, Premier League 2026 tickets online, cricket match 2026 tickets, football match tickets, sports tickets, buy FIFA 2026 tickets online, international sports tickets, sports event tickets, premium sports tickets, online ticket booking sports, global sports tickets, secure sports tickets";
  const TWITTER_HANDLE = '@ticketnexus';

interface MetadataOpts {
  title: string;
  description?: string;
  keywords?: string;
  /** Relative path, e.g. "/football/premier-league" */
  path?: string;
  /** Local path (/images/...) or absolute URL */
  image?: string;
  /** OpenGraph type — defaults to "website", use "article" for news pages */
  type?: 'website' | 'article';
  /** ISO date string, required when type="article" */
  publishedTime?: string;
  /** ISO date string */
  modifiedTime?: string;
  /** Prevent indexing of private / low-value pages */
  noIndex?: boolean;
}

export function buildMetadata(opts: MetadataOpts): Metadata {
  const {
    title,
    description = SITE_DESC,
    keywords,
    path = '',
    image,
    type = 'website',
    publishedTime,
    modifiedTime,
    noIndex = false,
  } = opts;

  const canonicalUrl = `${SITE_URL}${path}`;

  // Resolve local image paths to absolute URLs for OG tags
  const ogImage = image
    ? image.startsWith('http')
      ? image
      : `${SITE_URL}${image}`
    : undefined;

  return {
    // ── 1. Title ──────────────────────────────────────────────────────────
    title: `${title} | ${SITE_NAME}`,

    // ── 2. Meta description ───────────────────────────────────────────────
    description,

    // ── 3. Meta keywords ──────────────────────────────────────────────────
    ...(keywords ? { keywords } : {}),

    // ── 4. Canonical ──────────────────────────────────────────────────────
    alternates: { canonical: canonicalUrl },

    // ── 5. Robots ─────────────────────────────────────────────────────────
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-image-preview': 'large' },

    // ── 6. Base URL (required for resolving relative OG image paths) ───────
    metadataBase: new URL(SITE_URL),

    // ── 7. OpenGraph ──────────────────────────────────────────────────────
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: 'en_GB',
      type,
      ...(ogImage
        ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] }
        : {}),
      ...(type === 'article' && publishedTime ? { publishedTime } : {}),
      ...(type === 'article' && modifiedTime ? { modifiedTime } : {}),
    },

    // ── 8. Twitter / X ────────────────────────────────────────────────────
    twitter: {
      card: 'summary_large_image',
      site: TWITTER_HANDLE,
      title: `${title} | ${SITE_NAME}`,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

// ── JSON-LD helpers ───────────────────────────────────────────────────────────

export function buildSportJsonLd(sport: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${sport} Tickets`,
    description,
    url,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: `${sport} Tickets`, item: url },
      ],
    },
  };
}

export function buildEventJsonLd(opts: {
  name: string;
  description: string;
  startDate: string;
  location: string;
  url: string;
  image?: string;
  minPrice?: number;
  currency?: string;
}) {
  const { name, description, startDate, location, url, image, minPrice, currency } = opts;
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    description,
    startDate,
    location: { '@type': 'Place', name: location },
    url,
    ...(image ? { image: image.startsWith('http') ? image : `${SITE_URL}${image}` } : {}),
    ...(minPrice != null
      ? {
          offers: {
            '@type': 'AggregateOffer',
            lowPrice: minPrice,
            priceCurrency: currency || 'GBP',
            availability: 'https://schema.org/InStock',
            url,
          },
        }
      : {}),
  };
}

export function buildArticleJsonLd(opts: {
  title: string;
  description: string;
  publishedAt: string;
  author: string;
  url: string;
  image?: string;
}) {
  const { title, description, publishedAt, author, url, image } = opts;
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    datePublished: publishedAt,
    author: { '@type': 'Person', name: author },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(image ? { image: image.startsWith('http') ? image : `${SITE_URL}${image}` } : {}),
  };
}

export function buildSportsEventsListJsonLd(opts: {
  listName: string;
  description: string;
  pageUrl: string;
  sportWikiUrl?: string;
  events: Array<{
    slug: string;
    eventName: string;
    description?: string;
    date: string;
    time?: string;
    venue: string;
    city?: string;
    imageUrl?: string;
    minPrice?: number;
    currency?: string;
  }>;
}) {
  const { listName, description, pageUrl, events } = opts;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    description,
    url: pageUrl,
    numberOfItems: events.length,
    itemListElement: events.map((event, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/tickets/${event.slug}`,
      name: event.eventName,
    })),
  };
}

export function buildFootballEventsListJsonLd(
  events: Array<{
    slug: string;
    eventName: string;
    description?: string;
    date: string;
    time?: string;
    venue: string;
    city?: string;
    imageUrl?: string;
    minPrice?: number;
    currency?: string;
  }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Upcoming Football Events',
    description: 'Buy tickets for upcoming Premier League and football events. Compare prices from trusted resale platforms.',
    url: SITE_URL,
    numberOfItems: events.length,
    itemListElement: events.map((event, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/tickets/${event.slug}`,
      name: event.eventName,
    })),
  };
}

export { SITE_URL, SITE_NAME };
