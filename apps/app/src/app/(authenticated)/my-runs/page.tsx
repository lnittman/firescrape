import { Suspense } from 'react';
import { redirect } from 'next/navigation';

import { auth } from '@repo/auth/server';

import { MyRunsClient } from '@/components/my-runs/my-runs.client';
import { MyRunsSkeleton } from '@/components/my-runs/my-runs.skeleton';
import { getScrapes } from '@/lib/api/services/scrape';

export default async function MyRunsPage() {
  const session = await auth();
  
  if (!session?.userId) {
    redirect('/sign-in');
  }

  const { runs } = await getScrapes(session.userId);

  return (
    <Suspense fallback={<MyRunsSkeleton />}>
      <MyRunsClient initialRuns={runs} userId={session.userId} />
    </Suspense>
  );
}
