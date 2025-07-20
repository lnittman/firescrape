import Image from 'next/image';
import Link from 'next/link';
import { YubaLogo } from '@/components/shared';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturesSection } from '@/components/home/features-section';
import { ValuePropsSection } from '@/components/home/value-props-section';
import { FAQSection } from '@/components/home/faq-section';
import { CTASection } from '@/components/home/cta-section';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-surface">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <YubaLogo size="small" />
            <nav className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                How it Works
              </Link>
              <Link href="#faq" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
                FAQ
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-secondary hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        <HeroSection />
        <FeaturesSection />
        <ValuePropsSection />
        <FAQSection />
        <CTASection />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/10 bg-surface/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <YubaLogo size="xs" />
            <p className="text-sm text-secondary">
              © 2024 Yuba. Your outdoor adventure companion.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}