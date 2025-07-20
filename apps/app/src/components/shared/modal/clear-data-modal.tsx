"use client";

import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useIsMobile } from '@repo/design/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@repo/design/components/ui/dialog';
import { Button } from '@repo/design/components/ui/button';
import { toast } from '@repo/design/components/ui/sonner';
import { X } from '@phosphor-icons/react/dist/ssr';
import { clearAllUserData } from '@/app/actions/user';
import { cn } from '@repo/design/lib/utils';
import { clearDataModalOpenAtom } from '@/atoms/modals';

export function ClearDataModal() {
    const [open, setOpen] = useAtom(clearDataModalOpenAtom);
    const isMobile = useIsMobile();
    const [isDeleting, setIsDeleting] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Ensure client-side only rendering
    useEffect(() => {
        setMounted(true);
    }, []);

    const shouldOpen = mounted && open && !isMobile;

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await clearAllUserData();
            toast.success('All data cleared');
            setOpen(false);
        } catch (error) {
            toast.error('Failed to clear data');
            console.error('Clear data error:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Don't render on server or if not open
    if (!mounted || !shouldOpen) return null;

    return (
        <Dialog open={true} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md p-0 gap-0 z-[400] hide-default-close" aria-describedby="clear-data-description">
                <DialogHeader className="sr-only">
                    <DialogTitle>Delete All Data</DialogTitle>
                    <DialogDescription id="clear-data-description">
                        Are you sure you want to delete all your data? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {/* Header */}
                <div className="px-6 py-4 border-b border-border bg-muted/10">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-mono text-destructive uppercase tracking-wider">
                            Delete All Data
                        </span>
                        <button
                            onClick={handleClose}
                            className={cn(
                                "h-8 w-8 flex items-center justify-center transition-all duration-200 rounded-md border select-none",
                                "bg-accent/5 border-accent/50 text-muted-foreground",
                                "hover:bg-accent/40 hover:text-accent-foreground hover:border-accent/50",
                                "focus:outline-none"
                            )}
                            aria-label="Close"
                        >
                            <X className="w-4 h-4" weight="duotone" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <p className="text-sm text-muted-foreground mb-6">
                        Are you sure you want to delete all your data? This action cannot be undone.
                    </p>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" onClick={handleClose} className="font-medium">
                            Cancel
                        </Button>
                        <Button onClick={handleConfirm} disabled={isDeleting} className="bg-red-600 text-white hover:bg-red-700 font-medium disabled:opacity-50">
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
