'use client';

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useUser } from '@repo/auth/client';
import { useProfile } from '@/hooks/user/queries';
import { useSpaces } from '@/hooks/spaces';
import { updateProfile } from '@/app/actions/user';
import type { UpdateProfile } from '@repo/api';
import { MobileSettingsHeader } from '../mobile-settings-header';
import { type Country } from '@/components/shared/ui/flag-picker-button';
import { AvatarSection } from './components/avatar-section';
import { DisplayNameSection } from './components/display-name-section';
import { UsernameSection } from './components/username-section';
import { EmailSection } from './components/email-section';
import { PhoneNumberSection } from './components/phone-number-section';
import { UserIdSection } from './components/user-id-section';
import { DeleteAccountSection } from './components/delete-account-section';

// Define form state interface
interface FormState {
    displayName: string;
    username: string;
    phoneNumber: string;
}

export function GeneralSettings() {
    const { user, isLoaded } = useUser();
    const { profile, isLoading, mutate } = useProfile();
    const { spaces, isLoading: spacesLoading } = useSpaces();
    const [selectedCountry, setSelectedCountry] = useState<Country>();

    // Form state management
    const [formState, setFormState] = useState<FormState>({
        displayName: '',
        username: '',
        phoneNumber: '',
    });

    // Use ref to track if we've initialized the form
    const isInitialized = useRef(false);

    // Initialize form state when profile loads
    useEffect(() => {
        if (profile && user && !isInitialized.current) {
            setFormState({
                displayName: profile.displayName || user.fullName || '',
                username: profile.username || '',
                phoneNumber: profile.phoneNumber || '',
            });
            isInitialized.current = true;
        }
    }, [profile, user]);

    const handleUpdateField = useCallback(async (field: keyof FormState, value: string | null) => {
        const newValue = value || '';
        setFormState(prev => ({
            ...prev,
            [field]: newValue
        }));

        // Auto-save the field
        try {
            const updates: UpdateProfile = {
                [field]: value
            };

            const result = await updateProfile(updates);
            if ('error' in result) {
                throw new Error(result.error);
            }
            await mutate();
        } catch (error) {
            console.error(`Failed to update ${field}:`, error);
            // Revert the field value on error
            setFormState(prev => ({
                ...prev,
                [field]: field === 'displayName' ? (profile?.displayName || user?.fullName || '') :
                    field === 'username' ? (profile?.username || '') :
                        field === 'phoneNumber' ? (profile?.phoneNumber || '') :
                            ''
            }));
        }
    }, [profile, user, mutate]);

    const handleCountrySelect = (country: Country) => {
        setSelectedCountry(country);
    };

    const handleAvatarUpdate = () => {
        // Avatar is now handled by Clerk directly, so we don't need to do anything special here
        // The user object will be automatically updated by Clerk
        console.log('Avatar updated successfully');
    };

    const handleEmailSetAsPrimary = async (emailId: string) => {
        // TODO: Implement set as primary via Clerk
        console.log('Set as primary:', emailId);
    };

    const handleEmailDelete = async (emailId: string) => {
        // TODO: Implement delete email via Clerk
        console.log('Delete email:', emailId);
    };

    const handleAddEmail = () => {
        // TODO: Implement add email functionality
        console.log('Add email');
    };

    if (isLoading || !isLoaded || spacesLoading) {
        return (
            <div className="space-y-6">
                <MobileSettingsHeader title="General" />
                <div className="space-y-6 px-6 pb-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-32 bg-muted/50 rounded-lg animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <MobileSettingsHeader title="General" />

            {/* Desktop Header */}
            <div className="hidden sm:block space-y-2 px-6 pt-6">
                <h1 className="text-xl font-semibold">General Settings</h1>
                <p className="text-muted-foreground">
                    Manage your general account settings and preferences
                </p>
            </div>

            <div className="space-y-6 px-6 pb-6">
                {/* Avatar Section */}
                <AvatarSection
                    onAvatarUpdate={handleAvatarUpdate}
                />

                {/* Display Name Section */}
                <DisplayNameSection
                    value={formState.displayName}
                    onChange={(value) => handleUpdateField('displayName', value)}
                />

                {/* Username Section */}
                <UsernameSection
                    value={formState.username}
                    onChange={(value) => handleUpdateField('username', value)}
                />

                {/* Email Section */}
                <EmailSection
                    onSetAsPrimary={handleEmailSetAsPrimary}
                    onDelete={handleEmailDelete}
                    onAddEmail={handleAddEmail}
                />

                {/* Phone Number Section */}
                <PhoneNumberSection
                    value={formState.phoneNumber}
                    onChange={(value) => handleUpdateField('phoneNumber', value)}
                    selectedCountry={selectedCountry}
                    onCountrySelect={handleCountrySelect}
                />

                {/* User ID Section */}
                <UserIdSection />

                {/* Delete Account Section */}
                <DeleteAccountSection />
            </div>
        </div>
    );
} 