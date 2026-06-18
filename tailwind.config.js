/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        ivory: '#FAF8F5',
        charcoal: '#2C2C2C',
        terracotta: '#C4735B',
        'terracotta-light': '#E8A895',
        'terracotta-dark': '#A35A44',
        sand: '#E8E2DA',
        'warm-gray': '#8B8580',
        'light-warm': '#F0ECE6',
        cream: '#FFF9F3',
        'zone-bg': '#F5F1EC',
        'zone-border': '#E0D8CF',
        'drawer-bg': '#FFFDF9',
        'drawer-shadow': '#D8D0C6',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
      borderRadius: {
        'wardrobe': '12px',
        'zone': '16px',
      },
      boxShadow: {
        'wardrobe': '0 2px 12px rgba(44, 44, 44, 0.06)',
        'wardrobe-hover': '0 4px 20px rgba(44, 44, 44, 0.1)',
        'card': '0 1px 8px rgba(44, 44, 44, 0.04)',
        'zone': '0 1px 3px rgba(44, 44, 44, 0.04), 0 0 0 1px rgba(44, 44, 44, 0.03)',
        'zone-hover': '0 4px 16px rgba(44, 44, 44, 0.08), 0 0 0 1px rgba(44, 44, 44, 0.04)',
        'drawer': '0 2px 8px rgba(44, 44, 44, 0.06), inset 0 1px 0 rgba(255,255,255,0.5)',
        'drop-active': '0 0 0 2px #C4735B, 0 4px 16px rgba(196, 115, 91, 0.2)',
        'inset': 'inset 0 2px 6px rgba(44, 44, 44, 0.06)',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(8px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'pulse-gentle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'bounce-soft': 'bounce-soft 0.3s ease-out',
        'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
