import React from 'react';
import { auth } from '@repo/auth/server';
import { notificationSettingsService } from '@repo/api';
import { NotificationSettingsClient } from '@/components/settings/notification-settings-client';

export default async function NotificationSettingsPage() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error('Not authenticated');
    }

    const initialData = await notificationSettingsService.getNotificationSettings(userId);

    return <NotificationSettingsClient initialSettings={initialData} />;
} 