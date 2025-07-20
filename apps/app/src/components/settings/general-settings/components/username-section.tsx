'use client';

import React from 'react';

interface UsernameSectionProps {
    value: string;
    onChange: (value: string) => void;
}

export function UsernameSection({ value, onChange }: UsernameSectionProps) {
    return (
        <div className="border border-border rounded-lg">
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium font-mono">Username</label>
                    <p className="text-sm text-muted-foreground">
                        This is your unique username within Yuba.
                    </p>
                    <div className="flex items-center">
                        <span className="px-3 h-9 bg-muted border border-r-0 border-border rounded-l-md text-sm text-muted-foreground flex items-center font-mono">
                            yuba.ai/
                        </span>
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="flex-1 h-9 px-3 bg-background border border-border rounded-r-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-colors"
                            maxLength={50}
                            pattern="[a-zA-Z0-9_-]+"
                            style={{ fontSize: '16px' }} // Prevent zoom on iOS
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-between px-6 py-3 bg-muted/30 border-t border-border">
                <p className="text-xs text-muted-foreground">
                    Please use 48 characters at maximum.
                </p>
            </div>
        </div>
    );
} 