"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import {
    SortAscending,
    SortDescending,
    Clock,
    TextAa,
    ArrowClockwise,
    Check,
    Baby,
    Mountains,
    Lightning,
    Leaf,
    Scroll,
    Buildings
} from "@phosphor-icons/react/dist/ssr";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@repo/design/components/ui/dropdown-menu";
import { cn } from "@repo/design/lib/utils";
import { sortOrderAtom, type SortOrder } from "@/atoms/filters";

const sortOptions: { value: SortOrder; label: string; icon: React.ComponentType<any> }[] = [
    { value: 'newest', label: 'Newest First', icon: Leaf },
    { value: 'oldest', label: 'Oldest First', icon: Scroll },
    { value: 'alphabetical', label: 'A → Z', icon: SortAscending },
    { value: 'alphabetical-desc', label: 'Z → A', icon: SortDescending },
    { value: 'updated', label: 'Recently Updated', icon: ArrowClockwise },
];

export function SortMenu() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [sortOrder, setSortOrder] = useAtom(sortOrderAtom);

    const handleSortChange = (value: SortOrder) => {
        setSortOrder(value);
        setMenuOpen(false);
    };

    const currentSort = sortOptions.find(opt => opt.value === sortOrder);
    const CurrentIcon = currentSort?.icon || SortAscending;

    return (
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
                <button 
                    className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm transition-all duration-200 bg-background border border-border font-mono rounded-lg",
                        menuOpen 
                            ? "bg-accent text-foreground border-foreground/20" 
                            : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                >
                    <div className="w-[14px] h-[14px] relative flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={sortOrder}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <CurrentIcon size={14} weight="duotone" />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <span className="uppercase tracking-wider">Sort</span>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                side="bottom"
                sideOffset={8}
                className={cn(
                    "w-[200px] p-0 bg-popover border-border/50 rounded-lg font-mono overflow-hidden z-[90]"
                )}
            >
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        mass: 0.8
                    }}
                >
                    <div className="py-1 space-y-1">
                        {sortOptions.map((option) => {
                            const Icon = option.icon;
                            const isSelected = sortOrder === option.value;
                            
                            return (
                                <DropdownMenuItem
                                    key={option.value}
                                    onClick={() => handleSortChange(option.value)}
                                    className="rounded-md mx-1 px-2 py-1.5 text-sm cursor-pointer transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-2">
                                            <Icon 
                                                className={cn(
                                                    "w-4 h-4 transition-colors duration-200",
                                                    isSelected ? "text-foreground" : "text-muted-foreground"
                                                )} 
                                                weight="duotone" 
                                            />
                                            <span className={cn(
                                                "text-sm transition-colors duration-200",
                                                isSelected ? "text-foreground font-medium" : "text-muted-foreground"
                                            )}>
                                                {option.label}
                                            </span>
                                        </div>
                                        {isSelected && (
                                            <Check className="w-4 h-4 text-foreground" weight="duotone" />
                                        )}
                                    </div>
                                </DropdownMenuItem>
                            );
                        })}
                    </div>
                </motion.div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}