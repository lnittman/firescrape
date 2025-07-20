"use client";

import React, { Suspense } from 'react';
import { useAtom } from 'jotai';
import { MobileSheet } from '@/components/shared/ui/mobile-sheet';
import { useIsMobile } from '@repo/design/hooks/use-mobile';
import { Button } from '@repo/design/components/ui/button';
import { toast } from '@repo/design/components/ui/sonner';
import { clearAllUserData } from '@/app/actions/user';
import { clearDataModalOpenAtom } from '@/atoms/modals';

function MobileClearDataModalContent() {
    const [open, setOpen] = useAtom(clearDataModalOpenAtom);
    const isMobile = useIsMobile();
    const shouldOpen = open && isMobile;
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleClose = () => setOpen(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await clearAllUserData();
            toast.success('All data cleared');
            handleClose();
        } catch (error) {
            toast.error('Failed to clear data');
            console.error('Clear data error:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <MobileSheet
            isOpen={shouldOpen}
            onClose={handleClose}
            title="Delete All Data"
            showCloseButton
            position="bottom"
            spacing="sm"
        >
            <div className="p-6 space-y-4">
                <p className="text-sm text-muted-foreground font-mono">
                    Are you sure you want to delete all your data? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={handleClose} className="font-medium">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} disabled={isDeleting} className="bg-red-600 text-white hover:bg-red-700 font-medium disabled:opacity-50">
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </div>
        </MobileSheet>
    );
}

export function MobileClearDataModal() {
    return (
        <Suspense fallback={null}>
            <MobileClearDataModalContent />
        </Suspense>
    );
}
