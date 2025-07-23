"use client";

import React, { Suspense } from "react";
import { useAtom } from "jotai";
import {
    Bug,
    Sparkle,
    Smiley,
    Gauge,
    ChatText,
    Check
} from "@phosphor-icons/react/dist/ssr";
import { useAuth } from "@repo/auth/client";
import { cn } from "@repo/design/lib/utils";
import { MobileSheet } from "@/components/shared/ui/mobile-sheet";
import {
    mobileFeedbackTypeOpenAtom,
    mobileFeedbackTypeCallbackAtom,
    mobileFeedbackTypeSelectedAtom
} from "@/atoms/menus";

const feedbackTopics = [
    { id: "bug", label: "Bug Report", icon: Bug },
    { id: "feature", label: "Feature Request", icon: Sparkle },
    { id: "ui", label: "UI/UX Feedback", icon: Smiley },
    { id: "performance", label: "Performance", icon: Gauge },
    { id: "general", label: "General Feedback", icon: ChatText }
];

function MobileFeedbackTypeMenuContent() {
    const { isLoaded } = useAuth();
    const [isOpen, setIsOpen] = useAtom(mobileFeedbackTypeOpenAtom);
    const [callback] = useAtom(mobileFeedbackTypeCallbackAtom);
    const [selectedTopic, setSelectedTopic] = useAtom(mobileFeedbackTypeSelectedAtom);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleSelect = (topicId: string) => {
        setSelectedTopic(topicId);
        callback?.(topicId);
        setIsOpen(false);
    };

    if (!isLoaded) return null;

    return (
        <MobileSheet
            isOpen={isOpen}
            onClose={handleClose}
            title="Feedback Type"
            showBackButton={true}
            onBack={handleClose}
            position="bottom"
            spacing="sm"
            isSubsheet={true}
        >
            <div className="p-4 space-y-1">
                {feedbackTopics.map((topic) => (
                    <button
                        key={topic.id}
                        type="button"
                        onClick={() => handleSelect(topic.id)}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-accent transition-all duration-200 flex items-center justify-between font-mono rounded-md"
                    >
                        <div className="flex items-center gap-3">
                            <topic.icon size={18} weight="duotone" className="text-muted-foreground" />
                            <span>{topic.label}</span>
                        </div>
                        {selectedTopic === topic.id && (
                            <Check size={16} weight="duotone" className="text-green-600" />
                        )}
                    </button>
                ))}
            </div>
        </MobileSheet>
    );
}

export function MobileFeedbackTypeMenu() {
    return (
        <Suspense fallback={null}>
            <MobileFeedbackTypeMenuContent />
        </Suspense>
    );
}

