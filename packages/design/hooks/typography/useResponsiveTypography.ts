import { useEffect, useState } from 'react';

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