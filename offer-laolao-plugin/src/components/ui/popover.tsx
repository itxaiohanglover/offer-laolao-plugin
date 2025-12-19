import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "~lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  // 不使用 Portal，避免在 Chrome 扩展 Popup 中焦点转移导致窗口关闭
  <PopoverPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "plasmo-z-50 plasmo-w-72 plasmo-rounded-md plasmo-border plasmo-bg-popover plasmo-p-4 plasmo-text-popover-foreground plasmo-shadow-md plasmo-outline-none data-[state=open]:plasmo-animate-in data-[state=closed]:plasmo-animate-out data-[state=closed]:plasmo-fade-out-0 data-[state=open]:plasmo-fade-in-0 data-[state=closed]:plasmo-zoom-out-95 data-[state=open]:plasmo-zoom-in-95 data-[side=bottom]:plasmo-slide-in-from-top-2 data-[side=left]:plasmo-slide-in-from-right-2 data-[side=right]:plasmo-slide-in-from-left-2 data-[side=top]:plasmo-slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
