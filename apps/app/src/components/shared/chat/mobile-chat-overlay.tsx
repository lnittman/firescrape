"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { PaperPlaneTilt, ClockCounterClockwise, Plus, X } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@repo/design/lib/utils";
import { mobileChatOpenAtom, mobileUserMenuOpenAtom } from "@/atoms/menus";
import { YubaLogo } from "../logo";
import { useChat } from "ai/react";
import { useUser } from "@repo/auth/client";


// Hook to auto-close mobile overlays when transitioning to desktop
function useAutoCloseOnDesktop(isOpen: boolean, onClose: () => void) {
    useEffect(() => {
        if (!isOpen) return;

        const handleResize = () => {
            // Close immediately if screen becomes larger than mobile breakpoint (640px)
            if (window.innerWidth >= 640) {
                onClose();
            }
        };

        window.addEventListener('resize', handleResize);

        // Check immediately in case we're already on desktop
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen, onClose]);
}

// Main mobile chat overlay content component
function MobileChatOverlayContent() {
    const [isOpen, setIsOpen] = useAtom(mobileChatOpenAtom);
    const [isMobileUserMenuOpen, setIsMobileUserMenuOpen] = useAtom(mobileUserMenuOpenAtom);
    const [showRecentChats, setShowRecentChats] = useState(true);
    const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { user } = useUser();

    // Initialize chat with Mastra memory
    const { messages, input, setInput, handleSubmit, isLoading } = useChat({
        api: '/api/chat',
        body: {
            threadId: currentThreadId,
            data: {
                resourceId: user?.id,
            }
        },
        onError: (error) => {
            console.error('Chat error:', error);
        }
    });

    // Auto-close when transitioning to desktop
    useAutoCloseOnDesktop(isOpen, setIsOpen.bind(null, false));


    const handleClose = () => {
        setIsOpen(false);
    };

    // Close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (input.trim() && !isLoading) {
            handleSubmit();
            setShowRecentChats(false);
            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            const lineHeight = parseInt(window.getComputedStyle(textareaRef.current).lineHeight);
            const maxHeight = lineHeight * 5; // Max 5 rows
            textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';
        }
    }, [input]);

    const promptSuggestions = [
        "Find a scenic hike near me",
        "Plan a weekend camping trip",
        "Best trails for beginners",
        "Mountain biking routes",
        "Climbing spots nearby",
        "Family-friendly adventures"
    ];

    const handlePromptClick = (prompt: string) => {
        setInput(prompt);
        setShowRecentChats(false);
    };

    const handleNewChat = () => {
        // Generate new thread ID
        setCurrentThreadId(`thread-${Date.now()}`);
        setShowRecentChats(true);
        setInput("");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Full page solid overlay - positioned below header but covers tabs */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-x-0 bottom-0 top-14 z-[68] bg-background"
                        onClick={handleBackdropClick}
                    />

                    {/* Chat content - positioned from top for finger friendliness */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.23, 1, 0.32, 1],
                            delay: 0.1
                        }}
                        className="fixed left-0 right-0 top-14 bottom-0 z-[69] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-full w-full flex flex-col">
                            {/* Control Toolbar */}
                            <div className="bg-slate-50 dark:bg-slate-900 border-t border-b border-border px-4 py-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setShowRecentChats(true)}
                                            className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
                                            disabled
                                            title="Chat history coming soon"
                                        >
                                            <ClockCounterClockwise className="w-4 h-4" weight="duotone" />
                                        </button>
                                        <button
                                            onClick={handleNewChat}
                                            className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
                                        >
                                            <Plus className="w-4 h-4" weight="duotone" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
                                    >
                                        <X className="w-4 h-4" weight="duotone" />
                                    </button>
                                </div>
                            </div>

                            {/* Chat content area */}
                            <div className="flex-1 overflow-y-auto">
                                <AnimatePresence mode="wait">
                                    {showRecentChats ? (
                                        <motion.div
                                            key="recent-chats"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex flex-col items-center justify-center h-full px-4"
                                        >
                                            {/* Empty state */}
                                            <div className="text-center mb-8">
                                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                                                    <YubaLogo variant="fox" size="small" className="w-8 h-8" />
                                                </div>
                                                <h3 className="text-xl font-display font-medium">Ready to explore?</h3>
                                            </div>

                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="chat-messages"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="p-4 h-full"
                                        >
                                            {/* Chat messages */}
                                            <div className="space-y-4">
                                                {messages.map((msg, index) => (
                                                    <div
                                                        key={index}
                                                        className={cn(
                                                            "flex gap-3",
                                                            msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                                        )}
                                                    >
                                                        {msg.role === "assistant" && (
                                                            <div className="flex-shrink-0">
                                                                <div className="h-8 w-8 rounded-full bg-nature-green/10 flex items-center justify-center">
                                                                    <YubaLogo variant="fox" size="small" className="w-5 h-5" />
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div
                                                            className={cn(
                                                                "flex flex-col gap-1 max-w-[80%]",
                                                                msg.role === "user" ? "items-end" : "items-start"
                                                            )}
                                                        >
                                                            <div
                                                                className={cn(
                                                                    "px-3 py-2 rounded-lg text-sm",
                                                                    msg.role === "user"
                                                                        ? "bg-nature-green/10 text-foreground"
                                                                        : "bg-muted text-foreground"
                                                                )}
                                                            >
                                                                {msg.content}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {isLoading && (
                                                    <div className="flex gap-3">
                                                        <div className="flex-shrink-0">
                                                            <div className="h-8 w-8 rounded-full bg-nature-green/10 flex items-center justify-center">
                                                                <YubaLogo variant="fox" size="small" className="w-5 h-5" />
                                                            </div>
                                                        </div>
                                                        <div className="bg-muted px-3 py-2 rounded-lg">
                                                            <div className="flex gap-1">
                                                                <motion.div
                                                                    className="w-2 h-2 bg-muted-foreground rounded-full"
                                                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                                                    transition={{ duration: 1.4, repeat: Infinity }}
                                                                />
                                                                <motion.div
                                                                    className="w-2 h-2 bg-muted-foreground rounded-full"
                                                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                                                    transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
                                                                />
                                                                <motion.div
                                                                    className="w-2 h-2 bg-muted-foreground rounded-full"
                                                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                                                    transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Input area with suggestions */}
                            <div className="relative">
                                {/* Suggestion pills over prompt bar */}
                                <AnimatePresence>
                                    {showRecentChats && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="absolute bottom-full left-0 right-0 pb-2 px-4"
                                        >
                                            <div className="relative">
                                                {/* Gradient fade edges */}
                                                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
                                                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

                                                {/* Scrollable container */}
                                                <div className="flex gap-2 overflow-x-auto scrollbar-hide px-2">
                                                    {promptSuggestions.map((prompt, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => handlePromptClick(prompt)}
                                                            className="flex-shrink-0 px-3 py-2 text-sm bg-muted hover:bg-muted/70 rounded-lg transition-colors whitespace-nowrap"
                                                        >
                                                            {prompt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Input bar */}
                                <div className="p-4 border-t border-border">
                                    <form onSubmit={handleSendMessage} className="flex items-end gap-2 p-3 bg-muted/50 rounded-lg">
                                        <textarea
                                            ref={textareaRef}
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Ask about trails, conditions, gear..."
                                            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground resize-none overflow-hidden"
                                            rows={1}
                                            style={{ minHeight: '20px' }}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!input.trim() || isLoading}
                                            className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center transition-all flex-shrink-0",
                                                input.trim() && !isLoading
                                                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                                    : "bg-muted text-muted-foreground"
                                            )}
                                        >
                                            <PaperPlaneTilt className="w-4 h-4" weight="duotone" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Main exported component with Suspense wrapper
export function MobileChatOverlay() {
    return (
        <Suspense fallback={null}>
            <MobileChatOverlayContent />
        </Suspense>
    );
}