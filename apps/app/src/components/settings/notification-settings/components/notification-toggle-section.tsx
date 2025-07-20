'use client';

import React from 'react';

interface NotificationToggleSectionProps {
    title: string;
    description: string;
    enabled: boolean;
    onToggle: (value: boolean) => void;
    disabled?: boolean;
}

export function NotificationToggleSection({ title, description, enabled, onToggle, disabled }: NotificationToggleSectionProps) {
    return (
        <div className="border border-border rounded-lg hover:border-foreground/20 transition-colors">
            <div className="flex items-center justify-between p-6">
                <div className="space-y-1">
                    <h3 className="text-sm font-medium font-mono">{title}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={enabled}
                        onChange={(e) => onToggle(e.target.checked)}
                        disabled={disabled}
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-foreground/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 peer-disabled:opacity-50"></div>
                </label>
            </div>
        </div>
    );
}
