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
            Back to My Trips
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/trip/${trip.id}/edit`)}
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

        {/* Main Content */}
        <div className="bg-card rounded-lg border border-border/50 overflow-hidden">
          <div className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <span className="text-6xl">🥾</span>
          </div>
          
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="font-display text-3xl font-medium">{trip.title}</h1>
              <div className="flex gap-2">
                <span className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  getStatusColor(trip.status)
                )}>
                  {trip.status.charAt(0) + trip.status.slice(1).toLowerCase().replace('_', ' ')}
                </span>
                {trip.difficulty && (
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    getDifficultyColor(trip.difficulty)
                  )}>
                    {trip.difficulty.charAt(0) + trip.difficulty.slice(1).toLowerCase()}
                  </span>
                )}
              </div>
            </div>

            {trip.description && (
              <p className="text-muted-foreground mb-6">{trip.description}</p>
            )}

            {/* Trip Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {/* Elevation Gain */}
              {trip.elevationGain && (
                <div className="flex items-start gap-3">
                  <Mountains className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Elevation Gain</p>
                    <p className="text-sm text-muted-foreground">{trip.elevationGain} ft</p>
                  </div>
                </div>
              )}

              {/* Duration */}
              {trip.duration && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">{trip.duration} hours</p>
                  </div>
                </div>
              )}

              {/* Weather */}
              {trip.weather && (
                <div className="flex items-start gap-3">
                  <CloudRain className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Weather</p>
                    <p className="text-sm text-muted-foreground">
                      {typeof trip.weather === 'string' 
                        ? trip.weather 
                        : JSON.stringify(trip.weather)}
                    </p>
                  </div>
                </div>
              )}

              {/* Date */}
              {trip.startDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{trip.status === 'PLANNED' ? 'Planned Date' : 'Start Date'}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(trip.startDate), 'PPP')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Notes */}
            {trip.notes && (
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="font-medium mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{trip.notes}</p>
              </div>
            )}

            {/* Metadata */}
            <div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground">
              <p>Created: {format(new Date(trip.createdAt), 'PPP')}</p>
              {trip.updatedAt && (
                <p>Last updated: {format(new Date(trip.updatedAt), 'PPP')}</p>
              )}
            </div>
          </div>
        </div>
      </ScrollFadeContainer>
    </Page>
  );
}