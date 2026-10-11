import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F0E0D',
        foreground: '#FAF8F5',
        ivory: {
          DEFAULT: '#FAF8F5',
          light: '#FDFBF9',
          dark: '#F0ECE4',
        },
        sand: {
          50: '#FAF8F5',
          100: '#F5F1E8',
          200: '#EBE4D5',
          300: '#DDD2BD',
          400: '#C7B79D',
          500: '#AE997B',
        },
        charcoal: {
          50: '#F5F5F5',
          100: '#E6E5E3',
          200: '#C8C6C1',
          400: '#7B7770',
          600: '#46433D',
          700: '#32302B',
          800: '#22201C',
          900: '#161513',
          950: '#0C0B0A',
        },
        wood: {
          oak: '#D3BA9B',
          walnut: '#5C4334',
          ash: '#1C1B1A',
        },
        accent: {
          DEFAULT: '#D19A66',
          light: '#E2B88D',
          dark: '#A67342',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Didot', 'Bodoni MT', 'Cinzel', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['var(--font-space-mono)', 'Space Mono', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        widest: '0.25em',
        ultra: '0.35em',
      },
      boxShadow: {
        editorial: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
        glow: '0 0 50px -10px rgba(209, 154, 102, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;

