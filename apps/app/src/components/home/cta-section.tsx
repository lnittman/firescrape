'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { YubaLogo } from '@/components/shared';

export function CTASection() {
  return (
    <section className="py-20 px-4 bg-surface/50">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Large logo */}
          <div className="mb-8 flex justify-center">
            <YubaLogo size="large" />
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">
            Adventure starts here.
          </h2>
          
          <p className="text-lg text-secondary max-w-2xl mx-auto mb-8">
            Talk to Yuba like a friend. No endless scrolling or complex filters, just smart 
            guidance that transforms how you explore the outdoors.
          </p>

          {/* App Store Button */}
          <Link
            href="https://apps.apple.com/app/yuba"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-black hover:bg-gray-900 rounded-xl transition-all transform hover:scale-105"
          >
            <svg className="h-8 mr-3" viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg">
              <g fill="white">
                <path d="M8.445 19.775c-.03-3.32 2.706-4.928 2.83-5.005-1.546-2.257-3.943-2.565-4.794-2.593-2.026-.21-3.98 1.21-5.01 1.21-1.046 0-2.632-1.186-4.337-1.152C4.952 12.27 2.93 13.443 1.852 15.275c-2.21 3.697-.563 9.136 1.566 12.126 1.063 1.462 2.313 3.092 3.945 3.035 1.593-.063 2.19-.977 4.113-.977 1.908 0 2.464.977 4.132.942 1.71-.028 2.79-1.467 3.818-2.942 1.227-1.687 1.72-3.342 1.744-3.428-.04-.012-3.327-1.267-3.357-5.056M5.654 10.303c.862-1.073 1.45-2.538 1.287-4.028-1.25.055-2.798.859-3.695 1.906-.798.928-1.505 2.444-1.323 3.876 1.408.104 2.85-.71 3.73-1.754"/>
                <text x="30" y="26" fontSize="18" fontFamily="SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif">
                  Download on the
                </text>
                <text x="30" y="36" fontSize="22" fontFamily="SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif" fontWeight="600">
                  App Store
                </text>
              </g>
            </svg>
          </Link>

          {/* Coming soon for other platforms */}
          <p className="mt-4 text-sm text-secondary">
            Android and web versions coming soon
          </p>
        </motion.div>
      </div>
    </section>
  );
}