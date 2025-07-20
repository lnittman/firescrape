'use client'

import { useOffline } from '@/hooks/use-offline'
import { cn } from '@repo/design/lib/utils'
import { WifiSlash } from "@phosphor-icons/react"

export function OfflineIndicator() {
  const isOffline = useOffline()

  if (!isOffline) return null

  return (
    <div className={cn(
      'fixed bottom-4 left-4 z-50',
      'flex items-center gap-2 px-3 py-2',
      'bg-yellow-500/10 border border-yellow-500/20',
      'text-yellow-600 dark:text-yellow-400',
      'rounded-lg backdrop-blur-sm',
      'animate-in slide-in-from-bottom-2',
      'text-sm font-medium'
    )}>
      <WifiSlash className="h-4 w-4" weight="duotone" />
      <span>Offline mode</span>
    </div>
  )
}