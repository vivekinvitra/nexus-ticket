'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { SPORTS } from '@/lib/data/sports';

export default function SportsNav() {
  const [showDropdown, setShowDropdown] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const featuredSports = SPORTS.filter((s) => s.isFeatured);
  const otherSports = SPORTS.filter((s) => !s.isFeatured);

  const openDropdown = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setShowDropdown(true);
  };

  const closeDropdown = () => {
    hideTimer.current = setTimeout(() => setShowDropdown(false), 80);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flex: 1,
        overflowX: 'visible',
        gap: '0',
      }}
      className="nav-links-scroll"
    >
      {/* Featured sports */}
      {featuredSports.map((sport) => {
        const isActive = pathname === `/${sport.slug}`;
        return (
          <Link
            key={sport.slug}
            href={`/${sport.slug}`}
            onMouseEnter={closeDropdown}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              fontSize: '14px',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--primary)' : 'var(--text-gray)',
              background: isActive ? 'var(--primary-light)' : 'transparent',
              borderRadius: '6px',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              transition: 'all .15s',
              flexShrink: 0,
            }}
            className="sport-nav-tab"
          >
            <span style={{ fontSize: '16px' }}>{sport.icon}</span>
            {sport.name}
          </Link>
        );
      })}

      {/* More Sports trigger */}
      <div
        style={{ position: 'relative', flexShrink: 0 }}
        onMouseEnter={openDropdown}
        onMouseLeave={closeDropdown}
      >
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '8px 14px',
            fontSize: '14px',
            fontWeight: showDropdown ? 600 : 500,
            color: showDropdown ? 'var(--primary)' : 'var(--text-gray)',
            background: showDropdown ? 'var(--primary-light)' : 'transparent',
            border: 'none',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            transition: 'all .15s',
            flexShrink: 0,
          }}
          className="sport-nav-tab"
          aria-haspopup="true"
          aria-expanded={showDropdown}
        >
          <span style={{ fontSize: '16px' }}>⋮</span>
          More Sports
          <svg
            width="11" height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: 'transform .2s',
              transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Mega-dropdown */}
        {showDropdown && (
          <div
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.13)',
              zIndex: 1000,
              width: '560px',
              padding: '0',
              overflow: 'hidden',
              animation: 'dropdownFadeIn .15s ease',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '14px 20px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                All Sports
              </span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                {otherSports.length} categories
              </span>
            </div>

            {/* Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '2px',
              padding: '8px',
            }}>
              {otherSports.map((sport) => {
                const isActive = pathname === `/${sport.slug}`;
                return (
                  <Link
                    key={sport.slug}
                    href={`/${sport.slug}`}
                    onClick={() => setShowDropdown(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'background .12s',
                      background: isActive ? '#f0f9ff' : 'transparent',
                    }}
                    className="more-sports-item"
                  >
                    {/* Icon circle */}
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      background: `${sport.color}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      flexShrink: 0,
                    }}>
                      {sport.icon}
                    </div>
                    {/* Text */}
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? 'var(--primary)' : '#0f172a',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {sport.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '1px' }}>
                        {sport.count} events
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Footer */}
            <div style={{
              padding: '12px 20px',
              borderTop: '1px solid #f1f5f9',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                {"Can't find your sport?"}
              </span>
              <Link
                href="/football"
                onClick={() => setShowDropdown(false)}
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  textDecoration: 'none',
                }}
              >
                Browse all tickets →
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* News link */}
      <Link
        href="/news"
        onMouseEnter={closeDropdown}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: pathname === '/news' ? 700 : 500,
          color: pathname === '/news' ? '#fff' : 'var(--text-gray)',
          background: pathname === '/news' ? 'var(--primary)' : 'transparent',
          borderRadius: '6px',
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          transition: 'all .15s',
          flexShrink: 0,
          marginLeft: '4px',
        }}
        className="sport-nav-tab"
      >
        News
      </Link>

    </div>
  );
}
