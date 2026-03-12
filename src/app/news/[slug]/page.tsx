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

  const related = NEWS_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 6);
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
      name: 'TicketNexus',
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

      <main style={{ background: '#fff', minHeight: '100vh' }}>

        {/* ── Breadcrumb ── */}
        <div style={{ borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b', height: '42px', flexWrap: 'wrap' }}>
              <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link>
              <span style={{ color: '#cbd5e1' }}>›</span>
              <Link href="/news" style={{ color: '#64748b', textDecoration: 'none' }}>News</Link>
              <span style={{ color: '#cbd5e1' }}>›</span>
              <span style={{ color: catColor, fontWeight: 600 }}>{catLabel}</span>
            </div>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div className="news-page-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '48px', alignItems: 'start' }}>

            {/* ════ LEFT: Article ════ */}
            <article style={{ padding: '36px 0 72px' }}>

              {/* Category badge */}
              <div style={{ marginBottom: '14px' }}>
                <span style={{
                  display: 'inline-block', fontSize: '12px', fontWeight: 700,
                  padding: '5px 14px', borderRadius: '20px', background: catColor,
                  color: '#fff', letterSpacing: '0.04em',
                }}>
                  {catLabel} News
                </span>
              </div>

              {/* Title */}
              <h1 style={{
                fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, lineHeight: 1.15,
                color: '#0f172a', marginBottom: '18px',
              }}>
                {article.title}
              </h1>

              {/* Author strip — BY NAME | clock + date */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '50%', overflow: 'hidden',
                  flexShrink: 0, position: 'relative',
                }}>
                  <Image src={article.authorAvatar} alt={article.author} fill style={{ objectFit: 'cover' }} />
                </div>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  By
                </span>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {article.author}
                </span>
                <span style={{ color: '#cbd5e1' }}>|</span>
                <span style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  {formatDate(article.publishedAt)} &nbsp;·&nbsp; {article.readTime} min read
                </span>
              </div>

              {/* Hero image */}
              <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '10px', overflow: 'hidden', background: '#e2e8f0' }}>
                <Image src={article.imageUrl} alt={article.title} fill style={{ objectFit: 'cover' }} priority />
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', margin: '8px 0 32px', lineHeight: 1.5 }}>
                {article.imageCaption}
              </p>

              {/* Lead paragraph */}
              <p style={{ fontSize: '17px', lineHeight: 1.85, color: '#1e293b', marginBottom: '36px', fontWeight: 600 }}>
                {article.snippet}
              </p>

              {/* Body sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', marginBottom: '52px' }}>
                {article.content.map((section, idx) => (
                  <section key={idx}>
                    <h2 style={{
                      fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                      fontSize: '20px', fontWeight: 700, color: '#0f172a',
                      marginBottom: '12px', lineHeight: 1.3,
                      paddingBottom: '10px', borderBottom: '2px solid #f1f5f9',
                    }}>
                      {section.h2}
                    </h2>
                    <p style={{ fontSize: '15px', lineHeight: 1.9, color: '#475569', margin: 0 }}>
                      {section.body}
                    </p>
                  </section>
                ))}
              </div>

              {/* Related Tickets */}
              {relatedTickets.length > 0 && (
                <div style={{ paddingTop: '36px', borderTop: '2px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                      fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0,
                    }}>
                      Upcoming {catLabel} Tickets
                    </h3>
                    <Link href={`/${article.category}`} style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none' }}>
                      View all →
                    </Link>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }} className="related-tickets-grid">
                    {relatedTickets.map((event) => {
                      const slug = toTicketSlug(event);
                      const avail = event.availability === 'sold-out' ? '#ef4444' : event.availability === 'low' ? '#f59e0b' : '#10b981';
                      const availLabel = event.availability === 'sold-out' ? 'Sold Out' : event.availability === 'low' ? 'Low' : 'Available';
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
                            <span style={{ fontSize: '12px', color: '#64748b' }}>From</span>
                            <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)' }}>£{event.minPrice}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Back link */}
              <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #e2e8f0' }}>
                <Link href="/news" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  fontSize: '14px', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none',
                }}>
                  ← Back to all articles
                </Link>
              </div>
            </article>

            {/* ════ RIGHT: More [Sport] News sidebar ════ */}
            <aside style={{ padding: '36px 0 72px', position: 'sticky', top: '20px' }}>
              <h3 style={{
                fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                fontSize: '20px', fontWeight: 800, color: '#0f172a',
                marginBottom: '20px', paddingBottom: '14px',
                borderBottom: '3px solid #0f172a',
              }}>
                More {catLabel} News
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {related.map((rel, idx) => (
                  <Link
                    key={rel.id}
                    href={`/news/${rel.slug}`}
                    style={{
                      display: 'flex', gap: '14px', alignItems: 'flex-start',
                      padding: '16px 0',
                      borderBottom: idx < related.length - 1 ? '1px solid #f1f5f9' : 'none',
                      textDecoration: 'none',
                    }}
                    className="sidebar-news-card"
                  >
                    {/* Thumbnail */}
                    <div style={{
                      width: '88px', height: '66px', borderRadius: '6px',
                      overflow: 'hidden', flexShrink: 0, position: 'relative', background: '#f1f5f9',
                    }}>
                      <Image src={rel.imageUrl} alt={rel.title} fill style={{ objectFit: 'cover' }} />
                    </div>
                    {/* Text */}
                    <p style={{
                      fontSize: '13px', fontWeight: 700, color: '#0f172a',
                      lineHeight: 1.45, margin: 0, flex: 1,
                      display: '-webkit-box', WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      {rel.title}
                    </p>
                  </Link>
                ))}
              </div>

              <div style={{ marginTop: '16px' }}>
                <Link href="/news" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  fontSize: '13px', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none',
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                  View all articles →
                </Link>
              </div>
            </aside>

          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .news-page-grid {
            grid-template-columns: 1fr !important;
          }
          .related-tickets-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .related-ticket-card:hover {
          border-color: #cbd5e1 !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
          transform: translateY(-2px);
        }
        .sidebar-news-card:hover p {
          color: var(--primary) !important;
        }
      `}</style>
    </>
  );
}
