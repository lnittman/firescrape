import { useState, useEffect, useCallback } from 'react';
import { FONT_FAMILIES, TYPOGRAPHY_VARIANTS, TypographyVariant } from './constants';

// Hook to dynamically adjust font size based on container width
export const useResponsiveTypography = (
  baseSize: number,
  minSize: number,
  maxSize: number,
  containerRef: React.RefObject<HTMLElement>
) => {
  const [fontSize, setFontSize] = useState(baseSize);
  
  useEffect(() => {
    const updateFontSize = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.offsetWidth;
      const scaleFactor = containerWidth / 1200; // Base container width
      const newSize = Math.max(minSize, Math.min(maxSize, baseSize * scaleFactor));
      
      setFontSize(newSize);
    };
    
    updateFontSize();
    window.addEventListener('resize', updateFontSize);
    
    return () => window.removeEventListener('resize', updateFontSize);
  }, [baseSize, minSize, maxSize, containerRef]);
  
  return fontSize;
};

// Hook to cycle through font variations
export const useFontCycle = (
  fonts: string[] = Object.values(FONT_FAMILIES.body),
  interval: number = 3000,
  enabled: boolean = true
) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentFont, setCurrentFont] = useState(fonts[0]);
  
  useEffect(() => {
    if (!enabled) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % fonts.length;
        setCurrentFont(fonts[nextIndex]);
        return nextIndex;
      });
    }, interval);
    
    return () => clearInterval(timer);
  }, [fonts, interval, enabled]);
  
  const nextFont = useCallback(() => {
    const nextIndex = (currentIndex + 1) % fonts.length;
    setCurrentIndex(nextIndex);
    setCurrentFont(fonts[nextIndex]);
  }, [currentIndex, fonts]);
  
  const prevFont = useCallback(() => {
    const prevIndex = (currentIndex - 1 + fonts.length) % fonts.length;
    setCurrentIndex(prevIndex);
    setCurrentFont(fonts[prevIndex]);
  }, [currentIndex, fonts]);
  
  return { currentFont, nextFont, prevFont, currentIndex };
};

// Hook for variable font weight animation
export const useVariableWeight = (
  minWeight: number = 100,
  maxWeight: number = 900,
  duration: number = 2000,
  enabled: boolean = true
) => {
  const [weight, setWeight] = useState(minWeight);
  
  useEffect(() => {
    if (!enabled) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      
      const progress = (timestamp - startTime) / duration;
      const easedProgress = 0.5 * (1 + Math.sin(2 * Math.PI * progress - Math.PI / 2));
      
      const currentWeight = minWeight + (maxWeight - minWeight) * easedProgress;
      setWeight(Math.round(currentWeight));
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [minWeight, maxWeight, duration, enabled]);
  
  return weight;
};

// Hook to measure text dimensions
export const useTextMeasure = (
  text: string,
  fontFamily: string,
  fontSize: string
) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    context.font = `${fontSize} ${fontFamily}`;
    const metrics = context.measureText(text);
    
    setDimensions({
      width: metrics.width,
      height: parseInt(fontSize) * 1.2, // Approximate height
    });
  }, [text, fontFamily, fontSize]);
  
  return dimensions;
};

// Hook for typography variant switching with transition
export const useTypographyVariant = (
  initialVariant: TypographyVariant = 'body'
) => {
  const [variant, setVariant] = useState<TypographyVariant>(initialVariant);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const transitionToVariant = useCallback((newVariant: TypographyVariant) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setVariant(newVariant);
      setIsTransitioning(false);
    }, 150);
  }, []);
  
  const styles = TYPOGRAPHY_VARIANTS[variant];
  
  return {
    variant,
    styles,
    isTransitioning,
    transitionToVariant,
  };
};

// Hook for adaptive typography based on user preferences
export const useAdaptiveTypography = () => {
  const [preferences, setPreferences] = useState({
    increasedContrast: false,
    reducedMotion: false,
    prefersDark: false,
  });
  
  useEffect(() => {
    const mediaQueries = {
      contrast: window.matchMedia('(prefers-contrast: high)'),
      motion: window.matchMedia('(prefers-reduced-motion: reduce)'),
      dark: window.matchMedia('(prefers-color-scheme: dark)'),
    };
    
    const updatePreferences = () => {
      setPreferences({
        increasedContrast: mediaQueries.contrast.matches,
        reducedMotion: mediaQueries.motion.matches,
        prefersDark: mediaQueries.dark.matches,
      });
    };
    
    updatePreferences();
    
    Object.values(mediaQueries).forEach((mq) => {
      mq.addEventListener('change', updatePreferences);
    });
    
    return () => {
      Object.values(mediaQueries).forEach((mq) => {
        mq.removeEventListener('change', updatePreferences);
      });
    };
  }, []);
  
  return preferences;
};