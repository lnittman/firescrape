'use client';

import React from 'react';

interface DisplayNameSectionProps {
    value: string;
    onChange: (value: string) => void;
}

export function DisplayNameSection({ value, onChange }: DisplayNameSectionProps) {
    return (
        <div className="border border-border rounded-lg">
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium font-mono">Display Name</label>
                    <p className="text-sm text-muted-foreground">
                        Please enter your full name, or a display name you are comfortable with.
                    </p>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full h-9 px-3 bg-background border border-border rounded-md text-sm font-mono focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-colors"
                        maxLength={100}
                        style={{ fontSize: '16px' }} // Prevent zoom on iOS
                    />
                </div>
            </div>
            <div className="flex items-center justify-between px-6 py-3 bg-muted/30 border-t border-border">
                <p className="text-xs text-muted-foreground">
                    Please use 32 characters at maximum.
                </p>
            </div>
        </div>
    );
} 