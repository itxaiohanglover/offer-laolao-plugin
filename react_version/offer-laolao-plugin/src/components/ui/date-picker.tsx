import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "~lib/utils"
import { Button } from "~components/ui/button"
import { Calendar } from "~components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~components/ui/popover"

// 原生日期格式化，避免 date-fns 兼容性问题
function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDate(dateStr: string): Date | undefined {
  if (!dateStr) return undefined
  const [year, month, day] = dateStr.split('-').map(Number)
  if (!year || !month || !day) return undefined
  return new Date(year, month - 1, day)
}

interface DatePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  id?: string
  className?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = "选择日期",
  id,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  // 将字符串转换为 Date 对象
  const dateValue = React.useMemo(() => {
    return parseDate(value || "")
  }, [value])

  // 处理日期选择
  const handleSelect = (day: Date | undefined) => {
    if (day) {
      const formatted = formatDate(day)
      onChange?.(formatted)
    } else {
      onChange?.("")
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            "plasmo-w-full plasmo-justify-start plasmo-text-left plasmo-font-normal",
            !value && "plasmo-text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="plasmo-mr-2 plasmo-h-4 plasmo-w-4" />
          {dateValue ? formatDate(dateValue) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="plasmo-w-auto plasmo-p-0 plasmo-max-h-[320px] plasmo-overflow-auto" align="start">
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={handleSelect}
          captionLayout="dropdown-buttons"
          fromYear={1950}
          toYear={2050}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
