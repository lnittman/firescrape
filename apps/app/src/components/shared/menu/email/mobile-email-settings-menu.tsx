"use client";

import React, { Suspense } from "react";
import { useAtom } from "jotai";
import { useAuth } from "@repo/auth/client";
import { DotsThree } from "@phosphor-icons/react/dist/ssr";
import { Skeleton } from "@repo/design/components/ui/skeleton";
import { cn } from "@repo/design/lib/utils";
import {
    mobileEmailSettingsOpenAtom,
    mobileEmailSettingsDataAtom,
    mobileEmailSettingsCallbackAtom,
    type MobileEmailSettingsData
} from "@/atoms/menus";

interface MobileEmailSettingsMenuProps extends MobileEmailSettingsData {
    onSetAsPrimary?: (emailId: string) => void;
    onDelete?: (emailId: string) => void;
}

function MobileEmailSettingsMenuSkeleton() {
    return (
        <div className="h-8 w-8 flex-shrink-0">
            <Skeleton className="h-8 w-8 rounded-full" />
        </div>
    );
}

function MobileEmailSettingsMenuContent({
    emailId,
    emailAddress,
    isPrimary,
    isVerified,
    onSetAsPrimary,
    onDelete
}: MobileEmailSettingsMenuProps) {
    const { isLoaded } = useAuth();
    const [, setOpen] = useAtom(mobileEmailSettingsOpenAtom);
    const [, setData] = useAtom(mobileEmailSettingsDataAtom);
    const [, setCallback] = useAtom(mobileEmailSettingsCallbackAtom);

    const handleOpen = () => {
        setData({ emailId, emailAddress, isPrimary, isVerified });
        setCallback({ onSetAsPrimary, onDelete });
        setOpen(true);
    };

    if (!isLoaded) {
        return <MobileEmailSettingsMenuSkeleton />;
    }

    return (
        <button
            onClick={handleOpen}
            className={cn(
                "p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-md",
                "focus:outline-none"
            )}
            aria-label="Email actions"
        >
            <DotsThree size={16} weight="duotone" />
        </button>
    );
}

export function MobileEmailSettingsMenu(props: MobileEmailSettingsMenuProps) {
    return (
        <Suspense fallback={<MobileEmailSettingsMenuSkeleton />}>
            <MobileEmailSettingsMenuContent {...props} />
        </Suspense>
    );
}
