'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CaretDown } from '@phosphor-icons/react';

const faqs = [
  {
    question: 'What makes Yuba different from other trail apps?',
    answer: 'Yuba adapts to YOU. We personalize difficulty ratings based on your fitness level, consider real-time conditions, and prioritize safety. Plus, our conversational interface means you can just ask naturally—no endless forms or filters.'
  },
  {
    question: 'Do I have to track every single hike I do?',
    answer: 'Nope! Yuba learns from what you choose to share. The more you use it, the better it gets at recommendations, but there\'s no pressure. Remember: we measure success in muddy boots, not app engagement.'
  },
  {
    question: 'Can Yuba help me get in better shape for harder trails?',
    answer: 'Absolutely! Yuba gradually suggests trails that challenge you appropriately, tracks your progress, and celebrates your achievements. We\'ll help you work up to that dream summit safely and sustainably.'
  },
  {
    question: 'Does Yuba work offline?',
    answer: 'Yes! Download trail info before you go, and Yuba works fully offline. Safety features, maps, and your personalized recommendations all work without signal. Because the best trails rarely have cell coverage.'
  },
  {
    question: 'Is Yuba only for hiking?',
    answer: 'Not at all! We support hiking, biking, trail running, climbing, and more. Just tell Yuba what you\'re into, and it\'ll find the perfect spots for your preferred activities.'
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={false}
      className="border-b border-border/10 last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-primary transition-colors"
      >
        <h3 className="font-medium text-lg pr-4">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <CaretDown className="w-5 h-5" />
        </motion.div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="text-secondary pb-6 pr-12">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSection() {
  return (
    <section id="faq" className="py-20 px-4 bg-surface/30">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mb-4">
            F.A.Q.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}