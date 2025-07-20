'use client';

import React from 'react';
import { Download } from '@phosphor-icons/react/dist/ssr';

interface ExportDataSectionProps {
    onExport: () => void;
    isExporting: boolean;
}

export function ExportDataSection({ onExport, isExporting }: ExportDataSectionProps) {
    return (
        <div className="border border-border rounded-lg hover:border-foreground/20 transition-colors">
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Download size={16} weight="duotone" className="text-blue-600" />
                        <h3 className="text-sm font-medium font-mono">Export Data</h3>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono">
                        Download all your webs, processing data, and settings as JSON
                    </p>
                </div>
            </div>
            <div className="flex justify-end px-6 py-3 bg-muted/30 border-t border-border">
                <button
                    onClick={onExport}
                    disabled={isExporting}
                    className="px-3 py-1.5 text-sm font-mono bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-md disabled:opacity-50"
                >
                    {isExporting ? 'Exporting...' : 'Export'}
                </button>
            </div>
        </div>
    );
}
