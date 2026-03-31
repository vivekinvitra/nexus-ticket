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
  currency?: string;           // e.g. 'USD' — from Awin feed currency field
  featured?: boolean;
  description?: string;
  imageUrl?: string;
  partners: TicketPartnerPrice[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
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
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
}

export interface TicketPartnerPrice {
  partnerId: string;
  partnerName: string;
  partnerIcon: string;
  price: number;
  tag?: string;
  isBest?: boolean;
  awDeepLink?: string;    // aw_deep_link  — Awin affiliate tracking URL
  awProductId?: string;   // aw_product_id — Awin product identifier
  awImageUrl?: string;    // aw_image_url  — Awin-served product image URL
  dataFeedId?: string;    // data_feed_id  — Awin data feed identifier
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
  merchantId?: string;          // Awin merchant ID
  merchantredirecturl?: string; // Awin merchant redirect URL
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
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
  addedon: string;
  readTime: number;
  imageUrl: string;
  imageCaption: string;
  keyPoints: string[];
  featured?: boolean;
  leagueSlug?: string;
  ticketSlug?: string;   // slug of the matching TicketEvent — links news to /tickets/[slug]
  sportUrl?: string;     // explicit sport page path e.g. '/sports/football'
  leagueUrl?: string;    // explicit league page path e.g. '/leagues/premier-league'
  ticketUrl?: string;    // explicit ticket page path e.g. '/tickets/bournemouth-vs-manchester-united-20260320'
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string;
  content: string;
}

export interface SportCategory {
  slug: SportSlug;
  name: string;
  icon: string;
  count: number;
  description: string;
  color: string;
  isFeatured?: boolean;
  isActive?: 'Y' | 'N';
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
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
