'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="relative w-full h-full">
          <Image
            src="/images/hero-landscape.jpg"
            alt="Serene mountain landscape"
            fill
            className="object-cover"
            priority
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzg3Q0VFQiIvPjwvc3ZnPg=="
          />
          {/* Gradient overlays for gentle fade effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/10 via-transparent to-background/10" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-6">
            Get outside.<br />Stay safe.<br />Then get out of our way.
          </h1>
          
          <p className="text-lg md:text-xl text-secondary max-w-2xl mx-auto mb-8">
            Your AI-powered outdoor companion for hiking, biking, climbing, camping, and beyond. 
            We measure success in muddy boots, not screen time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-primary text-primary-foreground rounded-xl text-lg font-semibold hover:bg-primary/90 transition-all transform hover:scale-105"
            >
              Start Your Adventure
            </Link>
            <Link
              href="#how-it-works"
              className="px-8 py-4 bg-surface/80 backdrop-blur-sm text-primary rounded-xl text-lg font-semibold hover:bg-surface transition-all border border-border/20"
            >
              See How It Works
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-3 bg-primary/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}