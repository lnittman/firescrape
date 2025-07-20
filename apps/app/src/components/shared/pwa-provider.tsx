'use client'

import { useEffect, useState, useCallback } from 'react'
import { toast } from '@repo/design/components/ui/sonner'
import type { BeforeInstallPromptEvent } from '@/types/pwa'

export const PwaProvider = () => {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const [showReload, setShowReload] = useState(false)

  // Handle service worker registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Register service worker
      navigator.serviceWorker
        .register('/sw.js')
        .then(reg => {
          setRegistration(reg)
          if (process.env.NODE_ENV === 'development') {
            console.log('[PWA] Service Worker registered successfully')
          }

          // Check if there's a waiting worker (update available)
          if (reg.waiting) {
            setWaitingWorker(reg.waiting)
            setShowReload(true)
          }

          // Listen for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker is ready
                  setWaitingWorker(newWorker)
                  setShowReload(true)
                  toast.info('A new version is available!', {
                    action: {
                      label: 'Update',
                      onClick: () => reloadPage()
                    },
                    duration: Infinity
                  })
                }
              })
            }
          })
        })
        .catch(error => {
          if (process.env.NODE_ENV === 'development') {
            console.error('[PWA] Service Worker registration failed:', error)
          }
        })

      // Handle controller change (when service worker is updated)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload()
      })
    }
  }, [])

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false)
      toast.success('You\'re back online!')
    }

    const handleOffline = () => {
      setIsOffline(true)
      toast.error('You\'re offline. Some features may be limited.')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Update service worker
  const reloadPage = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' })
    }
  }, [waitingWorker])

  // Install prompt handling
  useEffect(() => {
    let deferredPrompt: BeforeInstallPromptEvent | null = null

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      deferredPrompt = e

      // Show install button or prompt
      const shouldShowPrompt = localStorage.getItem('pwa-install-dismissed') !== 'true'

      if (shouldShowPrompt) {
        setTimeout(() => {
          toast('Install Yuba app for a better experience', {
            action: {
              label: 'Install',
              onClick: async () => {
                if (deferredPrompt) {
                  deferredPrompt.prompt()
                  const { outcome } = await deferredPrompt.userChoice
                  if (outcome === 'accepted') {
                    if (process.env.NODE_ENV === 'development') {
                      console.log('[PWA] User accepted the install prompt')
                    }
                  }
                  deferredPrompt = null
                }
              }
            },
            cancel: {
              label: 'Not now',
              onClick: () => {
                localStorage.setItem('pwa-install-dismissed', 'true')
              }
            }
          })
        }, 30000) // Show after 30 seconds
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  // App installed handling
  useEffect(() => {
    const handleAppInstalled = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[PWA] App was installed')
      }
      toast.success('Yuba has been installed successfully!')
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  // Clean cache on version change
  useEffect(() => {
    const currentVersion = '1.0.0' // This should match the version in sw.js
    const storedVersion = localStorage.getItem('sw-version')

    if (storedVersion && storedVersion !== currentVersion) {
      // Version has changed, clear old caches
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CLEAN_CACHE' })
      }
    }

    localStorage.setItem('sw-version', currentVersion)
  }, [])

  return null
}
