const { FONT_FAMILIES, FONT_SIZES, FONT_WEIGHTS, LINE_HEIGHTS, LETTER_SPACINGS } = require('./src/typography/constants');

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        // Display fonts (Louize)
        'display': ['Louize Display', 'system-ui', 'sans-serif'],
        'louize': ['Louize Display', 'system-ui', 'sans-serif'],
        
        // Body fonts (CX80 variations)
        'sans': ['CX80', 'system-ui', 'sans-serif'],
        'cx80': ['CX80', 'system-ui', 'sans-serif'],
        'cx80-var': ['CX80 Variable', 'system-ui', 'sans-serif'],
        'cx80-0': ['CX80-0', 'system-ui', 'sans-serif'],
        'cx80-1': ['CX80-1', 'system-ui', 'sans-serif'],
        'cx80-2': ['CX80-2', 'system-ui', 'sans-serif'],
        'cx80-3': ['CX80-3', 'system-ui', 'sans-serif'],
        'cx80-0-var': ['CX80-0 Variable', 'system-ui', 'sans-serif'],
        'cx80-1-var': ['CX80-1 Variable', 'system-ui', 'sans-serif'],
        'cx80-2-var': ['CX80-2 Variable', 'system-ui', 'sans-serif'],
        'cx80-3-var': ['CX80-3 Variable', 'system-ui', 'sans-serif'],
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
        
        // Fluid typography
        'fluid-sm': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        'fluid-base': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'fluid-lg': 'clamp(1rem, 0.9rem + 0.5vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 1.3rem + 1vw, 2rem)',
        'fluid-3xl': 'clamp(2rem, 1.5rem + 2.5vw, 3rem)',
        'fluid-4xl': 'clamp(2.5rem, 1.8rem + 3.5vw, 4rem)',
        'fluid-5xl': 'clamp(3rem, 2rem + 5vw, 5rem)',
        'fluid-hero': 'clamp(4rem, 2.5rem + 7.5vw, 8rem)',
      },
      
      fontWeight: {
        'light': '300',
        'regular': '400',
        'medium': '500',
        'bold': '700',
      },
      
      lineHeight: {
        'none': '1',
        'tight': '1.25',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '2',
      },
      
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
      
      // Animation for typography
      animation: {
        // Modal animations
        'in': 'in 0.2s ease-out',
        'out': 'out 0.2s ease-in',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-in',
        'zoom-in': 'zoom-in 0.2s ease-out',
        'zoom-out': 'zoom-out 0.2s ease-in',
        // Text animations
        'text-gradient': 'text-gradient 3s linear infinite',
        'text-bounce': 'text-bounce 2s ease-in-out infinite',
        'text-pulse': 'text-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'text-slide-up': 'text-slide-up 0.5s ease-out',
        'text-slide-down': 'text-slide-down 0.5s ease-out',
        'text-fade-in': 'text-fade-in 0.5s ease-out',
        'text-typewriter': 'text-typewriter 2s steps(40, end)',
      },
      
      keyframes: {
        // Modal animations
        'in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'out': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'zoom-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'zoom-out': {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
        // Text animations
        'text-gradient': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'text-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'text-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'text-slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'text-slide-down': {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'text-fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'text-typewriter': {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  
  plugins: [
    require('tailwindcss-animate'),
    // Plugin to add typography utilities
    function({ addUtilities, theme }) {
      const typographyUtilities = {
        // Text rendering utilities
        '.text-render-optimize': {
          'text-rendering': 'optimizeLegibility',
          '-webkit-font-smoothing': 'antialiased',
          '-moz-osx-font-smoothing': 'grayscale',
        },
        '.text-render-speed': {
          'text-rendering': 'optimizeSpeed',
        },
        
        // Font variant utilities
        '.font-variant-numeric': {
          'font-variant-numeric': 'normal',
        },
        '.font-variant-tabular': {
          'font-variant-numeric': 'tabular-nums',
        },
        '.font-variant-oldstyle': {
          'font-variant-numeric': 'oldstyle-nums',
        },
        '.font-variant-proportional': {
          'font-variant-numeric': 'proportional-nums',
        },
        
        // Text balance utilities
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.text-pretty': {
          'text-wrap': 'pretty',
        },
        
        // Variable font utilities
        '.font-var-weight': {
          'font-variation-settings': '"wght" var(--font-weight, 400)',
        },
        '.font-var-width': {
          'font-variation-settings': '"wdth" var(--font-width, 100)',
        },
        '.font-var-slant': {
          'font-variation-settings': '"slnt" var(--font-slant, 0)',
        },
        
        // Typography presets matching our variants
        '.typography-hero': {
          fontFamily: theme('fontFamily.display'),
          fontSize: theme('fontSize.9xl'),
          fontWeight: theme('fontWeight.bold'),
          lineHeight: theme('lineHeight.none'),
          letterSpacing: theme('letterSpacing.tight'),
        },
        '.typography-title1': {
          fontFamily: theme('fontFamily.display'),
          fontSize: theme('fontSize.7xl'),
          fontWeight: theme('fontWeight.bold'),
          lineHeight: theme('lineHeight.tight'),
          letterSpacing: theme('letterSpacing.tight'),
        },
        '.typography-title2': {
          fontFamily: theme('fontFamily.display'),
          fontSize: theme('fontSize.5xl'),
          fontWeight: theme('fontWeight.medium'),
          lineHeight: theme('lineHeight.tight'),
          letterSpacing: theme('letterSpacing.normal'),
        },
        '.typography-title3': {
          fontFamily: theme('fontFamily.display'),
          fontSize: theme('fontSize.4xl'),
          fontWeight: theme('fontWeight.medium'),
          lineHeight: theme('lineHeight.snug'),
          letterSpacing: theme('letterSpacing.normal'),
        },
        '.typography-h1': {
          fontFamily: theme('fontFamily.sans'),
          fontSize: theme('fontSize.3xl'),
          fontWeight: theme('fontWeight.bold'),
          lineHeight: theme('lineHeight.snug'),
        },
        '.typography-h2': {
          fontFamily: theme('fontFamily.sans'),
          fontSize: theme('fontSize.2xl'),
          fontWeight: theme('fontWeight.bold'),
          lineHeight: theme('lineHeight.snug'),
        },
        '.typography-h3': {
          fontFamily: theme('fontFamily.sans'),
          fontSize: theme('fontSize.xl'),
          fontWeight: theme('fontWeight.medium'),
          lineHeight: theme('lineHeight.normal'),
        },
        '.typography-h4': {
          fontFamily: theme('fontFamily.sans'),
          fontSize: theme('fontSize.lg'),
          fontWeight: theme('fontWeight.medium'),
          lineHeight: theme('lineHeight.normal'),
        },
        '.typography-body': {
          fontFamily: theme('fontFamily.sans'),
          fontSize: theme('fontSize.base'),
          fontWeight: theme('fontWeight.regular'),
          lineHeight: theme('lineHeight.relaxed'),
        },
        '.typography-label': {
          fontFamily: theme('fontFamily.sans'),
          fontSize: theme('fontSize.sm'),
          fontWeight: theme('fontWeight.medium'),
          lineHeight: theme('lineHeight.tight'),
          letterSpacing: theme('letterSpacing.wide'),
          textTransform: 'uppercase',
        },
        '.typography-caption': {
          fontFamily: theme('fontFamily.sans'),
          fontSize: theme('fontSize.xs'),
          fontWeight: theme('fontWeight.regular'),
          lineHeight: theme('lineHeight.normal'),
        },
      };
      
      addUtilities(typographyUtilities);
    },
  ],
};