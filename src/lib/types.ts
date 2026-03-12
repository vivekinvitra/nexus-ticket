// ══════════════════════════════════════════════════
//  Core Types for TicketNexus
// ══════════════════════════════════════════════════

export type SportSlug =
  | 'football'
  | 'tennis'
  | 'cricket'
  | 'horse-racing'
  | 'boxing'
  | 'american-football'
  | 'athletics'
  | 'badminton'
  | 'baseball'
  | 'basketball'
  | 'beach-volleyball'
  | 'cycling'
  | 'darts'
  | 'equestrian'
  | 'esports'
  | 'figure-skating'
  | 'formula-1'
  | 'golf'
  | 'gymnastics'
  | 'ice-hockey'
  | 'motorsports'
  | 'moto-gp'
  | 'rugby'
  | 'swimming'
  | 'table-tennis'
  | 'volleyball'
  | 'winter-sports'
  | 'wrestling';

export type AvailabilityStatus = 'high' | 'low' | 'sold-out';

export interface TicketEvent {
  id: string;
  slug: string;        // URL slug e.g. 'manchester-united-vs-arsenal-2025-03-15'
  sport: SportSlug;
  eventName: string;
  league: string;
  leagueSlug?: string;  // subcategory slug e.g. 'fifa-world-cup'
  date: string;        // ISO date string
  time: string;
  venue: string;
  city: string;
  availability: AvailabilityStatus;
  minPrice: number;
  featured?: boolean;
  description?: string;
  imageUrl?: string;
  partners: TicketPartnerPrice[];
}

export interface LeagueCategory {
  slug: string;
  name: string;
  sportSlug: SportSlug;
  sportName: string;
  icon: string;
  color: string;
  bg: string;
  imageUrl: string;
  description: string;
  longDescription: string;
  count: number;
  matchesLabel: string;
  featured?: boolean;
  country: string;
  heroBg: string;
  location: string;
  date: string;
  month: string;
  day: string;
  dayLabel: string;
}

export interface TicketPartnerPrice {
  partnerId: string;
  partnerName: string;
  partnerIcon: string;
  price: number;
  tag?: string;
  isBest?: boolean;
}

export interface Partner {
  id: string;
  slug: string;
  name: string;
  icon: string;
  rating: number;
  reviewCount: number;
  description: string;
  shortDesc: string;
  features: string[];
  specialties: SportSlug[];
  pros: string[];
  cons: string[];
  paymentMethods: string[];
  deliveryOptions: string[];
  founded: number;
  website: string;
}

export interface NewsSection {
  h2: string;
  body: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  snippet: string;
  category: SportSlug | 'general';
  icon: string;
  author: string;
  authorAvatar: string;
  publishedAt: string;
  readTime: number;
  imageUrl: string;
  imageCaption: string;
  keyPoints: string[];
  featured?: boolean;
  metaTitle: string;
  metaDescription: string;
  content: NewsSection[];
}

export interface SportCategory {
  slug: SportSlug;
  name: string;
  icon: string;
  count: number;
  description: string;
  color: string;
  isFeatured?: boolean;
}

export interface LegalPage {
  slug: string;
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export interface LegalSection {
  heading: string;
  content: string;
}
