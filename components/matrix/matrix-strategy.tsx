'use client'

import { ShieldAlert, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { evaluateAccount, type MatrixAccount, type MatrixSettings } from '@/lib/matrix-data'
import { updateSettings } from '@/lib/matrix-store'
import { cn } from '@/lib/utils'

function Switch({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-5 w-9 shrink-0 rounded-full transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
        checked ? 'bg-primary' : 'bg-muted',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 size-4 rounded-full bg-background transition-transform',
          checked && 'translate-x-4',
        )}
      />
    </button>
  )
}

function Slider({
  label,
  value,
  onChange,
  disabled,
  min = 0,
  max = 100,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  disabled?: boolean
  min?: number
  max?: number
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="h-1.5 flex-1 cursor-pointer accent-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
      />
      <span className="w-10 text-right font-mono text-sm font-semibold">{value}</span>
    </div>
  )
}

export function MatrixStrategy({
  accounts,
  settings,
  canEdit,
}: {
  accounts: MatrixAccount[]
  settings: MatrixSettings
  canEdit: boolean
}) {
  const evals = accounts.map((a) => ({ a, e: evaluateAccount(a, settings) }))
  const avoided = evals.filter((x) => x.e.dispatch === '已规避')
  const core = evals.filter((x) => x.e.dispatch === '核心优选')
  const eligible = evals.filter((x) => x.e.dispatch === '可分发' || x.e.dispatch === '核心优选')

  return (
    <Card>
      <CardHeader>
        <CardTitle>智能分发策略</CardTitle>
        <CardDescription>
          按账号健康度自动筛选分发对象，低权重、高风险账号不再接收任务，核心内容优先流向高收录率账号
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4">
            <div className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-destructive/12 text-destructive">
                <ShieldAlert className="size-4" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold">自动规避低权重、高风险账号</p>
                <p className="text-[11px] text-muted-foreground">
                  高风险（重度违规 / 健康度过低）或权重低于阈值的账号不参与分发
                </p>
              </div>
              <Switch
                checked={settings.autoAvoid}
                onChange={(v) => updateSettings({ autoAvoid: v })}
                disabled={!canEdit}
                label="自动规避低权重高风险账号"
              />
            </div>
            <div>
              <p className="mb-1.5 text-xs text-muted-foreground">最低账号权重</p>
              <Slider
                label="最低账号权重"
                value={settings.minWeight}
                onChange={(v) => updateSettings({ minWeight: v })}
                disabled={!canEdit || !settings.autoAvoid}
              />
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-muted-foreground">当前已规避</span>
              <span className="font-mono font-semibold text-destructive">{avoided.length}</span>
              <span className="text-muted-foreground">个：</span>
              {avoided.length === 0 && <span className="text-muted-foreground">无</span>}
              {avoided.map(({ a }) => (
                <Badge key={a.id} variant="danger">
                  {a.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-border bg-background p-4">
            <div className="flex items-start gap-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <Star className="size-4" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold">核心内容优先高收录率账号</p>
                <p className="text-[11px] text-muted-foreground">
                  标记为核心的内容，只分发给收录率达标且低风险的账号
                </p>
              </div>
              <Switch
                checked={settings.corePriority}
                onChange={(v) => updateSettings({ corePriority: v })}
                disabled={!canEdit}
                label="核心内容优先高收录率账号"
              />
            </div>
            <div>
              <p className="mb-1.5 text-xs text-muted-foreground">核心优选收录率门槛（%）</p>
              <Slider
                label="核心优选收录率门槛"
                value={settings.coreIndexRate}
                onChange={(v) => updateSettings({ coreIndexRate: v })}
                disabled={!canEdit || !settings.corePriority}
              />
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-muted-foreground">核心优选</span>
              <span className="font-mono font-semibold text-accent">{core.length}</span>
              <span className="text-muted-foreground">个 · 可分发共</span>
              <span className="font-mono font-semibold">{eligible.length}</span>
              <span className="text-muted-foreground">个</span>
            </div>
          </div>
        </div>
        {!canEdit && (
          <p className="mt-3 text-xs text-muted-foreground">仅管理员可调整分发策略，当前身份为只读。</p>
        )}
      </CardContent>
    </Card>
  )
}
