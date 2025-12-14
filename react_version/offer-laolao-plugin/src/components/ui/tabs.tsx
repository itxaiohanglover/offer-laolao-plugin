import * as React from "react"

import { cn } from "~lib/utils"

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

function useTabsContext() {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider")
  }
  return context
}

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn("plasmo-w-full", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      className={cn(
        "plasmo-inline-flex plasmo-h-10 plasmo-items-center plasmo-justify-center plasmo-rounded-md plasmo-bg-muted plasmo-p-1 plasmo-text-muted-foreground plasmo-w-full",
        className
      )}
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

function TabsTrigger({ value, children, className }: TabsTriggerProps) {
  const { value: selectedValue, onValueChange } = useTabsContext()
  const isSelected = selectedValue === value

  return (
    <button
      type="button"
      onClick={() => onValueChange(value)}
      className={cn(
        "plasmo-inline-flex plasmo-items-center plasmo-justify-center plasmo-whitespace-nowrap plasmo-rounded-sm plasmo-px-3 plasmo-py-1.5 plasmo-text-sm plasmo-font-medium plasmo-ring-offset-background plasmo-transition-all focus-visible:plasmo-outline-none focus-visible:plasmo-ring-2 focus-visible:plasmo-ring-ring focus-visible:plasmo-ring-offset-2 disabled:plasmo-pointer-events-none disabled:plasmo-opacity-50 plasmo-flex-1",
        isSelected
          ? "plasmo-bg-background plasmo-text-foreground plasmo-shadow-sm"
          : "plasmo-hover:plasmo-bg-background/50 plasmo-hover:plasmo-text-foreground",
        className
      )}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

function TabsContent({ value, children, className }: TabsContentProps) {
  const { value: selectedValue } = useTabsContext()

  if (selectedValue !== value) {
    return null
  }

  return (
    <div
      className={cn(
        "plasmo-mt-2 plasmo-ring-offset-background focus-visible:plasmo-outline-none focus-visible:plasmo-ring-2 focus-visible:plasmo-ring-ring focus-visible:plasmo-ring-offset-2",
        className
      )}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }

