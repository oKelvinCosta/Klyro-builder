import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'gamay-editorial': ['gamay-editorial', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        azure: {
          50: 'hsl(var(--azure-50))',
          100: 'hsl(var(--azure-100))',
          200: 'hsl(var(--azure-200))',
          300: 'hsl(var(--azure-300))',
          400: 'hsl(var(--azure-400))',
          500: 'hsl(var(--azure-500))',
          600: 'hsl(var(--azure-600))',
          700: 'hsl(var(--azure-700))',
          800: 'hsl(var(--azure-800))',
          900: 'hsl(var(--azure-900))',
          950: 'hsl(var(--azure-950))',
        },
        purple: {
          50: 'hsl(var(--purple-50))',
          100: 'hsl(var(--purple-100))',
          200: 'hsl(var(--purple-200))',
          300: 'hsl(var(--purple-300))',
          400: 'hsl(var(--purple-400))',
          500: 'hsl(var(--purple-500))',
          600: 'hsl(var(--purple-600))',
          700: 'hsl(var(--purple-700))',
          800: 'hsl(var(--purple-800))',
          900: 'hsl(var(--purple-900))',
          950: 'hsl(var(--purple-950))',
        },

        neon: {
          50: 'hsl(var(--neon-50))',
          100: 'hsl(var(--neon-100))',
          200: 'hsl(var(--neon-200))',
          300: 'hsl(var(--neon-300))',
          400: 'hsl(var(--neon-400))',
          500: 'hsl(var(--neon-500))',
          600: 'hsl(var(--neon-600))',
          700: 'hsl(var(--neon-700))',
          800: 'hsl(var(--neon-800))',
          900: 'hsl(var(--neon-900))',
          950: 'hsl(var(--neon-950))',
        },
        space: {
          50: 'hsl(var(--space-50))',
          100: 'hsl(var(--space-100))',
          200: 'hsl(var(--space-200))',
          300: 'hsl(var(--space-300))',
          400: 'hsl(var(--space-400))',
          500: 'hsl(var(--space-500))',
          600: 'hsl(var(--space-600))',
          700: 'hsl(var(--space-700))',
          800: 'hsl(var(--space-800))',
          900: 'hsl(var(--space-900))',
          950: 'hsl(var(--space-950))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        pulseShadow: {
          '0%': {
            boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.7)',
          },
          '50%': {
            boxShadow: '0 0 0 8px rgba(0, 0, 0, 0)',
          },
          '80%': {
            boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
          },
          '100%': {
            boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.7)',
          },
        },
        pulseBlink: {
          '0%': {
            filter: 'brightness(1)',
          },
          '100%': {
            filter: 'brightness(1)',
          },
          '50%': {
            filter: 'brightness(1.35)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        pulseShadow: 'pulseShadow 1.5s infinite',
        pulseBlink: 'pulseBlink 1.5s infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
