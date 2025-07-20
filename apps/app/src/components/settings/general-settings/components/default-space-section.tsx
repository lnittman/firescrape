'use client';

import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/design/components/ui/select';

interface DefaultSpaceSectionProps {
    value: string | null;
    onChange: (value: string | null) => void;
}

export function DefaultSpaceSection({ value, onChange }: DefaultSpaceSectionProps) {
    return (
        <div className="border border-border rounded-lg">
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium font-mono">Default Activity Type</label>
                    <p className="text-sm text-muted-foreground">
                        Choose your preferred outdoor activity type. This will be used as the default when creating new activities.
                    </p>
                    <Select value={value || "hiking"} onValueChange={onChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select activity type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="hiking">Hiking</SelectItem>
                            <SelectItem value="biking">Mountain Biking</SelectItem>
                            <SelectItem value="climbing">Rock Climbing</SelectItem>
                            <SelectItem value="camping">Camping</SelectItem>
                            <SelectItem value="trail-running">Trail Running</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex items-center justify-between px-6 py-3 bg-muted/30 border-t border-border">
                <p className="text-xs text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
                    Learn more about Activity Types ↗
                </p>
            </div>
        </div>
    );
} 