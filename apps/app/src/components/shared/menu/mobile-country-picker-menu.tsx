"use client";

import React from "react";
import { useAtom } from "jotai";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@repo/design/lib/utils";
import { Skeleton } from "@repo/design/components/ui/skeleton";
import type { Country } from "@/components/shared/ui/flag-picker-button";
import {
    mobileCountryPickerOpenAtom,
    mobileCountryPickerCallbackAtom,
    mobileCountryPickerSelectedAtom,
} from "@/atoms/menus";

interface MobileCountryPickerMenuProps {
    selectedCountry?: Country;
    onSelect?: (country: Country) => void;
    disabled?: boolean;
    className?: string;
}

function MobileCountryPickerMenuSkeleton() {
    return (
        <div className="h-9 w-24">
            <Skeleton className="h-9 w-full rounded-md" />
        </div>
    );
}

function MobileCountryPickerMenuContent({ selectedCountry, onSelect, disabled, className }: MobileCountryPickerMenuProps) {
    const [_, setIsOpen] = useAtom(mobileCountryPickerOpenAtom);
    const [, setCallback] = useAtom(mobileCountryPickerCallbackAtom);
    const [, setSelected] = useAtom(mobileCountryPickerSelectedAtom);

    const handleOpen = () => {
        if (!disabled) {
            setSelected(selectedCountry);
            setCallback({ onSelect });
            setIsOpen(true);
        }
    };

    return (
        <button
            type="button"
            onClick={handleOpen}
            disabled={disabled}
            className={cn(
                "flex items-center gap-2 px-3 h-9 bg-background border border-border rounded-md hover:bg-accent transition-colors text-sm font-mono relative",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            {selectedCountry ? (
                <>
                    <span className="text-lg">{selectedCountry.flag}</span>
                    <span className="text-muted-foreground">{selectedCountry.dialCode}</span>
                </>
            ) : (
                <span className="text-muted-foreground">+1</span>
            )}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <CaretDown size={12} className="text-muted-foreground" />
            </div>
        </button>
    );
}

export function MobileCountryPickerMenu(props: MobileCountryPickerMenuProps) {
    return (
        <React.Suspense fallback={<MobileCountryPickerMenuSkeleton />}> 
            <MobileCountryPickerMenuContent {...props} />
        </React.Suspense>
    );
}
