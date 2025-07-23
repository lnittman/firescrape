import { useEffect, useState } from 'react';

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