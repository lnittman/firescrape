'use client';

import { Suspense, useState } from 'react';
import { Page } from '@/components/shared/layout/page';
import TripsList from './trips-list';
import TripsHeader from './trips-header';
import TripsLoading from './trips-loading';
import type { Trip } from '@repo/database';

interface TripsPageClientProps {
  userId: string;
  initialTrips: Trip[];
}

export function TripsPageClient({ userId, initialTrips }: TripsPageClientProps) {
  const [filter, setFilter] = useState<'planned' | 'completed'>('planned');

  return (
    <Page>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <TripsHeader
          userId={userId}
          filter={filter}
          onFilterChange={setFilter}
        />

        <Suspense fallback={<TripsLoading />}>
          <TripsList
            userId={userId}
            initialTrips={initialTrips}
            filter={filter}
          />
        </Suspense>
      </div>
    </Page>
  );
}
