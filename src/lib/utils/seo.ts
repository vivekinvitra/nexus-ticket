import type { Metadata } from 'next';

const SITE_NAME = 'TicketNexus';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ticket-nexus.com';
const SITE_DESC =
  'Compare sports ticket prices from the UK\'s top resale platforms. Find the best deals on football, cricket, horse racing, tennis, boxing, F1, rugby and golf tickets.';

export function buildMetadata(opts: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const { title, description = SITE_DESC, path = '', image } = opts;
  const url = `${SITE_URL}${path}`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'en_GB',
      type: 'website',
      ...(image ? { images: [{ url: image, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}

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
