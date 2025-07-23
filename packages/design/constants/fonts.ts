export const FONT_FAMILIES = {
  // Display font for branding/headers
  display: 'Louize Display',
  // Primary font for all body text
  primary: 'TX02Mono-Regular',
  // Secondary font for body/UI
  secondary: 'TX02Mono-Regular',
  // Tertiary font for accents/special
  tertiary: 'TX02Mono-Regular',
} as const;

export const FONT_WEIGHTS = {
  light: 300,
  regular: 400,
  medium: 500,
  bold: 700,
} as const;

export const FONT_SIZES = {
  xs: '0.75rem',     // 12px
  sm: '0.875rem',    // 14px
  base: '1rem',      // 16px
  lg: '1.125rem',    // 18px
  xl: '1.25rem',     // 20px
  '2xl': '1.5rem',   // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
  '5xl': '3rem',     // 48px
  '6xl': '3.75rem',  // 60px
  '7xl': '4.5rem',   // 72px
  '8xl': '6rem',     // 96px
  '9xl': '8rem',     // 128px
} as const;

export const LINE_HEIGHTS = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
} as const;

export const LETTER_SPACINGS = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

export const TEXT_TRANSFORMS = {
  none: 'none',
  uppercase: 'uppercase',
  lowercase: 'lowercase',
  capitalize: 'capitalize',
} as const;

export const TYPOGRAPHY_VARIANTS = {
  // Display Variants (using Louize Display)
  hero: {
    fontFamily: FONT_FAMILIES.display,
    fontSize: FONT_SIZES['9xl'],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: LINE_HEIGHTS.none,
    letterSpacing: LETTER_SPACINGS.tight,
  },
  title1: {
    fontFamily: FONT_FAMILIES.display,
    fontSize: FONT_SIZES['7xl'],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACINGS.tight,
  },
  title2: {
    fontFamily: FONT_FAMILIES.display,
    fontSize: FONT_SIZES['5xl'],
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACINGS.normal,
  },
  title3: {
    fontFamily: FONT_FAMILIES.display,
    fontSize: FONT_SIZES['4xl'],
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.snug,
    letterSpacing: LETTER_SPACINGS.normal,
  },
  
  // Heading Variants (using TX02Mono-Regular)
  h1: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES['3xl'],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: LINE_HEIGHTS.snug,
    letterSpacing: LETTER_SPACINGS.normal,
  },
  h2: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES['2xl'],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: LINE_HEIGHTS.snug,
    letterSpacing: LETTER_SPACINGS.normal,
  },
  h3: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACINGS.normal,
  },
  h4: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACINGS.normal,
  },
  
  // Body Variants (using TX02Mono-Regular)
  body: {
    fontFamily: FONT_FAMILIES.secondary,
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.relaxed,
    letterSpacing: LETTER_SPACINGS.normal,
  },
  bodyLarge: {
    fontFamily: FONT_FAMILIES.secondary,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.relaxed,
    letterSpacing: LETTER_SPACINGS.normal,
  },
  bodySmall: {
    fontFamily: FONT_FAMILIES.secondary,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACINGS.normal,
  },
  
  // Special Variants (using secondary and tertiary)
  label: {
    fontFamily: FONT_FAMILIES.secondary,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACINGS.wide,
    textTransform: TEXT_TRANSFORMS.uppercase,
  },
  caption: {
    fontFamily: FONT_FAMILIES.secondary,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACINGS.normal,
  },
  overline: {
    fontFamily: FONT_FAMILIES.tertiary,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.tight,
    letterSpacing: LETTER_SPACINGS.widest,
    textTransform: TEXT_TRANSFORMS.uppercase,
  },
  
  // Special Style Variants
  playful: {
    fontFamily: FONT_FAMILIES.tertiary, // TX02Mono-Regular
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.relaxed,
    letterSpacing: LETTER_SPACINGS.normal,
  },
  geometric: {
    fontFamily: FONT_FAMILIES.tertiary, // TX02Mono-Regular
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.normal,
    letterSpacing: LETTER_SPACINGS.wide,
  },
  rounded: {
    fontFamily: FONT_FAMILIES.primary, // TX02Mono-Regular
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.relaxed,
    letterSpacing: LETTER_SPACINGS.normal,
  },
  minimal: {
    fontFamily: FONT_FAMILIES.secondary, // TX02Mono-Regular
    fontSize: FONT_SIZES.base,
    fontWeight: FONT_WEIGHTS.light,
    lineHeight: LINE_HEIGHTS.loose,
    letterSpacing: LETTER_SPACINGS.wide,
  },
} as const;

export type TypographyVariant = keyof typeof TYPOGRAPHY_VARIANTS;
export type FontFamily = typeof FONT_FAMILIES[keyof typeof FONT_FAMILIES];
export type FontWeight = typeof FONT_WEIGHTS[keyof typeof FONT_WEIGHTS];
export type FontSize = typeof FONT_SIZES[keyof typeof FONT_SIZES];
export type LineHeight = typeof LINE_HEIGHTS[keyof typeof LINE_HEIGHTS];
export type LetterSpacing = typeof LETTER_SPACINGS[keyof typeof LETTER_SPACINGS];