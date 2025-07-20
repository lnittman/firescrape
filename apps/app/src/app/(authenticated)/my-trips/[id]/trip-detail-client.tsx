'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { 
  MapPin, 
  Clock, 
  Mountains, 
  Calendar, 
  ArrowLeft,
  Pencil,
  Trash,
  Star,
  CloudRain,
  Path
} from '@phosphor-icons/react';
import { Page } from '@/components/shared/layout/page';
import { ScrollFadeContainer } from '@/components/shared/layout/scroll-fade-container';
import { Button } from '@repo/design/components/ui/button';
import { cn } from '@/lib/utils';
import type { Trip } from '@repo/database';
import { updateTrip, deleteTrip } from '@/actions/trip-actions';

interface TripDetailClientProps {
  trip: Trip;
}

export function TripDetailClient({ trip }: TripDetailClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this trip?')) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteTrip(trip.id);
      if (result.success) {
        router.push('/my-trips');
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case 'EASY': return 'text-green-600 bg-green-50';
      case 'MODERATE': return 'text-yellow-600 bg-yellow-50';
      case 'HARD': return 'text-orange-600 bg-orange-50';
      case 'EXPERT': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNED': return 'text-blue-600 bg-blue-50';
      case 'IN_PROGRESS': return 'text-purple-600 bg-purple-50';
      case 'COMPLETED': return 'text-green-600 bg-green-50';
      case 'CANCELLED': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Page>
      <ScrollFadeContainer className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/my-trips')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Trips
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/my-trips/${trip.id}/edit`)}
            >
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <Trash className="h-4 w-4" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>

        {/* Adventure Details */}
        <div className="bg-card rounded-lg shadow-sm border p-6 space-y-6">
          {/* Title and Status */}
          <div>
            <div className="flex items-start justify-between">
              <h1 className="text-2xl font-display font-medium">{trip.title}</h1>
              <div className="flex gap-2">
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  getStatusColor(trip.status)
                )}>
                  {trip.status.replace('_', ' ')}
                </span>
                {trip.difficulty && (
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    getDifficultyColor(trip.difficulty)
                  )}>
                    {trip.difficulty}
                  </span>
                )}
              </div>
            </div>
            
            {trip.description && (
              <p className="mt-3 text-muted-foreground">{trip.description}</p>
            )}
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Location */}
            {trip.location && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-muted-foreground">{trip.location}</p>
                </div>
              </div>
            )}

            {/* Activity Type */}
            {trip.activityTypes && trip.activityTypes.length > 0 && (
              <div className="flex items-start gap-3">
                <Mountains className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Activities</p>
                  <p className="text-sm text-muted-foreground">
                    {trip.activityTypes.map(type => type.replace(/_/g, ' ').toLowerCase()).join(', ')}
                  </p>
                </div>
              </div>
            )}

            {/* Date */}
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(trip.startDate), 'MMM d, yyyy')}
                  {trip.endDate && trip.endDate !== trip.startDate && (
                    <> - {format(new Date(trip.endDate), 'MMM d, yyyy')}</>
                  )}
                </p>
              </div>
            </div>

            {/* Duration */}
            {trip.duration && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Duration</p>
                  <p className="text-sm text-muted-foreground">
                    {trip.duration < 60 
                      ? `${trip.duration} min`
                      : `${Math.floor(trip.duration / 60)}h ${trip.duration % 60}min`
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Distance */}
            {trip.distance && (
              <div className="flex items-start gap-3">
                <Path className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Distance</p>
                  <p className="text-sm text-muted-foreground">{trip.distance} miles</p>
                </div>
              </div>
            )}

            {/* Elevation */}
            {trip.elevationGain && (
              <div className="flex items-start gap-3">
                <Mountains className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Elevation Gain</p>
                  <p className="text-sm text-muted-foreground">{trip.elevationGain} ft</p>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {trip.notes && (
            <div>
              <h3 className="text-sm font-medium mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{trip.notes}</p>
            </div>
          )}

          {/* Rating */}
          {trip.rating && trip.status === 'COMPLETED' && (
            <div>
              <h3 className="text-sm font-medium mb-2">Rating</h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-5 w-5",
                      star <= trip.rating! 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-gray-300"
                    )}
                    weight={star <= trip.rating! ? "fill" : "regular"}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Weather */}
          {trip.weather && (
            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <CloudRain className="h-4 w-4" />
                Weather Conditions
              </h3>
              <pre className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                {JSON.stringify(trip.weather, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </ScrollFadeContainer>
    </Page>
  );
}