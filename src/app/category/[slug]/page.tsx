import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CategoryContent from '@/components/category/CategoryContent';
import { SPORTS, getSportBySlug } from '@/lib/data/sports';
import { TICKET_EVENTS } from '@/lib/data/tickets';
import { buildMetadata } from '@/lib/utils/seo';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return SPORTS.map((sport) => ({ slug: sport.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sport = getSportBySlug(params.slug);
  if (!sport) return {};
  return buildMetadata({
    title: `${sport.name} Tickets`,
    description: sport.description,
    path: `/category/${sport.slug}`,
  });
}

export default function CategoryPage({ params }: Props) {
  const sport = getSportBySlug(params.slug);
  if (!sport) notFound();

  return (
    <>
      <Header />

      <main>
        {/* Category hero */}
        <div
          style={{
            background: 'var(--white)',
            borderBottom: '1px solid var(--border-gray)',
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '40px 40px 32px',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}
            >
              <a
                href="/"
                style={{ fontSize: '13px', color: 'var(--text-gray)', textDecoration: 'none' }}
              >
                Home
              </a>
              <span style={{ color: 'var(--text-gray)', fontSize: '13px' }}>›</span>
              <span
                style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}
              >
                {sport.name}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '16px',
                  background: 'var(--light-gray)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  flexShrink: 0,
                }}
              >
                {sport.icon}
              </div>
              <div>
                <h1
                  style={{
                    fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
                    fontSize: '36px',
                    fontWeight: 700,
                    color: 'var(--text-dark)',
                    marginBottom: '8px',
                  }}
                >
                  {sport.name} Tickets
                </h1>
                <p style={{ fontSize: '16px', color: 'var(--text-gray)', maxWidth: '600px' }}>
                  {sport.description}
                </p>
              </div>
              <div
                style={{
                  marginLeft: 'auto',
                  textAlign: 'right',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    background: 'var(--primary-light)',
                    color: 'var(--primary-dark)',
                    fontSize: '13px',
                    fontWeight: 600,
                    padding: '6px 14px',
                    borderRadius: '100px',
                    display: 'inline-block',
                  }}
                >
                  {sport.count} events listed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '32px 40px 60px',
          }}
        >
          <CategoryContent sport={sport} allEvents={TICKET_EVENTS} />
        </div>
      </main>

      <Footer />
    </>
  );
}
