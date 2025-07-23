import React from 'react';
import type { Metadata } from 'next';
import { createMetadata } from '@repo/seo/metadata';
import { auth } from '@repo/auth/server';
import { db } from '@repo/database';
import { SettingsNavigation } from '@/components/settings/settings-navigation';
import { GeneralSettingsClient } from '@/components/settings/general-settings-client';

export const metadata: Metadata = createMetadata({
  title: 'Settings',
  description: 'Manage your account settings and preferences',
});

export default async function SettingsPage() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error('Not authenticated');
  }

  // Find the user by clerkId
  const user = await db.profile.findUnique({
    where: { clerkId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const initialData = {
    id: user.id,
    userId: user.clerkId,
    displayName: user.firstName || undefined,
    username: user.username || undefined,
    phoneNumber: undefined,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };

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