import React from 'react';
import type { Metadata } from 'next';
import { createMetadata } from '@repo/seo/metadata';
import { auth } from '@repo/auth/server';
import { profileService } from '@repo/api';
import { GeneralSettingsClient } from '@/components/settings/general-settings-client';

export const metadata: Metadata = createMetadata({
    title: 'General Settings',
    description: 'Manage your general account settings and preferences',
});

export default async function GeneralSettingsPage() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error('Not authenticated');
    }

    const initialData = await profileService.getProfile(userId);

    return <GeneralSettingsClient initialProfile={initialData} />;
} 