import type { Config } from 'tailwindcss';

import tailwindcssAnimate from 'tailwindcss-animate';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-work-sans)', 'sans-serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        background: '#000103',
        primary: '#F45D01',
        secondary: '#3E6259',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
