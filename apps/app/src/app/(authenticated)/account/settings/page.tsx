import React from 'react';
import type { Metadata } from 'next';
import { createMetadata } from '@repo/seo/metadata';
import { auth } from '@repo/auth/server';
import { profileService } from '@repo/api';
import { SettingsNavigation } from '@/components/settings/settings-navigation';
import { GeneralSettingsClient } from '@/components/settings/general-settings-client';

export const metadata: Metadata = createMetadata({
  title: 'Settings',
  description: 'Manage your account settings and preferences',
});

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error('Not authenticated');
  }

  const initialData = await profileService.getProfile(userId);

  return (
    <>
      {/* Mobile: Show navigation menu */}
      <div className="block sm:hidden">
        <SettingsNavigation />
      </div>

      {/* Desktop and Mobile: Show general settings content */}
      <div className="flex-1">
        <GeneralSettingsClient initialProfile={initialData} />
      </div>
    </>
  );
} 