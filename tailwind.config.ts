import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981',
          dark: '#059669',
          light: '#d1fae5',
        },
        accent: {
          DEFAULT: '#3b82f6',
          light: '#dbeafe',
        },
        orange: {
          DEFAULT: '#f59e0b',
          light: '#fef3c7',
        },
        'text-dark': '#1f2937',
        'text-gray': '#6b7280',
        'border-gray': '#e0e0e0',
        'light-gray': '#f5f5f5',
        'off-white': '#fafafa',
      },
      fontFamily: {
        head: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        body: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.08)',
        DEFAULT: '0 4px 6px rgba(0,0,0,0.07)',
        lg: '0 10px 25px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
};

export default config;
