import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { NEWS_ARTICLES, getNewsBySlug } from '@/lib/data/news';
import { getEventsBySport, toTicketSlug } from '@/lib/data/tickets';
import { buildMetadata } from '@/lib/utils/seo';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return NEWS_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getNewsBySlug(params.slug);
  if (!article) return {};
  return buildMetadata({
    title: article.metaTitle,
    description: article.metaDescription,
    path: `/news/${article.slug}`,
    image: article.imageUrl,
  });
}

const CAT_COLORS: Record<string, string> = {
  football: '#3b82f6',
  cricket: '#10b981',
  'horse-racing': '#f59e0b',
  tennis: '#ef4444',
  boxing: '#8b5cf6',
  'formula-1': '#dc2626',
  rugby: '#10b981',
  golf: '#10b981',
  general: '#6b7280',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function NewsArticlePage({ params }: Props) {
  const article = getNewsBySlug(params.slug);
  if (!article) notFound();

  const related = NEWS_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 5);
  const relatedTickets = getEventsBySport(article.category).slice(0, 4);
  const catColor = CAT_COLORS[article.category] || '#6b7280';
  const catLabel = article.category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.metaDescription,
    image: article.imageUrl,
    author: { '@type': 'Person', name: article.author },
    datePublished: article.publishedAt,
    publisher: {
      '@type': 'Organization',
      name: 'StrikeZone Tickets',
      logo: { '@type': 'ImageObject', url: '/logo.png' },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main style={{ background: '#f1f5f9', minHeight: '100vh' }}>

        {/* ── Breadcrumb bar ── */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b', height: '44px', flexWrap: 'wrap' }}>
              <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link>
              <span style={{ color: '#cbd5e1' }}>›</span>
              <Link href="/news" style={{ color: '#64748b', textDecoration: 'none' }}>News</Link>
              <span style={{ color: '#cbd5e1' }}>›</span>
              <span style={{ color: catColor, fontWeight: 600 }}>{catLabel}</span>
            </div>
          </div>
        </div>

        {/* ── Page body ── */}
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '28px 24px 80px' }}>
          <div className="news-article-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '28px', alignItems: 'start' }}>

            {/* ════════════ MAIN ARTICLE ════════════ */}
            <article>

              {/* Article card */}
              <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>

                {/* Header: category + title + author */}
                <div style={{ padding: '28px 32px 24px' }}>

                  {/* Category badge */}
                  <div style={{ marginBottom: '14px' }}>
                    <span style={{
                      display: 'inline-block', fontSize: '11px', fontWeight: 700,
                      padding: '5px 13px', borderRadius: '5px', background: catColor,
                      color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>
                      {catLabel}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 style={{
                    fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                    fontSize: '28px', fontWeight: 800, lineHeight: 1.25,
                    color: '#0f172a', marginBottom: '20px',
                  }} className="article-h1">
                    {article.title}
                  </h1>

                  {/* Author strip */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, position: 'relative', border: '2px solid #e2e8f0' }}>
                      <Image src={article.authorAvatar} alt={article.author} fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{article.author}</span>
                        <span style={{
                          fontSize: '10px', fontWeight: 700, background: '#1d4ed8',
                          color: '#fff', padding: '2px 7px', borderRadius: '3px',
                          textTransform: 'uppercase', letterSpacing: '0.05em',
                        }}>Editor</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                        {formatDate(article.publishedAt)} &nbsp;·&nbsp; {article.readTime} min read
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hero image — full width inside the card */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#e2e8f0' }}>
                  <Image src={article.imageUrl} alt={article.title} fill style={{ objectFit: 'cover' }} priority />
                </div>

                {/* Caption */}
                <p style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', margin: '0', padding: '8px 32px 0' }}>
                  {article.imageCaption}
                </p>

                {/* Body content */}
                <div style={{ padding: '28px 32px 32px' }}>

                {/* Key points */}
                <div style={{
                  background: '#f8fafc', border: `1px solid ${catColor}30`,
                  borderLeft: `3px solid ${catColor}`,
                  borderRadius: '8px', padding: '16px 20px', marginBottom: '28px',
                }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: catColor, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '10px' }}>
                    Key Takeaways
                  </p>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {article.keyPoints.map((point, i) => (
                      <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '14px', color: '#334155', lineHeight: 1.55 }}>
                        <span style={{ color: catColor, fontWeight: 800, flexShrink: 0 }}>✓</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lead paragraph */}
                <p style={{ fontSize: '17px', lineHeight: 1.8, color: '#334155', marginBottom: '36px', fontWeight: 500 }}>
                  {article.snippet}
                </p>

                {/* H2 content sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                  {article.content.map((section, idx) => (
                    <section key={idx}>
                      <h2 style={{
                        fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                        fontSize: '21px', fontWeight: 700, color: '#0f172a',
                        marginBottom: '12px', lineHeight: 1.3,
                        paddingBottom: '10px', borderBottom: '2px solid #f1f5f9',
                      }}>
                        {section.h2}
                      </h2>
                      <p style={{ fontSize: '15px', lineHeight: 1.9, color: '#475569' }}>
                        {section.body}
                      </p>
                    </section>
                  ))}
                </div>

                {/* Related Tickets */}
                {relatedTickets.length > 0 && (
                  <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '2px solid #f1f5f9' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                      fontSize: '18px', fontWeight: 700, color: '#0f172a',
                      marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px',
                    }}>
                      <span style={{ background: catColor, color: '#fff', borderRadius: '6px', padding: '3px 10px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {catLabel}
                      </span>
                      Upcoming Tickets
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }} className="related-tickets-grid">
                      {relatedTickets.map((event) => {
                        const slug = toTicketSlug(event);
                        const avail = event.availability === 'sold-out' ? '#ef4444' : event.availability === 'low' ? '#f59e0b' : '#10b981';
                        const availLabel = event.availability === 'sold-out' ? 'Sold Out' : event.availability === 'low' ? 'Low Availability' : 'Available';
                        return (
                          <Link
                            key={event.id}
                            href={`/tickets/${slug}`}
                            style={{
                              display: 'flex', flexDirection: 'column', gap: '10px',
                              background: '#f8fafc', border: '1px solid #e2e8f0',
                              borderRadius: '10px', padding: '16px', textDecoration: 'none',
                              transition: 'all .15s',
                            }}
                            className="related-ticket-card"
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                              <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', lineHeight: 1.35, margin: 0, flex: 1 }}>
                                {event.eventName}
                              </p>
                              <span style={{ fontSize: '10px', fontWeight: 700, color: avail, background: `${avail}15`, padding: '2px 7px', borderRadius: '20px', flexShrink: 0, whiteSpace: 'nowrap' }}>
                                {availLabel}
                              </span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <span>📍 {event.venue}, {event.city}</span>
                              <span>📅 {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {event.time}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #e2e8f0' }}>
                              <span style={{ fontSize: '13px', color: '#64748b' }}>From</span>
                              <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>£{event.minPrice}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                    <div style={{ marginTop: '14px', textAlign: 'right' }}>
                      <Link href={`/category/${article.category}`} style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>
                        View all {catLabel} tickets →
                      </Link>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <Link href="/news" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>
                    ← Back to all articles
                  </Link>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Category:</span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff', background: catColor, padding: '3px 10px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {catLabel}
                    </span>
                  </div>
                </div>
                </div>{/* end body content */}
              </div>{/* end article card */}
            </article>

            {/* ════════════ RIGHT SIDEBAR ════════════ */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '20px' }}>

              {/* Related News */}
              <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ padding: '16px 20px', background: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '15px' }}>📰</span>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>
                    Related News
                  </h3>
                </div>

                {/* Cards */}
                <div>
                  {related.map((rel, idx) => {
                    const rc = CAT_COLORS[rel.category] || '#6b7280';
                    const rl = rel.category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
                    return (
                      <Link
                        key={rel.id}
                        href={`/news/${rel.slug}`}
                        style={{
                          display: 'flex', gap: '12px', padding: '14px 16px',
                          borderBottom: idx < related.length - 1 ? '1px solid #f1f5f9' : 'none',
                          textDecoration: 'none', transition: 'background .15s',
                        }}
                        className="related-news-card"
                      >
                        {/* Thumbnail */}
                        <div style={{ width: '72px', height: '54px', borderRadius: '7px', overflow: 'hidden', flexShrink: 0, position: 'relative', background: '#f1f5f9' }}>
                          <Image src={rel.imageUrl} alt={rel.title} fill style={{ objectFit: 'cover' }} />
                        </div>
                        {/* Text */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{
                            display: 'inline-block', fontSize: '9px', fontWeight: 700,
                            padding: '2px 6px', borderRadius: '3px', background: rc,
                            color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px',
                          }}>
                            {rl}
                          </span>
                          <p style={{
                            fontSize: '12px', fontWeight: 600, color: '#0f172a',
                            lineHeight: 1.4, margin: 0,
                            display: '-webkit-box', WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical', overflow: 'hidden',
                          }}>
                            {rel.title}
                          </p>
                          <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0' }}>
                            {rel.readTime} min read
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* View all */}
                <div style={{ padding: '14px 16px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                  <Link href="/news" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                    fontSize: '13px', fontWeight: 600, color: 'var(--primary)',
                    textDecoration: 'none', padding: '9px',
                    borderRadius: '7px', border: '1.5px solid var(--primary)',
                    transition: 'all .15s',
                  }}>
                    View all articles →
                  </Link>
                </div>
              </div>

              {/* Article meta */}
              <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>
                    Article Details
                  </h3>
                </div>
                <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { icon: '✍️', label: 'Author', value: article.author },
                    { icon: '📅', label: 'Published', value: formatDate(article.publishedAt) },
                    { icon: '⏱️', label: 'Read time', value: `${article.readTime} min` },
                    { icon: '🏷️', label: 'Category', value: catLabel },
                  ].map(({ icon, label, value }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>{icon}</span>
                      <div>
                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Browse tickets CTA */}
              <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', borderRadius: '14px', padding: '22px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>🎟️</div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '6px', fontFamily: 'var(--font-poppins, Poppins, sans-serif)' }}>
                  Find the Best Ticket Prices
                </h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px', lineHeight: 1.5 }}>
                  Compare prices across the UK&apos;s top resale platforms instantly.
                </p>
                <Link href="/" style={{
                  display: 'block', background: 'var(--primary)', color: '#fff',
                  fontSize: '13px', fontWeight: 700, padding: '11px 16px',
                  borderRadius: '8px', textDecoration: 'none', letterSpacing: '0.03em',
                }}>
                  Browse All Tickets →
                </Link>
              </div>

            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
