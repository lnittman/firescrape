'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'next-view-transitions';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';
import { useAtom } from 'jotai';
import { useAuth } from '@repo/auth/client';
import { useIsMobile } from '@repo/design/hooks/useMobile';
import { cn } from '@repo/design/lib/utils';
import { MobileSheet } from '@/components/shared/ui/mobile-sheet';
import { formatRelativeTime } from '@/lib/utils';
import { searchModalOpenAtom } from '@/atoms/modals';
import { useScrapes } from '@/hooks/swr/scrape';

// Main mobile search modal content component
function MobileSearchModalContent() {
    const { isLoaded } = useAuth();
    const [isOpen, setIsOpen] = useAtom(searchModalOpenAtom);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const isMobile = useIsMobile();
    
    // Fetch data only when modal is open
    const { data } = useScrapes();
    const runs = data?.runs || [];

    // Only open on mobile - let SearchModal handle desktop
    const shouldOpen = isOpen && isMobile;

    // Filter runs based on search query
    const filteredRuns = runs.filter(run => {
        if (!query) return true;
        const searchQuery = query.toLowerCase();
        return (
            run.url.toLowerCase().includes(searchQuery) ||
            run.status.toLowerCase().includes(searchQuery)
        );
    }).slice(0, 8); // Match desktop limit for consistency

    // Reset selection when results change
    useEffect(() => {
        setSelectedIndex(0);
    }, [filteredRuns.length]);

    // Reset search when modal closes
    useEffect(() => {
        if (!isOpen) {
            setQuery('');
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (filteredRuns.length > 0 && selectedIndex < filteredRuns.length) {
            handleClose();
        }
    };

    if (!isLoaded) {
        return null;
    }

    return (
        <MobileSheet
            isOpen={shouldOpen}
            onClose={handleClose}
            position="top"
            contentHeight="fill"
            contentPadding={false}
            useScrollGradient={false}
        >
            <div className="flex flex-col h-full">
                {/* Search Input */}
                <form onSubmit={handleSearchSubmit} className="p-4 border-b border-border">
                    <div className="relative">
                        <MagnifyingGlass 
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
                            size={20} 
                            weight="duotone"
                        />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search runs..."
                            className="w-full h-12 pl-10 pr-4 bg-background border border-border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-colors"
                            autoFocus
                            style={{ fontSize: '16px' }} // Prevent zoom on iOS
                        />
                    </div>
                </form>

                {/* Results */}
                <div className="flex-1 overflow-y-auto">
                    {filteredRuns.length > 0 ? (
                        <div className="p-2">
                            {filteredRuns.map((run, index) => (
                                <Link
                                    key={run.id}
                                    href={`/r/${run.id}`}
                                    onClick={handleClose}
                                    className={cn(
                                        "block p-3 rounded-lg mb-1 transition-all duration-200",
                                        "hover:bg-muted/50",
                                        selectedIndex === index && "bg-muted"
                                    )}
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium text-sm truncate">
                                            {run.url}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span className={cn(
                                                "capitalize",
                                                run.status === 'COMPLETE' && "text-green-600",
                                                run.status === 'FAILED' && "text-red-600",
                                                run.status === 'PROCESSING' && "text-blue-600"
                                            )}>
                                                {run.status.toLowerCase()}
                                            </span>
                                            <span>•</span>
                                            <span>{formatRelativeTime(new Date(run.createdAt))}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : query ? (
                        <div className="p-8 text-center">
                            <p className="text-muted-foreground">No runs found</p>
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <p className="text-muted-foreground">
                                Search your scrape runs
                            </p>
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