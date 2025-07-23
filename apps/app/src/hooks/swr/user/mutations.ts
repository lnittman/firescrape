import { useState } from "react";
import { mutate } from "swr";
import type {
  UpdateProfile,
  UpdateAISettings,
} from "@/lib/api/schemas/profile";
import { updateProfile } from "@/actions/user/update-profile";
import { updateAISettings } from "@/actions/user/update-ai-settings";

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

      return data; // Return the input data as confirmation
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

      return data; // Return the input data as confirmation
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
