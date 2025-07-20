"use client"

import * as React from "react"
import { EmojiPicker as FrimousseEmojiPicker, type Emoji } from "frimousse"

import { cn } from "@repo/design/lib/utils"

interface EmojiPickerProps {
    onEmojiSelect?: (emoji: Emoji) => void
    className?: string
    children?: React.ReactNode
}

function EmojiPicker({ onEmojiSelect, className, children }: EmojiPickerProps) {
    return (
        <FrimousseEmojiPicker.Root
            className={cn(
                "bg-popover text-popover-foreground border-border flex h-[342px] w-[352px] flex-col overflow-hidden rounded-lg border shadow-md",
                className
            )}
            onEmojiSelect={onEmojiSelect}
        >
            {children}
        </FrimousseEmojiPicker.Root>
    )
}

interface EmojiPickerSearchProps {
    placeholder?: string
    className?: string
}

function EmojiPickerSearch({ placeholder = "Search emojis...", className }: EmojiPickerSearchProps) {
    return (
        <div className="px-4 py-3 border-b border-border">
        <FrimousseEmojiPicker.Search
            placeholder={placeholder}
            className={cn(
                "w-full h-9 px-3 py-1 text-sm bg-background border border-border rounded-md placeholder:text-muted-foreground/60 transition-colors focus-visible:outline-none focus-visible:border-foreground/30 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
        />
        </div>
    )
}

interface EmojiPickerContentProps {
    className?: string
}

function EmojiPickerContent({ className }: EmojiPickerContentProps) {
    return (
        <FrimousseEmojiPicker.Viewport
            className={cn("flex-1 overflow-hidden", className)}
        >
            <FrimousseEmojiPicker.Loading className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                Loading…
            </FrimousseEmojiPicker.Loading>
            <FrimousseEmojiPicker.Empty className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                No emoji found.
            </FrimousseEmojiPicker.Empty>
            <FrimousseEmojiPicker.List
                className="select-none px-2 pb-2"
                components={{
                    CategoryHeader: ({ category, ...props }) => (
                        <div
                            className="sticky top-0 z-10 border-b border-border bg-popover/95 backdrop-blur supports-[backdrop-filter]:bg-popover/60 px-2 pt-3 pb-1.5 font-medium text-muted-foreground text-xs"
                            {...props}
                        >
                            {category.label}
                        </div>
                    ),
                    Row: ({ children, ...props }) => (
                        <div className="flex gap-1" {...props}>
                            {children}
                        </div>
                    ),
                    Emoji: ({ emoji, ...props }) => (
                        <button
                            className="flex size-8 items-center justify-center rounded-md text-lg hover:bg-accent data-[active]:bg-accent transition-colors"
                            {...props}
                        >
                            {emoji.emoji}
                        </button>
                    ),
                }}
            />
        </FrimousseEmojiPicker.Viewport>
    )
}

interface EmojiPickerFooterProps {
    className?: string
    children?: React.ReactNode
}

function EmojiPickerFooter({ className, children }: EmojiPickerFooterProps) {
    return (
        <div
            className={cn(
                "border-border flex items-center justify-between border-t px-4 py-2 text-xs text-muted-foreground",
                className
            )}
        >
            {children}
        </div>
    )
}

export { EmojiPicker, EmojiPickerSearch, EmojiPickerContent, EmojiPickerFooter, type Emoji } 