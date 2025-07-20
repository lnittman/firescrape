'use client';

import React from 'react';
import { motion, Variants, useInView, useAnimation } from 'framer-motion';
import { Typography, TypographyProps } from './Typography';

// Stagger children animation for word-by-word or letter-by-letter effects
export interface AnimatedTextProps extends Omit<TypographyProps, 'animate'> {
  animation?: 'fadeIn' | 'slideUp' | 'typewriter' | 'glitch' | 'wave' | 'bounce';
  stagger?: 'words' | 'letters' | 'lines' | 'none';
  duration?: number;
  delay?: number;
  onAnimationComplete?: () => void;
}

const splitText = (text: string, type: 'words' | 'letters' | 'lines'): string[] => {
  switch (type) {
    case 'words':
      return text.split(' ');
    case 'letters':
      return text.split('');
    case 'lines':
      return text.split('\n');
    default:
      return [text];
  }
};

const animationVariants: Record<string, Variants> = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  },
  slideUp: {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
    },
  },
  typewriter: {
    hidden: { opacity: 0, width: 0 },
    visible: {
      opacity: 1,
      width: 'auto',
      transition: { duration: 0.1, ease: 'linear' },
    },
  },
  glitch: {
    hidden: { opacity: 0, x: -10, filter: 'blur(10px)' },
    visible: {
      opacity: [0, 1, 0, 1],
      x: [-10, 5, -5, 0],
      filter: ['blur(10px)', 'blur(0px)', 'blur(5px)', 'blur(0px)'],
      transition: {
        duration: 0.5,
        times: [0, 0.3, 0.6, 1],
        ease: 'easeInOut',
      },
    },
  },
  wave: {
    hidden: { opacity: 0, y: 20, rotate: -5 },
    visible: {
      opacity: 1,
      y: [20, -10, 0],
      rotate: [-5, 5, 0],
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  },
  bounce: {
    hidden: { opacity: 0, scale: 0.3 },
    visible: {
      opacity: 1,
      scale: [0.3, 1.1, 0.9, 1],
      transition: {
        duration: 0.6,
        times: [0, 0.5, 0.75, 1],
        ease: 'easeOut',
      },
    },
  },
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  animation = 'fadeIn',
  stagger = 'none',
  duration = 0.5,
  delay = 0,
  onAnimationComplete,
  ...typographyProps
}) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  React.useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);
  
  const text = typeof children === 'string' ? children : '';
  const shouldStagger = stagger !== 'none' && typeof children === 'string';
  
  if (!shouldStagger) {
    return (
      <Typography
        ref={ref}
        animate
        animationVariants={animationVariants[animation]}
        onAnimationComplete={onAnimationComplete}
        {...typographyProps}
      >
        {children}
      </Typography>
    );
  }
  
  const segments = splitText(text, stagger);
  
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: duration / segments.length,
        delayChildren: delay,
      },
    },
  };
  
  return (
    <Typography
      ref={ref}
      {...typographyProps}
      animate={false}
    >
      <motion.span
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        onAnimationComplete={onAnimationComplete}
        style={{ display: 'inline-flex', flexWrap: 'wrap' }}
      >
        {segments.map((segment, index) => (
          <motion.span
            key={index}
            variants={animationVariants[animation]}
            style={{
              display: 'inline-block',
              whiteSpace: stagger === 'letters' ? 'pre' : 'normal',
            }}
          >
            {segment}
            {stagger === 'words' && index < segments.length - 1 && '\u00A0'}
          </motion.span>
        ))}
      </motion.span>
    </Typography>
  );
};

// Gradient animated text component
export interface GradientTextProps extends TypographyProps {
  gradient?: string;
  animateGradient?: boolean;
  gradientSpeed?: number;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  gradient = 'linear-gradient(to right, #10b981, #3b82f6, #8b5cf6)',
  animateGradient = false,
  gradientSpeed = 3,
  style,
  ...props
}) => {
  const animatedStyle = animateGradient
    ? {
        backgroundImage: gradient,
        backgroundSize: '200% auto',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: `gradient ${gradientSpeed}s linear infinite`,
      }
    : {
        backgroundImage: gradient,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      };
  
  return (
    <>
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      <Typography
        style={{
          ...animatedStyle,
          ...style,
        }}
        {...props}
      >
        {children}
      </Typography>
    </>
  );
};

// Variable font weight animation
export interface VariableWeightTextProps extends TypographyProps {
  minWeight?: number;
  maxWeight?: number;
  duration?: number;
}

export const VariableWeightText: React.FC<VariableWeightTextProps> = ({
  children,
  minWeight = 100,
  maxWeight = 900,
  duration = 2,
  fontFamily = 'CX80 Variable',
  style,
  ...props
}) => {
  return (
    <Typography
      fontFamily={fontFamily}
      animate
      animationVariants={{
        hidden: { fontWeight: minWeight },
        visible: {
          fontWeight: [minWeight, maxWeight, minWeight],
          transition: {
            duration,
            repeat: Infinity,
            ease: 'easeInOut',
          },
        },
      }}
      style={style}
      {...props}
    >
      {children}
    </Typography>
  );
};