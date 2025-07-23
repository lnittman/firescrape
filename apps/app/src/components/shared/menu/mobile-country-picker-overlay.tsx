"use client";

import React, { useState } from "react";
import { useAtom } from "jotai";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { MobileSheet } from "@/components/shared/ui/mobile-sheet";
import { cn } from "@repo/design/lib/utils";
import {
    countries,
    continentOrder,
    type Country,
} from "@/lib/constants/countries";
import { mobileCountryPickerOpenAtom } from "@/atoms/menus";
import { useIsMobile } from "@repo/design/hooks/useMobile";

interface MobileCountryPickerOverlayProps {
    selectedCountry?: Country;
    onSelect?: (country: Country) => void;
}

function MobileCountryPickerOverlayContent({ selectedCountry, onSelect }: MobileCountryPickerOverlayProps) {
    const [isOpen, setIsOpen] = useAtom(mobileCountryPickerOpenAtom);
    const [searchQuery, setSearchQuery] = useState("");
    const isMobile = useIsMobile();

    const shouldOpen = isOpen && isMobile;

    const handleClose = () => {
        setIsOpen(false);
        setSearchQuery("");
        // MobileSheet will handle closing global mobile menu when animation completes
    };

    const handleSelect = (country: Country) => {
        onSelect?.(country);
        handleClose();
    };

    const filteredCountries = React.useMemo(() => {
        if (!searchQuery.trim()) return countries;
        const query = searchQuery.toLowerCase();
        return countries.filter((country) =>
            country.name.toLowerCase().includes(query) ||
            country.code.toLowerCase().includes(query) ||
            country.dialCode.includes(query)
        );
    }, [searchQuery]);

    const groupedCountries = React.useMemo(() => {
        const groups: Record<string, Country[]> = {};
        filteredCountries.forEach((country) => {
            const continent = country.continent || 'Other';
            if (!groups[continent]) groups[continent] = [];
            groups[continent].push(country);
        });
        Object.keys(groups).forEach((continent) => {
            groups[continent].sort((a, b) => a.name.localeCompare(b.name));
        });
        return groups;
    }, [filteredCountries]);

    return (
        <MobileSheet
            isOpen={shouldOpen}
            onClose={handleClose}
            title="Select Country"
            showCloseButton
            position="bottom"
            spacing="sm"
        >
            <div className="p-6 space-y-4">
                <div className="relative">
                    <MagnifyingGlass
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        weight="duotone"
                    />
                    <input
                        type="text"
                        placeholder="Search countries..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 text-sm font-mono bg-background border border-border rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-colors"
                        style={{ fontSize: "16px" }}
                        autoFocus={!isMobile}
                    />
                </div>
                <div className="max-h-[60vh] overflow-y-auto">
                    {continentOrder
                        .filter((c) => groupedCountries[c]?.length > 0)
                        .map((continent) => (
                            <div key={continent} className="py-2">
                                <div className="px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30">
                                    {continent}
                                </div>
                                <div className="space-y-1 px-1">
                                    {groupedCountries[continent].map((country) => (
                                        <button
                                            key={country.code}
                                            onClick={() => handleSelect(country)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-2 py-2 text-left transition-colors rounded-md hover:bg-accent/50",
                                                selectedCountry?.code === country.code && "bg-accent text-accent-foreground"
                                            )}
                                        >
                                            <span className="text-lg">{country.flag}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium truncate">
                                                    {country.name}
                                                </div>
                                            </div>
                                            <div className="text-sm font-mono text-muted-foreground">
                                                {country.dialCode}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    {Object.keys(groupedCountries).length === 0 && (
                        <div className="p-6 text-center">
                            <p className="text-sm text-muted-foreground font-mono">No countries found</p>
                        </div>
                    )}
                </div>
            </div>
        </MobileSheet>
    );
}

export function MobileCountryPickerOverlay(props: MobileCountryPickerOverlayProps) {
    return (
        <React.Suspense fallback={null}>
            <MobileCountryPickerOverlayContent {...props} />
        </React.Suspense>
    );
}

