'use client';

import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import { cn } from '../utils/cn';
import { TYPOGRAPHY_VARIANTS, TypographyVariant } from './constants';

export interface TypographyProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  variant?: TypographyVariant;
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  animationVariants?: Variants;
  fontFamily?: string;
  interactive?: boolean;
}

const defaultAnimationVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
};

const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      variant = 'body',
      as,
      children,
      className,
      animate = false,
      animationVariants = defaultAnimationVariants,
      fontFamily,
      interactive = false,
      style,
      ...motionProps
    },
    ref
  ) => {
    const variantStyles = TYPOGRAPHY_VARIANTS[variant];
    
    // Determine the appropriate HTML element based on variant
    const getDefaultElement = (): keyof JSX.IntrinsicElements => {
      if (as) return as;
      
      switch (variant) {
        case 'hero':
        case 'title1':
          return 'h1';
        case 'title2':
          return 'h2';
        case 'title3':
          return 'h3';
        case 'h1':
          return 'h1';
        case 'h2':
          return 'h2';
        case 'h3':
          return 'h3';
        case 'h4':
          return 'h4';
        case 'label':
        case 'caption':
        case 'overline':
          return 'span';
        default:
          return 'p';
      }
    };
    
    const Component = motion[getDefaultElement() as keyof typeof motion] as any;
    
    const combinedStyle = {
      ...variantStyles,
      ...(fontFamily && { fontFamily }),
      ...style,
    };
    
    const animationProps = animate
      ? {
          initial: 'hidden',
          animate: 'visible',
          whileHover: interactive ? 'hover' : undefined,
          variants: animationVariants,
        }
      : {};
    
    return (
      <Component
        ref={ref}
        className={cn(
          'transition-colors',
          interactive && 'cursor-pointer select-none',
          className
        )}
        style={combinedStyle}
        {...animationProps}
        {...motionProps}
      >
        {children}
      </Component>
    );
  }
);

Typography.displayName = 'Typography';

export { Typography };