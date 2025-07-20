'use client';

import React, { useCallback } from 'react';
import { useNotificationSettings } from '@/hooks/user/queries';
import { useUpdateNotificationSettings } from '@/hooks/user/mutations';
import type { NotificationSettings as NotificationSettingsType } from '@repo/api';
import { MobileSettingsHeader } from '../mobile-settings-header';
import { NotificationToggleSection } from './components/notification-toggle-section';

export function NotificationSettings() {
    const { settings, isLoading, mutate } = useNotificationSettings();
    const { updateNotificationSettings } = useUpdateNotificationSettings();

    const handleNotificationToggle = useCallback(async (key: string, value: boolean) => {
        if (!settings) return;

        const optimisticSettings: NotificationSettingsType = {
            ...settings,
            [key]: value,
            updatedAt: new Date().toISOString(),
        };

        await mutate(optimisticSettings, false);

        try {
            const result = await updateNotificationSettings({ [key]: value });

            if ('error' in result) {
                throw new Error(result.error);
            }

            await mutate();
        } catch (error) {
            await mutate();
            console.error('Failed to update notification setting:', error);
        }
    }, [settings, mutate]);

    const notifications = [
        {
            key: 'notifyProcessingComplete',
            title: 'Processing Complete',
            description: 'Get notified when web processing finishes',
            enabled: settings?.notifyProcessingComplete ?? true
        },
        {
            key: 'notifyProcessingFailed',
            title: 'Processing Failed',
            description: 'Get notified when web processing encounters errors',
            enabled: settings?.notifyProcessingFailed ?? true
        },
        {
            key: 'notifyWeeklySummary',
            title: 'Weekly Summary',
            description: 'Receive a weekly summary of your activity',
            enabled: settings?.notifyWeeklySummary ?? false
        },
        {
            key: 'notifyFeatureUpdates',
            title: 'Feature Updates',
            description: 'Get notified about new features and improvements',
            enabled: settings?.notifyFeatureUpdates ?? false
        }
    ];

    if (isLoading) {
        return (
            <div className="space-y-6">
                <MobileSettingsHeader title="Notifications" />
                <div className="animate-pulse px-6">
                    <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                </div>
                <div className="space-y-4 px-6 pb-6">
                    {notifications.map((_, i) => (
                        <div key={i} className="h-20 bg-muted rounded animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <MobileSettingsHeader title="Notifications" />

            {/* Desktop Header */}
            <div className="hidden sm:block space-y-2 px-6 pt-6">
                <h1 className="text-xl font-semibold">Notification Settings</h1>
                <p className="text-muted-foreground">
                    Manage your notification preferences and alerts
                </p>
            </div>

            <div className="space-y-6 px-6 pb-6">
                {notifications.map((n) => (
                    <NotificationToggleSection
                        key={n.key}
                        title={n.title}
                        description={n.description}
                        enabled={n.enabled}
                        onToggle={(value) => handleNotificationToggle(n.key, value)}
                        disabled={isLoading}
                    />
                ))}
            </div>
        </div>
    );
}
