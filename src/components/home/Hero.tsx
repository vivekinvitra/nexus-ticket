'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { LEAGUES as ALL_LEAGUES } from '@/lib/data/leagues';

const HERO_SLUGS = ['premier-league', 'fifa-world-cup', 'champions-league', 'europa-league', 'la-liga'];
const LEAGUES = HERO_SLUGS.map((slug) => ALL_LEAGUES.find((l) => l.slug === slug)).filter(Boolean) as typeof ALL_LEAGUES;

export default function Hero() {
  const [active, setActive] = useState(0);
  const paused = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!paused.current) {
        setActive((prev) => (prev + 1) % LEAGUES.length);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleDotClick = (i: number) => {
    setActive(i);
    paused.current = true;
    setTimeout(() => { paused.current = false; }, 10000);
  };

  const league = LEAGUES[active];
  const href = `/${league.sportSlug}/${league.slug}`;

  return (
    <section style={{ background: '#0f0f0f' }}>
      {/* ── Slider ── */}
      <div
        className="hero-slider"
        style={{
          position: 'relative',
          background: league.heroBg,
          transition: 'background 0.5s ease',
          overflow: 'hidden',
        }}
      >
        {/* Accent top bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: league.color,
            transition: 'background 0.5s ease',
            zIndex: 3,
          }}
        />


        {/* Content */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div
          style={{
            maxWidth: '760px',
            padding: '56px 40px 48px',
          }}
          className="hero-content"
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.08)',
              color: league.color,
              borderRadius: '100px',
              padding: '5px 14px',
              fontSize: '12px',
              fontWeight: 600,
              marginBottom: '24px',
              border: `1px solid ${league.color}40`,
              transition: 'color 0.5s, border-color 0.5s',
            }}
          >
            <span style={{ fontSize: '8px' }} className="animate-pulse-dot">●</span>
            {league.sportName} · Featured Event
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
              fontSize: 'clamp(22px, 3vw, 40px)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#ffffff',
              marginBottom: '16px',
            }}
            className="hero-h1"
          >
            {league.name}
          </h1>

          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', marginBottom: '10px' }}>
            📍 {league.location}
          </p>

          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginBottom: '36px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: league.color, fontSize: '13px' }}>📅</span>
            {league.date}
          </p>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link
              href={href}
              style={{
                background: league.color,
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 700,
                padding: '14px 32px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                letterSpacing: '0.5px',
                transition: 'opacity .2s',
              }}
            >
              BUY TICKETS NOW
            </Link>
            <Link
              href="/football"
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '14px',
                fontWeight: 500,
                padding: '13px 24px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.15)',
                transition: 'all .2s',
              }}
            >
              Browse All Events
            </Link>
          </div>

          {/* Dot indicators */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '40px', alignItems: 'center' }}>
            {LEAGUES.map((l, i) => (
              <button
                key={l.slug}
                onClick={() => handleDotClick(i)}
                title={l.name}
                style={{
                  width: i === active ? '32px' : '8px',
                  height: '8px',
                  borderRadius: '100px',
                  border: 'none',
                  cursor: 'pointer',
                  background: i === active ? league.color : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-content { padding: 40px 20px 36px !important; max-width: 100% !important; }
        }
        @media (max-width: 640px) {
          .hero-content { padding: 24px 16px 28px !important; }
          .hero-content a { padding: 11px 20px !important; font-size: 13px !important; }
        }
      `}</style>
    </section>
  );
}
