"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@repo/design/lib/utils";
import { YubaLogo } from "../logo";
import { PaperPlaneTilt, X, ClockCounterClockwise, Plus } from "@phosphor-icons/react/dist/ssr";
import { useClickAway } from "@repo/design/hooks/use-click-away";
import { useChat } from "ai/react";
import { useUser } from "@repo/auth/client";

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}


export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const [showRecentChats, setShowRecentChats] = useState(true);
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
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

  useClickAway(panelRef, () => {
    if (isOpen) onClose();
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


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
    <motion.div
      ref={panelRef}
      className={cn(
        "fixed bottom-24 left-6 z-50",
        "w-[380px] h-[520px]",
        "bg-background border border-border rounded-lg shadow-lg",
        "flex flex-col overflow-hidden"
      )}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Control Toolbar */}
      <div className="bg-slate-50 dark:bg-slate-900 border-t border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowRecentChats(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
            title="View chat history"
          >
            <ClockCounterClockwise className="w-4 h-4" weight="duotone" />
            <span>History</span>
          </button>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
          >
            <Plus className="w-4 h-4" weight="duotone" />
            <span>New</span>
          </button>
          <button
            onClick={onClose}
            className={cn(
              "h-8 w-8 rounded-md flex items-center justify-center",
              "hover:bg-accent transition-colors duration-200",
              "text-muted-foreground hover:text-foreground"
            )}
          >
            <X size={16} weight="duotone" />
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
              className="flex flex-col items-center justify-center h-full p-4"
            >
              {/* Empty state */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <YubaLogo variant="fox" size="small" className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-display font-medium mb-2">Ready to explore?</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Ask me anything about outdoor adventures, trail conditions, or planning your next trip.
                </p>
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
              {/* Messages */}
              <div className="space-y-3">
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

                <div ref={messagesEndRef} />
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
                      className="flex-shrink-0 px-3 py-1.5 text-xs bg-muted hover:bg-muted/70 rounded-lg transition-colors whitespace-nowrap"
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
        <div className="border-t border-border p-3">
          <form onSubmit={handleSendMessage} className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about trails, conditions, gear..."
              className={cn(
                "flex-1 px-3 py-2 text-sm",
                "bg-transparent border border-border rounded-lg",
                "focus:outline-none focus:ring-2 focus:ring-nature-green/50 focus:border-nature-green/50",
                "placeholder:text-muted-foreground resize-none overflow-hidden"
              )}
              rows={1}
              style={{ minHeight: '40px' }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={cn(
                "h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0",
                "bg-nature-green text-white",
                "hover:bg-nature-green-dark transition-colors duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nature-green/50"
              )}
            >
              <PaperPlaneTilt size={18} weight="duotone" />
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}