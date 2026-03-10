import type { NewsArticle } from '@/lib/types';

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: '1',
    slug: 'premier-league-ticket-prices-2025',
    title: 'Premier League 2024/25: How to Find the Best Ticket Deals This Season',
    snippet:
      'With ticket prices hitting record highs, we break down which platforms offer the best value for the Premier League\'s biggest fixtures.',
    category: 'football',
    icon: '⚽',
    author: 'James Mitchell',
    publishedAt: '2025-02-18',
    readTime: 5,
  },
  {
    id: '2',
    slug: 'cheltenham-festival-guide-2025',
    title: 'Cheltenham Festival 2025: Complete Ticket Buying Guide',
    snippet:
      'Everything you need to know about buying Cheltenham Festival tickets — from Champion Day to Gold Cup Day — and where to find the best prices.',
    category: 'horse-racing',
    icon: '🏇',
    author: 'Sophie Clarke',
    publishedAt: '2025-02-15',
    readTime: 7,
  },
  {
    id: '3',
    slug: 'wimbledon-ballot-tips',
    title: '5 Tips for the Wimbledon Ballot and When to Use Resale Sites',
    snippet:
      'Missed the Wimbledon ballot? Don\'t panic. We explain when the secondary market becomes your best option and how to avoid overpaying.',
    category: 'tennis',
    icon: '🎾',
    author: 'Rachel Nguyen',
    publishedAt: '2025-02-12',
    readTime: 4,
  },
  {
    id: '4',
    slug: 'f1-silverstone-hospitality-guide',
    title: 'British GP 2025: Grandstand vs Paddock Club — Is the Upgrade Worth It?',
    snippet:
      'We compare Silverstone\'s general admission, grandstand, and Paddock Club hospitality packages to help you decide what\'s worth your money.',
    category: 'formula-1',
    icon: '🏎️',
    author: 'Dan Richards',
    publishedAt: '2025-02-10',
    readTime: 6,
  },
  {
    id: '5',
    slug: 'boxing-ticket-buying-tips',
    title: 'How to Buy Boxing Tickets: Avoiding Scams and Finding Real Value',
    snippet:
      'Boxing ticket scams are on the rise. Here\'s our guide to the safest platforms, how to spot a fake ticket, and where to find the best prices.',
    category: 'boxing',
    icon: '🥊',
    author: 'Marcus Thompson',
    publishedAt: '2025-02-08',
    readTime: 5,
  },
  {
    id: '6',
    slug: 'cricket-test-match-best-seats',
    title: 'England Cricket 2025: The Best Seats at Lord\'s, The Oval, and Edgbaston',
    snippet:
      'Which end is best for watching Test cricket? Our ground-by-ground breakdown of the best viewing positions and how to book them.',
    category: 'cricket',
    icon: '🏏',
    author: 'Priya Patel',
    publishedAt: '2025-02-05',
    readTime: 6,
  },
];

export const getNewsByCategory = (category: string): NewsArticle[] =>
  category === 'all'
    ? NEWS_ARTICLES
    : NEWS_ARTICLES.filter((a) => a.category === category);
