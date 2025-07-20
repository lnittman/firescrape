"use client";

import React, { useState, Suspense, useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { ArrowLeft, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@repo/design/lib/utils";
import { MobileSheet } from "@/components/shared/ui/mobile-sheet";
import * as emojiData from "@emoji-mart/data";
import { mobileEmojiPickerOpenAtom, mobileEmojiPickerCallbackAtom } from "@/atoms/menus";

// Types based on actual emoji-mart structure
interface EmojiData {
    id: string;
    name: string;
    keywords: string[];
    skins: Array<{
        unified: string;
        native: string;
    }>;
    version: number;
    emoticons?: string[];
}

interface CategoryData {
    id: string;
    emojis: string[];
}

interface MobileEmojiPickerMenuProps {
    onEmojiSelect?: (emoji: string) => void;
}

// Category mapping
const CATEGORY_LABELS: Record<string, string> = {
    "people": "Smileys & People",
    "nature": "Animals & Nature",
    "foods": "Food & Drink",
    "activity": "Activity",
    "places": "Travel & Places",
    "objects": "Objects",
    "symbols": "Symbols",
    "flags": "Flags"
};

// Main mobile emoji picker menu content component
function MobileEmojiPickerMenuContent({ onEmojiSelect }: MobileEmojiPickerMenuProps) {
    const [isOpen, setIsOpen] = useAtom(mobileEmojiPickerOpenAtom);
    const [emojiCallback] = useAtom(mobileEmojiPickerCallbackAtom);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredEmojis, setFilteredEmojis] = useState<{ [key: string]: EmojiData[] }>({});
    const [isLoading, setIsLoading] = useState(true);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Initialize emoji data
    useEffect(() => {
        const initializeEmojis = () => {
            try {
                const data = emojiData as any;
                const categories = data.categories as CategoryData[];
                const emojis = data.emojis as { [key: string]: EmojiData };

                const organized: { [key: string]: EmojiData[] } = {};

                categories.forEach(category => {
                    if (CATEGORY_LABELS[category.id]) {
                        organized[category.id] = category.emojis
                            .map(emojiId => emojis[emojiId])
                            .filter(Boolean)
                            .slice(0, 60); // Limit per category for performance
                    }
                });

                setFilteredEmojis(organized);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to initialize emojis:", error);
                setIsLoading(false);
            }
        };

        if (isOpen) {
            initializeEmojis();
        }
    }, [isOpen]);

    // Filter emojis based on search
    useEffect(() => {
        if (!searchQuery.trim()) {
            // Reset to original data when search is cleared
            const data = emojiData as any;
            const categories = data.categories as CategoryData[];
            const emojis = data.emojis as { [key: string]: EmojiData };

            const organized: { [key: string]: EmojiData[] } = {};

            categories.forEach(category => {
                if (CATEGORY_LABELS[category.id]) {
                    organized[category.id] = category.emojis
                        .map(emojiId => emojis[emojiId])
                        .filter(Boolean)
                        .slice(0, 60);
                }
            });

            setFilteredEmojis(organized);
            return;
        }

        const query = searchQuery.toLowerCase();
        const data = emojiData as any;
        const emojis = data.emojis as { [key: string]: EmojiData };
        const searchResults: EmojiData[] = [];

        Object.values(emojis).forEach(emoji => {
            if (
                emoji.name.toLowerCase().includes(query) ||
                emoji.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
                emoji.id.toLowerCase().includes(query)
            ) {
                searchResults.push(emoji);
            }
        });

        setFilteredEmojis({
            search: searchResults.slice(0, 60)
        });
    }, [searchQuery]);

    const handleClose = () => {
        setIsOpen(false);
        setSearchQuery("");
        // MobileSheet will handle closing global mobile menu when animation completes
    };

    const handleEmojiSelect = (emoji: EmojiData) => {
        const native = emoji.skins?.[0]?.native || emoji.id;

        // Call the callback function that was set when opening the picker
        if (emojiCallback) {
            emojiCallback(native);
        }
        // Also call the direct prop if provided
        onEmojiSelect?.(native);
        // Close the picker - MobileSheet will handle global mobile menu
        setIsOpen(false);
        setSearchQuery("");
    };

    if (!isOpen) {
        return null;
    }

    return (
        <MobileSheet
            isOpen={isOpen}
            onClose={handleClose}
            title="Choose icon"
            showCloseButton={false}
            position="bottom"
            spacing="sm"
            contentHeight="fill"
            className="[&_h2]:pl-12 [&>div]:z-[90]"
        >
            {/* Back button overlay */}
            <button
                onClick={handleClose}
                className={cn(
                    "absolute top-4 left-6 z-10 h-8 w-8 bg-transparent text-muted-foreground flex items-center justify-center rounded-full border border-border transition-all duration-200",
                    "hover:bg-accent hover:text-foreground hover:border-foreground/20",
                    "focus:outline-none"
                )}
                aria-label="Back"
            >
                <ArrowLeft className="w-4 h-4" weight="duotone" />
            </button>

            {/* Search Section */}
            <div className="px-4 py-4 border-b border-border bg-muted/10">
                <div className="relative">
                    <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search emojis..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-3 text-base bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground/30"
                        style={{ fontSize: '16px' }} // Prevent zoom on iOS
                    />
                </div>
            </div>

            {/* Emoji Grid */}
            <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto px-2">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                            Loading emojis...
                        </div>
                    ) : Object.keys(filteredEmojis).length === 0 ? (
                        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                            No emoji found.
                            </div>
                        ) : (
                            Object.entries(filteredEmojis).map(([categoryId, emojis]) => (
                                <div key={categoryId} className="mb-4">
                                    {/* Category Header */}
                                    <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2 pt-3 pb-1.5 font-medium text-muted-foreground text-xs">
                                        {searchQuery ? "Search Results" : CATEGORY_LABELS[categoryId] || categoryId}
                                </div>

                                    {/* Emoji Grid */}
                                    <div className="grid grid-cols-8 gap-1 p-2">
                                        {emojis.map((emoji) => (
                                            <button
                                                key={emoji.id}
                                                onClick={() => handleEmojiSelect(emoji)}
                                                className="flex aspect-square items-center justify-center rounded-md text-xl hover:bg-accent transition-colors min-h-10"
                                                title={emoji.name}
                                            >
                                                {emoji.skins?.[0]?.native || emoji.id}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                    )}
                </div>
            </div>
        </MobileSheet>
    );
}

// Main exported component with Suspense wrapper
export function MobileEmojiPickerMenu({ onEmojiSelect }: MobileEmojiPickerMenuProps) {
    return (
        <Suspense fallback={null}>
            <MobileEmojiPickerMenuContent onEmojiSelect={onEmojiSelect} />
        </Suspense>
    );
} 