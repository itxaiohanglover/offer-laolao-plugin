import * as React from "react"

import { cn } from "~lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "plasmo-flex plasmo-h-10 plasmo-w-full plasmo-rounded-md plasmo-border plasmo-border-input plasmo-bg-background plasmo-px-3 plasmo-py-2 plasmo-text-sm plasmo-ring-offset-background file:plasmo-border-0 file:plasmo-bg-transparent file:plasmo-text-sm file:plasmo-font-medium placeholder:plasmo-text-muted-foreground focus-visible:plasmo-outline-none focus-visible:plasmo-ring-2 focus-visible:plasmo-ring-ring focus-visible:plasmo-ring-offset-2 disabled:plasmo-cursor-not-allowed disabled:plasmo-opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

