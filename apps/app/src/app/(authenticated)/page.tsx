import { auth } from '@repo/auth/server';
import { tripService, userContextService } from '@repo/api';
import { HomePageClientV2 } from '@/components/explore/home-page-client-v2';

export default async function HomePage() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.log('[HomePage] No userId found in auth');
      return null; // Auth middleware should handle this
    }
    
    console.log('[HomePage] Authenticated userId:', userId);
    
    // Fetch data in parallel for performance
    const [recentTrips, userContext] = await Promise.all([
      tripService.listTrips(userId).catch(err => {
        console.error('[HomePage] Error fetching trips:', err);
        return [];
      }),
      userContextService.getUserContext(userId).catch(err => {
        console.error('[HomePage] Error fetching user context:', err);
        return null;
      }),
    ]);
    
    return (
      <HomePageClientV2 
        initialTrips={recentTrips}
        userContext={userContext || undefined}
      />
    );
  } catch (error) {
    console.error('[HomePage] Critical error:', error);
    // Return a simple error state instead of throwing
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }
}
