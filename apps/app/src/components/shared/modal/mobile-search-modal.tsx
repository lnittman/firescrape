'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'next-view-transitions';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';
import { useAtom } from 'jotai';
import { useAuth } from '@repo/auth/client';
import { useIsMobile } from '@repo/design/hooks/use-mobile';
import { cn } from '@repo/design/lib/utils';
import { MobileSheet } from '@/components/shared/ui/mobile-sheet';
import { formatRelativeTime } from '@/lib/dashboard-utils';
import { searchModalOpenAtom } from '@/atoms/modals';
import { useTrips } from '@/hooks/use-trips';
import type { Trip } from '@repo/database';

// Main mobile search modal content component
function MobileSearchModalContent() {
    const { isLoaded } = useAuth();
    const [isOpen, setIsOpen] = useAtom(searchModalOpenAtom);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const isMobile = useIsMobile();
    
    // Fetch data only when modal is open
    const { trips = [] } = useTrips();

    // Only open on mobile - let SearchModal handle desktop
    const shouldOpen = isOpen && isMobile;

    // Filter trips based on search query
    const filteredTrips = trips.filter(trip => {
        if (!query) return true;
        const searchQuery = query.toLowerCase();
        return (
            trip.title.toLowerCase().includes(searchQuery) ||
            trip.location?.toLowerCase().includes(searchQuery) ||
            trip.description?.toLowerCase().includes(searchQuery) ||
            trip.difficulty?.toLowerCase().includes(searchQuery)
        );
    }).slice(0, 8); // Match desktop limit for consistency

    // Reset selection when results change
    useEffect(() => {
        setSelectedIndex(0);
    }, [filteredTrips.length]);

    // Reset search when modal closes
    useEffect(() => {
        if (!isOpen) {
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleTripClick = (trip: Trip) => {
        setIsOpen(false);
        // Navigation handled by Link component
    };

    if (!isLoaded) {
        return null;
    }

    return (
        <MobileSheet
            isOpen={shouldOpen}
            onClose={handleClose}
            title="Command menu"
            showCloseButton={true}
            position="bottom"
            spacing="sm"
            contentHeight="fill"
        >
            <div className="flex flex-col h-full">
                {/* Search Input */}
                <div className="p-4 border-b border-border flex-shrink-0">
                    <div className="relative">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" weight="duotone" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder='Search…'
                            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 font-mono text-base"
                            style={{ fontSize: '16px' }} // Prevent zoom on iOS
                            autoFocus
                        />
                    </div>
                </div>

                {/* Results */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {filteredTrips.length > 0 ? (
                        <div className="flex-1 overflow-y-auto">
                            <div className="divide-y divide-border">
                                {filteredTrips.map((trip, index) => (
                                    <Link
                                        key={trip.id}
                                        href={`/trip/${trip.id}`}
                                        onClick={() => handleTripClick(trip)}
                                        className="block p-3 transition-colors active:bg-accent"
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05, duration: 0.2 }}
                                            className="space-y-2"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <h3 className="text-sm font-medium text-foreground line-clamp-1 font-mono">
                                                    {trip.title}
                                                </h3>
                                                <span className={cn(
                                                    "text-xs px-2 py-1 rounded border flex-shrink-0",
                                                    trip.difficulty === 'EASY' && "text-green-600 bg-green-600/10 border-green-600/20",
                                                    trip.difficulty === 'MODERATE' && "text-yellow-600 bg-yellow-600/10 border-yellow-600/20",
                                                    trip.difficulty === 'CHALLENGING' && "text-orange-600 bg-orange-600/10 border-orange-600/20",
                                                    trip.difficulty === 'DIFFICULT' && "text-red-600 bg-red-600/10 border-red-600/20",
                                                    trip.difficulty === 'EXTREME' && "text-red-600 bg-red-600/10 border-red-600/20"
                                                )}>
                                                    {trip.difficulty?.toLowerCase()}
                                                </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground flex items-center justify-between">
                                                <span className="truncate font-mono">{trip.distance ? `${trip.distance} mi` : ''} {trip.distance && trip.elevationGain ? '•' : ''} {trip.elevationGain ? `${trip.elevationGain} ft` : ''}</span>
                                                <span className="flex-shrink-0 ml-2">{trip.location}</span>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-8">
                            <div className="text-center">
                                    <div className="w-12 h-12 rounded-md bg-muted/50 flex items-center justify-center mx-auto mb-3">
                                        <MagnifyingGlass className="w-6 h-6 text-muted-foreground/60" weight="duotone" />
                                </div>
                                <p className="text-sm text-muted-foreground font-mono">
                                    {query ? 'No trips found' : 'Start typing to search...'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MobileSheet>
    );
}

// Main exported component with Suspense wrapper
export function MobileSearchModal() {
    return (
        <Suspense fallback={null}>
            <MobileSearchModalContent />
        </Suspense>
    );
} 