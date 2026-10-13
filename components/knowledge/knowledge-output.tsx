import Link from 'next/link'
import {
  Building2,
  Boxes,
  Users,
  Sparkles,
  Swords,
  FileSearch,
  Radar,
  PenLine,
  ShieldAlert,
  ArrowRight,
  Lightbulb,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { KnowledgeGraph } from '@/components/knowledge/knowledge-graph'
import { CopyButton } from '@/components/knowledge/copy-button'
import type { Derived, FactGroupKey, FactSource } from '@/lib/brand-kb'

const groupIcon: Record<FactGroupKey, LucideIcon> = {
  brand: Building2,
  product: Boxes,
  user: Users,
  usp: Sparkles,
  rival: Swords,
  source: FileSearch,
}

const sourceVariant: Record<FactSource, 'muted' | 'default' | 'accent'> = {
  手动录入: 'muted',
  文档解析: 'default',
  链接抓取: 'accent',
}

function MiniStat({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="font-mono text-2xl font-bold tracking-tight">
        {value}
        {unit && <span className="ml-0.5 text-sm font-medium text-muted-foreground">{unit}</span>}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

export function KnowledgeOutput({ derived, brandName }: { derived: Derived; brandName: string }) {
  const missing = derived.checklist.filter((c) => !c.done)

  return (
    <div className="flex flex-col gap-5">
      <section aria-label="结构化知识概览" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MiniStat label="结构化知识条目" value={String(derived.entityCount)} />
        <MiniStat label="信息完整度" value={String(derived.completeness)} unit="%" />
        <MiniStat label="GEO 探针词" value={String(derived.probes.length)} />
        <MiniStat label="创作校验规则" value={String(derived.guardrails.length)} />
      </section>

      {missing.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-400" />
          <div className="text-sm">
            <p className="font-medium">补充以下信息可进一步提升结构化质量</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {missing.map((m) => `${m.label}（${m.hint}）`).join('；')}
            </p>
          </div>
        </div>
      )}

      <section className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>结构化知识条目</CardTitle>
            <CardDescription>统一口径后的品牌事实，标注来源，供 GEO 评估与内容创作调用</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {derived.groups.map((g) => {
              const Icon = groupIcon[g.key]
              return (
                <div key={g.key}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-md bg-primary/12 text-primary">
                      <Icon className="size-3.5" />
                    </span>
                    <p className="text-sm font-semibold">{g.label}</p>
                    <span className="font-mono text-xs text-muted-foreground">{g.facts.length}</span>
                  </div>
                  <dl className="rounded-xl border border-border bg-background">
                    {g.facts.map((f, i) => (
                      <div
                        key={`${f.label}-${i}`}
                        className="flex items-start gap-3 border-b border-border/50 px-3 py-2 text-sm last:border-b-0"
                      >
                        <dt className="w-24 shrink-0 truncate pt-0.5 text-xs text-muted-foreground" title={f.label}>
                          {f.label}
                        </dt>
                        <dd className="min-w-0 flex-1 text-sm leading-relaxed">{f.value}</dd>
                        <Badge variant={sourceVariant[f.source]} className="shrink-0">
                          {f.source}
                        </Badge>
                      </div>
                    ))}
                  </dl>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-5">
          <Card>
            <CardHeader>
              <CardTitle>品牌专属知识图谱</CardTitle>
              <CardDescription>实体与关系统一建模，便于大模型识别与采信</CardDescription>
            </CardHeader>
            <CardContent>
              <KnowledgeGraph graph={derived.graph} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row items-start justify-between gap-3">
              <div>
                <CardTitle>AI 友好的 Schema 输出</CardTitle>
                <CardDescription className="mt-1">标准化 JSON-LD，提升被大模型引用的概率</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="accent">Schema.org</Badge>
                <CopyButton text={derived.schema} />
              </div>
            </CardHeader>
            <CardContent>
              <pre
                tabIndex={0}
                aria-label="JSON-LD 内容"
                className="max-h-72 overflow-auto rounded-lg border border-border bg-background p-4 font-mono text-xs leading-relaxed text-muted-foreground"
              >
                <code>{derived.schema}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </section>

      <section aria-label="数据支撑与约束" className="grid gap-5 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
                <Radar className="size-4" />
              </span>
              <div>
                <CardTitle>支撑 GEO 评估</CardTitle>
                <CardDescription className="mt-0.5">自动生成探针词，并作为官方口径基准</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <ul className="flex flex-col gap-1.5">
              {derived.probes.map((p) => (
                <li
                  key={p.query}
                  className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  <Badge variant="muted">{p.type}</Badge>
                  <span className="min-w-0 flex-1 truncate">{p.query}</span>
                </li>
              ))}
            </ul>
            <Link href="/geo" className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-fit' })}>
              前往 GEO 评估
              <ArrowRight />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
                <PenLine className="size-4" />
              </span>
              <div>
                <CardTitle>支撑 AI 内容生成</CardTitle>
                <CardDescription className="mt-0.5">创作时自动注入的品牌口径</CardDescription>
              </div>
            </div>
            <CopyButton text={derived.contextBlock} />
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <pre
              tabIndex={0}
              aria-label="内容创作调用的品牌口径"
              className="max-h-72 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-background p-3 font-mono text-xs leading-relaxed text-muted-foreground"
            >
              {derived.contextBlock}
            </pre>
            <Link href="/content" className={buttonVariants({ variant: 'outline', size: 'sm', className: 'w-fit' })}>
              前往 AI 内容创作
              <ArrowRight />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
                <ShieldAlert className="size-4" />
              </span>
              <div>
                <CardTitle>约束创作准确性</CardTitle>
                <CardDescription className="mt-0.5">命中即拦截并自动修正</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-1.5">
              {derived.guardrails.map((g) => (
                <li key={g.claim} className="rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={g.kind === '参数冲突' ? 'warning' : 'danger'}>{g.kind}</Badge>
                    <span className="text-xs text-muted-foreground">{g.field}</span>
                  </div>
                  <p className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="rounded bg-destructive/15 px-1.5 py-0.5 font-mono text-destructive line-through">
                      {g.claim}
                    </span>
                    <ArrowRight className="size-3 text-muted-foreground" />
                    <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-emerald-400">{g.fix}</span>
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              以上规则将在「{brandName}」的内容创作与 UGC 分发环节发布前自动校验。
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
