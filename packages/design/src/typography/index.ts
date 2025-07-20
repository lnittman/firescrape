// Core Typography Components
export { Typography } from './Typography';
export type { TypographyProps } from './Typography';

// Animated Typography Components
export {
  AnimatedText,
  GradientText,
  VariableWeightText,
} from './AnimatedTypography';
export type {
  AnimatedTextProps,
  GradientTextProps,
  VariableWeightTextProps,
} from './AnimatedTypography';

// Creative Typography Components
export {
  MorphingText,
  ParallaxText,
  Text3D,
  ElasticText,
  ScrambleText,
  SplitFlapText,
} from './CreativeTypography';
export type {
  MorphingTextProps,
  ParallaxTextProps,
  Text3DProps,
  ElasticTextProps,
  ScrambleTextProps,
  SplitFlapTextProps,
} from './CreativeTypography';

// Typography Constants
export {
  FONT_FAMILIES,
  FONT_WEIGHTS,
  FONT_SIZES,
  LINE_HEIGHTS,
  LETTER_SPACINGS,
  TEXT_TRANSFORMS,
  TYPOGRAPHY_VARIANTS,
} from './constants';
export type {
  TypographyVariant,
  FontFamily,
  FontWeight,
  FontSize,
  LineHeight,
  LetterSpacing,
} from './constants';

// Typography Hooks
export {
  useResponsiveTypography,
  useFontCycle,
  useVariableWeight,
  useTextMeasure,
  useTypographyVariant,
  useAdaptiveTypography,
} from './hooks';

// Typography Utilities
export {
  getOptimalLineLength,
  getContrastingWeight,
  calculateReadingTime,
  generateFontScale,
  getLineHeightForSize,
  fontWeightToNumber,
  generateFluidTypography,
  getFontVariationSettings,
  truncateText,
  balanceText,
  getAccessibleTextColor,
  formatNumber,
} from './utils';

// Font CSS (to be imported in the app)
export { default as fontStyles } from '../fonts/fonts.css';