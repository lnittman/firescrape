"use client";

import React from "react";
import { useUser } from "@repo/auth/client";
import {
  useProfile,
  useAISettings,
  useAppearanceSettings,
} from "@/hooks/user/queries";
import { cn } from "@repo/design/lib/utils";
import { SPACE_DEFAULTS } from "@repo/api";
import {
  User,
  Mountains,
  MapPin,
  Clock,
  Palette,
  Calendar,
  Footprints,
} from "@phosphor-icons/react/dist/ssr";
// Removed space constants - Yuba focuses on outdoor activities

export function AccountOverview() {
  const { user } = useUser();
  const { profile, isLoading: profileLoading } = useProfile();
  const { settings: aiSettings, isLoading: aiLoading } = useAISettings();
  const { settings: appearanceSettings, isLoading: appearanceLoading } =
    useAppearanceSettings();

  const isLoading = profileLoading || aiLoading || appearanceLoading;

  if (isLoading) {
    return (
      <div className="flex-1 py-8">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-4xl px-6">
            <div className="space-y-6">
              <div className="h-6 bg-muted rounded w-1/3 animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-32 bg-muted rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mock data for now - would come from activity tracking
  const totalHikes = 12;
  const totalMiles = 87;
  const savedTrails = 5;
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "";

  return (
    <div className="flex-1 py-8">
      <div className="w-full flex justify-center">
        <div className="w-full max-w-4xl px-6">
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">
                Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
              </h2>
              <p className="text-muted-foreground">
                Here's an overview of your account and recent activity.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Hikes */}
              <div className="border border-border bg-card p-6 rounded-lg hover:border-foreground/20 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-green-500/10 text-green-600 border border-green-500/20 rounded-lg flex items-center justify-center">
                    <Mountains size={20} weight="duotone" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-mono">
                      {totalHikes}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Hikes
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Outdoor adventures completed
                </p>
              </div>

              {/* Total Miles */}
              <div className="border border-border bg-card p-6 rounded-lg hover:border-foreground/20 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-lg flex items-center justify-center">
                    <Footprints size={20} weight="duotone" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-mono">
                      {totalMiles}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Miles Hiked
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Total distance covered
                </p>
              </div>

              {/* Saved Trails */}
              <div className="border border-border bg-card p-6 rounded-lg hover:border-foreground/20 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-purple-500/10 text-purple-600 border border-purple-500/20 rounded-lg flex items-center justify-center">
                    <MapPin size={20} weight="duotone" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold font-mono">
                      {savedTrails}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Saved Trails
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Favorite outdoor destinations
                </p>
              </div>
            </div>

            {/* Account Info */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Account Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Info */}
                <div className="border border-border bg-card p-6 rounded-lg">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-accent text-foreground rounded-lg flex items-center justify-center text-sm font-medium border border-border">
                      {user?.firstName?.charAt(0) ||
                        user?.emailAddresses?.[0]?.emailAddress
                          ?.charAt(0)
                          ?.toUpperCase() ||
                        "U"}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="font-medium">
                        {user?.firstName && user?.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user?.emailAddresses?.[0]?.emailAddress || "User"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {user?.emailAddresses?.[0]?.emailAddress}
                      </div>
                      {joinDate && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar size={12} weight="duotone" />
                          Joined {joinDate}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="border border-border bg-card p-6 rounded-lg">
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Palette size={16} weight="duotone" />
                    Preferences
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tier:</span>
                      <span className="font-mono capitalize">
                        {profile?.tier || "free"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Default Model:
                      </span>
                      <span className="font-mono text-xs">
                        {aiSettings?.defaultModel ||
                          SPACE_DEFAULTS.DEFAULT_MODEL}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
