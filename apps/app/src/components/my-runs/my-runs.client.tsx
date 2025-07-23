'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { EmptyState } from '@/components/shared/empty-state';
import { Page } from '@/components/shared/layout/page';
import { useScrapes } from '@/hooks/swr/scrape';

import { RunsHeader } from './my-runs-header';
import { ScrapeListItem } from '../scrape/scrape-list-item';

type Scrape = {
  id: string;
  url: string;
  status: string;
  formats: string[];
  createdAt: Date;
  completedAt: Date | null;
  duration: number | null;
  error: string | null;
  metadata: any;
  markdown: string | null;
};

interface MyRunsClientProps {
  initialRuns: Scrape[];
  userId: string;
}

export function MyRunsClient({ initialRuns, userId }: MyRunsClientProps) {
  const [filter, setFilter] = useState<'active' | 'archived'>('active');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { data: runsData, mutate } = useScrapes();
  const runs = runsData?.runs || initialRuns;

  // Filter runs based on active/archived
  // Active: PENDING, PROCESSING, or recently completed (within 24 hours)
  // Archived: Older completed runs or failed runs
  const filteredRuns = runs.filter(run => {
    const isRecent = run.completedAt 
      ? new Date().getTime() - new Date(run.completedAt).getTime() < 24 * 60 * 60 * 1000
      : true;
    
    if (filter === 'active') {
      return run.status === 'PENDING' || run.status === 'PROCESSING' || 
        (run.status === 'COMPLETE' && isRecent);
    } else {
      return (run.status === 'COMPLETE' && !isRecent) || run.status === 'FAILED';
    }
  });

  return (
    <Page>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32">
        <RunsHeader 
          filter={filter} 
          onFilterChange={setFilter} 
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ 
              opacity: { duration: 0.2, ease: "easeOut" },
              y: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
            }}
          >
            {filteredRuns.length === 0 ? (
              <EmptyState filter={filter} />
            ) : (
              <div className="mt-6 space-y-2">
                {filteredRuns.map((run) => (
                  <ScrapeListItem
                    key={run.id}
                    run={run}
                    isHovered={hoveredId === run.id}
                    isDimmed={hoveredId !== null && hoveredId !== run.id}
                    onHover={setHoveredId}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Page>
  );
}