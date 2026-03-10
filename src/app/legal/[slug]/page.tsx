import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { buildMetadata } from '@/lib/utils/seo';

const LEGAL_PAGES: Record<string, { title: string; lastUpdated: string; content: string }> = {
  terms: {
    title: 'Terms & Conditions',
    lastUpdated: '1 January 2025',
    content: `
## 1. Introduction

Welcome to StrikeZone Tickets ("we", "our", "us"). By using this website you agree to these Terms & Conditions. Please read them carefully.

StrikeZone Tickets is a ticket comparison service. We do not sell tickets directly — we compare prices from third-party partner platforms and link you to their websites.

## 2. Use of the Service

You may use StrikeZone Tickets for personal, non-commercial purposes only. You must not:

- Use our service for any unlawful purpose
- Attempt to gain unauthorised access to our systems
- Scrape or harvest data without permission
- Misrepresent your identity or affiliation

## 3. Accuracy of Information

We strive to provide accurate, up-to-date pricing information. However, ticket prices change frequently and we cannot guarantee that prices shown are current at the time of purchase. Always confirm the final price on the partner's website before completing your transaction.

## 4. Third-Party Links

Our website contains affiliate links to third-party ticket platforms. We are not responsible for the content, policies, or practices of those third-party websites. Your purchase is subject to the terms and conditions of the partner platform.

## 5. Intellectual Property

All content on this website — including text, graphics, logos, and data — is owned by or licensed to StrikeZone Tickets and protected by copyright law.

## 6. Limitation of Liability

To the maximum extent permitted by law, StrikeZone Tickets shall not be liable for any indirect, incidental, or consequential damages arising from your use of this service.

## 7. Changes to Terms

We may update these terms at any time. Continued use of the service constitutes acceptance of the updated terms.

## 8. Governing Law

These terms are governed by the laws of England and Wales.
    `,
  },
  privacy: {
    title: 'Privacy Policy',
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

To exercise any of these rights, contact: privacy@strikezone-tickets.com

## 5. Data Retention

We retain usage data for 26 months. Contact form data is retained for 12 months.

## 6. Cookies

See our separate Cookie Policy for full details on cookies we use.

## 7. Contact

For privacy-related queries: privacy@strikezone-tickets.com
    `,
  },
  cookies: {
    title: 'Cookie Policy',
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

For more about cookies generally: [aboutcookies.org](https://www.aboutcookies.org)
    `,
  },
  'affiliate-disclosure': {
    title: 'Affiliate Disclosure',
    lastUpdated: '1 January 2025',
    content: `
## Our Affiliate Relationships

StrikeZone Tickets is a ticket comparison website. We earn revenue through **affiliate commissions** paid to us by our partner ticket platforms (Ticketmaster, StubHub, Viagogo, SeatGeek, GetMeIn, TicketSwap and others).

## How It Works

When you click a "Get Tickets" button or any link to a partner website on StrikeZone Tickets, a tracking cookie or referral code is set. If you subsequently make a purchase on that partner's website, we receive a commission — typically a percentage of the transaction value.

**This commission is paid by the partner, not by you.** The price you pay for your tickets is the same whether you arrived via StrikeZone or directly.

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

If you have questions about our affiliate relationships: info@strikezone-tickets.com
    `,
  },
};

const LEGAL_NAV = [
  { slug: 'terms', label: 'Terms & Conditions' },
  { slug: 'privacy', label: 'Privacy Policy' },
  { slug: 'cookies', label: 'Cookie Policy' },
  { slug: 'affiliate-disclosure', label: 'Affiliate Disclosure' },
];

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return Object.keys(LEGAL_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = LEGAL_PAGES[params.slug];
  if (!page) return {};
  return buildMetadata({
    title: page.title,
    path: `/legal/${params.slug}`,
  });
}

export default function LegalPage({ params }: Props) {
  const page = LEGAL_PAGES[params.slug];
  if (!page) notFound();

  // Convert basic markdown to HTML sections
  const sections = page.content
    .trim()
    .split(/\n(?=## )/)
    .filter(Boolean);

  return (
    <>
      <Header />

      <main>
        {/* Breadcrumb */}
        <div
          style={{
            background: 'var(--white)',
            borderBottom: '1px solid var(--border-gray)',
            padding: '16px 40px',
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
            }}
          >
            <Link href="/" style={{ color: 'var(--text-gray)', textDecoration: 'none' }}>
              Home
            </Link>
            <span style={{ color: 'var(--text-gray)' }}>›</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{page.title}</span>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '40px 40px 80px',
            display: 'grid',
            gridTemplateColumns: '240px 1fr',
            gap: '48px',
          }}
          className="legal-grid"
        >
          {/* Sidebar nav */}
          <aside>
            <div
              style={{
                background: 'var(--white)',
                border: '1px solid var(--border-gray)',
                borderRadius: '12px',
                overflow: 'hidden',
                position: 'sticky',
                top: 'calc(var(--nav-h) + 20px)',
              }}
            >
              <div
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid var(--border-gray)',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--text-gray)',
                }}
              >
                Legal Pages
              </div>
              {LEGAL_NAV.map((nav) => {
                const isActive = nav.slug === params.slug;
                return (
                  <Link
                    key={nav.slug}
                    href={`/legal/${nav.slug}`}
                    style={{
                      display: 'block',
                      padding: '12px 20px',
                      fontSize: '14px',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'var(--primary)' : 'var(--text-gray)',
                      background: isActive ? 'var(--primary-light)' : 'transparent',
                      borderLeft: `3px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
                      textDecoration: 'none',
                      transition: 'all .15s',
                    }}
                  >
                    {nav.label}
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* Main content */}
          <div>
            <div style={{ marginBottom: '32px' }}>
              <h1
                style={{
                  fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                  fontSize: '36px',
                  fontWeight: 800,
                  color: 'var(--text-dark)',
                  marginBottom: '8px',
                }}
              >
                {page.title}
              </h1>
              <p style={{ fontSize: '13px', color: 'var(--text-gray)' }}>
                Last updated: {page.lastUpdated}
              </p>
            </div>

            <div
              style={{
                background: 'var(--white)',
                border: '1px solid var(--border-gray)',
                borderRadius: '12px',
                padding: '40px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {sections.map((section, i) => {
                const lines = section.split('\n');
                const heading = lines[0].replace(/^##\s+/, '');
                const body = lines.slice(1).join('\n').trim();

                return (
                  <div
                    key={i}
                    style={{
                      marginBottom: i < sections.length - 1 ? '32px' : 0,
                      paddingBottom: i < sections.length - 1 ? '32px' : 0,
                      borderBottom:
                        i < sections.length - 1 ? '1px solid var(--border-gray)' : 'none',
                    }}
                  >
                    <h2
                      style={{
                        fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                        fontSize: '18px',
                        fontWeight: 700,
                        color: 'var(--text-dark)',
                        marginBottom: '12px',
                      }}
                    >
                      {heading}
                    </h2>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'var(--text-gray)',
                        lineHeight: 1.8,
                        whiteSpace: 'pre-line',
                      }}
                    >
                      {body}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contact box */}
            <div
              style={{
                marginTop: '32px',
                background: 'var(--primary-light)',
                border: '1px solid var(--primary)',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--text-dark)',
                  marginBottom: '8px',
                }}
              >
                Questions?
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--text-gray)', lineHeight: 1.6 }}>
                If you have questions about this policy, please email us at{' '}
                <a
                  href="mailto:legal@strikezone-tickets.com"
                  style={{ color: 'var(--primary)', fontWeight: 600 }}
                >
                  legal@strikezone-tickets.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
