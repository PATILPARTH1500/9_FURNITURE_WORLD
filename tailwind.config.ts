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
        // Primary brand palette from new Google Flow video interiors
        tangerine: {
          DEFAULT: '#F4510B',
          light: '#FF6F36',
          dark: '#D03E00',
        },
        rust: {
          DEFAULT: '#B84518',
          dark: '#94320C',
          light: '#D45A2B',
        },
        coral: {
          DEFAULT: '#E66B45',
          burnt: '#E66B45',
          dusty: '#D9877A',
          light: '#F5A89A',
        },
        mustard: {
          DEFAULT: '#F4B82E',
          light: '#FFCB57',
          dark: '#D89C19',
        },
        olive: {
          DEFAULT: '#626B3D',
          light: '#7B864E',
          dark: '#4B522E',
        },
        moss: {
          DEFAULT: '#35452C',
          light: '#485C3C',
          dark: '#242F1E',
        },
        cream: {
          DEFAULT: '#F4E9D8',
          light: '#FAF4EB',
          dark: '#E7D8BF',
        },
        peach: {
          DEFAULT: '#F0B49A',
          light: '#FBE0D5',
          dark: '#DE9475',
        },
        walnut: {
          DEFAULT: '#805438',
          light: '#9E6A49',
          dark: '#5E3C26',
        },
        checkerboard: {
          DEFAULT: '#29251F',
          black: '#29251F',
        },
        leaf: {
          DEFAULT: '#477A48',
          light: '#5E9A60',
          dark: '#355C36',
        },
        // Semantic and legacy compat
        background: '#F4E9D8',
        foreground: '#29251F',
        accent: {
          DEFAULT: '#F4510B',
          light: '#FF6F36',
          dark: '#D03E00',
        },
        ivory: {
          DEFAULT: '#FAF8F5',
          light: '#FFFFFF',
          dark: '#F4E9D8',
        },
        sand: {
          50: '#FAF8F5',
          100: '#F4E9D8',
          200: '#E8D8BF',
          300: '#D5BE9E',
          400: '#B89B77',
          500: '#805438',
        },
        charcoal: {
          50: '#F7F6F5',
          100: '#EAE8E5',
          200: '#D5D2CD',
          400: '#8A857D',
          600: '#524D45',
          700: '#3D3830',
          800: '#29251F',
          900: '#1E1B17',
          950: '#141210',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'var(--font-cormorant)', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'var(--font-inter)', 'DM Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.03em',
        widest: '0.15em',
        ultra: '0.25em',
      },
      boxShadow: {
        retro: '0 10px 30px -10px rgba(41, 37, 31, 0.15)',
        warm: '0 15px 35px -5px rgba(244, 81, 11, 0.2)',
      },
    },
  },
  plugins: [],
};

export default config;
