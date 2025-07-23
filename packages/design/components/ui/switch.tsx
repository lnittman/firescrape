"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@repo/design/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 items-center rounded-sm border shadow-xs transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=unchecked]:bg-muted data-[state=unchecked]:border-border",
        "data-[state=checked]:bg-fire-orange/5 data-[state=checked]:border-fire-orange/30",
        "hover:border-foreground/20 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block h-3 w-3 rounded-[3px] ring-0 transition-all duration-200",
          "data-[state=unchecked]:bg-muted-foreground/40 data-[state=unchecked]:translate-x-1",
          "data-[state=checked]:bg-fire-orange/50 data-[state=checked]:translate-x-5 backdrop-blur-lg"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
