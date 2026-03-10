import Image from 'next/image';
import Link from 'next/link';
import type { NewsArticle } from '@/lib/types';

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

interface NewsSectionProps {
  articles: NewsArticle[];
}

export default function NewsSection({ articles }: NewsSectionProps) {
  return (
    <section
      style={{
        marginTop: '60px',
        paddingTop: '40px',
        borderTop: '1px solid var(--border-gray)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
            fontSize: '28px',
            fontWeight: 700,
            color: 'var(--text-dark)',
          }}
        >
          Latest <span style={{ color: 'var(--primary)' }}>News</span>
        </h2>
        <Link
          href="/news"
          style={{
            fontSize: '14px',
            color: 'var(--primary)',
            fontWeight: 600,
            transition: 'opacity .2s',
          }}
        >
          View All →
        </Link>
      </div>

      <div className="news-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

    </section>
  );
}

function NewsCard({ article }: { article: NewsArticle }) {
  const catColor = CAT_COLORS[article.category] || '#6b7280';
  const catLabel = article.category.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Link
      href={`/news/${article.slug}`}
      style={{
        background: 'var(--white)',
        border: '1px solid var(--border-gray)',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all .2s',
        boxShadow: 'var(--shadow-sm)',
        display: 'block',
        textDecoration: 'none',
      }}
      className="news-card"
    >
      {/* Thumbnail */}
      <div
        style={{
          height: '160px',
          background: 'var(--light-gray)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          style={{ objectFit: 'cover' }}
        />
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

      {/* Body */}
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
          <span
            style={{
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: 'var(--text-gray)',
              display: 'inline-block',
            }}
          />
          <span>{article.readTime} min read</span>
        </div>
        <h3
          style={{
            fontSize: '15px',
            fontWeight: 600,
            lineHeight: 1.4,
            color: 'var(--text-dark)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
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
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {article.snippet}
        </p>
      </div>

    </Link>
  );
}
