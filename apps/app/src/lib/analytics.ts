// Analytics utility for tracking user engagement with outdoor activities and locations

export function trackEvent(eventName: string, properties?: Record<string, any>) {
  // TODO: Implement analytics tracking
  // For now, just log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', eventName, properties);
  }
}

export function trackPageView(pathname: string) {
  trackEvent('page_view', { pathname });
}

export function trackLocationView(locationId: string, locationName: string) {
  trackEvent('location_view', { locationId, locationName });
}

export function trackActivityStart(activityType: string) {
  trackEvent('activity_start', { activityType });
}

export function trackActivityComplete(activityType: string, duration: number, distance?: number) {
  trackEvent('activity_complete', { 
    activityType, 
    duration, 
    distance,
    timestamp: new Date().toISOString()
  });
}

export function trackSearchQuery(query: string, resultsCount: number) {
  trackEvent('search', { query, resultsCount });
}

export function trackFilterApplied(filterType: string, filterValue: any) {
  trackEvent('filter_applied', { filterType, filterValue });
}