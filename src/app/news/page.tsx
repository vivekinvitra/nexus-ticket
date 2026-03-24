import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getAllNews } from '@/lib/data/news';
import { buildMetadata } from '@/lib/utils/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Sports Ticket News & Guides',
  description:
    'The latest sports ticket news, buying guides, and tips to help you get the best seats at the best prices.',
  path: '/news',
});

const CAT_COLORS: Record<string, string> = {
  football: '#3b82f6',
  cricket: '#10b981',
  'horse-racing': '#f59e0b',
  tennis: '#ef4444',
  boxing: '#8b5cf6',
  'formula-1': '#ef4444',
  rugby: '#10b981',
  golf: '#10b981',
  general: '#6b7280',
};

export default async function NewsPage() {
  const articles = await getAllNews();
  return (
    <>
      <Header />

      <main>
        {/* Page header */}
        <div
          style={{
            background: 'var(--white)',
            borderBottom: '1px solid var(--border-gray)',
            padding: '40px 40px 32px',
          }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <h1
              style={{
                fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                fontSize: '36px',
                fontWeight: 700,
                color: 'var(--text-dark)',
                marginBottom: '8px',
              }}
            >
              Latest <span style={{ color: 'var(--primary)' }}>News</span> &amp; Guides
            </h1>
            <p style={{ fontSize: '16px', color: 'var(--text-gray)', marginBottom: '20px' }}>
              Expert tips, buying guides and the latest sports ticket news.
            </p>
          </div>
        </div>

        {/* Articles grid */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 40px 80px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '28px',
            }}
            className="news-page-grid"
          >
            {articles.map((article) => {
              const catColor = CAT_COLORS[article.category] || '#6b7280';
              const catLabel = article.category
                .replace('-', ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase());
              return (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  style={{
                    background: 'var(--white)',
                    border: '1px solid var(--border-gray)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    display: 'block',
                    textDecoration: 'none',
                    transition: 'all .2s',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  className="news-card"
                >
                  <div
                    style={{
                      height: '160px',
                      background: 'var(--light-gray)',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <span
                      style={{
                        fontSize: '48px',
                        zIndex: 1,
                        position: 'relative',
                        opacity: 0.2,
                        userSelect: 'none',
                      }}
                    >
                      {article.icon}
                    </span>
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        zIndex: 2,
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '5px 12px',
                        borderRadius: '100px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        background: catColor,
                        color: '#ffffff',
                      }}
                    >
                      {catLabel}
                    </div>
                  </div>
                  <div style={{ padding: '18px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        color: 'var(--text-gray)',
                        marginBottom: '8px',
                      }}
                    >
                      <span>{article.author}</span>
                      <span>·</span>
                      <span>{article.readTime} min read</span>
                    </div>
                    <h3
                      style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        lineHeight: 1.4,
                        color: 'var(--text-dark)',
                        marginBottom: '10px',
                      }}
                    >
                      {article.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '13px',
                        color: 'var(--text-gray)',
                        lineHeight: 1.6,
                      }}
                    >
                      {article.snippet.replace(/<[^>]*>/g, '')}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />

    </>
  );
}
