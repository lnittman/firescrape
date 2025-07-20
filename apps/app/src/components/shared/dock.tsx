"use client";

import { useState, useEffect } from "react";

import { MapPin, Link, Star, Sparkle, Lightning, Compass } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { toast } from "@repo/design/components/ui/sonner";

import { cn } from "@/lib/utils";

interface DockProps {
  onInterestsClick?: () => void;
  className?: string;
}

export function Dock({
  onInterestsClick,
  className,
}: DockProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const pathname = usePathname();

  // Check AI service connectivity
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const aiUrl = process.env.NEXT_PUBLIC_AI_URL || 'http://localhost:6969';
        const response = await fetch(`${aiUrl}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(3000), // 3 second timeout
        });
        setIsConnected(response.ok);
      } catch (error) {
        setIsConnected(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Dynamic menu items based on current page
  const getMenuItems = () => {
    const isHomePage = pathname === '/';
    const isAdventuresPage = pathname === '/my-trips';

    if (isHomePage) {
      return [
        {
          label: "Set interests",
          icon: <Star weight="duotone" className="h-4 w-4" />,
          onClick: onInterestsClick || (() => { }),
        },
        {
          label: "Quick Start",
          icon: <Lightning weight="duotone" className="h-4 w-4" />,
          onClick: async () => {
            // Quick start - generate instant adventure based on current time/location
            const quickPrompts = [
              "2-hour adventure near me right now",
              "Quick outdoor activity before sunset",
              "Easy trail within 30 minutes",
              "Spontaneous nature walk nearby"
            ];
            const randomPrompt = quickPrompts[Math.floor(Math.random() * quickPrompts.length)];
            
            // Trigger adventure creation
            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
            if (input) {
              input.value = randomPrompt;
              input.dispatchEvent(new Event('input', { bubbles: true }));
            }
          },
        },
      ];
    }

    if (isAdventuresPage) {
      return [
        {
          label: "New adventure",
          icon: <Compass weight="duotone" className="h-4 w-4" />,
          onClick: () => {
            // Navigate to home page for new adventure
            window.location.href = '/';
          },
        },
        {
          label: "Filter trips",
          icon: <Star weight="duotone" className="h-4 w-4" />,
          onClick: () => {
            // TODO: Open filter panel
            toast.info("Filter feature coming soon!");
          },
        },
      ];
    }

    // Default menu items for other pages
    return [
      {
        label: "Quick Plan (2 hours)",
        icon: <Sparkle weight="duotone" className="h-4 w-4" />,
        onClick: () => { },
      },
      {
        label: "Weekend Adventure",
        icon: <MapPin weight="duotone" className="h-4 w-4" />,
        onClick: () => { },
      },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={cn(
          "bg-background border border-border rounded-lg shadow-lg",
          "w-[260px] relative overflow-hidden"
        )}
        initial={false}
        animate={{
          height: isHovered ? 140 : 48,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
      >
        {/* Menu items - positioned from bottom to stay fixed */}
        <div className="absolute bottom-[58px] left-3 right-3">
          <div className="flex flex-col gap-1">
            {menuItems.map((item, index) => (
              <motion.button
                key={index}
                onClick={item.onClick}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-md",
                  "hover:bg-accent transition-colors",
                  "text-sm text-foreground whitespace-nowrap w-full text-left"
                )}
                initial={false}
                animate={{
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.2, delay: isHovered ? 0.1 : 0 }}
              >
                {item.icon}
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Bottom dock content - always visible */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-[48px] pl-4 pr-2",
          "flex items-center justify-between bg-accent/60 rounded-lg"
        )}>
          {/* Status indicator */}
          <div className="flex items-center">
            <div className={cn(
              "w-2 h-2 rounded-full transition-colors",
              isChecking ? "bg-yellow-600 animate-pulse" :
                isConnected ? "bg-green-700" : "bg-red-700"
            )} />
          </div>

          {/* Link button - copies current URL */}
          <button
            onClick={() => {
              const currentUrl = window.location.href;
              navigator.clipboard.writeText(currentUrl);
              toast.success("Current link copied!");
            }}
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center",
              "hover:bg-accent transition-colors duration-200",
              "text-muted-foreground hover:text-foreground"
            )}
            aria-label="Copy link"
          >
            <Link weight="duotone" className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
