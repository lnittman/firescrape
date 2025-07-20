'use client';

import React, { useRef } from 'react';
import { useUser } from '@repo/auth/client';
import { useAtom } from 'jotai';
import { toast } from '@repo/design/components/ui/sonner';
import { avatarUploadModalOpenAtom, avatarUploadFileAtom } from '@/atoms/modals';

interface AvatarSectionProps {
    // Remove avatarUrl prop since we'll use Clerk's user data
    onAvatarUpdate?: () => void;
}

export function AvatarSection({ onAvatarUpdate }: AvatarSectionProps) {
    const { user } = useUser();
    const [, setAvatarModalOpen] = useAtom(avatarUploadModalOpenAtom);
    const [, setSelectedAvatarFile] = useAtom(avatarUploadFileAtom);
    const avatarFileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        avatarFileInputRef.current?.click();
    };

    const handleAvatarFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please select an image file');
                return;
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image must be smaller than 5MB');
                return;
            }

            // Set the file in the atom and open the modal
            setSelectedAvatarFile(file);
            setAvatarModalOpen(true);
        }
        // Reset file input
        if (avatarFileInputRef.current) {
            avatarFileInputRef.current.value = '';
        }
    };

    // Check if user has a custom avatar
    const hasCustomAvatar = user?.imageUrl && user.imageUrl.trim() !== '';

    // Get user initials - same logic as navigation and user-menu
    const userInitials = user?.fullName
        ? user.fullName
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
        : user?.emailAddresses?.[0]?.emailAddress?.charAt(0).toUpperCase() || "?";

    return (
        <>
            <div className="border border-border rounded-lg">
                <div className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <h3 className="font-medium font-mono">Avatar</h3>
                            <p className="text-sm text-muted-foreground">
                                This is your avatar.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Click on the avatar to upload a custom one from your files.
                            </p>
                        </div>
                        <button
                            onClick={handleAvatarClick}
                            className="relative group cursor-pointer h-16 w-16 rounded-full"
                        >
                            <div className="relative h-16 w-16 bg-transparent text-foreground flex items-center justify-center text-lg font-medium border border-border rounded-full overflow-hidden hover:border-foreground/30 transition-colors">
                                {hasCustomAvatar ? (
                                    <img
                                        src={user.imageUrl}
                                        alt="Avatar"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-foreground relative z-10">
                                        {userInitials}
                                    </span>
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-xs font-mono">Edit</span>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
                <div className="px-6 py-3 bg-muted/30 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                        An avatar is optional but strongly recommended.
                    </p>
                </div>
            </div>

            {/* Hidden file input for avatar selection */}
            <input
                ref={avatarFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFileSelect}
                className="hidden"
            />
        </>
    );
} 