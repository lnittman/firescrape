import { auth } from '@repo/auth/server';
import { tripService } from '@repo/api';
import { TripsPageClient } from './components/trips-page-client';

export default async function TripsPage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Not authenticated');
  }

  // Fetch trips on the server
  const trips = await tripService.listTrips(userId);

  return (
    <TripsPageClient
      userId={userId}
      initialTrips={trips}
    />
  );
}
