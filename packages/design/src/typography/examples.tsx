'use client';

import React from 'react';
import {
  Typography,
  AnimatedText,
  GradientText,
  VariableWeightText,
  MorphingText,
  ParallaxText,
  Text3D,
  ElasticText,
  ScrambleText,
  SplitFlapText,
} from './index';

export const TypographyExamples = () => {
  return (
    <div className="space-y-12 p-8">
      {/* Basic Typography */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Basic Typography</h2>
        <div className="space-y-4">
          <Typography variant="hero">Hero Text with Louize</Typography>
          <Typography variant="title1">Title 1 - Adventure Awaits</Typography>
          <Typography variant="title2">Title 2 - Explore the Outdoors</Typography>
          <Typography variant="h1">Heading 1 with CX80</Typography>
          <Typography variant="body">
            Body text using CX80. Perfect for reading long passages about your outdoor adventures,
            trail descriptions, and detailed guides.
          </Typography>
          <Typography variant="label">Label Text</Typography>
          <Typography variant="caption">Caption text for image descriptions</Typography>
        </div>
      </section>

      {/* Animated Text */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Animated Typography</h2>
        <div className="space-y-6">
          <AnimatedText variant="h2" animation="fadeIn">
            Fade In Animation
          </AnimatedText>
          
          <AnimatedText variant="h2" animation="slideUp" stagger="words">
            Slide Up Word by Word
          </AnimatedText>
          
          <AnimatedText variant="h2" animation="typewriter" stagger="letters">
            Typewriter Effect
          </AnimatedText>
          
          <AnimatedText variant="h2" animation="wave">
            Wave Animation Effect
          </AnimatedText>
          
          <AnimatedText variant="h2" animation="bounce">
            Bouncing Text Effect
          </AnimatedText>
        </div>
      </section>

      {/* Gradient Text */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Gradient Typography</h2>
        <div className="space-y-4">
          <GradientText
            variant="title2"
            gradient="linear-gradient(to right, #10b981, #3b82f6)"
          >
            Nature Gradient Text
          </GradientText>
          
          <GradientText
            variant="title2"
            gradient="linear-gradient(45deg, #f97316, #eab308, #84cc16)"
            animateGradient
          >
            Animated Sunset Gradient
          </GradientText>
        </div>
      </section>

      {/* Variable Weight */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Variable Font Weight</h2>
        <VariableWeightText
          variant="h1"
          minWeight={100}
          maxWeight={900}
          duration={3}
        >
          Breathing Text Weight
        </VariableWeightText>
      </section>

      {/* CX80 Variations */}
      <section>
        <h2 className="text-2xl font-bold mb-6">CX80 Font Variations</h2>
        <div className="space-y-4">
          <Typography variant="body" fontFamily="CX80">
            Standard CX80 - Clean and modern
          </Typography>
          <Typography variant="body" fontFamily="CX80-0">
            CX80-0 - Minimal variation
          </Typography>
          <Typography variant="body" fontFamily="CX80-1">
            CX80-1 - Geometric variation
          </Typography>
          <Typography variant="body" fontFamily="CX80-2">
            CX80-2 - Rounded variation
          </Typography>
          <Typography variant="body" fontFamily="CX80-3">
            CX80-3 - Playful variation
          </Typography>
        </div>
      </section>

      {/* Creative Effects */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Creative Typography Effects</h2>
        <div className="space-y-8">
          <MorphingText variant="h2" morphOnHover>
            Hover to Morph Font (CX80 Variations)
          </MorphingText>
          
          <ParallaxText variant="h2" speed={0.5}>
            Parallax Scrolling Text
          </ParallaxText>
          
          <Text3D variant="h2" rotateY={360} perspective={1000}>
            3D Rotating Text
          </Text3D>
          
          <ElasticText variant="h2" elasticity={0.2}>
            Elastic Text - Move Your Mouse
          </ElasticText>
          
          <ScrambleText variant="h2" scrambleOnHover>
            Hover to Scramble This Text
          </ScrambleText>
          
          <SplitFlapText variant="h2">
            Split Flap Display Effect
          </SplitFlapText>
        </div>
      </section>

      {/* Responsive Typography */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Responsive Typography</h2>
        <Typography 
          variant="title1" 
          className="text-fluid-hero"
        >
          Fluid Typography Scales
        </Typography>
        <Typography 
          variant="body" 
          className="text-fluid-lg mt-4"
        >
          This text scales smoothly between different viewport sizes using CSS clamp()
        </Typography>
      </section>

      {/* Outdoor-Themed Examples */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Yuba Outdoor Examples</h2>
        <div className="space-y-6">
          <AnimatedText 
            variant="hero" 
            animation="slideUp" 
            stagger="words"
            className="text-green-600"
          >
            Touch Grass Today
          </AnimatedText>
          
          <GradientText
            variant="title1"
            gradient="linear-gradient(135deg, #065f46, #10b981, #34d399)"
            animateGradient
          >
            Discover Your Next Trail
          </GradientText>
          
          <div className="p-6 bg-green-50 rounded-lg">
            <Typography variant="h2" className="text-green-800 mb-3">
              Trail Difficulty: Moderate
            </Typography>
            <Typography variant="body" className="text-green-700">
              <ElasticText elasticity={0.05}>
                5.2 miles • 1,200 ft elevation gain • 2-3 hours
              </ElasticText>
            </Typography>
          </div>
          
          <div className="p-6 bg-sky-50 rounded-lg">
            <ScrambleText 
              variant="h3" 
              scrambleOnHover={false}
              scrambleDuration={2}
              className="text-sky-800"
            >
              Current Conditions: Clear Skies
            </ScrambleText>
          </div>
        </div>
      </section>
    </div>
  );
};