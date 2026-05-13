import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#FFF0F5',
          100: '#FFE0EB',
          200: '#FFC2D9',
          300: '#FFA3C4',
          400: '#FF85B0',
          500: '#FF6B9D',
          600: '#E5558A',
          700: '#CC4077',
          800: '#992D5A',
          900: '#661E3D',
        },
        purple: {
          50: '#F5F0FF',
          100: '#EDE0FF',
          200: '#D9C2FF',
          300: '#C4A3FF',
          400: '#B085FF',
          500: '#9B6BFF',
          600: '#7C55CC',
          700: '#5D4099',
          800: '#3E2B66',
          900: '#1F1633',
        },
      },
    },
  },
  plugins: [],
};
export default config;
