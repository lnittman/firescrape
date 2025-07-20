'use client';

import React from 'react';
import { useAtom } from 'jotai';
import { deleteAccountModalOpenAtom } from '@/atoms/modals';

export function DeleteAccountSection() {
    const [, setDeleteModalOpen] = useAtom(deleteAccountModalOpenAtom);

    return (
        <>
            <div className="border border-destructive rounded-lg bg-destructive/5">
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium font-mono text-destructive">Delete Account</label>
                        <p className="text-sm text-muted-foreground">
                            Permanently remove your Personal Account and all of its contents from the Yuba platform. This action is not reversible, so please continue with caution.
                        </p>
                    </div>
                </div>
                <div className="flex justify-end px-6 py-3 bg-destructive/10 border-t border-destructive/20">
                    <button
                        onClick={() => setDeleteModalOpen(true)}
                        className="px-3 py-1.5 bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors rounded-md text-xs font-medium"
                    >
                        Delete Personal Account
                    </button>
                </div>
            </div>
        </>
    );
} 