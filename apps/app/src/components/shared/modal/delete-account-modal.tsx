"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@repo/auth/client';
import { useAtom } from 'jotai';
import { useIsMobile } from '@repo/design/hooks/use-mobile';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@repo/design/components/ui/dialog';
import { Button } from '@repo/design/components/ui/button';
import { Input } from '@repo/design/components/ui/input';
import { Label } from '@repo/design/components/ui/label';
import { toast } from '@repo/design/components/ui/sonner';
import { X } from '@phosphor-icons/react/dist/ssr';
import { clearAllUserData } from '@/app/actions/user';
import { cn } from '@repo/design/lib/utils';
import { deleteAccountModalOpenAtom } from '@/atoms/modals';

export function DeleteAccountModal() {
    const [open, setOpen] = useAtom(deleteAccountModalOpenAtom);
    const { user } = useUser();
    const isMobile = useIsMobile();
    const [usernameConfirm, setUsernameConfirm] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Ensure client-side only rendering
    useEffect(() => {
        setMounted(true);
    }, []);

    // Debug logging
    useEffect(() => {
        console.log('DeleteAccountModal debug:', {
            mounted,
            open,
            isMobile,
            shouldOpen: mounted && open && !isMobile
        });
    }, [mounted, open, isMobile]);

    // Don't open on mobile - let MobileDeleteAccountModal handle it
    const shouldOpen = mounted && open && !isMobile;

    const username = user?.username || user?.firstName || 'your-username';
    const isUsernameValid = usernameConfirm === username;
    const isDeleteConfirmValid = deleteConfirm === 'delete my personal account';
    const canDelete = isUsernameValid && isDeleteConfirmValid;

    const handleDelete = async () => {
        if (!canDelete) return;

        setIsDeleting(true);
        try {
            await clearAllUserData();
            toast.success('Account deletion initiated');
            setOpen(false);
            // Redirect to sign out or account deletion confirmation
        } catch (error) {
            toast.error('Failed to delete account');
            console.error('Account deletion error:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancel = () => {
        setUsernameConfirm('');
        setDeleteConfirm('');
        setOpen(false);
    };

    const handleClose = () => {
        setUsernameConfirm('');
        setDeleteConfirm('');
        setOpen(false);
    };

    // Don't render on server or if not open
    if (!mounted || !shouldOpen) return null;

    return (
        <Dialog open={true} onOpenChange={handleClose}>
            <DialogContent
                className="sm:max-w-lg p-0 gap-0 z-[400] hide-default-close"
                aria-describedby="delete-account-description"
                onOpenAutoFocus={(e) => {
                    if (window.innerWidth < 640) {
                        e.preventDefault();
                    }
                }}
            >
                <DialogHeader className="sr-only">
                    <DialogTitle className="text-destructive font-mono">
                        Delete Personal Account
                    </DialogTitle>
                    <DialogDescription id="delete-account-description" className="text-left">
                        This action is not reversible. Yuba will delete all of your data and outdoor activity history.
                    </DialogDescription>
                </DialogHeader>

                {/* Header */}
                <div className="px-6 py-4 border-b border-border bg-muted/10">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-mono text-destructive uppercase tracking-wider">
                            Delete Personal Account
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

                <div className="p-6 space-y-4">
                    {/* Warning banner */}
                    <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                        <p className="text-sm text-destructive font-medium">
                            This action is not reversible. Please be certain.
                        </p>
                    </div>

                    <div className="space-y-3 text-sm text-muted-foreground">
                        <p>
                            Yuba will <strong>delete all of your activity data</strong>, along with all of
                            your saved trails, personalized recommendations, safety contacts, and all other
                            data associated with your account.
                        </p>
                        <p>
                            Yuba recommends that you export any activity data you wish to keep before
                            proceeding with account deletion.
                        </p>
                    </div>

                    {/* Username confirmation */}
                    <div className="space-y-2">
                        <Label htmlFor="username-confirm" className="text-sm font-medium font-mono">
                            Enter your username <span className="font-mono text-muted-foreground">{username}</span> to continue:
                        </Label>
                        <Input
                            id="username-confirm"
                            value={usernameConfirm}
                            onChange={(e) => setUsernameConfirm(e.target.value)}
                            className={cn(
                                "font-mono",
                                isUsernameValid && "border-green-600/30 bg-green-600/5"
                            )}
                            disabled={isDeleting}
                        />
                    </div>

                    {/* Delete confirmation */}
                    <div className="space-y-2">
                        <Label htmlFor="delete-confirm" className="text-sm font-medium font-mono">
                            To verify, type <span className="font-mono text-muted-foreground">delete my personal account</span> below:
                        </Label>
                        <Input
                            id="delete-confirm"
                            value={deleteConfirm}
                            onChange={(e) => setDeleteConfirm(e.target.value)}
                            className={cn(
                                "font-mono",
                                isDeleteConfirmValid && "border-green-600/30 bg-green-600/5"
                            )}
                            disabled={isDeleting}
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleCancel}
                            disabled={isDeleting}
                            className="font-medium"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={!canDelete || isDeleting}
                            className={cn(
                                "font-medium min-w-[120px]",
                                canDelete
                                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    : "bg-muted text-muted-foreground cursor-not-allowed"
                            )}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 