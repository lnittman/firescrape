"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    DotsThree,
    Star,
    Trash
} from "@phosphor-icons/react/dist/ssr";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@repo/design/components/ui/dropdown-menu";
import { cn } from "@repo/design/lib/utils";

interface EmailActionsMenuProps {
    emailId: string;
    emailAddress: string;
    isPrimary: boolean;
    isVerified: boolean;
    onSetAsPrimary?: (emailId: string) => void;
    onDelete?: (emailId: string) => void;
}

export function EmailActionsMenu({
    emailId,
    emailAddress,
    isPrimary,
    isVerified,
    onSetAsPrimary,
    onDelete
}: EmailActionsMenuProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSetAsPrimary = () => {
        if (onSetAsPrimary && isVerified && !isPrimary) {
            onSetAsPrimary(emailId);
        }
        setMenuOpen(false);
    };

    const handleDelete = () => {
        if (onDelete && !isPrimary) {
            onDelete(emailId);
        }
        setMenuOpen(false);
    };

    return (
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        "p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors rounded-md",
                        "focus:outline-none",
                        menuOpen ? "bg-accent/80 text-foreground" : ""
                    )}
                    aria-label="Email actions"
                >
                    <DotsThree size={16} weight="duotone" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                side="bottom"
                sideOffset={8}
                className={cn(
                    "w-[180px] p-0 bg-popover border-border/50 rounded-lg font-mono overflow-hidden"
                )}
            >
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        mass: 0.8
                    }}
                >
                    {/* Set as primary option */}
                    <div className="py-1 space-y-1">
                        <DropdownMenuItem
                            onClick={handleSetAsPrimary}
                            disabled={isPrimary || !isVerified}
                            className={cn(
                                "rounded-md mx-1 px-2 py-1.5 text-sm cursor-pointer transition-all duration-200",
                                (isPrimary || !isVerified) && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <Star className="w-4 h-4" weight="duotone" />
                                <span className="text-sm">Set as primary</span>
                            </div>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="mx-1" />

                        {/* Delete option */}
                        <DropdownMenuItem
                            onClick={handleDelete}
                            disabled={isPrimary}
                            className={cn(
                                "rounded-md mx-1 px-2 py-1.5 text-sm cursor-pointer transition-all duration-200",
                                "text-destructive hover:bg-destructive/10 hover:text-destructive",
                                isPrimary && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <Trash className="w-4 h-4" weight="duotone" />
                                <span className="text-sm">Delete</span>
                            </div>
                        </DropdownMenuItem>
                    </div>
                </motion.div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 