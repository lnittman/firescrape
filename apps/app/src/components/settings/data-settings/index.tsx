'use client';

import React, { useState } from 'react';
import { exportUserData } from '@/app/actions/user';
import { MobileSettingsHeader } from '../mobile-settings-header';
import { ExportDataSection } from './components/export-data-section';
import { ClearDataSection } from './components/clear-data-section';
import { StorageUsageSection } from './components/storage-usage-section';

export function DataSettings() {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const result = await exportUserData();

            if ('error' in result) {
                console.error('Export failed:', result.error);
                return;
            }

            const blob = new Blob([JSON.stringify(result.data, null, 2)], {
                type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `webs-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to export data:', error);
        } finally {
            setIsExporting(false);
        }
    };


    return (
        <div className="space-y-6">
            <MobileSettingsHeader title="Data & Privacy" />

            {/* Desktop Header */}
            <div className="hidden sm:block space-y-2 px-6 pt-6">
                <h1 className="text-xl font-semibold">Data & Privacy Settings</h1>
                <p className="text-muted-foreground">
                    Manage your data exports, storage, and privacy preferences
                </p>
            </div>

            <div className="space-y-6 px-6 pb-6">
                <ExportDataSection onExport={handleExport} isExporting={isExporting} />
                <ClearDataSection isClearing={false} />
                <StorageUsageSection />
            </div>
        </div>
    );
}
