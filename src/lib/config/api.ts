/**
 * Central API configuration.
 * All external API base URLs and endpoints are defined here.
 * API keys are loaded from environment variables only.
 */

/** Base URL for Cloudflare Image Delivery CDN (news images). */
export const IMAGE_DELIVERY_BASE_URL = 'https://imagedelivery.net/d30Eru8iw5r9nF8rk-OkDw/';

/**
 * Returns a news image URL with the specified Cloudflare variant.
 * e.g. newsImageVariant(article.imageUrl, 'w=280')
 * Replaces the trailing variant segment (e.g. /public → /w=280).
 */
export function newsImageVariant(imageUrl: string, variant: string): string {
  return imageUrl.replace(/\/[^/]+$/, `/${variant}`);
}

export const API_CONFIG = {
  // ── Base URL ────────────────────────────────────────────────────────────
  AUTH_URL: 'https://ticketapi.avi-kh.workers.dev',

  // ── Endpoints ───────────────────────────────────────────────────────────
  ENDPOINTS: {
    NEWS:    '/api/ticket/news',
    TICKETS: '/api/ticket/tickets',
    LEAGUES: '/api/ticket/leagues',
    SPORTS:  '/api/ticket/sports',
  },

  // ── Default query params ─────────────────────────────────────────────────
  DEFAULTS: {
    NEWS_PAGE:  1,
    NEWS_LIMIT: 100,
  },
} as const;

/**
 * Builds a full API URL from an endpoint path and optional query params.
 * Example: buildApiUrl(API_CONFIG.ENDPOINTS.NEWS, { page: 1, limit: 100 })
 */
export function buildApiUrl(
  endpoint: string,
  params?: Record<string, string | number>,
): string {
  const url = new URL(`${API_CONFIG.AUTH_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }
  return url.toString();
}
