'use client';

import React from 'react';
import { useUser } from '@repo/auth/client';
import { EmailActionsMenu } from '@/components/shared/menu/email-actions-menu';
import { MobileEmailSettingsMenu } from '@/components/shared/menu/email/mobile-email-settings-menu';
import { Plus } from '@phosphor-icons/react/dist/ssr';
import { useIsMobile } from '@repo/design/hooks/use-mobile';

interface EmailSectionProps {
    onSetAsPrimary: (emailId: string) => void;
    onDelete: (emailId: string) => void;
    onAddEmail: () => void;
}

export function EmailSection({ onSetAsPrimary, onDelete, onAddEmail }: EmailSectionProps) {
    const { user } = useUser();
    const isMobile = useIsMobile();

    return (
        <div className="border border-border rounded-lg">
            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium font-mono">Email</label>
                    <p className="text-sm text-muted-foreground">
                        Enter the email addresses you want to use to log in with Yuba. Your primary email will be used for account-related notifications.
                    </p>
                    <div className="space-y-2">
                        {user?.emailAddresses?.map((email, index) => (
                            <div key={email.id} className="flex items-center justify-between p-3 border border-border rounded-md">
                                <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3">
                                    <span className="text-sm font-mono">{email.emailAddress}</span>
                                    <div className="flex items-center gap-2 mt-1 sm:mt-0">
                                        {email.verification?.status === 'verified' && (
                                            <span className="text-xs px-2 py-0.5 bg-blue-600/10 border border-blue-600/20 text-blue-600 rounded-md font-mono">
                                                Verified
                                            </span>
                                        )}
                                        {index === 0 && (
                                            <span className="text-xs px-2 py-0.5 bg-green-600/10 border border-green-600/20 text-green-600 rounded-md font-mono">
                                                Primary
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {isMobile ? (
                                    <MobileEmailSettingsMenu
                                        emailId={email.id}
                                        emailAddress={email.emailAddress}
                                        isPrimary={index === 0}
                                        isVerified={email.verification?.status === 'verified'}
                                        onSetAsPrimary={onSetAsPrimary}
                                        onDelete={onDelete}
                                    />
                                ) : (
                                    <EmailActionsMenu
                                        emailId={email.id}
                                        emailAddress={email.emailAddress}
                                        isPrimary={index === 0}
                                        isVerified={email.verification?.status === 'verified'}
                                        onSetAsPrimary={onSetAsPrimary}
                                        onDelete={onDelete}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={onAddEmail}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-mono border border-border rounded-md hover:bg-accent transition-colors"
                    >
                        <Plus size={16} weight="duotone" />
                        Add Another
                    </button>
                </div>
            </div>
            <div className="px-6 py-3 bg-muted/30 border-t border-border">
                <p className="text-xs text-muted-foreground">
                    Emails must be verified to be able to login with them or be used as primary email.
                </p>
            </div>
        </div>
    );
} 