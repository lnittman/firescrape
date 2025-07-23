import { useState, useEffect, useCallback } from 'react';

import { TYPOGRAPHY_VARIANTS, TypographyVariant } from '../../constants/fonts';

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

