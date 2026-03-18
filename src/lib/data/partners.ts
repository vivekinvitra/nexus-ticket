import type { Partner } from '@/lib/types';

export const PARTNERS: Partner[] = [
  {
    id: 'footballticketnet',
    slug: 'footballticketnet',
    name: 'Football TicketNet US',
    merchantId: '109004',
    icon: '⚽',
    rating: 4.2,
    reviewCount: 48200,
    shortDesc: 'The trusted marketplace for football tickets worldwide.',
    description:
      'FootballTicketNet is a specialist football ticket marketplace offering official and verified tickets for matches across the Premier League, Champions League, international fixtures and more. With a dedicated focus on football, it provides fans with reliable access to some of the most sought-after seats in the game.',
    features: [
      'Specialist football ticket platform',
      'Buyer guarantee on all purchases',
      'Mobile e-tickets for instant delivery',
      '24/7 customer support',
      'Price alerts and waitlists',
      'Accessible seating options',
    ],
    specialties: ['football'],
    pros: [
      'Specialist football inventory',
      'Strong buyer protection',
      'Wide event selection',
      'Reliable mobile tickets',
    ],
    cons: [
      'Service fees can be high',
      'No secondary market for sold-out events',
    ],
    paymentMethods: ['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay'],
    deliveryOptions: ['E-ticket', 'Mobile app', 'Print at home'],
    founded: 2004,
    website: 'https://footballticketnet.com',
    merchantredirecturl: 'https://www.awin1.com/cread.php?awinmid=109004&awinaffid=90270',
    metaTitle: 'FootballTicketNet Review 2025 | Trusted Football Tickets | TicketNexus',
    metaDescription: 'Read our FootballTicketNet review. A specialist football ticket marketplace offering verified tickets for Premier League, Champions League and more with buyer guarantee.',
    metaKeywords: 'FootballTicketNet review, FootballTicketNet tickets, buy football tickets, Premier League tickets, Champions League tickets, verified football tickets',
  },
  {
    id: 'awin',
    slug: 'awin',
    name: 'Awin',
    icon: '🌐',
    rating: 4.4,
    reviewCount: 21500,
    shortDesc: 'Leading affiliate network connecting fans with top ticket sellers.',
    description:
      'Awin is a global affiliate marketing network that partners with the world\'s leading ticket retailers, sports clubs, and event organisers. Through Awin\'s trusted network, fans can discover competitive ticket deals from verified sellers with full purchase protection.',
    features: [
      'Verified affiliate partner network',
      'Exclusive partner deals and discounts',
      'Price comparison across top sellers',
      'Secure payment via trusted retailers',
      'Wide coverage of sports and events',
      'Real-time inventory updates',
    ],
    specialties: ['football', 'tennis', 'horse-racing', 'cricket', 'formula-1'],
    pros: [
      'Access to exclusive partner discounts',
      'Verified and trusted sellers only',
      'Broad event and sport coverage',
      'Competitive pricing through network',
    ],
    cons: [
      'Redirects to partner sites for purchase',
      'Availability varies by partner',
    ],
    paymentMethods: ['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'American Express'],
    deliveryOptions: ['E-ticket', 'Mobile app', 'Print at home', 'Registered mail'],
    founded: 2000,
    website: 'https://awin.com',
    metaTitle: 'Awin Review 2025 | Trusted Sports Ticket Network | TicketNexus',
    metaDescription: 'Read our Awin review. A global affiliate network connecting fans with verified ticket sellers for football, tennis, horse racing, cricket and Formula 1 events.',
    metaKeywords: 'Awin review, Awin tickets, buy sports tickets, verified ticket sellers, football tennis cricket F1 tickets, Awin affiliate network',
  },
];

export const getPartnerBySlug = (slug: string): Partner | undefined =>
  PARTNERS.find((p) => p.slug === slug);
