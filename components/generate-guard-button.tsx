'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Sparkles,
  ShieldCheck,
  Gavel,
  AlertTriangle,
  BookOpen,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Database,
  X,
} from 'lucide-react'

type Severity = 'high' | 'medium' | 'low'
type Finding = {
  category: 'platform' | 'sensitive' | 'knowhow'
  rule: string
  matched: string
  severity: Severity
  advice: string
  source: string
}
type ValidateResult = {
  kbVersion: string
  score: number
  passed: boolean
  counts: { platform: number; sensitive: number; knowhow: number }
  findings: Finding[]
}

type Phase = 'idle' | 'connect' | 'platform' | 'sensitive' | 'knowhow' | 'result' | 'generating' | 'done'

const CATEGORY_META = {
  platform: { icon: Gavel, label: '平台规则验证', hint: '广告法 / 价格法 / 平台内容规范' },
  sensitive: { icon: AlertTriangle, label: '敏感词验证', hint: '虚假宣传 / 安全绝对化用语' },
  knowhow: { icon: BookOpen, label: '行业 know-how 规范', hint: '续航 / 智驾 / 能耗标注' },
} as const

const SEVERITY_BADGE: Record<Severity, { variant: 'danger' | 'warning' | 'muted'; label: string }> = {
  high: { variant: 'danger', label: '高风险' },
  medium: { variant: 'warning', label: '中风险' },
  low: { variant: 'muted', label: '低风险' },
}

// 校验阶段依次对应知识库的三个知识域
const STEP_ORDER: Array<'platform' | 'sensitive' | 'knowhow'> = ['platform', 'sensitive', 'knowhow']

export function GenerateGuardButton({
  content,
  label,
  generatingLabel = 'AI 正在生成…',
  className,
  onProceed,
}: {
  content: string
  label: string
  generatingLabel?: string
  className?: string
  onProceed?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<ValidateResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => setMounted(true), [])

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }, [])

  const close = useCallback(() => {
    clearTimers()
    setOpen(false)
    setPhase('idle')
    setResult(null)
    setError(null)
  }, [clearTimers])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close])

  useEffect(() => () => clearTimers(), [clearTimers])

  const run = useCallback(async () => {
    setOpen(true)
    setError(null)
    setResult(null)
    setPhase('connect')

    // 真实调用外部知识库校验接口，同时分阶段展示调用过程
    const fetchPromise = fetch('/api/knowledge/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('知识库服务返回异常')
        return (await res.json()) as ValidateResult
      })
      .catch(() => null)

    // 阶段动画：连接 → 平台规则 → 敏感词 → 行业规范
    timers.current.push(setTimeout(() => setPhase('platform'), 700))
    timers.current.push(setTimeout(() => setPhase('sensitive'), 1400))
    timers.current.push(setTimeout(() => setPhase('knowhow'), 2100))

    const [data] = await Promise.all([
      fetchPromise,
      new Promise((r) => timers.current.push(setTimeout(r, 2700))),
    ])

    if (!data) {
      setError('知识库校验失败，请稍后重试')
      setPhase('result')
      return
    }
    setResult(data)
    setPhase('result')
  }, [content])

  const proceed = useCallback(() => {
    setPhase('generating')
    timers.current.push(
      setTimeout(() => {
        setPhase('done')
        onProceed?.()
      }, 1600),
    )
  }, [onProceed])

  // 判断某阶段的状态：进行中 / 已完成 / 等待
  const stepState = (cat: 'platform' | 'sensitive' | 'knowhow') => {
    const order: Phase[] = ['connect', 'platform', 'sensitive', 'knowhow', 'result']
    const catIndex = order.indexOf(cat)
    const phaseIndex = order.indexOf(phase)
    if (phase === 'generating' || phase === 'done' || phase === 'result') return 'done'
    if (phaseIndex > catIndex) return 'done'
    if (phaseIndex === catIndex) return 'active'
    return 'wait'
  }

  return (
    <>
      <Button className={cn('h-11 gap-2', className)} onClick={run}>
        <Sparkles className="size-4" />
        {label}
      </Button>

      {mounted && open &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="guard-title"
            onClick={close}
          >
            <div
              className="flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-2xl sm:rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-border p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary glow-primary">
                  <ShieldCheck className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 id="guard-title" className="text-sm font-semibold">
                    生成即合规 · 知识库校验
                  </h2>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Database className="size-3" />
                    {result?.kbVersion ?? 'auto-kb v3.2'} · 外部知识库实时调用
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label="关闭"
                  className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                {/* Connect line */}
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-xs">
                  {phase === 'connect' ? (
                    <Loader2 className="size-3.5 animate-spin text-primary" />
                  ) : (
                    <CheckCircle2 className="size-3.5 text-chart-2" />
                  )}
                  <span className="text-muted-foreground">
                    {phase === 'connect' ? '正在连接外部知识库服务…' : '已连接知识库，开始逐项校验'}
                  </span>
                </div>

                {/* Validation steps */}
                <ul className="space-y-2.5">
                  {STEP_ORDER.map((cat) => {
                    const meta = CATEGORY_META[cat]
                    const Icon = meta.icon
                    const state = stepState(cat)
                    const count = result?.counts[cat] ?? 0
                    return (
                      <li
                        key={cat}
                        className={cn(
                          'flex items-center gap-3 rounded-lg border p-3 transition-colors',
                          state === 'active'
                            ? 'border-primary/40 bg-primary/5'
                            : 'border-border bg-background',
                        )}
                      >
                        <span
                          className={cn(
                            'grid size-9 shrink-0 place-items-center rounded-lg',
                            state === 'wait' ? 'bg-muted text-muted-foreground' : 'bg-primary/12 text-primary',
                          )}
                        >
                          <Icon className="size-4.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{meta.label}</p>
                          <p className="truncate text-[11px] text-muted-foreground">{meta.hint}</p>
                        </div>
                        <span className="shrink-0">
                          {state === 'wait' && <span className="text-[11px] text-muted-foreground">等待</span>}
                          {state === 'active' && <Loader2 className="size-4 animate-spin text-primary" />}
                          {state === 'done' &&
                            (count > 0 ? (
                              <Badge variant="warning" className="px-1.5 py-0 text-[11px]">
                                {count} 项待整改
                              </Badge>
                            ) : (
                              <Badge variant="success" className="gap-1 px-1.5 py-0 text-[11px]">
                                <CheckCircle2 className="size-3" />
                                通过
                              </Badge>
                            ))}
                        </span>
                      </li>
                    )
                  })}
                </ul>

                {/* Result summary */}
                {phase !== 'connect' && phase !== 'platform' && phase !== 'sensitive' && phase !== 'knowhow' && (
                  <div className="mt-4">
                    {error ? (
                      <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                        <AlertCircle className="size-4 shrink-0" />
                        {error}
                      </div>
                    ) : result ? (
                      <>
                        <div
                          className={cn(
                            'flex items-center gap-3 rounded-lg border p-3.5',
                            result.passed
                              ? 'border-chart-2/40 bg-chart-2/10'
                              : 'border-amber-500/40 bg-amber-500/10',
                          )}
                        >
                          {result.passed ? (
                            <CheckCircle2 className="size-6 shrink-0 text-chart-2" />
                          ) : (
                            <AlertTriangle className="size-6 shrink-0 text-amber-500" />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold">
                              {result.passed ? '合规校验通过' : `发现 ${result.findings.length} 项合规风险`}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {result.passed
                                ? '内容符合平台规则与行业规范，可安全生成'
                                : '建议整改后生成，或知悉风险继续'}
                            </p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p
                              className={cn(
                                'text-xl font-bold tabular-nums',
                                result.score >= 90 ? 'text-chart-2' : result.score >= 70 ? 'text-amber-500' : 'text-destructive',
                              )}
                            >
                              {result.score}
                            </p>
                            <p className="text-[10px] text-muted-foreground">合规评分</p>
                          </div>
                        </div>

                        {/* Top findings */}
                        {result.findings.length > 0 && phase === 'result' && (
                          <ul className="mt-3 space-y-2">
                            {result.findings.slice(0, 3).map((f, i) => {
                              const sev = SEVERITY_BADGE[f.severity]
                              return (
                                <li key={i} className="rounded-lg border border-border bg-secondary/30 p-2.5">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <Badge variant={sev.variant} className="px-1.5 py-0 text-[10px]">
                                      {sev.label}
                                    </Badge>
                                    <span className="text-xs font-medium">{f.rule}</span>
                                    <code className="rounded bg-destructive/10 px-1 text-[10px] text-destructive">
                                      {f.matched}
                                    </code>
                                  </div>
                                  <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{f.advice}</p>
                                </li>
                              )
                            })}
                            {result.findings.length > 3 && (
                              <li className="text-center text-[11px] text-muted-foreground">
                                另有 {result.findings.length - 3} 项，详见知识库
                              </li>
                            )}
                          </ul>
                        )}
                      </>
                    ) : null}

                    {phase === 'generating' && (
                      <div className="mt-3 flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/5 p-3 text-xs text-primary">
                        <Loader2 className="size-4 animate-spin" />
                        {generatingLabel}
                      </div>
                    )}
                    {phase === 'done' && (
                      <div className="mt-3 flex items-center gap-2 rounded-lg border border-chart-2/40 bg-chart-2/10 p-3 text-xs text-chart-2">
                        <CheckCircle2 className="size-4" />
                        已按合规要求完成生成
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer actions */}
              {phase === 'result' && !error && result && (
                <div className="flex items-center gap-2 border-t border-border p-4">
                  {result.passed ? (
                    <Button className="flex-1 gap-1.5" onClick={proceed}>
                      <Sparkles className="size-4" />
                      合规通过 · 开始生成
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" className="flex-1" onClick={close}>
                        去修改
                      </Button>
                      <Button className="flex-1" onClick={proceed}>
                        知悉风险 · 继续生成
                      </Button>
                    </>
                  )}
                </div>
              )}
              {phase === 'result' && error && (
                <div className="flex items-center gap-2 border-t border-border p-4">
                  <Button variant="outline" className="flex-1" onClick={close}>
                    关闭
                  </Button>
                  <Button className="flex-1" onClick={run}>
                    重试校验
                  </Button>
                </div>
              )}
              {phase === 'done' && (
                <div className="border-t border-border p-4">
                  <Button variant="outline" className="w-full" onClick={close}>
                    完成
                  </Button>
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
