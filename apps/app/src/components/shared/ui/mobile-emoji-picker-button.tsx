"use client"

import * as React from "react"
import { useAtom } from "jotai";
import { useIsMobile } from "@repo/design/hooks/use-mobile";
import { Button } from "@repo/design/components/ui/button"
import { mobileEmojiPickerOpenAtom, mobileEmojiPickerCallbackAtom } from "@/atoms/menus";

interface MobileEmojiPickerButtonProps {
    emoji?: string | null
    onEmojiSelect: (emoji: string) => void
    disabled?: boolean
    className?: string
}

export function MobileEmojiPickerButton({
    emoji,
    onEmojiSelect,
    disabled = false,
    className,
}: MobileEmojiPickerButtonProps) {
    const [, setIsOpen] = useAtom(mobileEmojiPickerOpenAtom);
    const [, setEmojiCallback] = useAtom(mobileEmojiPickerCallbackAtom);
    const [optimisticEmoji, setOptimisticEmoji] = React.useState<string | null>(null);
    const isMobile = useIsMobile();

    // Use optimistic emoji if available, otherwise use the prop
    const displayEmoji = optimisticEmoji || emoji || "😊";

    // Reset optimistic state when prop changes (server update completed)
    React.useEffect(() => {
        if (emoji && optimisticEmoji && emoji !== optimisticEmoji) {
            setOptimisticEmoji(null);
        }
    }, [emoji, optimisticEmoji]);

    const handleClick = () => {
        if (!isMobile || disabled) return;

        // Set the callback function that will be called when an emoji is selected
        setEmojiCallback(() => (selectedEmoji: string) => {
            // Optimistic update
            setOptimisticEmoji(selectedEmoji);
            // Call the actual handler
            onEmojiSelect(selectedEmoji);
        });
        // Open the mobile emoji picker
        setIsOpen(true);
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            disabled={disabled}
            className={className}
            onClick={handleClick}
            aria-label={emoji ? `Change emoji from ${emoji}` : "Add emoji"}
        >
            {displayEmoji}
        </Button>
    );
} 