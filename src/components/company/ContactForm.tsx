'use client';

const EMAIL_CONTACTS = [
  { icon: '📧', label: 'General Enquiries', value: 'info@ticket-nexus.com' },
  { icon: '🤝', label: 'Partner with Us', value: 'partners@ticket-nexus.com' },
  { icon: '📰', label: 'Press & Media', value: 'press@ticket-nexus.com' },
];

export default function ContactForm() {
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
        <form style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {['First Name', 'Last Name'].map((label) => (
              <div key={label}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '5px' }}>{label}</label>
                <input
                  type="text"
                  placeholder={label === 'First Name' ? 'John' : 'Smith'}
                  style={{ width: '100%', padding: '10px 13px', border: '1px solid var(--border-gray)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-dark)', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '5px' }}>Email Address</label>
            <input
              type="email"
              placeholder="john@example.com"
              style={{ width: '100%', padding: '10px 13px', border: '1px solid var(--border-gray)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-dark)', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '5px' }}>Subject</label>
            <select
              style={{ width: '100%', padding: '10px 13px', border: '1px solid var(--border-gray)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-dark)', outline: 'none', background: 'var(--white)', boxSizing: 'border-box' }}
            >
              <option value="">Select a topic...</option>
              <option value="general">General Enquiry</option>
              <option value="partner">Partner / Advertise</option>
              <option value="press">Press & Media</option>
              <option value="feedback">Feedback</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '5px' }}>Message</label>
            <textarea
              rows={5}
              placeholder="How can we help?"
              style={{ width: '100%', padding: '10px 13px', border: '1px solid var(--border-gray)', borderRadius: '8px', fontSize: '14px', color: 'var(--text-dark)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>
          <button
            type="submit"
            style={{ alignSelf: 'flex-start', background: 'var(--primary)', color: 'var(--white)', border: 'none', borderRadius: '8px', padding: '11px 26px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
          >
            Send Message
          </button>
        </form>
      </div>
    </>
  );
}
