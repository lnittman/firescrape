import { useState } from "react";
import { mutate } from "swr";
import type {
  UpdateProfile,
  UpdateAppearanceSettings,
  UpdateNotificationSettings,
  UpdateAISettings,
} from "@repo/api";
import {
  updateProfile,
  updateAppearanceSettings,
  updateNotificationSettings,
  updateAISettings,
} from "@/app/actions/user";

export function useUpdateProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (data: UpdateProfile) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await updateProfile(data);

      if ("error" in result) {
        throw new Error(result.error);
      }

      // Invalidate and refetch profile data
      await mutate("/api/user/profile");
      await mutate("/api/user");

      return result.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile: update,
    isLoading,
    error,
  };
}

export function useUpdateAppearanceSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Since appearance is managed by the design system, this is a no-op
  // Kept for compatibility with existing components
  const update = async (data: UpdateAppearanceSettings) => {
    setIsLoading(true);
    setError(null);

    try {
      // No actual settings to update - design system handles all appearance
      await new Promise((resolve) => setTimeout(resolve, 100)); // Brief delay for UX

      return null;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateAppearanceSettings: update,
    isLoading,
    error,
  };
}

export function useUpdateNotificationSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (data: UpdateNotificationSettings) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await updateNotificationSettings(data);

      if ("error" in result) {
        throw new Error(result.error);
      }

      // Invalidate and refetch notification settings
      await mutate("/api/user/notifications");
      await mutate("/api/user");

      return result.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateNotificationSettings: update,
    isLoading,
    error,
  };
}

export function useUpdateAISettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (data: UpdateAISettings) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await updateAISettings(data);

      if ("error" in result) {
        throw new Error(result.error);
      }

      // Invalidate and refetch AI settings
      await mutate("/api/user/ai-settings");
      await mutate("/api/user");

      return result.data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateAISettings: update,
    isLoading,
    error,
  };
}
