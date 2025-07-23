import { useCallback, useEffect, useState } from 'react';

import { FONT_FAMILIES } from '../../constants/fonts';

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
