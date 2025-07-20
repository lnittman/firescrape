'use client';

type TripsEmptyStateProps = {
  filter: 'planned' | 'completed';
};

export default function TripsEmptyState({ filter }: TripsEmptyStateProps) {
  return (
    <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 12rem)' }}>
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
          <span className="text-3xl">🏕️</span>
        </div>
        <h3 className="text-xl font-display font-medium mb-2">No trips yet</h3>
        <p className="text-muted-foreground max-w-md">
          {filter === 'planned' 
            ? "Start planning your next outdoor adventure. Your upcoming trips will appear here."
            : "Your completed outdoor journeys will be tracked here. Time to get out there!"
          }
        </p>
      </div>
    </div>
  );
}