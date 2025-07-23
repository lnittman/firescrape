import { notFound } from 'next/navigation';
import { auth } from '@repo/auth/server';
import { getScrapeById } from '@/lib/api/services/scrape';
import { RunDetailClient } from '@/components/run/run-detail.client';

interface RunPageProps {
  params: Promise<{ id: string }>;
}

export default async function RunPage({ params }: RunPageProps) {
  const { id } = await params;
  const session = await auth();
  
  if (!session?.userId) {
    notFound();
  }

  const run = await getScrapeById(session.userId, id);

  if (!run) {
    notFound();
  }

  return <RunDetailClient run={run} />;
}