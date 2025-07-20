import { useEffect, useState } from 'react'
import { atom, useAtom } from 'jotai'

// Global atom for offline state
export const isOfflineAtom = atom(false)

/**
 * Hook to track online/offline status
 * @returns {boolean} isOffline - true if the app is offline
 */
export function useOffline() {
  const [isOffline, setIsOffline] = useAtom(isOfflineAtom)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize state
    setIsOffline(!navigator.onLine)
    setIsInitialized(true)

    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setIsOffline])

  // Return false during SSR or initial render to avoid hydration issues
  return isInitialized ? isOffline : false
}

/**
 * Hook to check if a specific URL is cached
 * @param url - The URL to check
 * @returns {boolean} isCached - true if the URL is cached
 */
export function useIsCached(url?: string) {
  const [isCached, setIsCached] = useState(false)

  useEffect(() => {
    if (!url || !('caches' in window)) {
      setIsCached(false)
      return
    }

    const checkCache = async () => {
      try {
        const cacheNames = await caches.keys()
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName)
          const response = await cache.match(url)
          if (response) {
            setIsCached(true)
            return
          }
        }
        setIsCached(false)
      } catch {
        setIsCached(false)
      }
    }

    checkCache()
  }, [url])

  return isCached
}

/**
 * Hook to get cache statistics
 * @returns {object} Cache statistics including size and count
 */
export function useCacheStats() {
  const [stats, setStats] = useState({
    totalItems: 0,
    cacheNames: [] as string[],
    isLoading: true
  })

  useEffect(() => {
    if (!('caches' in window)) {
      setStats({ totalItems: 0, cacheNames: [], isLoading: false })
      return
    }

    const getCacheStats = async () => {
      try {
        const cacheNames = await caches.keys()
        const websCaches = cacheNames.filter(name => name.startsWith('webs-'))
        let totalItems = 0

        for (const cacheName of websCaches) {
          const cache = await caches.open(cacheName)
          const requests = await cache.keys()
          totalItems += requests.length
        }

        setStats({
          totalItems,
          cacheNames: websCaches,
          isLoading: false
        })
      } catch {
        setStats({ totalItems: 0, cacheNames: [], isLoading: false })
      }
    }

    getCacheStats()
  }, [])

  return stats
}