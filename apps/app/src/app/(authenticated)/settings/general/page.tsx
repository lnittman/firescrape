import React from 'react';
import type { Metadata } from 'next';
import { createMetadata } from '@repo/seo/metadata';
import { auth, currentUser } from '@repo/auth/server';
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

    const user = await currentUser();

    // For MVP, we'll use user data from Clerk
    const initialData = {
        id: userId,
        userId,
        username: user?.username || '',
        displayName: user?.fullName || user?.firstName || '',
        phoneNumber: '', // Not stored in MVP
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    return <GeneralSettingsClient initialProfile={initialData} />;
}