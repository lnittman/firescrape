'use client';

import React, { Suspense } from 'react';
import { useAtom } from 'jotai';
import { motion } from 'framer-motion';
import {
    SortAscending,
    SortDescending,
    Clock,
    ArrowClockwise,
    Check,
    Leaf,
    Scroll
} from '@phosphor-icons/react/dist/ssr';
import { useAuth } from '@repo/auth/client';
import { MobileSheet } from '@/components/shared/ui/mobile-sheet';
import { cn } from '@repo/design/lib/utils';
import { 
    mobileSortOpenAtom,
    sortOrderAtom,
    type SortOrder
} from '@/atoms/filters';

const sortOptions: { value: SortOrder; label: string; description: string; icon: React.ComponentType<any> }[] = [
    { 
        value: 'newest', 
        label: 'Newest First', 
        description: 'Fresh and green',
        icon: Leaf 
    },
    { 
        value: 'oldest', 
        label: 'Oldest First', 
        description: 'Ancient wisdom',
        icon: Scroll 
    },
    { 
        value: 'alphabetical', 
        label: 'A → Z', 
        description: 'Alphabetical order',
        icon: SortAscending 
    },
    { 
        value: 'alphabetical-desc', 
        label: 'Z → A', 
        description: 'Reverse alphabetical',
        icon: SortDescending 
    },
    { 
        value: 'updated', 
        label: 'Recently Updated', 
        description: 'Last modified first',
        icon: ArrowClockwise 
    },
];

// Main mobile sort sheet content component
function MobileSortSheetContent() {
    const { isLoaded } = useAuth();
    const [isOpen, setIsOpen] = useAtom(mobileSortOpenAtom);
    const [sortOrder, setSortOrder] = useAtom(sortOrderAtom);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSortChange = (value: SortOrder) => {
        setSortOrder(value);
        setIsOpen(false);
    };

    if (!isLoaded) {
        return null;
    }

    return (
        <MobileSheet
            isOpen={isOpen}
            onClose={handleClose}
            title="Sort"
            position="bottom"
            showCloseButton={true}
        >
            <div className="p-4 space-y-2">
                {sortOptions.map((option, index) => {
                    const Icon = option.icon;
                    const isSelected = sortOrder === option.value;
                    
                    return (
                        <motion.button
                            key={option.value}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.2 }}
                            onClick={() => handleSortChange(option.value)}
                            className={cn(
                                "w-full flex items-center justify-between p-4 rounded-lg transition-all duration-200",
                                isSelected 
                                    ? "bg-accent border border-accent/50" 
                                    : "bg-muted/20 border border-transparent hover:bg-muted/40 active:bg-muted/60"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center",
                                    isSelected ? "bg-background" : "bg-muted/30"
                                )}>
                                    <Icon 
                                        className={cn(
                                            "w-5 h-5",
                                            isSelected ? "text-foreground" : "text-muted-foreground"
                                        )} 
                                        weight="duotone" 
                                    />
                                </div>
                                <div className="text-left">
                                    <div className={cn(
                                        "text-sm font-mono font-medium",
                                        isSelected ? "text-foreground" : "text-foreground/80"
                                    )}>
                                        {option.label}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                        {option.description}
                                    </div>
                                </div>
                            </div>
                            {isSelected && (
                                <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                                    <Check className="w-4 h-4 text-background" weight="bold" />
                                </div>
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </MobileSheet>
    );
}

// Main exported component with Suspense wrapper
export function MobileSortSheet() {
    return (
        <Suspense fallback={null}>
            <MobileSortSheetContent />
        </Suspense>
    );
}