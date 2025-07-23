'use client'

import { useState, useEffect } from 'react'
import { Button } from '@repo/design/components/ui/button'
import { Card } from '@repo/design/components/ui/card'
import { RefreshCw } from 'lucide-react'
import { cn } from '@repo/design/lib/utils'

export function ServiceWorkerUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const handleUpdateFound = (registration: ServiceWorkerRegistration) => {
      const newWorker = registration.installing
      if (!newWorker) return

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          setWaitingWorker(newWorker)
          setShowPrompt(true)
        }
      })
    }

    navigator.serviceWorker.ready.then(registration => {
      registration.addEventListener('updatefound', () => handleUpdateFound(registration))
      
      // Check if there's already a waiting worker
      if (registration.waiting) {
        setWaitingWorker(registration.waiting)
        setShowPrompt(true)
      }
    })

    // Listen for controller change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload()
    })
  }, [])

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' })
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
  }

  if (!showPrompt) return null

  return (
    <Card className={cn(
      'fixed bottom-4 right-4 z-50',
      'p-4 max-w-sm',
      'animate-in slide-in-from-bottom-2',
      'shadow-lg'
    )}>
      <div className="flex items-start gap-3">
        <RefreshCw className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-sm">Update Available</h3>
          <p className="text-sm text-muted-foreground mt-1">
            A new version of Firescrape is available. Refresh to update.
          </p>
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              onClick={handleUpdate}
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Update now
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
            >
              Later
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}