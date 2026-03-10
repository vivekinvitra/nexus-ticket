'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { SPORTS } from '@/lib/data/sports';

export default function SportsNav() {
  const [showAllSports, setShowAllSports] = useState(false);
  const pathname = usePathname();

  // Separate featured and other sports
  const featuredSports = SPORTS.filter(s => s.isFeatured);
  const otherSports = SPORTS.filter(s => !s.isFeatured);

  const SportLink = ({ sport, variant = 'default' }: any) => {
    const isActive = pathname === `/category/${sport.slug}`;
    const isCompact = variant === 'compact';

    return (
      <Link
        key={sport.slug}
        href={`/category/${sport.slug}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isCompact ? '4px' : '6px',
          padding: isCompact ? '6px 10px' : '8px 14px',
          fontSize: isCompact ? '13px' : '14px',
          fontWeight: isActive ? 600 : 500,
          color: isActive ? 'var(--primary)' : 'var(--text-gray)',
          background: isActive ? 'var(--primary-light)' : 'transparent',
          borderRadius: '6px',
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          transition: 'all .2s',
          flexShrink: 0,
          cursor: 'pointer',
        }}
        className="sport-nav-tab"
        onMouseEnter={() => setShowAllSports(false)}
      >
        <span style={{ fontSize: isCompact ? '14px' : '16px' }}>{sport.icon}</span>
        {sport.name}
      </Link>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        gap: '0',
      }}
      className="nav-links-scroll"
    >
      {/* Featured Sports */}
      {featuredSports.map((sport) => (
        <SportLink key={sport.slug} sport={sport} />
      ))}

      {/* More Sports Dropdown */}
      <div
        style={{
          position: 'relative',
          flexShrink: 0,
        }}
        onMouseEnter={() => setShowAllSports(true)}
        onMouseLeave={() => setShowAllSports(false)}
      >
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--text-gray)',
            background: 'transparent',
            border: 'none',
            borderRadius: '8px',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            transition: 'all .2s',
            flexShrink: 0,
          }}
          className="sport-nav-tab"
        >
          <span style={{ fontSize: '16px' }}>⋮</span>
          More Sports
          <span style={{ fontSize: '12px', marginLeft: '2px' }}>▼</span>
        </button>

        {/* Dropdown Menu */}
        {showAllSports && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: 'var(--white)',
              border: '1px solid var(--border-gray)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 1000,
              minWidth: '480px',
              maxHeight: '600px',
              overflowY: 'auto',
              marginTop: '4px',
              padding: '20px',
            }}
            onMouseEnter={() => setShowAllSports(true)}
            onMouseLeave={() => setShowAllSports(false)}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '20px',
              }}
            >
              {otherSports.map((sport) => (
                <Link
                  key={sport.slug}
                  href={`/category/${sport.slug}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--text-gray)',
                    background: 'transparent',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap',
                    textDecoration: 'none',
                    transition: 'all .2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      'var(--light-gray)';
                    (e.currentTarget as HTMLElement).style.color =
                      'var(--text-dark)';
                    (e.currentTarget as HTMLElement).style.transform =
                      'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      'transparent';
                    (e.currentTarget as HTMLElement).style.color =
                      'var(--text-gray)';
                    (e.currentTarget as HTMLElement).style.transform =
                      'translateX(0)';
                  }}
                >
                  <span style={{ fontSize: '18px', flexShrink: 0 }}>{sport.icon}</span>
                  <span>{sport.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* News Link */}
      <Link
        href="/news"
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 14px',
          fontSize: '14px',
          fontWeight: pathname === '/news' ? 600 : 500,
          color: pathname === '/news' ? 'var(--primary)' : 'var(--text-gray)',
          background:
            pathname === '/news' ? 'var(--primary-light)' : 'transparent',
          borderRadius: '8px',
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          transition: 'all .2s',
          flexShrink: 0,
        }}
        className="sport-nav-tab"
      >
        News
      </Link>

    </div>
  );
}
