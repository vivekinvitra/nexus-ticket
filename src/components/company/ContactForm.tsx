'use client';

import { useState } from 'react';

const EMAIL_CONTACTS = [
  { icon: '📧', label: 'General Enquiries', value: 'info@ticket-nexus.com' },
  { icon: '🤝', label: 'Partner with Us', value: 'partners@ticket-nexus.com' },
  { icon: '📰', label: 'Press & Media', value: 'press@ticket-nexus.com' },
];

const TOPICS = [
  { value: 'general', label: 'General Enquiry' },
  { value: 'partner', label: 'Partner / Advertise' },
  { value: 'press', label: 'Press & Media' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'other', label: 'Other' },
];

export default function ContactForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email,
          topic,
          description,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
      setFirstName('');
      setLastName('');
      setEmail('');
      setTopic('');
      setDescription('');
    } catch {
      setErrorMsg('Network error. Please try again.');
      setStatus('error');
    }
  }

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '40px',
        }}
      >
        {EMAIL_CONTACTS.map(({ icon, label, value }) => (
          <div
            key={label}
            style={{
              background: 'var(--white)',
              border: '1px solid var(--border-gray)',
              borderRadius: '12px',
              padding: '22px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '30px', marginBottom: '8px' }}>{icon}</div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: 'var(--text-gray)',
                marginBottom: '5px',
              }}
            >
              {label}
            </div>
            <a
              href={`mailto:${value}`}
              style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}
            >
              {value}
            </a>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--white)', border: '1px solid var(--border-gray)', borderRadius: '12px', padding: '32px' }}>
        <h2 style={{ fontFamily: 'var(--font-poppins, Poppins, sans-serif)', fontSize: '18px', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '22px' }}>
          Send Us a Message
        </h2>

        {status === 'success' ? (
          <div style={{ padding: '20px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', color: '#166534', fontSize: '15px', fontWeight: 600 }}>
            Message sent! We&apos;ll get back to you soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '5px' }}>First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 13px', border: '1px solid var(--border-gray)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-dark)', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '5px' }}>Last Name</label>
                <input
                  type="text"
                  placeholder="Smith"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 13px', border: '1px solid var(--border-gray)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-dark)', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '5px' }}>Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 13px', border: '1px solid var(--border-gray)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-dark)', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '5px' }}>Subject</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 13px', border: '1px solid var(--border-gray)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-dark)', outline: 'none', background: 'var(--white)', boxSizing: 'border-box' }}
              >
                <option value="">Select a topic...</option>
                {TOPICS.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '5px' }}>Message</label>
              <textarea
                rows={5}
                placeholder="How can we help?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 13px', border: '1px solid var(--border-gray)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-dark)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>

            {status === 'error' && (
              <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', color: '#991b1b', fontSize: '13px' }}>
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              style={{ alignSelf: 'flex-start', background: 'var(--primary)', color: 'var(--white)', border: 'none', borderRadius: '8px', padding: '11px 26px', fontSize: '15px', fontWeight: 600, cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.7 : 1 }}
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
