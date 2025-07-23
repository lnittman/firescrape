"use client";

import React, { useState } from "react";
import { Brain, Info, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { useAISettings } from "@/hooks/swr/user/queries";
import { useUpdateAISettings } from "@/hooks/swr/user/mutations";
import type { AISettings } from "@/lib/api/schemas";
import { MobileSettingsHeader } from "./mobile-settings-header";

interface AISettingsPageProps {
  initialSettings?: AISettings;
}

export function AISettingsPage({ initialSettings }: AISettingsPageProps) {
  const { settings, isLoading } = useAISettings(initialSettings);
  const { updateAISettings, isLoading: isUpdating } = useUpdateAISettings();
  
  const [rules, setRules] = useState(settings?.rules || "");
  const [hasChanges, setHasChanges] = useState(false);

  // Use initial data from RSC if available, otherwise fall back to SWR
  const effectiveSettings = settings || initialSettings;

  React.useEffect(() => {
    if (effectiveSettings?.rules !== undefined) {
      setRules(effectiveSettings.rules || "");
    }
  }, [effectiveSettings]);

  React.useEffect(() => {
    setHasChanges(rules !== (effectiveSettings?.rules || ""));
  }, [rules, effectiveSettings?.rules]);

  const handleSave = async () => {
    try {
      await updateAISettings({ rules: rules.trim() || undefined });
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save AI settings:", error);
    }
  };

  if (isLoading && !initialSettings) {
    return (
      <div className="space-y-6">
        <MobileSettingsHeader title="AI Settings" />
        <div className="animate-pulse px-6">
          <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mobile header with back button */}
      <MobileSettingsHeader title="AI Settings" />

      {/* Desktop Header */}
      <div className="hidden sm:block space-y-2 px-6 pt-6">
        <h1 className="text-xl font-semibold">AI Settings</h1>
        <p className="text-muted-foreground">
          Configure custom rules and preferences for AI-powered scraping
        </p>
      </div>

      <div className="space-y-6 px-6 pb-6">
        {/* Custom Rules */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Brain
              size={16}
              weight="duotone"
              className="text-muted-foreground"
            />
            <h3 className="text-sm font-medium font-mono">Custom Rules</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-accent/30 border border-border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info
                  size={16}
                  weight="duotone"
                  className="text-blue-600 mt-0.5 flex-shrink-0"
                />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">AI-Powered Extraction</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Set custom rules to help the AI understand what content you want to extract.
                    For example: "Focus on product descriptions and prices" or "Extract only article text, ignore navigation".
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Extraction Rules
              </label>
              <textarea
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                placeholder="Describe what content you want the AI to focus on when scraping pages..."
                className="w-full h-32 px-3 py-2 bg-background border border-border hover:border-foreground/20 focus:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-foreground/20 text-sm transition-colors rounded-lg resize-none"
                style={{ fontSize: '16px' }} // Prevent zoom on iOS
              />
              <p className="text-xs text-muted-foreground">
                These rules will be applied to all your scraping requests to help the AI extract more relevant content.
              </p>
            </div>

            {hasChanges && (
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-4 py-2 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm rounded-lg h-10"
                >
                  {isUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Sparkle size={14} weight="duotone" />
                      Save Rules
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Future AI Features */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded border border-dashed border-muted-foreground/50"></div>
            <h3 className="text-sm font-medium font-mono text-muted-foreground">
              More AI Features Coming Soon
            </h3>
          </div>
          <div className="border border-dashed border-muted-foreground/30 rounded-lg p-4">
            <p className="text-xs text-muted-foreground text-center">
              Advanced AI features like custom extraction models and intelligent content filtering will be available in future updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
