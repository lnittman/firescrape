'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@repo/auth/client';
import { Copy, Check } from '@phosphor-icons/react/dist/ssr';
import { cn } from '@repo/design/lib/utils';
import { Button } from '@repo/design/components/ui/button';

export function UserIdSection() {
    const { user } = useUser();
    const [copiedUserId, setCopiedUserId] = useState(false);
    useEffect(() => {
        if (!copiedUserId) return;
        const id = window.setTimeout(() => setCopiedUserId(false), 2000);
        return () => window.clearTimeout(id);
    }, [copiedUserId]);

    const handleCopyUserId = async () => {
        if (user?.id) {
            await navigator.clipboard.writeText(user.id);
            setCopiedUserId(true);
        }
    };

    return (
        <div className="border border-border rounded-lg">
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium font-mono">User ID</label>
                    <p className="text-sm text-muted-foreground">
                        This is your user ID within Yuba.
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-9 px-3 bg-muted border border-border rounded-md text-sm font-mono flex items-center text-muted-foreground truncate">
                            {user?.id}
                        </div>
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleCopyUserId}
                            className="h-9 w-9 border border-border"
                        >
                            <span className="relative flex size-4">
                                <Copy
                                    className={cn(
                                        'absolute inset-0 transition-opacity duration-200',
                                        copiedUserId ? 'opacity-0' : 'opacity-100'
                                    )}
                                    weight="duotone"
                                />
                                <Check
                                    className={cn(
                                        'absolute inset-0 text-green-600 transition-opacity duration-200',
                                        copiedUserId ? 'opacity-100' : 'opacity-0'
                                    )}
                                    weight="bold"
                                />
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="px-6 py-3 bg-muted/30 border-t border-border">
                <p className="text-xs text-muted-foreground">
                    Used when interacting with the Yuba API.
                </p>
            </div>
        </div>
    );
} 