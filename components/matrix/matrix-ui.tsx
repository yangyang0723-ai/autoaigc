'use client'

import { useEffect, useId, useRef } from 'react'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { matrixPlatforms, type Dispatch, type Risk } from '@/lib/matrix-data'
import { cn } from '@/lib/utils'

export const fieldClass =
  'h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60'

export function PlatformMark({ platform, className }: { platform: string; className?: string }) {
  const mark = matrixPlatforms.find((p) => p.name === platform)?.mark ?? platform.slice(0, 1)
  return (
    <span
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-sm font-bold text-primary',
        className,
      )}
    >
      {mark}
    </span>
  )
}

export function scoreTone(score: number) {
  if (score >= 75) return { text: 'text-emerald-400', bar: 'bg-emerald-400' }
  if (score >= 55) return { text: 'text-amber-400', bar: 'bg-amber-400' }
  return { text: 'text-destructive', bar: 'bg-destructive' }
}

export function HealthMeter({ score }: { score: number }) {
  const tone = scoreTone(score)
  return (
    <div className="flex items-center gap-2" role="img" aria-label={`健康度 ${score} 分`}>
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <span className={cn('block h-full rounded-full', tone.bar)} style={{ width: `${score}%` }} />
      </span>
      <span className={cn('w-7 font-mono text-sm font-semibold', tone.text)}>{score}</span>
    </div>
  )
}

const riskVariant = { 低: 'success', 中: 'warning', 高: 'danger' } as const

export function RiskBadge({ risk }: { risk: Risk }) {
  return <Badge variant={riskVariant[risk]}>{risk}风险</Badge>
}

const dispatchVariant: Record<Dispatch, 'accent' | 'success' | 'danger' | 'warning' | 'muted'> = {
  核心优选: 'accent',
  可分发: 'success',
  已规避: 'danger',
  待授权: 'warning',
  已冻结: 'muted',
}

export function DispatchBadge({ dispatch }: { dispatch: Dispatch }) {
  return <Badge variant={dispatchVariant[dispatch]}>{dispatch}</Badge>
}

export function Modal({
  open,
  onClose,
  title,
  desc,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  desc?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      aria-labelledby={titleId}
      className="m-auto max-h-[90vh] w-[min(640px,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-start justify-between gap-4 border-b border-border p-5">
        <div>
          <h3 id={titleId} className="text-base font-semibold">
            {title}
          </h3>
          {desc && <p className="mt-1 text-xs text-muted-foreground">{desc}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>
      {open && children}
    </dialog>
  )
}
