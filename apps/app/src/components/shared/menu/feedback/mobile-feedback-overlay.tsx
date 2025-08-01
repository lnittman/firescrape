"use client";

// For optimal mobile experience without zoom, ensure your HTML includes:
// <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

import React, { useState, useRef, useEffect, Suspense } from "react";
import { useAtom } from "jotai";
import { motion } from "framer-motion";
import {
    X,
    PaperPlaneTilt,
    Check,
    Smiley,
    Bug,
    Sparkle,
    Gauge,
    ChatText,
    ThumbsUp,
    ThumbsDown,
} from "@phosphor-icons/react/dist/ssr";
import { useAuth } from "@repo/auth/client";
import { cn } from "@repo/design/lib/utils";
import { MobileSheet } from "@/components/shared/ui/mobile-sheet";
import {
    mobileFeedbackOpenAtom,
    mobileFeedbackTypeOpenAtom,
    mobileFeedbackTypeCallbackAtom,
    mobileFeedbackTypeSelectedAtom
} from "@/atoms/menus";
import { useMobileMenuTransition } from "@/atoms/modals";

const feedbackTopics = [
    { id: 'bug', label: 'Bug Report', icon: Bug },
    { id: 'feature', label: 'Feature Request', icon: Sparkle },
    { id: 'ui', label: 'UI/UX Feedback', icon: Smiley },
    { id: 'performance', label: 'Performance', icon: Gauge },
    { id: 'general', label: 'General Feedback', icon: ChatText },
];

// Main mobile feedback overlay content component
function MobileFeedbackOverlayContent() {
    const { isLoaded } = useAuth();
    const [isOpen, setIsOpen] = useAtom(mobileFeedbackOpenAtom);
    const [selectedTopic, setSelectedTopic] = useAtom(mobileFeedbackTypeSelectedAtom);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [, setFeedbackTypeCallback] = useAtom(mobileFeedbackTypeCallbackAtom);
    const openTypeMenu = useMobileMenuTransition(mobileFeedbackTypeOpenAtom, true);
    const [sentiment, setSentiment] = useState<'positive' | 'negative' | null>(null);
    const [isTypeMenuOpen] = useAtom(mobileFeedbackTypeOpenAtom);

    // Ref for the textarea to handle autofocus
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleClose = () => {
        setIsOpen(false);
        // MobileSheet will handle closing global mobile menu when animation completes
    };

    // Autofocus textarea when overlay opens, with mobile-friendly approach
    useEffect(() => {
        if (isOpen && textareaRef.current && !isSubmitted) {
            // Use multiple focus attempts for better mobile compatibility
            const focusInput = () => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                    textareaRef.current.click(); // Additional trigger for iOS
                    textareaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Force keyboard on iOS Safari
                    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                        textareaRef.current.setSelectionRange(0, 0);
                    }
                }
            };

            // Initial focus attempt
            const timeoutId1 = setTimeout(focusInput, 100);

            // Second attempt after animation
            const timeoutId2 = setTimeout(focusInput, 300);

            // Third attempt for stubborn mobile browsers
            const timeoutId3 = setTimeout(focusInput, 500);

            return () => {
                clearTimeout(timeoutId1);
                clearTimeout(timeoutId2);
                clearTimeout(timeoutId3);
            };
        }
    }, [isOpen, isSubmitted]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTopic || !feedback.trim()) return;

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic: selectedTopic,
                    message: feedback.trim(),
                    sentiment: sentiment,
                }),
            });

            if (response.ok) {
                setIsSubmitted(true);
                setTimeout(() => {
                    setIsOpen(false);
                    setSelectedTopic('');
                    setFeedback('');
                    setIsSubmitted(false);
                    setSentiment(null);
                }, 2000);
            }
        } catch (error) {
            console.error('Failed to submit feedback:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = () => {
        setSelectedTopic('');
        setFeedback('');
        setIsSubmitted(false);
        setSentiment(null);
    };

    const selectedTopicData = feedbackTopics.find(t => t.id === selectedTopic);

    if (!isLoaded) {
        return null;
    }

    return (
        <MobileSheet
            isOpen={isOpen}
            onClose={handleClose}
            title="Feedback"
            showCloseButton={true}
            position="bottom"
            spacing="sm"
            contentPadding={false}
            hasSubsheetOpen={isTypeMenuOpen}
        >
            <div className="p-4">
                {isSubmitted ? (
                    <div className="text-center py-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="w-16 h-16 bg-green-600/10 border border-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <Check size={32} weight="duotone" className="text-green-600" />
                        </motion.div>
                        <h3 className="text-lg font-medium text-foreground mb-2 font-mono">Thank you!</h3>
                        <p className="text-sm text-muted-foreground font-mono">Your feedback has been submitted.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Topic Selection */}
                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setFeedbackTypeCallback((topicId: string) => setSelectedTopic(topicId));
                                    openTypeMenu();
                                }}
                                className="w-full h-11 px-4 bg-background border border-border rounded-lg text-sm text-left flex items-center justify-between hover:border-foreground/20 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all duration-200 font-mono"
                            >
                                <div className="flex items-center gap-3">
                                    {selectedTopicData && (
                                        <selectedTopicData.icon size={18} weight="duotone" className="text-muted-foreground" />
                                    )}
                                    <span className={selectedTopicData ? 'text-foreground' : 'text-muted-foreground'}>
                                        {selectedTopicData ? selectedTopicData.label : 'Select a topic...'}
                                    </span>
                                </div>
                            </button>
                        </div>

                        {/* Feedback Text */}
                            <div className="space-y-3">
                            <textarea
                                    ref={textareaRef}
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Tell us what's on your mind..."
                                    className="w-full h-32 px-4 py-3 bg-background border border-border rounded-lg resize-none hover:border-foreground/20 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/30 transition-all duration-200 placeholder:text-muted-foreground font-mono text-base"
                                    style={{ fontSize: '16px' }} // Prevent zoom on iOS
                                    onTouchStart={() => {
                                        // Additional touch event for mobile browsers
                                        if (textareaRef.current) {
                                            textareaRef.current.focus();
                                        }
                                    }}
                                required
                            />
                            <div className="flex items-center justify-end">
                                <span className="text-xs text-muted-foreground font-mono">
                                    Markdown supported
                                </span>
                            </div>
                        </div>

                        {/* Sentiment and Submit - matching desktop footer style */}
                        <div className="bg-muted/30 border-t border-border p-4 -mx-4 -mb-4 flex items-center justify-between">
                            {/* Thumbs up/down buttons */}
                                <div className="flex items-center gap-1">
                                <motion.button
                                    type="button"
                                    onClick={() => setSentiment(sentiment === 'positive' ? null : 'positive')}
                                        className="p-2 rounded-full"
                                    animate={{
                                        backgroundColor: sentiment === 'positive'
                                            ? 'rgba(34, 197, 94, 0.2)'
                                            : 'transparent'
                                    }}
                                    whileHover={{
                                        backgroundColor: sentiment === 'positive'
                                            ? 'rgba(34, 197, 94, 0.3)'
                                            : 'rgba(255, 255, 255, 0.08)'
                                    }}
                                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                                    title="Positive feedback"
                                >
                                    <motion.div
                                        className="text-muted-foreground"
                                        animate={{
                                            color: sentiment === 'positive'
                                                ? '#22c55e'
                                                : undefined
                                        }}
                                        whileHover={{
                                            color: sentiment !== 'positive'
                                                ? 'hsl(var(--foreground))'
                                                : undefined
                                        }}
                                        transition={{
                                            duration: 0.2,
                                            ease: 'easeInOut',
                                            color: { duration: 0.2 }
                                        }}
                                    >
                                            <ThumbsUp size={16} weight="duotone" />
                                    </motion.div>
                                </motion.button>
                                <motion.button
                                    type="button"
                                    onClick={() => setSentiment(sentiment === 'negative' ? null : 'negative')}
                                        className="p-2 rounded-full"
                                    animate={{
                                        backgroundColor: sentiment === 'negative'
                                            ? 'rgba(239, 68, 68, 0.2)'
                                            : 'transparent'
                                    }}
                                    whileHover={{
                                        backgroundColor: sentiment === 'negative'
                                            ? 'rgba(239, 68, 68, 0.3)'
                                            : 'rgba(255, 255, 255, 0.08)'
                                    }}
                                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                                    title="Negative feedback"
                                >
                                    <motion.div
                                        className="text-muted-foreground"
                                        animate={{
                                            color: sentiment === 'negative'
                                                ? '#ef4444'
                                                : undefined
                                        }}
                                        whileHover={{
                                            color: sentiment !== 'negative'
                                                ? 'hsl(var(--foreground))'
                                                : undefined
                                        }}
                                        transition={{
                                            duration: 0.2,
                                            ease: 'easeInOut',
                                            color: { duration: 0.2 }
                                        }}
                                    >
                                            <ThumbsDown size={16} weight="duotone" />
                                    </motion.div>
                                </motion.button>
                            </div>

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={!selectedTopic || !feedback.trim() || isSubmitting}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 font-mono",
                                    "disabled:opacity-50 disabled:cursor-not-allowed",
                                    selectedTopic && feedback.trim() && !isSubmitting
                                        ? "bg-foreground text-background hover:bg-foreground/90"
                                        : "bg-muted text-muted-foreground"
                                )}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                                        />
                                        Sending...
                                    </span>
                                ) : (
                                            'Send'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </MobileSheet>
    );
}

// Main exported component with Suspense wrapper
export function MobileFeedbackOverlay() {
    return (
        <Suspense fallback={null}>
            <MobileFeedbackOverlayContent />
        </Suspense>
    );
} 