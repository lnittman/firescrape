import { useCallback, useState } from 'react';

import { TYPOGRAPHY_VARIANTS, TypographyVariant } from '../../constants/fonts';

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
