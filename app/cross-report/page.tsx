import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { PageHero } from '@/components/geo/page-hero'
import { PeriodFilter } from '@/components/geo/segmented'
import { PlatformRadar } from '@/components/cross/platform-radar'
import { DimensionHeatmap } from '@/components/cross/dimension-heatmap'
import { DescriptionDiff } from '@/components/cross/description-diff'
import { platforms } from '@/lib/geo-data'
import { weakPoints } from '@/lib/cross-data'
import { GitCompareArrows, Download, AlertTriangle, Library, Sparkles, Share2 } from 'lucide-react'

const levelVariant = { 高: 'danger', 中: 'warning', 低: 'muted' } as const

const best = (key: 'mention' | 'first' | 'top3' | 'sov') => Math.max(...platforms.map((p) => p[key]))
const worst = (key: 'mention' | 'first' | 'top3' | 'sov') => Math.min(...platforms.map((p) => p[key]))

export default function CrossReportPage() {
  const cols = [
    { key: 'mention', label: '提及率' },
    { key: 'first', label: '首推率' },
    { key: 'top3', label: 'TOP3' },
    { key: 'sov', label: 'SOV' },
  ] as const

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHero
        module="多平台交叉报告"
        icon={GitCompareArrows}
        title="横向对比各 AI 平台对品牌的描述差异"
        desc="基于同一套探针词库与统一口径，对比 6 个主流大模型对星河汽车的推荐优先级与描述准确度，定位薄弱平台与薄弱维度。"
      >
        <PeriodFilter />
        <Button variant="outline" size="lg">
          <Download />
          导出交叉报告
        </Button>
      </PageHero>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">核心指标横向对比</h3>
          <span className="text-xs text-muted-foreground">高亮为该指标最高 / 最低平台</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{p.name}</p>
                  <Badge variant="muted">{p.samples.toLocaleString()} 次采样</Badge>
                </div>
                <dl className="mt-4 grid grid-cols-4 gap-2">
                  {cols.map((c) => {
                    const v = p[c.key]
                    const isBest = v === best(c.key)
                    const isWorst = v === worst(c.key)
                    return (
                      <div key={c.key}>
                        <dt className="text-[11px] text-muted-foreground">{c.label}</dt>
                        <dd
                          className={`mt-1 font-mono text-base font-bold ${
                            isBest ? 'text-emerald-400' : isWorst ? 'text-destructive' : ''
                          }`}
                        >
                          {v}
                          <span className="text-[10px] font-medium text-muted-foreground">%</span>
                        </dd>
                      </div>
                    )
                  })}
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>平台能力雷达</CardTitle>
            <CardDescription>点选平台叠加对比，6 个维度 0–100 归一得分</CardDescription>
          </CardHeader>
          <CardContent>
            <PlatformRadar />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>维度 × 平台热力矩阵</CardTitle>
            <CardDescription>极差 ≥ 35 的维度说明各平台口径分歧较大，应优先纠偏</CardDescription>
          </CardHeader>
          <CardContent>
            <DimensionHeatmap />
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>描述差异对照</CardTitle>
          <CardDescription>以品牌知识库的官方口径为基准，逐平台判定“一致 / 偏差 / 幻觉 / 缺失”</CardDescription>
        </CardHeader>
        <CardContent>
          <DescriptionDiff />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-400" />
              薄弱点与建议动作
            </CardTitle>
            <CardDescription className="mt-1">按影响程度排序，可一键进入对应模块处理</CardDescription>
          </div>
          <Badge variant="warning">{weakPoints.length} 项待处理</Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          {weakPoints.map((w) => (
            <div
              key={w.title + w.platform}
              className="flex flex-col gap-3 rounded-lg border border-border p-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={levelVariant[w.level as keyof typeof levelVariant]}>{w.level}优先级</Badge>
                  <Badge variant="outline">{w.platform}</Badge>
                  <p className="text-sm font-semibold">{w.title}</p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.evidence}</p>
                <p className="mt-1 text-xs text-muted-foreground/80">{w.impact}</p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Link href="/knowledge" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                  <Library />
                  补充知识库
                </Link>
                <Link href="/text" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                  <Sparkles />
                  生成纠偏内容
                </Link>
                <Link href="/ugc" className={buttonVariants({ size: 'sm' })}>
                  <Share2 />
                  分发信源
                </Link>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
