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
    website: 'https://footballticketnet.com/?utm_source=nexus_tickets&utm_medium=https://ticket-nexus.com/&utm_campaign=90270',
    merchantredirecturl: 'https://www.awin1.com/cread.php?awinmid=109004&awinaffid=90270',
    metaTitle: 'FootballTicketNet Review 2025 | Trusted Football Tickets | TicketNexus',
    metaDescription: 'Read our FootballTicketNet review. A specialist football ticket marketplace offering verified tickets for Premier League, Champions League and more with buyer guarantee.',
    metaKeywords: 'FootballTicketNet review, FootballTicketNet tickets, buy football tickets, Premier League tickets, Champions League tickets, verified football tickets',
  },  
];

export const getPartnerBySlug = (slug: string): Partner | undefined =>
  PARTNERS.find((p) => p.slug === slug);
