import type { LucideIcon } from 'lucide-react'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function StatCard({
  label,
  value,
  unit,
  delta,
  direction = 'up',
  good = true,
  icon: Icon,
  hint,
}: {
  label: string
  value: string
  unit?: string
  delta?: string
  direction?: 'up' | 'down'
  good?: boolean
  icon: LucideIcon
  hint?: string
}) {
  const TrendIcon = direction === 'up' ? TrendingUp : TrendingDown
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/12 text-primary">
            <Icon className="size-[18px]" />
          </span>
          {delta && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-xs font-medium',
                good ? 'text-emerald-400' : 'text-destructive',
              )}
            >
              <TrendIcon className="size-3" />
              {delta}
            </span>
          )}
        </div>
        <p className="mt-4 font-mono text-2xl font-bold tracking-tight">
          {value}
          {unit && <span className="ml-0.5 text-sm font-medium text-muted-foreground">{unit}</span>}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        {hint && <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground/80">{hint}</p>}
      </CardContent>
    </Card>
  )
}
