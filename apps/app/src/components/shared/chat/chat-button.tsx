"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { cn } from "@repo/design/lib/utils";
import { useIsMobile } from "@repo/design/hooks/use-mobile";
import { YubaLogo } from "../logo";
import { ChatPanel } from "./chat-panel";
import { MobileChatOverlay } from "./mobile-chat-overlay";
import { foxChatOpenAtom } from "@/atoms/modals";
import { mobileChatOpenAtom } from "@/atoms/menus";

export function ChatButton() {
  const [isDesktopOpen, setIsDesktopOpen] = useAtom(foxChatOpenAtom);
  const [isMobileOpen, setIsMobileOpen] = useAtom(mobileChatOpenAtom);
  const isMobile = useIsMobile();

  const handleClick = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setIsDesktopOpen(!isDesktopOpen);
    }
  };

  const isOpen = isMobile ? isMobileOpen : isDesktopOpen;

  return (
    <>
      {/* Button - Fixed bottom left, aligned with dock */}
      <motion.button
        onClick={handleClick}
        className={cn(
          "fixed bottom-6 left-6 z-40",
          "h-12 w-12 rounded-lg",
          "bg-background border border-border",
          "hover:bg-accent hover:border-foreground/20",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nature-green/50",
          "flex items-center justify-center",
          isOpen && "bg-accent border-foreground/20"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <YubaLogo variant="fox" size="small" className="w-8 h-8" />
      </motion.button>

      {/* Chat Interface - Mobile vs Desktop */}
      {isMobile ? (
        <MobileChatOverlay />
      ) : (
        <AnimatePresence>
          {isDesktopOpen && (
            <ChatPanel
              isOpen={isDesktopOpen}
              onClose={() => setIsDesktopOpen(false)}
            />
          )}
        </AnimatePresence>
      )}
    </>
  );
}