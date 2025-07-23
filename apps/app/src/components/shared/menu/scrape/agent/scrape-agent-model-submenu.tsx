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
    mobileScrapeModelOpenAtom,
    mobileScrapeModelCallbackAtom,
    mobileScrapeModelSelectedAtom
} from "@/atoms/menus";

const models = [
    { value: 'none', label: 'None' },
    { value: 'fire-1', label: 'FIRE-1 (150+ credits)' },
];

function MobileScrapeModelMenuContent() {
    const { isLoaded } = useAuth();
    const [isOpen, setIsOpen] = useAtom(mobileScrapeModelOpenAtom);
    const [callback] = useAtom(mobileScrapeModelCallbackAtom);
    const [selectedModel, setSelectedModel] = useAtom(mobileScrapeModelSelectedAtom);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSelect = (modelValue: string) => {
        setSelectedModel(modelValue);
        callback?.(modelValue);
        setIsOpen(false);
    };

    if (!isLoaded) return null;

    return (
        <MobileSheet
            isOpen={isOpen}
            onClose={handleClose}
            title="Select Model"
            showCloseButton={false}
            showBackButton={true}
            onBack={handleClose}
            position="bottom"
            spacing="sm"
            isSubsheet={true}
        >
            <div className="p-4 space-y-1">
                {models.map((model) => (
                    <button
                        key={model.value}
                        type="button"
                        onClick={() => handleSelect(model.value)}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-accent transition-all duration-200 flex items-center justify-between font-mono rounded-md"
                    >
                        <span>{model.label}</span>
                        {selectedModel === model.value && (
                            <Check size={16} weight="duotone" className="text-green-600" />
                        )}
                    </button>
                ))}
            </div>
        </MobileSheet>
    );
}

export function MobileScrapeModelMenu() {
    return (
        <Suspense fallback={null}>
            <MobileScrapeModelMenuContent />
        </Suspense>
    );
}