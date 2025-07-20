export default function TripsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((n) => (
        <div key={n} className="bg-card rounded-lg overflow-hidden shadow-sm animate-pulse">
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
