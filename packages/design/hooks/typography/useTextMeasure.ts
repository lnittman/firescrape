import { useState, useEffect } from 'react';

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