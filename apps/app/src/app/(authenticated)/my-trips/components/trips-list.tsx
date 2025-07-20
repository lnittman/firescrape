"use client";

import Link from "next/link";
import TripsEmptyState from "./trips-empty-state";
import { useTrips } from "@/hooks/use-trips";
import type { Trip } from "@repo/database";

type TripsListProps = {
  userId: string;
  initialTrips: Trip[];
  filter: 'planned' | 'completed';
};

export default function TripsList({
  userId,
  initialTrips,
  filter,
}: TripsListProps) {
  const { trips, isLoading } = useTrips(initialTrips);

  // Filter trips based on status
  const filteredTrips = trips.filter((trip: any) => {
    if (filter === 'planned') {
      return trip.status === 'PLANNED' || trip.status === 'IN_PROGRESS';
    } else {
      return trip.status === 'COMPLETED';
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="bg-card rounded-lg overflow-hidden shadow-sm animate-pulse"
          >
            <div className="h-40 bg-muted"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 bg-muted rounded w-2/3"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredTrips.length === 0) {
    return <TripsEmptyState filter={filter} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredTrips.map((trip: any) => (
        <Link
          href={`/my-trips/${trip.id}`}
          key={trip.id}
          className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border/50"
        >
          <div className="h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
            <span className="text-4xl">🥾</span>
          </div>

          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-display font-medium text-lg">
                {trip.title}
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded-full ${trip.status === "COMPLETED"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}
              >
                {trip.status === "COMPLETED"
                  ? "Completed"
                  : trip.status === "IN_PROGRESS"
                    ? "In Progress"
                    : "Planned"}
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {trip.description || "No description available"}
            </p>

            <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{trip.location || "Location TBD"}</span>
              </div>

              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                <span>
                  {trip.distance
                    ? `${trip.distance} mi`
                    : "Distance TBD"}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span>
                  {trip.elevationGain
                    ? `${trip.elevationGain} ft`
                    : "Elevation TBD"}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  {trip.createdAt
                    ? new Date(trip.createdAt).toLocaleDateString()
                    : "Date TBD"}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}