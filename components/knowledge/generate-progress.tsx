import { Check, FileSearch, Loader2, Network, ShieldCheck, Waypoints } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const steps = [
  { icon: FileSearch, label: '解析资料与链接', desc: '读取文档、抓取网页并清洗文本' },
  { icon: Waypoints, label: '抽取实体与关系', desc: '识别产品、人群、卖点与竞品关系' },
  { icon: Network, label: '构建品牌知识图谱', desc: '统一口径并建立实体关联' },
  { icon: ShieldCheck, label: '生成 Schema 与创作约束', desc: '输出结构化数据与校验规则' },
]

export function GenerateProgress({ progress }: { progress: number }) {
  const current = Math.min(steps.length - 1, Math.floor(progress / 25))

  return (
    <Card>
      <CardContent className="p-6" role="status" aria-live="polite">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">正在生成品牌结构化知识…</p>
            <p className="mt-1 text-xs text-muted-foreground">{steps[current].desc}</p>
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
