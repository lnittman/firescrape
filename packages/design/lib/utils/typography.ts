import { FONT_SIZES, LINE_HEIGHTS, LETTER_SPACINGS } from '../../constants/fonts';

// Calculate optimal line length based on font size
export const getOptimalLineLength = (fontSize: string): string => {
  const sizeInRem = parseFloat(fontSize);
  const charactersPerLine = Math.round(65 / sizeInRem * 16); // ~65 characters optimal
  return `${charactersPerLine}ch`;
};

// Get contrasting font weight
export const getContrastingWeight = (currentWeight: number): number => {
  if (currentWeight <= 300) return 700;
  if (currentWeight >= 700) return 300;
  return currentWeight > 400 ? 300 : 700;
};

// Calculate reading time
export const calculateReadingTime = (text: string, wpm: number = 200): number => {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wpm);
};

// Generate font scale
export const generateFontScale = (
  baseSize: number = 16,
  scale: number = 1.25
): Record<string, string> => {
  const sizes: Record<string, string> = {};
  const steps = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];
  
  steps.forEach((step, index) => {
    const multiplier = Math.pow(scale, index - 2); // base is at index 2
    sizes[step] = `${(baseSize * multiplier) / 16}rem`;
  });
  
  return sizes;
};

// Get appropriate line height for font size
export const getLineHeightForSize = (fontSize: string): number => {
  const sizeInRem = parseFloat(fontSize);
  
  if (sizeInRem <= 0.875) return LINE_HEIGHTS.normal;
  if (sizeInRem <= 1.25) return LINE_HEIGHTS.relaxed;
  if (sizeInRem <= 2.25) return LINE_HEIGHTS.snug;
  return LINE_HEIGHTS.tight;
};

// Convert font weight name to number
export const fontWeightToNumber = (weight: string): number => {
  const weightMap: Record<string, number> = {
    thin: 100,
    extralight: 200,
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  };
  
  return weightMap[weight.toLowerCase()] || 400;
};

// Generate CSS for fluid typography
export const generateFluidTypography = (
  minSize: number,
  maxSize: number,
  minViewport: number = 320,
  maxViewport: number = 1920
): string => {
  const slope = (maxSize - minSize) / (maxViewport - minViewport);
  const yAxisIntersection = -minViewport * slope + minSize;
  
  return `clamp(${minSize}px, ${yAxisIntersection}px + ${slope * 100}vw, ${maxSize}px)`;
};

// Get font variation settings for variable fonts
export const getFontVariationSettings = (
  weight?: number,
  width?: number,
  slant?: number,
  optical?: number
): string => {
  const settings: string[] = [];
  
  if (weight !== undefined) settings.push(`'wght' ${weight}`);
  if (width !== undefined) settings.push(`'wdth' ${width}`);
  if (slant !== undefined) settings.push(`'slnt' ${slant}`);
  if (optical !== undefined) settings.push(`'opsz' ${optical}`);
  
  return settings.join(', ');
};

// Truncate text with ellipsis
export const truncateText = (
  text: string,
  maxLength: number,
  ellipsis: string = '...'
): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
};

// Balance text for better line breaks
export const balanceText = (text: string, maxWordsPerLine: number = 8): string => {
  const words = text.split(' ');
  if (words.length <= maxWordsPerLine) return text;
  
  const lines: string[] = [];
  let currentLine: string[] = [];
  
  words.forEach((word) => {
    currentLine.push(word);
    
    if (currentLine.length >= maxWordsPerLine) {
      lines.push(currentLine.join(' '));
      currentLine = [];
    }
  });
  
  if (currentLine.length > 0) {
    lines.push(currentLine.join(' '));
  }
  
  return lines.join('\n');
};

// Get accessible color for text based on background
export const getAccessibleTextColor = (
  backgroundColor: string,
  lightColor: string = '#ffffff',
  darkColor: string = '#000000'
): string => {
  // Simple luminance calculation
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? darkColor : lightColor;
};

// Format number with proper typography
export const formatNumber = (
  num: number,
  options?: {
    useOldStyleNums?: boolean;
    useTabularNums?: boolean;
    locale?: string;
  }
): { value: string; fontFeatureSettings: string } => {
  const { useOldStyleNums = false, useTabularNums = true, locale = 'en-US' } = options || {};
  
  const features: string[] = [];
  if (useOldStyleNums) features.push("'onum' 1");
  if (useTabularNums) features.push("'tnum' 1");
  
  return {
    value: num.toLocaleString(locale),
    fontFeatureSettings: features.join(', ') || 'normal',
  };
};