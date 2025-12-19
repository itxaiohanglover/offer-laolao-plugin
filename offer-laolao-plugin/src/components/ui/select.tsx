import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "~lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "plasmo-flex plasmo-h-10 plasmo-w-full plasmo-items-center plasmo-justify-between plasmo-rounded-md plasmo-border plasmo-border-input plasmo-bg-background plasmo-px-3 plasmo-py-2 plasmo-text-sm plasmo-ring-offset-background placeholder:plasmo-text-muted-foreground focus:plasmo-outline-none focus:plasmo-ring-2 focus:plasmo-ring-ring focus:plasmo-ring-offset-2 disabled:plasmo-cursor-not-allowed disabled:plasmo-opacity-50 [&>span]:plasmo-line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="plasmo-h-4 plasmo-w-4 plasmo-opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "plasmo-flex plasmo-cursor-default plasmo-items-center plasmo-justify-center plasmo-py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="plasmo-h-4 plasmo-w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "plasmo-flex plasmo-cursor-default plasmo-items-center plasmo-justify-center plasmo-py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="plasmo-h-4 plasmo-w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  // 不使用 Portal，避免在 Chrome 扩展 Popup 中焦点转移导致窗口关闭
  <SelectPrimitive.Content
    ref={ref}
    className={cn(
      "plasmo-relative plasmo-z-50 plasmo-max-h-96 plasmo-min-w-[8rem] plasmo-overflow-hidden plasmo-rounded-md plasmo-border plasmo-bg-popover plasmo-text-popover-foreground plasmo-shadow-md data-[state=open]:plasmo-animate-in data-[state=closed]:plasmo-animate-out data-[state=closed]:plasmo-fade-out-0 data-[state=open]:plasmo-fade-in-0 data-[state=closed]:plasmo-zoom-out-95 data-[state=open]:plasmo-zoom-in-95 data-[side=bottom]:plasmo-slide-in-from-top-2 data-[side=left]:plasmo-slide-in-from-right-2 data-[side=right]:plasmo-slide-in-from-left-2 data-[side=top]:plasmo-slide-in-from-bottom-2",
      position === "popper" &&
        "data-[side=bottom]:plasmo-translate-y-1 data-[side=left]:plasmo--translate-x-1 data-[side=right]:plasmo-translate-x-1 data-[side=top]:plasmo--translate-y-1",
      className
    )}
    position={position}
    {...props}
  >
    <SelectScrollUpButton />
    <SelectPrimitive.Viewport
      className={cn(
        "plasmo-p-1",
        position === "popper" &&
          "plasmo-h-[var(--radix-select-trigger-height)] plasmo-w-full plasmo-min-w-[var(--radix-select-trigger-width)]"
      )}
    >
      {children}
    </SelectPrimitive.Viewport>
    <SelectScrollDownButton />
  </SelectPrimitive.Content>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "plasmo-py-1.5 plasmo-pl-8 plasmo-pr-2 plasmo-text-sm plasmo-font-semibold",
      className
    )}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "plasmo-relative plasmo-flex plasmo-w-full plasmo-cursor-default plasmo-select-none plasmo-items-center plasmo-rounded-sm plasmo-py-1.5 plasmo-pl-8 plasmo-pr-2 plasmo-text-sm plasmo-outline-none focus:plasmo-bg-accent focus:plasmo-text-accent-foreground data-[disabled]:plasmo-pointer-events-none data-[disabled]:plasmo-opacity-50",
      className
    )}
    {...props}
  >
    <span className="plasmo-absolute plasmo-left-2 plasmo-flex plasmo-h-3.5 plasmo-w-3.5 plasmo-items-center plasmo-justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="plasmo-h-4 plasmo-w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("plasmo--mx-1 plasmo-my-1 plasmo-h-px plasmo-bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}

