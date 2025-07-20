'use client';

import { motion } from 'framer-motion';
import { 
  MapPin, 
  ShieldCheck, 
  Brain, 
  Cloud, 
  Users, 
  Compass,
  TreeEvergreen,
  Clock
} from '@phosphor-icons/react';

const features = [
  {
    label: 'Personalized Difficulty',
    icon: TreeEvergreen,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    label: 'Real-time Conditions',
    icon: Cloud,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    label: 'Safety First',
    icon: ShieldCheck,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    label: 'AI Trail Guide',
    icon: Brain,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    label: 'Offline Ready',
    icon: Compass,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    label: 'Community Insights',
    icon: Users,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    label: 'Multi-Activity',
    icon: MapPin,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
  },
  {
    label: 'Time Aware',
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">
            Adventure as unique as you are.
          </h2>
          <p className="text-lg text-secondary max-w-3xl mx-auto">
            Tell Yuba what matters to you—your fitness level, your time constraints, 
            your love for waterfalls—and watch it learn, adapt, and actually get you outside.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                className={`
                  flex items-center gap-2 px-5 py-3 rounded-full
                  ${feature.bgColor} border border-border/10
                  cursor-default transition-all
                `}
              >
                <Icon className={`w-5 h-5 ${feature.color}`} />
                <span className={`text-sm font-medium ${feature.color}`}>
                  {feature.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}