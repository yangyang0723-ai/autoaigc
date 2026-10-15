import { Archive, BrainCircuit, Check, Library, Loader2, Repeat } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export const defaultSteps = [
  { icon: Library, label: '构建探针 Prompt', desc: '按标准词库口径生成探针问题' },
  { icon: Repeat, label: '多平台批量采样', desc: '模拟真实用户，同题多次采样' },
  { icon: BrainCircuit, label: 'NLP 语义解析', desc: '识别推荐品牌、顺位与情感' },
  { icon: Archive, label: '生成报告并留存快照', desc: '汇总指标，留存原始回答' },
]

export function EvalProgress({
  progress,
  samplesTotal,
  title = '正在评估，请稍候…',
  steps = defaultSteps,
}: {
  progress: number
  samplesTotal: number
  title?: string
  steps?: typeof defaultSteps
}) {
  const current = Math.min(steps.length - 1, Math.floor(progress / 25))
  const done = Math.round((samplesTotal * progress) / 100)

  return (
    <Card>
      <CardContent className="p-6" role="status" aria-live="polite">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">{title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              已完成 <span className="font-mono text-foreground">{done}</span> / {samplesTotal} 次探针采样
            </p>
          </div>
          <span className="font-mono text-2xl font-bold text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => {
            const Icon = s.icon
            const state = i < current ? 'done' : i === current ? 'active' : 'todo'
            return (
              <li
                key={s.label}
                className={cn(
                  'flex items-start gap-3 rounded-xl border p-3.5 transition-colors',
                  state === 'active' ? 'border-primary/50 bg-primary/10' : 'border-border bg-background',
                  state === 'todo' && 'opacity-60',
                )}
              >
                <span
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-lg',
                    state === 'done' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-primary/12 text-primary',
                  )}
                >
                  {state === 'done' ? (
                    <Check className="size-4" />
                  ) : state === 'active' ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Icon className="size-4" />
                  )}
                </span>
                <span>
                  <span className="block text-sm font-medium">{s.label}</span>
                  <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">{s.desc}</span>
                </span>
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}
