"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useUser } from '@repo/auth/client';
import { useAtom } from 'jotai';
import { useIsMobile } from '@repo/design/hooks/useMobile';
import { Button } from '@repo/design/components/ui/button';
import { toast } from '@repo/design/components/ui/sonner';
import { Minus, Plus, ArrowsOut, ArrowsIn } from '@phosphor-icons/react/dist/ssr';
import { cn } from '@repo/design/lib/utils';
import { MobileSheet } from '@/components/shared/ui/mobile-sheet';
import { avatarUploadModalOpenAtom, avatarUploadFileAtom } from '@/atoms/modals';

interface MobileAvatarUploadModalProps {
    onAvatarUpdate?: () => void;
}

// Main mobile avatar upload modal content component
function MobileAvatarUploadModalContent({ onAvatarUpdate }: MobileAvatarUploadModalProps = {}) {
    const [open, setOpen] = useAtom(avatarUploadModalOpenAtom);
    const [selectedFile, setSelectedFile] = useAtom(avatarUploadFileAtom);
    const { user } = useUser();
    const isMobile = useIsMobile();

    // Only open on mobile - let AvatarUploadModal handle desktop
    const shouldOpen = open && isMobile;

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    // Load image when selectedFile changes
    useEffect(() => {
        if (selectedFile && open) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
                // Reset crop controls
                setScale(1);
                setPosition({ x: 0, y: 0 });
            };
            reader.readAsDataURL(selectedFile);
        } else if (!open) {
            // Reset when modal closes
            setPreviewUrl(null);
            setScale(1);
            setPosition({ x: 0, y: 0 });
            setSelectedFile(null); // Also reset the file atom
        }
    }, [selectedFile, open, setSelectedFile]);

    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.2, 3));
    };

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev - 0.2, 0.5));
    };

    // Wheel zoom support
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY;
        const zoomSpeed = 0.1;

        if (delta > 0) {
            // Zoom out
            setScale(prev => Math.max(prev - zoomSpeed, 0.5));
        } else {
            // Zoom in
            setScale(prev => Math.min(prev + zoomSpeed, 3));
        }
    };

    const handleResetZoom = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const handleFitToFrame = () => {
        // Calculate scale to fit image in crop area
        if (imageRef.current) {
            const img = imageRef.current;
            const cropSize = 256; // 256px crop area
            const scaleX = cropSize / img.naturalWidth;
            const scaleY = cropSize / img.naturalHeight;
            const fitScale = Math.min(scaleX, scaleY);
            setScale(fitScale);
            setPosition({ x: 0, y: 0 });
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        setIsDragging(true);
        setDragStart({
            x: touch.clientX - position.x,
            y: touch.clientY - position.y
        });
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isDragging) {
            e.preventDefault();
            const touch = e.touches[0];
            setPosition({
                x: touch.clientX - dragStart.x,
                y: touch.clientY - dragStart.y
            });
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    const getCroppedImageBlob = (): Promise<Blob | null> => {
        return new Promise((resolve) => {
            if (!canvasRef.current || !imageRef.current) {
                resolve(null);
                return;
            }

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(null);
                return;
            }

            const img = imageRef.current;
            const cropSize = 256;

            // Set canvas size to desired output size
            canvas.width = cropSize;
            canvas.height = cropSize;

            // Calculate the source rectangle to crop from the original image
            const centerX = img.naturalWidth / 2;
            const centerY = img.naturalHeight / 2;
            const sourceSize = Math.min(img.naturalWidth, img.naturalHeight) / scale;
            const sourceX = centerX - sourceSize / 2 - (position.x / scale);
            const sourceY = centerY - sourceSize / 2 - (position.y / scale);

            // Draw the cropped image
            ctx.drawImage(
                img,
                sourceX, sourceY, sourceSize, sourceSize,
                0, 0, cropSize, cropSize
            );

            canvas.toBlob(resolve, 'image/jpeg', 0.9);
        });
    };

    const handleUpload = async () => {
        if (!selectedFile || !previewUrl || !user) return;

        setIsUploading(true);
        try {
            const croppedBlob = await getCroppedImageBlob();
            if (!croppedBlob) {
                throw new Error('Failed to process image');
            }

            // Convert blob to file for Clerk upload
            const croppedFile = new File([croppedBlob], 'avatar.jpg', {
                type: 'image/jpeg',
                lastModified: Date.now(),
            });

            // Use Clerk's setProfileImage method
            await user.setProfileImage({ file: croppedFile });

            // Notify parent component that upload is complete
            onAvatarUpdate?.();

            toast.success('Avatar updated successfully');
            handleClose();
        } catch (error) {
            toast.error('Failed to update avatar');
            console.error('Avatar upload error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedFile(null); // Reset the file when modal closes
    };

    if (!user) {
        return null;
    }

    return (
        <MobileSheet
            isOpen={shouldOpen}
            onClose={handleClose}
            title="Set Avatar"
            showCloseButton={true}
            position="bottom"
            spacing="sm"
        >
            <div className="p-6 space-y-6">
                {previewUrl && (
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            {/* Crop viewport - smaller for mobile */}
                            <div
                                className="w-56 h-56 border-2 border-border rounded-full overflow-hidden bg-muted cursor-move relative touch-none select-none"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                onWheel={handleWheel}
                            >
                                <img
                                    ref={imageRef}
                                    src={previewUrl}
                                    alt="Avatar preview"
                                    className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-transform duration-150 ease-out"
                                    style={{
                                        transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                                        transformOrigin: 'center center'
                                    }}
                                    draggable={false}
                                />
                                {/* Crop overlay */}
                                <div className="absolute inset-0 border-2 border-foreground/20 rounded-full pointer-events-none" />

                                {/* Center cross indicator when dragging */}
                                {isDragging && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="w-6 h-6">
                                            <div className="absolute w-full h-0.5 bg-white/60 top-1/2 -translate-y-1/2" />
                                            <div className="absolute h-full w-0.5 bg-white/60 left-1/2 -translate-x-1/2" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Hidden canvas for cropping */}
                            <canvas ref={canvasRef} className="hidden" />
                        </div>

                        {/* Crop controls */}
                        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg border border-border">
                            <button
                                onClick={handleZoomOut}
                                className="p-2 hover:bg-accent rounded-md transition-colors disabled:opacity-50"
                                title="Zoom out"
                                disabled={scale <= 0.5}
                            >
                                <Minus size={16} weight="duotone" className="text-muted-foreground" />
                            </button>

                            <div className="px-3 py-1 text-xs font-mono bg-background rounded border min-w-[60px] text-center">
                                {Math.round(scale * 100)}%
                            </div>

                            <button
                                onClick={handleZoomIn}
                                className="p-2 hover:bg-accent rounded-md transition-colors disabled:opacity-50"
                                title="Zoom in"
                                disabled={scale >= 3}
                            >
                                <Plus size={16} weight="duotone" className="text-muted-foreground" />
                            </button>

                            <div className="w-px h-6 bg-border mx-1" />

                            <button
                                onClick={handleResetZoom}
                                className="p-2 hover:bg-accent rounded-md transition-colors"
                                title="Reset zoom and position"
                            >
                                <ArrowsOut size={16} weight="duotone" className="text-muted-foreground" />
                            </button>

                            <button
                                onClick={handleFitToFrame}
                                className="p-2 hover:bg-accent rounded-md transition-colors"
                                title="Fit to frame"
                            >
                                <ArrowsIn size={16} weight="duotone" className="text-muted-foreground" />
                            </button>
                        </div>

                        {/* Helpful text */}
                        <p className="text-xs text-muted-foreground text-center max-w-sm">
                            Drag to reposition • Use controls to zoom and fit • Your avatar will be cropped to a circle
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleClose}
                        disabled={isUploading}
                        className="flex-1 h-12 text-base font-medium"
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleUpload}
                        disabled={isUploading || !previewUrl}
                        className={cn(
                            "flex-1 h-12 text-base font-medium",
                            "bg-foreground text-background hover:bg-foreground/90"
                        )}
                    >
                        {isUploading ? 'Processing...' : 'Set Avatar'}
                    </Button>
                </div>
            </div>
        </MobileSheet>
    );
}

// Main exported component with Suspense wrapper
export function MobileAvatarUploadModal({ onAvatarUpdate }: MobileAvatarUploadModalProps = {}) {
    return (
        <Suspense fallback={null}>
            <MobileAvatarUploadModalContent onAvatarUpdate={onAvatarUpdate} />
        </Suspense>
    );
} 