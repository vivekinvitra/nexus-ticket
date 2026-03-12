'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Icon from '@/components/common/Icon';
import { SPORTS } from '@/lib/data/sports';
import SportsNav from './SportsNav';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();

  return (
    <header>
      {/* ── Single sticky nav bar ── */}
      <nav
        style={{
          height: 'var(--nav-h)',
          background: 'var(--white)',
          borderBottom: '1px solid var(--border-gray)',
          position: 'sticky',
          top: 0,
          zIndex: 900,
          display: 'flex',
          alignItems: 'center',
          padding: '0 32px',
          gap: '0',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'visible',
        }}
      >
        {/* Logo — never shrinks */}
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
            fontSize: '22px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flexShrink: 0,
            color: 'var(--text-dark)',
            marginRight: '8px',
            textDecoration: 'none',
          }}
        >
          <span style={{ color: 'var(--primary)' }}>Ticket</span>Nexus          
        </Link>

        {/* Sports + News Navigation */}
        <SportsNav />

        {/* Right: search + CTA — never shrinks */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0,
            marginLeft: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--light-gray)',
              border: '1px solid var(--border-gray)',
              borderRadius: '8px',
              padding: '8px 12px',
              transition: 'all .2s',
            }}
            className="hidden md:flex"
          >
            <Icon name="search" size={15} className="shrink-0" />
            <input
              type="text"
              placeholder="Search events…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--text-dark)',
                fontSize: '13px',
                width: '150px',
              }}
            />
          </div>          

          <Link
            href="/football"
            style={{
              background: 'var(--primary)',
              color: 'var(--white)',
              fontSize: '13px',
              fontWeight: 600,
              padding: '9px 18px',
              borderRadius: '8px',
              transition: 'all .2s',
              textDecoration: 'none',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
            className="hidden md:block"
          >
            Get Tickets
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'none',
              padding: '8px',
              color: 'var(--text-dark)',
              border: 'none',
            }}
            className="md:hidden"
            aria-label="Toggle menu"
          >
            <Icon name={mobileOpen ? 'x' : 'menu'} size={22} />
          </button>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div
          style={{
            background: 'var(--white)',
            borderBottom: '1px solid var(--border-gray)',
            padding: '16px 20px',
            boxShadow: 'var(--shadow)',
          }}
        >
          {/* Mobile search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--light-gray)',
              border: '1px solid var(--border-gray)',
              borderRadius: '8px',
              padding: '10px 14px',
              marginBottom: '12px',
            }}
          >
            <Icon name="search" size={15} className="shrink-0" />
            <input
              type="text"
              placeholder="Search events…"
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                color: 'var(--text-dark)',
                width: '100%',
              }}
            />
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {SPORTS.map((sport) => (
              <Link
                key={sport.slug}
                href={`/${sport.slug}`}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '15px',
                  fontWeight: 500,
                  color: 'var(--text-gray)',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all .2s',
                }}
              >
                <span style={{ fontSize: '18px', width: '24px' }}>{sport.icon}</span>
                {sport.name}
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text-gray)',
                    background: 'var(--light-gray)',
                    padding: '2px 8px',
                    borderRadius: '100px',
                  }}
                >
                  {sport.count}
                </span>
              </Link>
            ))}

            <div style={{ height: '1px', background: 'var(--border-gray)', margin: '8px 0' }} />

            <Link
              href="/news"
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                fontSize: '15px',
                fontWeight: 500,
                color: 'var(--text-gray)',
                padding: '10px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              📰 News
            </Link>
            <Link
              href="/partners"
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                fontSize: '15px',
                fontWeight: 500,
                color: 'var(--text-gray)',
                padding: '10px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              🤝 Partners
            </Link>
          </nav>

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: '8px',
                border: '1px solid var(--border-gray)',
                background: 'transparent',
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--text-dark)',
              }}
            >
              Sign In
            </button>
            <Link
              href="/football"
              onClick={() => setMobileOpen(false)}
              style={{
                flex: 1,
                padding: '11px',
                borderRadius: '8px',
                background: 'var(--primary)',
                color: 'var(--white)',
                fontSize: '14px',
                fontWeight: 600,
                textAlign: 'center',
                textDecoration: 'none',
              }}
            >
              Get Tickets
            </Link>
          </div>
        </div>
      )}

    </header>
  );
}
