"use client"

import React, { useState, useEffect } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@repo/design/components/ui/dropdown-menu"
import { Button } from "@repo/design/components/ui/button"
import { cn } from "@repo/design/lib/utils"
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr"
import * as emojiData from "@emoji-mart/data"

interface EmojiPickerButtonProps {
    emoji?: string | null
    onEmojiSelect: (emoji: string) => void
    disabled?: boolean
    className?: string
}

// Types based on actual emoji-mart structure
interface EmojiData {
    id: string
    name: string
    keywords: string[]
    skins: Array<{
        unified: string
        native: string
    }>
    version: number
    emoticons?: string[]
}

interface CategoryData {
    id: string
    emojis: string[]
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
}

export function EmojiPickerButton({
    emoji,
    onEmojiSelect,
    disabled = false,
    className,
}: EmojiPickerButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredEmojis, setFilteredEmojis] = useState<{ [key: string]: EmojiData[] }>({})
    const [isLoading, setIsLoading] = useState(true)

    const displayEmoji = emoji || "😊"

    // Close menu when resizing to mobile to prevent UI issues
    useEffect(() => {
        const handleResize = () => {
            if (isOpen && window.innerWidth < 768) {
                setIsOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [isOpen])

    // Initialize emoji data when dropdown opens
    useEffect(() => {
        const initializeEmojis = () => {
            try {
                const data = emojiData as any
                const categories = data.categories as CategoryData[]
                const emojis = data.emojis as { [key: string]: EmojiData }

                const organized: { [key: string]: EmojiData[] } = {}

                categories.forEach(category => {
                    if (CATEGORY_LABELS[category.id]) {
                        organized[category.id] = category.emojis
                            .map(emojiId => emojis[emojiId])
                            .filter(Boolean)
                            .slice(0, 48) // Limit per category for performance (6 rows of 8)
                    }
                })

                setFilteredEmojis(organized)
                setIsLoading(false)
            } catch (error) {
                console.error("Failed to initialize emojis:", error)
                setIsLoading(false)
            }
        }

        if (isOpen) {
            initializeEmojis()
        }
    }, [isOpen])

    // Filter emojis based on search
    useEffect(() => {
        if (!searchQuery.trim()) {
            // Reset to original data when search is cleared
            const data = emojiData as any
            const categories = data.categories as CategoryData[]
            const emojis = data.emojis as { [key: string]: EmojiData }

            const organized: { [key: string]: EmojiData[] } = {}

            categories.forEach(category => {
                if (CATEGORY_LABELS[category.id]) {
                    organized[category.id] = category.emojis
                        .map(emojiId => emojis[emojiId])
                        .filter(Boolean)
                        .slice(0, 48)
                }
            })

            setFilteredEmojis(organized)
            return
        }

        const query = searchQuery.toLowerCase()
        const data = emojiData as any
        const emojis = data.emojis as { [key: string]: EmojiData }
        const searchResults: EmojiData[] = []

        Object.values(emojis).forEach(emoji => {
            if (
                emoji.name.toLowerCase().includes(query) ||
                emoji.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
                emoji.id.toLowerCase().includes(query)
            ) {
                searchResults.push(emoji)
            }
        })

        setFilteredEmojis({
            search: searchResults.slice(0, 64) // 8 rows of 8 for search results
        })
    }, [searchQuery])

    const handleEmojiClick = (emojiItem: EmojiData) => {
        const native = emojiItem.skins?.[0]?.native || emojiItem.id
        onEmojiSelect(native)
        setIsOpen(false)
    }

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        if (!open) {
            setSearchQuery("")
        }
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={disabled}
                    className={cn(
                        "h-7 w-7 transition-all duration-200",
                        isOpen && "bg-accent",
                        className
                    )}
                    aria-label={emoji ? `Change emoji from ${emoji}` : "Add emoji"}
                >
                    {displayEmoji}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                side="bottom"
                sideOffset={8}
                className="p-0 bg-popover border-border/50 rounded-lg font-mono overflow-hidden z-[90]"
                style={{ width: '352px', height: '342px' }}
            >
                <div className="h-full flex flex-col">
                    {/* Search Section */}
                    <div className="px-4 py-3 border-b border-border">
                        <div className="relative">
                            <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search emojis..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-9 pl-10 pr-3 py-1 text-sm bg-background border border-border rounded-md placeholder:text-muted-foreground/60 transition-colors focus-visible:outline-none focus-visible:border-foreground/30 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                            />
                        </div>
                    </div>

                    {/* Emoji Grid */}
                    <div className="flex-1 overflow-hidden">
                        <div className="h-full overflow-y-auto px-2 pb-2">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full text-sm text-muted-foreground font-mono">
                                    Loading emojis...
                                </div>
                            ) : Object.keys(filteredEmojis).length === 0 ? (
                                <div className="flex items-center justify-center h-full text-sm text-muted-foreground font-mono">
                                    No emojis found.
                                </div>
                            ) : (
                                Object.entries(filteredEmojis).map(([categoryId, emojis]) => (
                                    <div key={categoryId} className="mb-4">
                                        {/* Category Header - Full width with glassy background */}
                                        <div className="sticky top-0 z-10 -mx-2 border-b border-border bg-popover/95 backdrop-blur supports-[backdrop-filter]:bg-popover/60 px-4 pt-3 pb-1.5 font-medium text-muted-foreground text-xs font-mono">
                                            {searchQuery ? "Search Results" : CATEGORY_LABELS[categoryId] || categoryId}
                                        </div>

                                        {/* Emoji Grid */}
                                        <div className="grid grid-cols-8 gap-1 p-2">
                                            {emojis.map((emojiItem) => (
                                                <button
                                                    key={emojiItem.id}
                                                    onClick={() => handleEmojiClick(emojiItem)}
                                                    className="flex size-8 items-center justify-center rounded-md text-lg hover:bg-accent transition-colors duration-200"
                                                    title={emojiItem.name}
                                                >
                                                    {emojiItem.skins?.[0]?.native || emojiItem.id}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
} 