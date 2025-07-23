"use client";

import React, { Suspense } from "react";
import { useAtom } from "jotai";
import {
    Check
} from "@phosphor-icons/react/dist/ssr";
import { useAuth } from "@repo/auth/client";
import { cn } from "@repo/design/lib/utils";
import { MobileSheet } from "@/components/shared/ui/mobile-sheet";
import {
    mobileScrapeExampleOpenAtom,
    mobileScrapeExampleCallbackAtom,
    mobileScrapeExampleSelectedAtom
} from "@/atoms/menus";

const examples = [
    { value: 'none', label: 'None' },
    { value: 'ycombinator', label: 'YCombinator W24 companies' },
    { value: 'firecrawl-login', label: 'Firecrawl Login Example' },
];

function MobileScrapeExampleMenuContent() {
    const { isLoaded } = useAuth();
    const [isOpen, setIsOpen] = useAtom(mobileScrapeExampleOpenAtom);
    const [callback] = useAtom(mobileScrapeExampleCallbackAtom);
    const [selectedExample, setSelectedExample] = useAtom(mobileScrapeExampleSelectedAtom);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSelect = (exampleValue: string) => {
        setSelectedExample(exampleValue);
        callback?.(exampleValue);
        setIsOpen(false);
    };

    if (!isLoaded) return null;

    return (
        <MobileSheet
            isOpen={isOpen}
            onClose={handleClose}
            title="Select Example"
            showCloseButton={false}
            showBackButton={true}
            onBack={handleClose}
            position="bottom"
            spacing="sm"
            isSubsheet={true}
        >
            <div className="p-4 space-y-1">
                {examples.map((example) => (
                    <button
                        key={example.value}
                        type="button"
                        onClick={() => handleSelect(example.value)}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-accent transition-all duration-200 flex items-center justify-between font-mono rounded-md"
                    >
                        <span>{example.label}</span>
                        {selectedExample === example.value && (
                            <Check size={16} weight="duotone" className="text-green-600" />
                        )}
                    </button>
                ))}
            </div>
        </MobileSheet>
    );
}

export function MobileScrapeExampleMenu() {
    return (
        <Suspense fallback={null}>
            <MobileScrapeExampleMenuContent />
        </Suspense>
    );
}