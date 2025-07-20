'use client';

import { useTransitionRouter } from 'next-view-transitions';
import { CaretLeft } from '@phosphor-icons/react';
import { cn } from '@repo/design/lib/utils';

interface MobileSettingsHeaderProps {
    title: string;
}

export function MobileSettingsHeader({ title }: MobileSettingsHeaderProps) {
    const router = useTransitionRouter();

    const handleBack = () => {
        router.push('/account/settings');
    };

    return (
        <div className="sm:hidden flex items-center gap-3 p-4 border-b border-border">
            <button
                onClick={handleBack}
                className={cn(
                    "h-8 w-8 flex items-center justify-center transition-all duration-200 rounded-md border select-none",
                    "bg-accent/5 border-accent/50 text-muted-foreground",
                    "hover:bg-accent/40 hover:text-accent-foreground hover:border-accent/50",
                    "focus:outline-none"
                )}
                aria-label="Back to settings"
            >
                <CaretLeft className="w-3 h-3" weight="duotone" />
            </button>
            <h1 className="text-lg font-semibold">{title}</h1>
        </div>
    );
} 