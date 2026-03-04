import { CalendarDays, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DateRange {
  from: string  // ISO date string YYYY-MM-DD
  to: string
}

interface DateRangePickerProps {
  value: DateRange
  onChange: (value: DateRange) => void
  label?: string
  className?: string
}

export function DateRangePicker({ value, onChange, label = 'Période', className }: DateRangePickerProps) {
  const hasValue = value.from || value.to

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-1.5 text-sm">
        <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="text-xs text-muted-foreground whitespace-nowrap">{label}</span>
        <input
          type="date"
          value={value.from}
          max={value.to || undefined}
          onChange={(e) => onChange({ ...value, from: e.target.value })}
          className="w-32 bg-transparent outline-none text-sm"
        />
        <span className="text-muted-foreground">→</span>
        <input
          type="date"
          value={value.to}
          min={value.from || undefined}
          onChange={(e) => onChange({ ...value, to: e.target.value })}
          className="w-32 bg-transparent outline-none text-sm"
        />
        {hasValue && (
          <button
            type="button"
            onClick={() => onChange({ from: '', to: '' })}
            className="ml-auto text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
