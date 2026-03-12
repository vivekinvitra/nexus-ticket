'use client';

import Icon from '@/components/common/Icon';

const DATE_TABS = [
  { label: 'Today', value: 'today' },
  { label: 'Tomorrow', value: 'tomorrow' },
];

interface DateFilterBarProps {
  activeDate: string;
  onDateChange: (value: string) => void;
}

export default function DateFilterBar({ activeDate, onDateChange }: DateFilterBarProps) {
  return (
    <div
      style={{
        background: 'var(--white)',
        borderBottom: '1px solid var(--border-gray)',
      }}
    >
      <div
        className="date-filter-inner"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '16px 40px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        <span
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text-dark)',
            marginRight: '4px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          Show tickets for:
        </span>

        {DATE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onDateChange(tab.value)}
            style={{
              padding: '8px 18px',
              fontSize: '14px',
              fontWeight: 500,
              color: activeDate === tab.value ? 'var(--white)' : 'var(--text-gray)',
              background: activeDate === tab.value ? 'var(--primary)' : 'transparent',
              border: `1px solid ${activeDate === tab.value ? 'var(--primary)' : 'var(--border-gray)'}`,
              borderRadius: '8px',
              transition: 'all .2s',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--white)',
            border: '1px solid var(--border-gray)',
            borderRadius: '8px',
            padding: '8px 12px',
            flexShrink: 0,
            marginLeft: 'auto',
          }}
        >
          <Icon name="calendar" size={14} className="shrink-0" />
          <input
            type="date"
            style={{
              border: 'none',
              background: 'none',
              outline: 'none',
              fontSize: '14px',
              color: 'var(--text-dark)',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          />
        </div>
      </div>
    </div>
  );
}
