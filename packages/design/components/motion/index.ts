// Motion Primitives - Beautiful, animated components
// Re-exported from individual component files

// Core animations
export * from './animated-group';
export * from './animated-background';
export * from './border-trail';
export * from './transition-panel';
export * from './infinite-slider';
export * from './progressive-blur';

// Text effects
export * from './text-shimmer';
export * from './text-shimmer-wave';
export * from './text-scramble';
// Export everything except PresetType from text-effect to avoid conflict
export { TextEffect } from './text-effect';
export * from './text-morph';
export * from './text-loop';
export * from './text-roll';

// Number effects
export * from './animated-number';
export * from './sliding-number';

// Interactive elements
export * from './tilt';
export * from './glow-effect';
export * from './spinning-text';
export * from './spotlight';
export * from './dock';
export * from './scroll-progress';

// UI Components
export * from './accordion';
export * from './carousel';
export * from './cursor';
export * from './dialog';
export * from './disclosure';
export * from './image-comparison';
export * from './morphing-dialog';
export * from './morphing-popover';

// Toolbars
export * from './toolbar-dynamic';
export * from './toolbar-expandable';

// Hooks
export * from '../../hooks/useClickOutside';
export * from '../../hooks/usePreventScroll';

// Logo and Icons
export * from './firescrape-logo';
export * from './animated-fire';