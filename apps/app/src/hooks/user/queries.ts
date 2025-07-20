import type {
  Profile,
  AppearanceSettings,
  NotificationSettings,
  AISettings,
} from "@repo/api";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch");
  }

  // Extract data from the response envelope
  return json.data || json;
};

export function useProfile(initialData?: Profile) {
  const { data, error, mutate } = useSWR<Profile>(
    "/api/user/profile",
    fetcher,
    {
      // Use initialData instead of fallbackData for RSC hydration
      ...(initialData && { initialData }),
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      revalidateIfStale: true,
      dedupingInterval: 5000, // 5 seconds
      focusThrottleInterval: 60000, // 1 minute
    },
  );

  return {
    profile: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useAppearanceSettings(initialData?: AppearanceSettings) {
  const { data, error, mutate } = useSWR<AppearanceSettings>(
    "/api/user/appearance",
    fetcher,
    {
      // Use initialData instead of fallbackData for RSC hydration
      ...(initialData && { initialData }),
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      revalidateIfStale: true,
      dedupingInterval: 5000, // 5 seconds
      focusThrottleInterval: 60000, // 1 minute
    },
  );

  return {
    settings: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useNotificationSettings(initialData?: NotificationSettings) {
  const { data, error, mutate } = useSWR<NotificationSettings>(
    "/api/user/notifications",
    fetcher,
    {
      // Use initialData instead of fallbackData for RSC hydration
      ...(initialData && { initialData }),
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      revalidateIfStale: true,
      dedupingInterval: 5000, // 5 seconds
      focusThrottleInterval: 60000, // 1 minute
    },
  );

  return {
    settings: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}

export function useAISettings(initialData?: AISettings) {
  const { data, error, mutate } = useSWR<AISettings>(
    "/api/user/ai-settings",
    fetcher,
    {
      // Use initialData instead of fallbackData for RSC hydration
      ...(initialData && { initialData }),
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      revalidateIfStale: true,
      dedupingInterval: 5000, // 5 seconds
      focusThrottleInterval: 60000, // 1 minute
    },
  );

  return {
    settings: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
