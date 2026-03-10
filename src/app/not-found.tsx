import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main
        style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 40px',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <div style={{ fontSize: '80px', marginBottom: '24px' }}>🎫</div>
          <h1
            style={{
              fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
              fontSize: '48px',
              fontWeight: 800,
              color: 'var(--text-dark)',
              marginBottom: '8px',
            }}
          >
            404
          </h1>
          <h2
            style={{
              fontFamily: 'var(--font-poppins, Poppins, sans-serif)',
              fontSize: '22px',
              fontWeight: 700,
              color: 'var(--text-dark)',
              marginBottom: '12px',
            }}
          >
            Page Not Found
          </h2>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--text-gray)',
              lineHeight: 1.7,
              marginBottom: '28px',
            }}
          >
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            style={{
              background: 'var(--primary)',
              color: 'var(--white)',
              fontSize: '15px',
              fontWeight: 600,
              padding: '12px 28px',
              borderRadius: '8px',
              display: 'inline-block',
              textDecoration: 'none',
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
