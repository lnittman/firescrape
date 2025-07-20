'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChatCircle, MapTrifold, Clock } from '@phosphor-icons/react';

const valueProps = [
  {
    title: 'Find your perfect adventure. Get answers. Stay safe.',
    subtitle: 'Yuba isn\'t just another outdoor app—it\'s that friend who actually knows the trails, crags, campsites, and rivers. Ask about any outdoor activity and get real insights tailored to your experience level.',
    icon: ChatCircle,
    features: [
      'Natural conversation, not endless forms',
      'Personalized difficulty ratings',
      'Real-time safety alerts'
    ],
    image: '/images/value-prop-1.jpg',
    imageAlt: 'Conversational interface showing outdoor activity recommendations'
  },
  {
    title: 'The easiest way to explore what\'s around you. Period.',
    subtitle: 'No tedious planning. Just talk, tap, or type—Yuba does the heavy lifting so you can focus on the adventure. Unless you like heavy lifting, in which case... we know some great bouldering spots.',
    icon: MapTrifold,
    features: [
      { icon: ChatCircle, label: 'Talk' },
      { icon: MapTrifold, label: 'Tap' },
      { icon: Clock, label: 'Type' }
    ],
    image: '/images/value-prop-2.jpg',
    imageAlt: 'Map interface showing nearby outdoor activities'
  },
  {
    title: 'Make each adventure better than the last with Yuba Score.',
    subtitle: 'Each adventure gets a personalized score based on your experience level, preferences, and past outings. Plus, you get simple tips to keep improving and exploring safely.',
    icon: Clock,
    features: [
      'Adaptive difficulty ratings',
      'Progress tracking that matters',
      'Celebrate real achievements'
    ],
    image: '/images/value-prop-3.jpg',
    imageAlt: 'Personalized adventure scoring interface'
  }
];

export function ValuePropsSection() {
  return (
    <section id="how-it-works" className="py-20">
      {valueProps.map((prop, index) => {
        const isEven = index % 2 === 0;
        return (
          <div key={index} className="mb-32 last:mb-0">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`
                  grid md:grid-cols-2 gap-12 items-center
                  ${isEven ? '' : 'md:[&>*:first-child]:order-2'}
                `}
              >
                {/* Content */}
                <div className="space-y-6">
                  <h3 className="font-display text-3xl md:text-4xl font-bold text-primary">
                    {prop.title}
                  </h3>
                  <p className="text-lg text-secondary">
                    {prop.subtitle}
                  </p>
                  
                  {/* Features - different styles for different sections */}
                  {index === 1 ? (
                    <div className="flex gap-8 justify-start">
                      {prop.features.map((feature, idx) => {
                        if (typeof feature === 'object' && 'icon' in feature) {
                          const Icon = feature.icon;
                          return (
                            <div key={idx} className="text-center">
                              <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mb-2">
                                <Icon className="w-8 h-8 text-primary" />
                              </div>
                              <span className="text-sm font-medium text-primary">
                                {feature.label}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {prop.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          </div>
                          <span className="text-secondary">{typeof feature === 'string' ? feature : feature.label}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Image placeholder */}
                <div className="relative">
                  <div className="relative aspect-[4/3] md:aspect-square rounded-2xl overflow-hidden bg-surface/50">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
                    {/* Placeholder for actual image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <prop.icon className="w-24 h-24 text-primary/20 mx-auto mb-4" />
                        <p className="text-sm text-secondary/50">Product Screenshot</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  {index === 0 && (
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-green-100 rounded-full blur-3xl opacity-50" />
                  )}
                  {index === 1 && (
                    <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50" />
                  )}
                  {index === 2 && (
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-orange-100 rounded-full blur-3xl opacity-50" />
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        );
      })}
    </section>
  );
}