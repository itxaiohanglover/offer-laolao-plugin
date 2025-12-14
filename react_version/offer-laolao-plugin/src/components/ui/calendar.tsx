import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { zhCN } from "date-fns/locale"

import { cn } from "~lib/utils"
import { buttonVariants } from "~components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={zhCN}
      showOutsideDays={showOutsideDays}
      className={cn("plasmo-p-3", className)}
      classNames={{
        months: "plasmo-flex plasmo-flex-col sm:plasmo-flex-row plasmo-space-y-4 sm:plasmo-space-x-4 sm:plasmo-space-y-0",
        month: "plasmo-space-y-4",
        caption: "plasmo-flex plasmo-justify-center plasmo-pt-1 plasmo-relative plasmo-items-center plasmo-gap-1",
        caption_label: "plasmo-text-sm plasmo-font-medium plasmo-hidden",
        caption_dropdowns: "plasmo-flex plasmo-gap-1",
        dropdown: "plasmo-appearance-none plasmo-bg-transparent plasmo-border plasmo-border-input plasmo-rounded-md plasmo-px-2 plasmo-py-1 plasmo-text-sm plasmo-cursor-pointer focus:plasmo-outline-none focus:plasmo-ring-1 focus:plasmo-ring-ring",
        dropdown_month: "",
        dropdown_year: "",
        vhidden: "plasmo-hidden",
        nav: "plasmo-space-x-1 plasmo-flex plasmo-items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "plasmo-h-7 plasmo-w-7 plasmo-bg-transparent plasmo-p-0 plasmo-opacity-50 hover:plasmo-opacity-100"
        ),
        nav_button_previous: "plasmo-absolute plasmo-left-1",
        nav_button_next: "plasmo-absolute plasmo-right-1",
        table: "plasmo-w-full plasmo-border-collapse plasmo-space-y-1",
        head_row: "plasmo-flex",
        head_cell:
          "plasmo-text-muted-foreground plasmo-rounded-md plasmo-w-9 plasmo-font-normal plasmo-text-[0.8rem]",
        row: "plasmo-flex plasmo-w-full plasmo-mt-2",
        cell: "plasmo-h-9 plasmo-w-9 plasmo-text-center plasmo-text-sm plasmo-p-0 plasmo-relative [&:has([aria-selected].day-range-end)]:plasmo-rounded-r-md [&:has([aria-selected].day-outside)]:plasmo-bg-accent/50 [&:has([aria-selected])]:plasmo-bg-accent first:[&:has([aria-selected])]:plasmo-rounded-l-md last:[&:has([aria-selected])]:plasmo-rounded-r-md focus-within:plasmo-relative focus-within:plasmo-z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "plasmo-h-9 plasmo-w-9 plasmo-p-0 plasmo-font-normal aria-selected:plasmo-opacity-100"
        ),
        day_range_end: "plasmo-day-range-end",
        day_selected:
          "plasmo-bg-primary plasmo-text-primary-foreground hover:plasmo-bg-primary hover:plasmo-text-primary-foreground focus:plasmo-bg-primary focus:plasmo-text-primary-foreground",
        day_today: "plasmo-bg-accent plasmo-text-accent-foreground",
        day_outside:
          "plasmo-day-outside plasmo-text-muted-foreground plasmo-opacity-50 aria-selected:plasmo-bg-accent/50 aria-selected:plasmo-text-muted-foreground aria-selected:plasmo-opacity-30",
        day_disabled: "plasmo-text-muted-foreground plasmo-opacity-50",
        day_range_middle:
          "aria-selected:plasmo-bg-accent aria-selected:plasmo-text-accent-foreground",
        day_hidden: "plasmo-invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="plasmo-h-4 plasmo-w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="plasmo-h-4 plasmo-w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
