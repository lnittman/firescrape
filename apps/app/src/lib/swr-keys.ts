/**
 * Centralized SWR cache keys to ensure consistency
 */
export const SWR_KEYS = {
  // List keys
  WEBS: '/api/webs',
  SPACES: '/api/spaces',
  
  // Detail keys
  web: (id: string) => `/api/webs/${id}`,
  space: (id: string) => `/api/spaces/${id}`,
  
  // Complex keys with params
  websBySpace: (spaceId: string) => `/api/spaces/${spaceId}/webs`,
  userSettings: (userId: string) => `/api/users/${userId}/settings`,
} as const;