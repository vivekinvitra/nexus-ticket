import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { buildMetadata } from '@/lib/utils/seo';
import { PAGES, getPageBySlug, getPagesByGroup } from '@/lib/data/pages';
import ContactForm from '@/components/company/ContactForm';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getPageBySlug(params.slug);
  if (!page) return {};
  return buildMetadata({
    title: page.metaTitle ?? `${page.title} | TicketNexus`,
    description: page.metaDescription,
    keywords: page.metaKeywords,
    path: `/company/${params.slug}`,
  });
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ currentSlug }: { currentSlug: string }) {
  const companyPages = getPagesByGroup('company');
  const legalPages = getPagesByGroup('legal');

  const navGroup = (label: string, pages: typeof companyPages) => (
    <div style={{ marginBottom: '4px' }}>
      <div
        style={{
          padding: '10px 20px',
          fontSize: '11px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-gray)',
          borderBottom: '1px solid var(--border-gray)',
        }}
      >
        {label}
      </div>
      {pages.map((p) => {
        const isActive = p.slug === currentSlug;
        return (
          <Link
            key={p.slug}
            href={`/company/${p.slug}`}
            style={{
              display: 'block',
              padding: '11px 20px',
              fontSize: '14px',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--primary)' : 'var(--text-gray)',
              background: isActive ? 'var(--primary-light)' : 'transparent',
              borderLeft: `3px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
              textDecoration: 'none',
            }}
          >
            {p.title}
          </Link>
        );
      })}
    </div>
  );

  return (
    <aside style={{ minWidth: 0 }}>
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
        {navGroup('Company', companyPages)}
        {navGroup('Legal', legalPages)}
      </div>
    </aside>
  );
}

// ── About content ─────────────────────────────────────────────────────────────
function AboutContent() {
  return (
    <>
      <div
        style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
          borderRadius: '12px',
          padding: '48px 40px',
          textAlign: 'center',
          marginBottom: '32px',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
            fontSize: '36px',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '12px',
          }}
        >
          About TicketNexus
        </h1>
        <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, maxWidth: '560px', margin: '0 auto' }}>
          We help sports fans find the best ticket prices — comparing trusted sellers in one place.
        </p>
      </div>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontFamily: 'var(--font-poppins, Poppins, sans-serif)', fontSize: '22px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '14px' }}>
          Our Mission
        </h2>
        <p style={{ fontSize: '15px', color: 'var(--text-gray)', lineHeight: 1.8, marginBottom: '14px' }}>
          TicketNexus was built with a simple goal: make it easy for fans to find the best price for the events they love. Live sport is one of life{"'"}s great experiences — but navigating dozens of ticketing platforms to find a fair deal can be exhausting.
        </p>
        <p style={{ fontSize: '15px', color: 'var(--text-gray)', lineHeight: 1.8 }}>
          We aggregate listings from trusted partners, surface the best prices, and link you directly to the seller — so you can spend less time searching and more time in the stands.
        </p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
        {[
          { value: '1,200+', label: 'Events Listed' },
          { value: '28', label: 'Sports Covered' },
          { value: '2', label: 'Trusted Partners' },
        ].map(({ value, label }) => (
          <div key={label} style={{ background: 'var(--white)', border: '1px solid var(--border-gray)', borderRadius: '12px', padding: '24px 16px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-poppins, Poppins, sans-serif)', fontSize: '28px', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>{value}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-gray)' }}>{label}</div>
          </div>
        ))}
      </div>

      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ fontFamily: 'var(--font-poppins, Poppins, sans-serif)', fontSize: '22px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '20px' }}>
          How It Works
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { step: '1', title: 'Search for your event', desc: 'Browse by sport, league or event name to find the fixture you want to attend.' },
            { step: '2', title: 'Compare prices', desc: 'We show you prices side-by-side from our verified partner platforms so you can see who has the best deal.' },
            { step: '3', title: 'Buy securely', desc: 'Click through to your chosen seller and complete your purchase directly on their secure site.' },
          ].map(({ step, title, desc }) => (
            <div key={step} style={{ display: 'flex', gap: '18px', background: 'var(--white)', border: '1px solid var(--border-gray)', borderRadius: '12px', padding: '18px 22px', alignItems: 'flex-start' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
                {step}
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-dark)', marginBottom: '3px' }}>{title}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-gray)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ background: 'var(--light-gray)', borderRadius: '12px', padding: '20px', fontSize: '14px', color: 'var(--text-gray)', lineHeight: 1.6 }}>
        <strong style={{ color: 'var(--text-dark)' }}>Affiliate Disclosure:</strong> TicketNexus earns a commission when you purchase through our partner links. This never affects the price you pay.{' '}
        <Link href="/company/affiliate-disclosure" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Learn more</Link>.
      </div>
    </>
  );
}

// ── Contact content ───────────────────────────────────────────────────────────
function ContactContent() {
  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-poppins, Poppins, sans-serif)', fontSize: '32px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '8px' }}>
        Contact Us
      </h1>
      <p style={{ fontSize: '15px', color: 'var(--text-gray)', marginBottom: '36px' }}>
        Have a question or feedback? We{"'"}d love to hear from you.
      </p>

      <ContactForm />
    </>
  );
}

// ── Legal content ─────────────────────────────────────────────────────────────
function LegalContent({ page }: { page: { title: string; lastUpdated?: string; content?: string } }) {
  const sections = (page.content ?? '').trim().split(/\n(?=## )/).filter(Boolean);

  return (
    <>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontFamily: 'var(--font-poppins, Poppins, sans-serif)', fontSize: '36px', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '6px' }}>
          {page.title}
        </h1>
        {page.lastUpdated && (
          <p style={{ fontSize: '13px', color: 'var(--text-gray)' }}>Last updated: {page.lastUpdated}</p>
        )}
      </div>

      <div style={{ background: 'var(--white)', border: '1px solid var(--border-gray)', borderRadius: '12px', padding: '40px', boxShadow: 'var(--shadow-sm)' }}>
        {sections.map((section, i) => {
          const lines = section.split('\n');
          const heading = lines[0].replace(/^##\s+/, '');
          const body = lines.slice(1).join('\n').trim();
          return (
            <div key={i} style={{ marginBottom: i < sections.length - 1 ? '28px' : 0, paddingBottom: i < sections.length - 1 ? '28px' : 0, borderBottom: i < sections.length - 1 ? '1px solid var(--border-gray)' : 'none' }}>
              <h2 style={{ fontFamily: 'var(--font-poppins, Poppins, sans-serif)', fontSize: '17px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '10px' }}>
                {heading}
              </h2>
              <div style={{ fontSize: '14px', color: 'var(--text-gray)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {body}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '28px', background: 'var(--primary-light)', border: '1px solid var(--primary)', borderRadius: '12px', padding: '22px' }}>
        <h3 style={{ fontFamily: 'var(--font-poppins, Poppins, sans-serif)', fontSize: '15px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '6px' }}>
          Questions?
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-gray)', lineHeight: 1.6 }}>
          If you have questions about this policy, email us at{' '}
          <a href="mailto:info@ticket-nexus.com" style={{ color: 'var(--primary)', fontWeight: 600 }}>info@ticket-nexus.com</a>.
        </p>
      </div>
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CompanyPage({ params }: Props) {
  const page = getPageBySlug(params.slug);
  if (!page) notFound();

  return (
    <>
      <Header />

      <main>
        {/* Breadcrumb */}
        <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border-gray)', padding: '16px 40px' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <Link href="/" style={{ color: 'var(--text-gray)', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: 'var(--text-gray)' }}>›</span>
            <span style={{ color: 'var(--text-gray)', textTransform: 'capitalize' }}>{page.group}</span>
            <span style={{ color: 'var(--text-gray)' }}>›</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{page.title}</span>
          </div>
        </div>

        {/* Two-column layout */}
        <div
          style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 40px 80px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: '40px' }}
          className="legal-grid"
        >
          <Sidebar currentSlug={params.slug} />

          <div>
            {params.slug === 'about' && <AboutContent />}
            {params.slug === 'contact' && <ContactContent />}
            {page.group === 'legal' && <LegalContent page={page} />}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
