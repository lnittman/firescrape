import { notFound } from 'next/navigation';
import { auth } from '@repo/auth/server';
import { tripService } from '@repo/api';
import { TripDetailClient } from './trip-detail-client';

interface TripPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TripPage({ params }: TripPageProps) {
  const { id } = await params;
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error('Not authenticated');
  }

  // Fetch the trip
  const trip = await tripService.getTripById(id, userId);
  
  if (!trip) {
    notFound();
  }

  return <TripDetailClient trip={trip} />;
}