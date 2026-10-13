import Link from 'next/link'
import {
  ArrowRight,
  CalendarClock,
  Crown,
  Download,
  Eye,
  FileText,
  Hash,
  Lightbulb,
  Medal,
  PieChart,
  Radar,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatCard } from '@/components/geo/stat-card'
import { GeoTrendChart } from '@/components/geo/geo-trend-chart'
import { SovPie } from '@/components/geo/sov-pie'
import { SnapshotViewer } from '@/components/geo/snapshot-viewer'
import { platforms as allPlatforms } from '@/lib/geo-data'
import type { EvalReport } from '@/lib/geo-eval'
import { cn } from '@/lib/utils'

const sign = (n: number) => (n >= 0 ? '+' : '')

export function EvalReportView({ report }: { report: EvalReport }) {
  const { overall, deltas } = report
  const cols = allPlatforms.filter((p) => report.platforms.some((r) => r.id === p.id))

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent">
                <FileText className="size-3" />
                GEO 评估报告
              </Badge>
              <Badge variant={report.grade.variant}>{report.grade.label}</Badge>
            </div>
            <h3 className="mt-2.5 text-balance text-xl font-bold">{report.brandName} · AI 搜索可见度评估</h3>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Hash className="size-3.5" />
                {report.id}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarClock className="size-3.5" />
                {report.createdAt}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Radar className="size-3.5" />
                {report.keywords.length} 个关键词 · {report.platforms.length} 个平台 · {report.samplesTotal} 次采样
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {report.keywords.map((k) => (
                <span key={k} className="rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                  {k}
                </span>
              ))}
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2.5">
            <Badge variant="muted">
              <ShieldCheck className="size-3" />
              原始快照已留存
            </Badge>
            <Button variant="outline" size="lg">
              <Download />
              导出报告
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="核心指标">
        <StatCard
          icon={Eye}
          label="AI 提及率"
          value={String(overall.mention)}
          unit="%"
          delta={`${sign(deltas.mention)}${deltas.mention}pp`}
          direction={deltas.mention >= 0 ? 'up' : 'down'}
          good={deltas.mention >= 0}
          hint="被提及次数 / 总采样次数"
        />
        <StatCard
          icon={Crown}
          label="首推率"
          value={String(overall.first)}
          unit="%"
          delta={`${sign(deltas.first)}${deltas.first}pp`}
          direction={deltas.first >= 0 ? 'up' : 'down'}
          good={deltas.first >= 0}
          hint="回答中顺位排第 1 的占比"
        />
        <StatCard
          icon={Medal}
          label="TOP3 推荐率"
          value={String(overall.top3)}
          unit="%"
          delta={`${sign(deltas.top3)}${deltas.top3}pp`}
          direction={deltas.top3 >= 0 ? 'up' : 'down'}
          good={deltas.top3 >= 0}
          hint="回答中顺位进入前 3 的占比"
        />
        <StatCard
          icon={PieChart}
          label="SOV 声量份额"
          value={String(overall.sov)}
          unit="%"
          delta={`${sign(deltas.sov)}${deltas.sov}pp`}
          direction={deltas.sov >= 0 ? 'up' : 'down'}
          good={deltas.sov >= 0}
          hint="本品推荐占全部品牌推荐的份额"
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>分平台表现</CardTitle>
              <CardDescription className="mt-1">各大模型对本品牌的推荐优先级与情感倾向</CardDescription>
            </div>
            <Badge variant="muted">{report.platforms.length} 个平台</Badge>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="py-2 pr-2 font-medium">AI 平台</th>
                  <th className="px-2 py-2 font-medium">提及率</th>
                  <th className="px-2 py-2 text-right font-medium">首推率</th>
                  <th className="px-2 py-2 text-right font-medium">TOP3</th>
                  <th className="px-2 py-2 text-right font-medium">SOV</th>
                  <th className="px-2 py-2 font-medium">情感（正/中/负）</th>
                  <th className="py-2 pl-2 text-right font-medium">较上次</th>
                </tr>
              </thead>
              <tbody>
                {report.platforms.map((p) => (
                  <tr key={p.id} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pr-2 font-medium">{p.name}</td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-14 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${p.mention}%` }} />
                        </div>
                        <span className="font-mono text-xs">{p.mention}%</span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-right font-mono">{p.first}%</td>
                    <td className="px-2 py-3 text-right font-mono">{p.top3}%</td>
                    <td className="px-2 py-3 text-right font-mono">{p.sov}%</td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-1.5 w-14 overflow-hidden rounded-full bg-muted">
                          <div className="bg-emerald-500" style={{ width: `${p.pos}%` }} />
                          <div className="bg-muted-foreground/50" style={{ width: `${p.neu}%` }} />
                          <div className="bg-destructive" style={{ width: `${p.neg}%` }} />
                        </div>
                        <span className="font-mono text-xs text-muted-foreground">
                          {p.pos}/{p.neu}/{p.neg}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pl-2 text-right">
                      <span
                        className={cn(
                          'inline-flex items-center gap-0.5 font-mono text-xs',
                          p.delta >= 0 ? 'text-emerald-400' : 'text-destructive',
                        )}
                      >
                        {p.delta >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                        {sign(p.delta)}
                        {p.delta}pp
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SOV 声量份额</CardTitle>
            <CardDescription>本品 vs 品牌库中的竞品 · 全平台加权</CardDescription>
          </CardHeader>
          <CardContent>
            <SovPie data={report.sovShares} />
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>关键词 × 平台 提及率</CardTitle>
          <CardDescription>颜色越深提及率越高，快速定位哪个提问场景在哪个平台缺位</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-separate border-spacing-1 text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="py-1.5 pr-3 text-left font-medium">关键词</th>
                {cols.map((p) => (
                  <th key={p.id} className="px-1 py-1.5 text-center font-medium">
                    {p.name}
                  </th>
                ))}
                <th className="px-1 py-1.5 text-center font-medium">综合</th>
              </tr>
            </thead>
            <tbody>
              {report.keywordRows.map((row) => (
                <tr key={row.keyword}>
                  <td className="max-w-56 truncate py-1 pr-3 font-medium">{row.keyword}</td>
                  {cols.map((p) => {
                    const v = row.cells[p.id]
                    return (
                      <td
                        key={p.id}
                        className="rounded-md px-1 py-2 text-center font-mono text-xs"
                        style={{ background: `color-mix(in oklab, var(--primary) ${Math.round(v * 0.75)}%, transparent)` }}
                      >
                        {v}%
                      </td>
                    )
                  })}
                  <td className="rounded-md border border-border px-1 py-2 text-center font-mono text-xs font-semibold">
                    {row.mention}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Lightbulb className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">评估结论与优化建议</h3>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {report.insights.map((item) => (
            <div key={item.title} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-lg',
                    item.tone === 'good' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400',
                  )}
                >
                  {item.tone === 'good' ? <TrendingUp className="size-[18px]" /> : <TriangleAlert className="size-[18px]" />}
                </span>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <Link
                href={item.action.href}
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'self-start')}
              >
                {item.action.label}
                <ArrowRight />
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>可见度趋势</CardTitle>
          <CardDescription>近 30 天 · 本次评估口径下的历史走势，对比竞品均值</CardDescription>
        </CardHeader>
        <CardContent>
          <GeoTrendChart
            brandName={report.brandName}
            finals={{ mention: overall.mention, first: overall.first, top3: overall.top3, sov: overall.sov }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI 回答快照</CardTitle>
          <CardDescription>NLP 解析结果与原始回答并排核验，支持回溯与问题定位</CardDescription>
        </CardHeader>
        <CardContent>
          <SnapshotViewer key={report.id} snapshots={report.snapshots} brandName={report.brandName} />
        </CardContent>
      </Card>
    </div>
  )
}
