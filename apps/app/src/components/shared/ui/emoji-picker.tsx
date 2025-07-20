'use client';

import React from 'react';
import { Button } from '@repo/design/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@repo/design/components/ui/popover';
import { EmojiPicker as BaseEmojiPicker, EmojiPickerContent, type Emoji } from '@repo/design';
import { cn } from '@repo/design/lib/utils';

interface EmojiPickerProps {
  value?: string;
  onSelect: (emoji: string) => void;
  className?: string;
}

export function EmojiPicker({ value = '🌐', onSelect, className }: EmojiPickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleEmojiSelect = (emoji: Emoji) => {
    onSelect(emoji.emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={cn("h-10 w-10 p-0 text-xl", className)}
        >
          {value}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-fit" align="start">
        <BaseEmojiPicker onEmojiSelect={handleEmojiSelect}>
          <EmojiPickerContent />
        </BaseEmojiPicker>
      </PopoverContent>
    </Popover>
  );
}