/**
 * Central API configuration.
 * All external API base URLs and endpoints are defined here.
 * API keys are loaded from environment variables only.
 */

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
