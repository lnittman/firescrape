'use client';

import React from 'react';
import { Trash } from '@phosphor-icons/react/dist/ssr';
import { useAtom } from 'jotai';
import { clearDataModalOpenAtom } from '@/atoms/modals';

interface ClearDataSectionProps {
    isClearing: boolean;
}

export function ClearDataSection({ isClearing }: ClearDataSectionProps) {
    const [, setOpen] = useAtom(clearDataModalOpenAtom);
    return (
        <div className="border border-border rounded-lg hover:border-foreground/20 transition-colors">
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Trash size={16} weight="duotone" className="text-red-600" />
                        <h3 className="text-sm font-medium font-mono">Clear All Data</h3>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">
                        Permanently delete all webs, cache, and processing history
                    </p>
                    <p className="text-xs text-red-600 font-mono">This action cannot be undone</p>
                </div>
            </div>
            <div className="flex justify-end px-6 py-3 bg-muted/30 border-t border-border">
                <button
                    onClick={() => setOpen(true)}
                    disabled={isClearing}
                    className="px-3 py-1.5 text-sm font-mono bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
                >
                    {isClearing ? 'Clearing...' : 'Clear All'}
                </button>
            </div>
        </div>
    );
}
