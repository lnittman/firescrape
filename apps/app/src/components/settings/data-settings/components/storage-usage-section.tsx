'use client';

import React from 'react';

export function StorageUsageSection() {
    return (
        <div className="border border-border rounded-lg">
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <h3 className="text-sm font-medium font-mono">Storage Usage</h3>
                    <p className="text-xs text-muted-foreground font-mono">
                        Storage metrics will be calculated from your actual data
                    </p>
                </div>
            </div>
        </div>
    );
}
