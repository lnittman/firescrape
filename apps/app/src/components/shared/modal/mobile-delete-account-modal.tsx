"use client";

import React, { useState, Suspense } from 'react';
import { useAtom } from 'jotai';
import { useUser } from '@repo/auth/client';
import { useIsMobile } from '@repo/design/hooks/use-mobile';
import { Button } from '@repo/design/components/ui/button';
import { Input } from '@repo/design/components/ui/input';
import { Label } from '@repo/design/components/ui/label';
import { toast } from '@repo/design/components/ui/sonner';
import { cn } from '@repo/design/lib/utils';
import { MobileSheet } from '@/components/shared/ui/mobile-sheet';
import { clearAllUserData } from '@/app/actions/user';
import { deleteAccountModalOpenAtom } from '@/atoms/modals';

function MobileDeleteAccountModalContent() {
    const { isLoaded, user } = useUser();
    const [isOpen, setIsOpen] = useAtom(deleteAccountModalOpenAtom);
    const isMobile = useIsMobile();

    // Only open on mobile - let DeleteAccountModal handle desktop
    const shouldOpen = isOpen && isMobile;

    const [usernameConfirm, setUsernameConfirm] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const username = user?.username || user?.firstName || 'your-username';
    const isUsernameValid = usernameConfirm === username;
    const isDeleteConfirmValid = deleteConfirm === 'delete my personal account';
    const canDelete = isUsernameValid && isDeleteConfirmValid;

    const handleClose = () => {
        setUsernameConfirm('');
        setDeleteConfirm('');
        setIsOpen(false);
    };

    const handleDelete = async () => {
        if (!canDelete) return;
        setIsDeleting(true);
        try {
            await clearAllUserData();
            toast.success('Account deletion initiated');
            handleClose();
        } catch (error) {
            toast.error('Failed to delete account');
            console.error('Account deletion error:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!isLoaded) {
        return null;
    }

    return (
        <MobileSheet
            isOpen={shouldOpen}
            onClose={handleClose}
            title="Delete Personal Account"
            showCloseButton
            position="bottom"
            spacing="sm"
        >
            <div className="p-6 space-y-4">
                <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                    <p className="text-sm text-destructive font-medium font-mono">
                        This action is not reversible. Please be certain.
                    </p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="username-confirm" className="text-sm font-medium font-mono">
                        Enter your username <span className="font-mono text-muted-foreground">{username}</span> to continue:
                    </Label>
                    <Input
                        id="username-confirm"
                        value={usernameConfirm}
                        onChange={(e) => setUsernameConfirm(e.target.value)}
                        className={cn(
                            'font-mono',
                            isUsernameValid && 'border-green-600/30 bg-green-600/5'
                        )}
                        disabled={isDeleting}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="delete-confirm" className="text-sm font-medium font-mono">
                        To verify, type <span className="font-mono text-muted-foreground">delete my personal account</span> below:
                    </Label>
                    <Input
                        id="delete-confirm"
                        value={deleteConfirm}
                        onChange={(e) => setDeleteConfirm(e.target.value)}
                        className={cn(
                            'font-mono',
                            isDeleteConfirmValid && 'border-green-600/30 bg-green-600/5'
                        )}
                        disabled={isDeleting}
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleClose}
                        disabled={isDeleting}
                        className="font-medium"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={!canDelete || isDeleting}
                        className={cn(
                            'font-medium min-w-[120px]',
                            canDelete ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : 'bg-muted text-muted-foreground cursor-not-allowed'
                        )}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </div>
            </div>
        </MobileSheet>
    );
}

export function MobileDeleteAccountModal() {
    return (
        <Suspense fallback={null}>
            <MobileDeleteAccountModalContent />
        </Suspense>
    );
}
