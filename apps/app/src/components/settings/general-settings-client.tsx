'use client';

import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useUser } from '@repo/auth/client';
import { updateProfile } from '@/actions/user/update-profile';
import { MobileSettingsHeader } from './mobile-settings-header';
import { AvatarSection } from './general-settings/components/avatar-section';
import { DisplayNameSection } from './general-settings/components/display-name-section';
import { UsernameSection } from './general-settings/components/username-section';
import { EmailSection } from './general-settings/components/email-section';
import { UserIdSection } from './general-settings/components/user-id-section';
import { DeleteAccountSection } from './general-settings/components/delete-account-section';

// Define form state interface
interface FormState {
    displayName: string;
    username: string;
}

interface Profile {
    id: string;
    userId: string;
    displayName?: string;
    username?: string;
    createdAt: string;
    updatedAt: string;
}

interface GeneralSettingsClientProps {
    initialProfile?: Profile;
}

export function GeneralSettingsClient({ initialProfile }: GeneralSettingsClientProps) {
    const { user, isLoaded } = useUser();

    // Use initial data from RSC
    const effectiveProfile = initialProfile;

    // Form state management
    const [formState, setFormState] = useState<FormState>({
        displayName: '',
        username: '',
    });

    // Use ref to track if we've initialized the form
    const isInitialized = useRef(false);

    // Initialize form state when profile loads
    useEffect(() => {
        if (effectiveProfile && !isInitialized.current) {
            setFormState({
                displayName: effectiveProfile.displayName || '',
                username: effectiveProfile.username || '',
            });
            isInitialized.current = true;
        }
    }, [effectiveProfile]);

    // Track which fields have been modified
    const [modifiedFields, setModifiedFields] = useState<Set<keyof FormState>>(new Set());
    const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string>('');

    // Debounce timer ref
    const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Update form field and mark as modified
    const updateField = useCallback((field: keyof FormState, value: string) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
        setModifiedFields((prev) => new Set(prev).add(field));
        setSaveState('idle'); // Reset save state when user types
        setErrorMessage(''); // Clear error message
    }, []);

    // Save changes with debounce
    const saveChanges = useCallback(async () => {
        if (modifiedFields.size === 0) return;

        setSaveState('saving');
        setErrorMessage('');

        try {
            const updates: Partial<FormState> = {};
            modifiedFields.forEach((field) => {
                updates[field] = formState[field];
            });

            // For MVP, we'll just simulate the save
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setSaveState('saved');
            setModifiedFields(new Set());

            // Reset save state after 2 seconds
            setTimeout(() => {
                setSaveState('idle');
            }, 2000);
        } catch (error) {
            console.error('Failed to update profile:', error);
            setSaveState('error');
            setErrorMessage('Failed to save changes. Please try again.');
        }
    }, [formState, modifiedFields]);

    // Debounced save
    useEffect(() => {
        if (modifiedFields.size > 0) {
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
            saveTimerRef.current = setTimeout(() => {
                saveChanges();
            }, 1000); // Save after 1 second of inactivity
        }

        return () => {
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
        };
    }, [modifiedFields, saveChanges]);

    // Loading state
    if (!isLoaded) {
        return (
            <div className="max-w-2xl mx-auto px-0 pb-16 sm:px-6 sm:pb-6 lg:px-8">
                <MobileSettingsHeader title="General" />
                <div className="animate-pulse space-y-4 mt-6">
                    <div className="h-32 bg-muted rounded-lg"></div>
                    <div className="h-24 bg-muted rounded-lg"></div>
                    <div className="h-24 bg-muted rounded-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-0 pb-16 sm:px-6 sm:pb-6 lg:px-8">
            <MobileSettingsHeader title="General" />
            
            <div className="space-y-6 mt-6">
                <AvatarSection />
                
                <DisplayNameSection
                    value={formState.displayName}
                    onChange={(value) => updateField('displayName', value)}
                />
                
                <UsernameSection
                    value={formState.username}
                    onChange={(value) => updateField('username', value)}
                />
                
                <EmailSection 
                    onSetAsPrimary={() => {}}
                    onDelete={() => {}}
                    onAddEmail={() => {}}
                />
                
                <UserIdSection />
                
                <DeleteAccountSection />
            </div>
        </div>
    );
}