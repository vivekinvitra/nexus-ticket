export type PageGroup = 'company' | 'legal';

export interface PageDef {
  slug: string;
  title: string;
  group: PageGroup;
  lastUpdated?: string;
  content?: string;
}

export const PAGES: PageDef[] = [
  // ── Company ──────────────────────────────────────────────────────────────
  {
    slug: 'about',
    title: 'About Us',
    group: 'company',
  },
  {
    slug: 'contact',
    title: 'Contact Us',
    group: 'company',
  },

  // ── Legal ─────────────────────────────────────────────────────────────────
  {
    slug: 'terms',
    title: 'Terms & Conditions',
    group: 'legal',
    lastUpdated: '1 January 2025',
    content: `
## 1. Introduction

Welcome to TicketNexus ("we", "our", "us"). By using this website you agree to these Terms & Conditions. Please read them carefully.

TicketNexus is a ticket comparison service. We do not sell tickets directly — we compare prices from third-party partner platforms and link you to their websites.

## 2. Use of the Service

You may use TicketNexus for personal, non-commercial purposes only. You must not:

- Use our service for any unlawful purpose
- Attempt to gain unauthorised access to our systems
- Scrape or harvest data without permission
- Misrepresent your identity or affiliation

## 3. Accuracy of Information

We strive to provide accurate, up-to-date pricing information. However, ticket prices change frequently and we cannot guarantee that prices shown are current at the time of purchase. Always confirm the final price on the partner's website before completing your transaction.

## 4. Third-Party Links

Our website contains affiliate links to third-party ticket platforms. We are not responsible for the content, policies, or practices of those third-party websites. Your purchase is subject to the terms and conditions of the partner platform.

## 5. Intellectual Property

All content on this website — including text, graphics, logos, and data — is owned by or licensed to TicketNexus and protected by copyright law.

## 6. Limitation of Liability

To the maximum extent permitted by law, TicketNexus shall not be liable for any indirect, incidental, or consequential damages arising from your use of this service.

## 7. Changes to Terms

We may update these terms at any time. Continued use of the service constitutes acceptance of the updated terms.

## 8. Governing Law

These terms are governed by the laws of England and Wales.
    `,
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    group: 'legal',
    lastUpdated: '1 January 2025',
    content: `
## 1. What We Collect

We collect the following types of information:

- **Usage data:** Pages visited, time on site, referring URLs (via Google Analytics)
- **Technical data:** IP address, browser type, device type
- **Cookies:** See our Cookie Policy for details
- **Contact data:** If you contact us via email

We do not collect payment information — all transactions occur on our partners' websites.

## 2. How We Use Your Data

We use your data to:

- Improve the website and user experience
- Monitor site performance and fix bugs
- Comply with legal obligations
- Send marketing communications (only with your consent)

## 3. Sharing Your Data

We do not sell your personal data. We may share anonymised, aggregated data with analytics providers. We share data with partners only where required to fulfil the service.

## 4. Your Rights (GDPR)

Under UK GDPR, you have the right to:

- Access your personal data
- Correct inaccurate data
- Request deletion of your data
- Object to processing
- Data portability

To exercise any of these rights, contact: privacy@ticket-nexus.com

## 5. Data Retention

We retain usage data for 26 months. Contact form data is retained for 12 months.

## 6. Cookies

See our separate Cookie Policy for full details on cookies we use.

## 7. Contact

For privacy-related queries: privacy@ticket-nexus.com
    `,
  },
  {
    slug: 'cookies',
    title: 'Cookie Policy',
    group: 'legal',
    lastUpdated: '1 January 2025',
    content: `
## What Are Cookies?

Cookies are small text files stored on your device when you visit a website. They help websites function correctly and provide information to site owners.

## Cookies We Use

### Essential Cookies
Required for the website to function. Cannot be disabled.

| Cookie | Purpose | Duration |
|--------|---------|----------|
| session | User session management | Session |
| csrf | Security token | Session |

### Analytics Cookies
Help us understand how visitors use the site.

| Cookie | Provider | Purpose | Duration |
|--------|----------|---------|----------|
| _ga | Google Analytics | Visitor tracking | 2 years |
| _gid | Google Analytics | Session tracking | 24 hours |

### Partner / Affiliate Cookies
Set when you click through to our partner sites.

| Cookie | Purpose | Duration |
|--------|---------|----------|
| affiliate_ref | Track referrals to partners | 30 days |

## Managing Cookies

You can control cookies through your browser settings. Note that disabling certain cookies may affect the functionality of the website.

Most browsers allow you to:
- View cookies stored on your device
- Block all or certain cookies
- Delete cookies on exit

## More Information

For more about cookies generally: aboutcookies.org
    `,
  },
  {
    slug: 'affiliate-disclosure',
    title: 'Affiliate Disclosure',
    group: 'legal',
    lastUpdated: '1 January 2025',
    content: `
## Our Affiliate Relationships

TicketNexus is a ticket comparison website. We earn revenue through **affiliate commissions** paid to us by our partner ticket platforms (FootballTicketNet and Awin).

## How It Works

When you click a "Get Tickets" button or any link to a partner website on TicketNexus, a tracking cookie or referral code is set. If you subsequently make a purchase on that partner's website, we receive a commission — typically a percentage of the transaction value.

**This commission is paid by the partner, not by you.** The price you pay for your tickets is the same whether you arrived via TicketNexus or directly.

## Effect on Our Rankings

Our affiliate relationships do not influence ticket pricing data, which is fetched directly from partner APIs. However, "Featured Partner" placements in the filter sidebar are paid promotional positions.

We always aim to show you the most accurate, up-to-date prices regardless of our commercial relationships.

## Editorial Independence

Our reviews, ratings, and written content are produced independently of our commercial relationships. We do not accept payment for positive reviews. Ratings reflect genuine user feedback aggregated from multiple review sources.

## Compliance

This disclosure is made in accordance with:

- UK ASA (Advertising Standards Authority) guidelines
- FTC guidelines for affiliate marketing
- UK Consumer Rights Act 2015

## Questions?

If you have questions about our affiliate relationships: info@ticket-nexus.com
    `,
  },
];

export const getPageBySlug = (slug: string): PageDef | undefined =>
  PAGES.find((p) => p.slug === slug);

export const getPagesByGroup = (group: PageGroup): PageDef[] =>
  PAGES.filter((p) => p.group === group);
