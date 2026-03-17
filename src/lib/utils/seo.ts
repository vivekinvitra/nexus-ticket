import type { Metadata } from 'next';

const SITE_NAME = 'TicketNexus';
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ticket-nexus.com').replace(/\/$/, '');
const SITE_DESC =
  "Compare sports ticket prices from the UK's top resale platforms. Find the best deals on football, cricket, horse racing, tennis, boxing, F1, rugby and golf tickets.";
const TWITTER_HANDLE = '@ticketnexus';

interface MetadataOpts {
  title: string;
  description?: string;
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
    title: `${title} | ${SITE_NAME}`,
    description,
    metadataBase: new URL(SITE_URL),

    // ── Canonical ─────────────────────────────────────────────────────────
    alternates: { canonical: canonicalUrl },

    // ── Robots ────────────────────────────────────────────────────────────
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, 'max-image-preview': 'large' },

    // ── OpenGraph ─────────────────────────────────────────────────────────
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

    // ── Twitter / X ────────────────────────────────────────────────────────
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

export { SITE_URL, SITE_NAME };
