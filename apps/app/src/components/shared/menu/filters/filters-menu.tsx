"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import {
    FunnelSimple,
    Check,
    Circle,
    CircleNotch,
    CircleDashed,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    CalendarBlank,
    ChartBar,
    ChatCircle
} from "@phosphor-icons/react/dist/ssr";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@repo/design/components/ui/dropdown-menu";
import { cn } from "@repo/design/lib/utils";
import { 
    hasActiveFiltersAtom,
    activeFilterCountAtom,
    statusFilterAtom,
    dateRangeFilterAtom,
    type WebStatus,
    type DateRange 
} from "@/atoms/filters";
import { useSpaces } from "@/hooks/spaces";

const statusOptions: { value: WebStatus; label: string; icon: React.ComponentType<any>; color?: string }[] = [
    { value: 'all', label: 'All Statuses', icon: Circle },
    { value: 'PENDING', label: 'Pending', icon: CircleNotch, color: 'text-yellow-600' },
    { value: 'PROCESSING', label: 'Processing', icon: CircleDashed, color: 'text-blue-600' },
    { value: 'COMPLETE', label: 'Complete', icon: CheckCircle, color: 'text-green-600' },
    { value: 'FAILED', label: 'Failed', icon: XCircle, color: 'text-red-600' },
];

const dateRangeOptions: { value: DateRange; label: string; icon: React.ComponentType<any> }[] = [
    { value: 'all', label: 'All Time', icon: CalendarBlank },
    { value: 'today', label: 'Today', icon: Clock },
    { value: 'week', label: 'This Week', icon: Calendar },
    { value: 'month', label: 'This Month', icon: Calendar },
];

export function FiltersMenu() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [status, setStatus] = useAtom(statusFilterAtom);
    const [dateRange, setDateRange] = useAtom(dateRangeFilterAtom);
    const [hasActiveFilters] = useAtom(hasActiveFiltersAtom);
    const [activeFilterCount] = useAtom(activeFilterCountAtom);
    const { spaces = [] } = useSpaces();

    const handleStatusChange = (value: WebStatus) => {
        setStatus(value);
    };

    const handleDateRangeChange = (value: DateRange) => {
        setDateRange(value);
    };

    const handleClearFilters = () => {
        setStatus('all');
        setDateRange('all');
    };

    return (
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
                <button 
                    className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm transition-all duration-200 font-mono rounded-lg relative",
                        hasActiveFilters
                            ? "bg-accent text-foreground border border-foreground/30" 
                            : "bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-accent",
                        menuOpen && "bg-accent text-foreground border-foreground/20"
                    )}
                >
                    <div className="w-[14px] h-[14px] flex items-center justify-center">
                        <FunnelSimple size={14} weight={hasActiveFilters ? "fill" : "duotone"} />
                    </div>
                    <span className="uppercase tracking-wider">Filters</span>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                side="bottom"
                sideOffset={8}
                className={cn(
                    "w-[280px] p-0 bg-popover border-border/50 rounded-lg font-mono overflow-hidden z-[90]"
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
                    {/* Status Filter */}
                    <div className="py-2">
                        <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider px-3 pb-1">
                            Status
                        </DropdownMenuLabel>
                        {statusOptions.map((option) => {
                            const Icon = option.icon;
                            const isSelected = status === option.value;
                            
                            return (
                                <DropdownMenuItem
                                    key={option.value}
                                    onClick={() => handleStatusChange(option.value)}
                                    className="rounded-md mx-1 px-2 py-1.5 text-sm cursor-pointer transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-2">
                                            <Icon 
                                                className={cn("w-4 h-4", option.color)} 
                                                weight="duotone" 
                                            />
                                            <span className={cn(
                                                "text-sm transition-colors duration-200",
                                                isSelected ? "text-foreground" : "text-muted-foreground"
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

                    <DropdownMenuSeparator className="my-0" />

                    {/* Date Range Filter */}
                    <div className="py-2">
                        <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider px-3 pb-1">
                            Date Range
                        </DropdownMenuLabel>
                        {dateRangeOptions.map((option) => {
                            const Icon = option.icon;
                            const isSelected = dateRange === option.value;
                            
                            return (
                                <DropdownMenuItem
                                    key={option.value}
                                    onClick={() => handleDateRangeChange(option.value)}
                                    className="rounded-md mx-1 px-2 py-1.5 text-sm cursor-pointer transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-4 h-4 text-muted-foreground" weight="duotone" />
                                            <span className={cn(
                                                "text-sm transition-colors duration-200",
                                                isSelected ? "text-foreground" : "text-muted-foreground"
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


                    {/* Clear Filters */}
                    {activeFilterCount > 0 && (
                        <>
                            <DropdownMenuSeparator className="my-0" />
                            <div className="p-2">
                                <button
                                    onClick={handleClearFilters}
                                    className="w-full px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground bg-muted/20 hover:bg-muted/40 rounded-md transition-all duration-200 font-mono"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </>
                    )}
                </motion.div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}