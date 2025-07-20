import React from 'react';
import { auth } from '@repo/auth/server';
import { appearanceSettingsService } from '@repo/api';
import { AppearanceSettingsClient } from '@/components/settings/appearance-settings-client';

export default async function AppearanceSettingsPage() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error('Not authenticated');
    }

    const initialData = await appearanceSettingsService.getAppearanceSettings(userId);

    return <AppearanceSettingsClient initialSettings={initialData} />;
} 