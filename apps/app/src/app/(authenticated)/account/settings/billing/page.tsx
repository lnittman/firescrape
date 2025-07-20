import React from 'react';
import { MobileSettingsHeader } from '@/components/settings/mobile-settings-header';

export default function BillingSettingsPage() {
    return (
        <div className="space-y-6">
            {/* Mobile header with back button */}
            <MobileSettingsHeader title="Billing" />

            {/* Desktop Header */}
            <div className="hidden sm:block space-y-2 px-6 pt-6">
                <h1 className="text-xl font-semibold">Billing Settings</h1>
                <p className="text-muted-foreground">
                    Manage your subscription and billing preferences
                </p>
            </div>

            <div className="px-6 pb-6">
                <div className="p-6 border border-dashed border-border rounded-lg text-center">
                    <p className="text-sm text-muted-foreground font-mono">
                        Billing settings coming soon...
                    </p>
                </div>
            </div>
        </div>
    );
}
