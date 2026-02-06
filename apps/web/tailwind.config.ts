import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981',
          hover: '#059669',
        },
        border: '#E4E4E7',
        muted: '#71717A',
      },
      borderRadius: {
        lg: '24px',
      },
      keyframes: {
        'brush-stroke': {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'brush-stroke': 'brush-stroke 0.6s ease-in-out',
      },
    },
  },
};

export default config;