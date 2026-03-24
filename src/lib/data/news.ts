import type { NewsArticle } from '@/lib/types';
import { API_CONFIG, buildApiUrl } from '@/lib/config/api';

const NEWS_API     = buildApiUrl(API_CONFIG.ENDPOINTS.NEWS, { page: API_CONFIG.DEFAULTS.NEWS_PAGE, limit: API_CONFIG.DEFAULTS.NEWS_LIMIT });
const NEWS_API_KEY = process.env.NEWS_API_KEY ?? '';

interface ApiNewsItem {
  id: number;
  slug: string;
  title: string;
  snippet: string;
  imageUrl: string;
  publishedAt: string | null;
  readTime: number;
  featured: number;
  category: string;
  icon: string;
  league: string;
  leagueSlug: string | null;
  author: string;
  authorAvatar: string;
  isactive: string;
  addedon: string;
  imageCaption: string;
  keyPoints: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  content: string;
}

function normalizeCategory(cat: string): NewsArticle['category'] {
  const map: Record<string, NewsArticle['category']> = {
    'Football': 'football',
    'Tennis': 'tennis',
    'Cricket': 'cricket',
    'Horse Racing': 'horse-racing',
    'Boxing': 'boxing',
    'Formula 1': 'formula-1',
    'Formula-1': 'formula-1',
    'Rugby': 'rugby',
    'Golf': 'golf',
    'American Football': 'american-football',
    'Athletics': 'athletics',
    'Basketball': 'basketball',
    'Ice Hockey': 'ice-hockey',
    'Motorsports': 'motorsports',
    'Moto GP': 'moto-gp',
    'Cycling': 'cycling',
    'Darts': 'darts',
    'Esports': 'esports',
    'Swimming': 'swimming',
    'Gymnastics': 'gymnastics',
  };
  return map[cat] ?? 'general';
}

function mapApiItem(item: ApiNewsItem): NewsArticle {
  let keyPoints: string[] = [];
  try {
    keyPoints = JSON.parse(item.keyPoints);
  } catch {
    keyPoints = [];
  }

  const publishedAt = item.publishedAt ?? item.addedon.split(' ')[0];
  const addedon = item.addedon.split(' ')[0];

  return {
    id: String(item.id),
    slug: item.slug,
    title: item.title,
    snippet: item.snippet,
    category: normalizeCategory(item.category),
    icon: item.icon,
    author: item.author,
    authorAvatar: item.authorAvatar,
    publishedAt,
    addedon,
    readTime: item.readTime,
    imageUrl: item.imageUrl,
    imageCaption: item.imageCaption,
    keyPoints,
    featured: item.featured === 1,
    leagueSlug: item.leagueSlug ?? undefined,
    metaTitle: item.metaTitle,
    metaDescription: item.metaDescription,
    metaKeywords: item.metaKeywords,
    content: item.content,
  };
}

async function fetchAllNews(): Promise<NewsArticle[]> {
  try {
    const res = await fetch(NEWS_API, {
      headers: { 'x-api-key': NEWS_API_KEY },
    });
    if (!res.ok) return [];
    const data: ApiNewsItem[] = await res.json();
    return data.filter((item) => item.isactive === 'Y').map(mapApiItem);
  } catch {
    return [];
  }
}

export async function getAllNews(): Promise<NewsArticle[]> {
  return fetchAllNews();
}

export async function getNewsBySlug(slug: string): Promise<NewsArticle | undefined> {
  const articles = await fetchAllNews();
  return articles.find((a) => a.slug === slug);
}

export async function getFeaturedNews(): Promise<NewsArticle[]> {
  const articles = await fetchAllNews();
  return articles.filter((a) => a.featured === true).slice(0, 3);
}

export async function getNewsByCategory(category: string): Promise<NewsArticle[]> {
  const articles = await fetchAllNews();
  return category === 'all'
    ? articles
    : articles.filter((a) => a.category === category);
}
