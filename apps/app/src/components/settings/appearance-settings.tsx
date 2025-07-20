"use client";

import React from "react";
import { Palette, Info } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@repo/design/lib/utils";
import { useAppearanceSettings } from "@/hooks/user/queries";
import type { AppearanceSettings } from "@repo/api";
import { MobileSettingsHeader } from "./mobile-settings-header";

interface AppearanceSettingsProps {
  initialSettings?: AppearanceSettings;
}

export function AppearanceSettings({
  initialSettings,
}: AppearanceSettingsProps) {
  const { settings, isLoading } = useAppearanceSettings(initialSettings);

  // Use initial data from RSC if available, otherwise fall back to SWR
  const effectiveSettings = settings || initialSettings;

  if (isLoading && !initialSettings) {
    return (
      <div className="space-y-6">
        <MobileSettingsHeader title="Appearance" />
        <div className="animate-pulse px-6">
          <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
        </div>
        <div className="space-y-4 px-6">
          <div className="h-20 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mobile header with back button */}
      <MobileSettingsHeader title="Appearance" />

      {/* Desktop Header */}
      <div className="hidden sm:block space-y-2 px-6 pt-6">
        <h1 className="text-xl font-semibold">Appearance Settings</h1>
        <p className="text-muted-foreground">
          Visual preferences are managed by our design system
        </p>
      </div>

      <div className="space-y-6 px-6 pb-6">
        {/* Design System Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Palette
              size={16}
              weight="duotone"
              className="text-muted-foreground"
            />
            <h3 className="text-sm font-medium font-mono">Design System</h3>
          </div>

          <div className="bg-accent/30 border border-border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info
                size={16}
                weight="duotone"
                className="text-blue-600 mt-0.5 flex-shrink-0"
              />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">
                  Typography & Visual Design
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Yuba uses a carefully crafted design system with Louize
                  Display for headings and CX80 font variations for body text.
                  Typography, colors, and spacing are optimized for the best
                  outdoor adventure experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Theme Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500"></div>
            <h3 className="text-sm font-medium font-mono">Current Theme</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="space-y-1">
                <div className="text-sm font-medium">System Theme</div>
                <div className="text-xs text-muted-foreground">
                  Automatically adapts to your device settings
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full bg-white border border-gray-300"></div>
                <div className="w-4 h-4 rounded-full bg-gray-900"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Typography Preview */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded"></div>
            <h3 className="text-sm font-medium font-mono">
              Typography Preview
            </h3>
          </div>

          <div className="border border-border rounded-lg p-4 space-y-3">
            <div className="font-display text-lg font-bold">
              Louize Display - Adventure Awaits
            </div>
            <div className="font-cx80 text-base">
              CX80 Body Text - Perfect for reading trail descriptions and
              outdoor guides
            </div>
            <div className="font-cx80 text-sm text-muted-foreground">
              Small text for captions and metadata
            </div>
          </div>
        </div>

        {/* Future Settings Placeholder */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded border border-dashed border-muted-foreground/50"></div>
            <h3 className="text-sm font-medium font-mono text-muted-foreground">
              More Options Coming Soon
            </h3>
          </div>

          <div className="border border-dashed border-muted-foreground/30 rounded-lg p-4">
            <p className="text-xs text-muted-foreground text-center">
              Additional appearance customization options will be available in
              future updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
