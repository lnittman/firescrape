'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';
import { useAtom } from 'jotai';
import { useIsMobile } from '@repo/design/hooks/useMobile';
import { Dialog } from '@repo/design/components/ui/dialog';
import { Button } from '@repo/design/components/ui/button';
import { Link } from 'next-view-transitions';
import { cn } from '@repo/design/lib/utils';
import { searchModalOpenAtom } from '@/atoms/modals';
import { extractDomain, formatRelativeTime } from '@/lib/utils';
import { useScrapes } from '@/hooks/swr/scrape/queries';


export function SearchModal() {
    const [isOpen, setIsOpen] = useAtom(searchModalOpenAtom);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const isMobile = useIsMobile();
    const [mounted, setMounted] = useState(false);
    
    // Ensure client-side only rendering
    useEffect(() => {
        setMounted(true);
    }, []);
    
    // Fetch data only when modal is open
    const { data } = useScrapes();
    const runs = data?.runs || [];

    // Don't open on mobile - let MobileSearchModal handle it
    const shouldOpen = mounted && isOpen && !isMobile;

    // Helper function to get the correct run URL
    const getRunUrl = (run: any) => {
        return `/r/${run.id}`;
    };

    const filteredRuns = useMemo(() => {
        if (!query.trim()) return runs.slice(0, 20);

        return runs.filter(run => {
            const searchText = `${run.url} ${run.status}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
        }).slice(0, 20);
    }, [runs, query]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!shouldOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, filteredRuns.length - 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter' && filteredRuns[selectedIndex]) {
                e.preventDefault();
                window.location.href = getRunUrl(filteredRuns[selectedIndex]);
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [shouldOpen, filteredRuns, selectedIndex, setIsOpen, getRunUrl]);

    // Reset selection when query changes
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    // Reset when modal closes
    useEffect(() => {
        if (!isOpen) {
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsOpen(false);
    };

    // Don't render on server
    if (!mounted) return null;

    return (
        <Dialog open={shouldOpen} onOpenChange={setIsOpen}>
            <AnimatePresence>
                {shouldOpen && (
                    <div className="fixed inset-0 z-[400]">
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-background/60 backdrop-blur-sm"
                            onClick={handleClose}
                            aria-hidden="true"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        />

                        {/* Modal */}
                        <motion.div
                            className="fixed left-1/2 top-1/2 h-[500px] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="flex flex-col h-full rounded-lg border border-border bg-background shadow-md overflow-hidden">
                                {/* Header */}
                                <div className="p-4 border-b border-border flex-shrink-0 bg-muted/10">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                                            Search Runs
                                        </span>
                                        <button
                                            onClick={handleClose}
                                            className={cn(
                                                "h-8 w-8 flex items-center justify-center transition-all duration-200 rounded-md border select-none",
                                                "bg-accent/5 border-accent/50 text-muted-foreground",
                                                "hover:bg-accent/40 hover:text-accent-foreground hover:border-accent/50",
                                                "focus:outline-none"
                                            )}
                                            aria-label="Close"
                                        >
                                            <X className="w-4 h-4" weight="duotone" />
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" weight="duotone" />
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="Search runs..."
                                            className="w-full pl-10 pr-4 py-3 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none font-mono"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {/* Results */}
                                <div className="flex-1 flex flex-col overflow-hidden">
                                    {filteredRuns.length > 0 ? (
                                        <div className="flex-1 overflow-y-auto">
                                            <div className="divide-y divide-border">
                                                {filteredRuns.map((run, index) => (
                                                    <Link
                                                        key={run.id}
                                                        href={getRunUrl(run)}
                                                        className={cn(
                                                            "block p-4 transition-colors font-mono border-l-2",
                                                            index === selectedIndex
                                                                ? "bg-accent border-l-primary"
                                                                : "hover:bg-accent/50 border-l-transparent"
                                                        )}
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        <div className="space-y-2">
                                                            <div className="flex items-center justify-between gap-3">
                                                                <h3 className="text-sm font-medium truncate">
                                                                    {extractDomain(run.url)}
                                                                </h3>
                                                                <span className={cn(
                                                                    "text-xs px-2 py-1 rounded border",
                                                                    run.status === 'COMPLETE' && "text-green-600 bg-green-600/10 border-green-600/20",
                                                                    run.status === 'PENDING' && "text-yellow-600 bg-yellow-600/10 border-yellow-600/20",
                                                                    run.status === 'PROCESSING' && "text-blue-600 bg-blue-600/10 border-blue-600/20",
                                                                    run.status === 'FAILED' && "text-red-600 bg-red-600/10 border-red-600/20"
                                                                )}>
                                                                    {run.status}
                                                                </span>
                                                            </div>
                                                            <div className="text-xs text-muted-foreground flex items-center justify-between">
                                                                <span className="truncate">{run.url}</span>
                                                                <span>{formatRelativeTime(new Date(run.createdAt))}</span>
                                                            </div>
                                                        </div>
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
                                                    {query ? 'No runs found' : 'Start typing to search...'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="flex justify-end items-center px-4 py-3 bg-muted/30 border-t border-border flex-shrink-0">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleClose}
                                        className="font-medium"
                                    >
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Dialog>
    );
} 