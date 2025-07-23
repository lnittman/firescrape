'use client';

import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Typography, TypographyProps } from './Typography';
import { FONT_FAMILIES } from '../../constants/fonts';

// Morphing text between CX80 variations
export interface MorphingTextProps extends Omit<TypographyProps, 'fontFamily'> {
  variations?: string[];
  morphDuration?: number;
  morphOnHover?: boolean;
}

export const MorphingText: React.FC<MorphingTextProps> = ({
  children,
  variations = [
    FONT_FAMILIES.body.cx80,
    FONT_FAMILIES.body.cx80_1,
    FONT_FAMILIES.body.cx80_2,
    FONT_FAMILIES.body.cx80_3,
  ],
  morphDuration = 0.5,
  morphOnHover = false,
  ...props
}) => {
  const [currentVariation, setCurrentVariation] = React.useState(0);
  
  React.useEffect(() => {
    if (!morphOnHover) {
      const interval = setInterval(() => {
        setCurrentVariation((prev) => (prev + 1) % variations.length);
      }, morphDuration * 1000);
      return () => clearInterval(interval);
    }
  }, [morphOnHover, morphDuration, variations.length]);
  
  const handleHover = () => {
    if (morphOnHover) {
      setCurrentVariation((prev) => (prev + 1) % variations.length);
    }
  };
  
  return (
    <Typography
      fontFamily={variations[currentVariation]}
      onMouseEnter={handleHover}
      style={{
        transition: `font-family ${morphDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

// Parallax scrolling text
export interface ParallaxTextProps extends TypographyProps {
  speed?: number;
  offset?: number;
}

export const ParallaxText: React.FC<ParallaxTextProps> = ({
  children,
  speed = 0.5,
  offset = 0,
  style,
  ...props
}) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 1000 * speed]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  
  return (
    <Typography
      style={{
        ...style,
        y: springY,
        position: 'relative',
        top: offset,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

// 3D rotating text
export interface Text3DProps extends TypographyProps {
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  perspective?: number;
}

export const Text3D: React.FC<Text3DProps> = ({
  children,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  perspective = 1000,
  style,
  ...props
}) => {
  return (
    <div style={{ perspective: `${perspective}px` }}>
      <Typography
        animate
        animationVariants={{
          hidden: {
            rotateX: 0,
            rotateY: 0,
            rotateZ: 0,
          },
          visible: {
            rotateX: [0, rotateX, 0],
            rotateY: [0, rotateY, 0],
            rotateZ: [0, rotateZ, 0],
            transition: {
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          },
        }}
        style={{
          ...style,
          transformStyle: 'preserve-3d',
        }}
        {...props}
      >
        {children}
      </Typography>
    </div>
  );
};

// Elastic text that responds to mouse position
export interface ElasticTextProps extends TypographyProps {
  elasticity?: number;
  damping?: number;
}

export const ElasticText: React.FC<ElasticTextProps> = ({
  children,
  elasticity = 0.1,
  damping = 0.8,
  ...props
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = (e.clientX - centerX) * elasticity;
    const distanceY = (e.clientY - centerY) * elasticity;
    
    setPosition({ x: distanceX, y: distanceY });
  };
  
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };
  
  const springX = useSpring(position.x, { damping: damping * 100, stiffness: 300 });
  const springY = useSpring(position.y, { damping: damping * 100, stiffness: 300 });
  
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: 'inline-block' }}
    >
      <Typography
        style={{
          x: springX,
          y: springY,
        }}
        {...props}
      >
        {children}
      </Typography>
    </motion.div>
  );
};

// Scramble text effect
export interface ScrambleTextProps extends TypographyProps {
  scrambleDuration?: number;
  scrambleOnHover?: boolean;
  characters?: string;
}

export const ScrambleText: React.FC<ScrambleTextProps> = ({
  children,
  scrambleDuration = 1,
  scrambleOnHover = true,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*',
  ...props
}) => {
  const originalText = typeof children === 'string' ? children : '';
  const [displayText, setDisplayText] = React.useState(originalText);
  const [isScrambling, setIsScrambling] = React.useState(false);
  
  const scramble = React.useCallback(() => {
    if (isScrambling) return;
    setIsScrambling(true);
    
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) =>
        originalText
          .split('')
          .map((char, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );
      
      if (iteration >= originalText.length) {
        clearInterval(interval);
        setIsScrambling(false);
      }
      
      iteration += 1 / 3;
    }, scrambleDuration * 1000 / originalText.length / 3);
  }, [originalText, characters, scrambleDuration, isScrambling]);
  
  React.useEffect(() => {
    if (!scrambleOnHover) {
      scramble();
    }
  }, [scramble, scrambleOnHover]);
  
  return (
    <Typography
      onMouseEnter={scrambleOnHover ? scramble : undefined}
      {...props}
    >
      {displayText}
    </Typography>
  );
};

// Split flap display effect (like airport/train station boards)
export interface SplitFlapTextProps extends TypographyProps {
  flipDuration?: number;
  stagger?: number;
}

export const SplitFlapText: React.FC<SplitFlapTextProps> = ({
  children,
  flipDuration = 0.6,
  stagger = 0.05,
  fontFamily = FONT_FAMILIES.body.cx80_1,
  ...props
}) => {
  const text = typeof children === 'string' ? children : '';
  
  return (
    <Typography fontFamily={fontFamily} {...props}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{
            duration: flipDuration,
            delay: index * stagger,
            type: 'spring',
            damping: 15,
          }}
          style={{
            display: 'inline-block',
            transformOrigin: 'center bottom',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </Typography>
  );
};