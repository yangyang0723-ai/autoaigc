'use client'

import { useState } from 'react'
import { CalendarClock, Download, FileText, Hash, Lightbulb, Radar, TriangleAlert } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Segmented } from '@/components/geo/segmented'
import { BrandCompare } from '@/components/cross/brand-compare'
import { PlatformCards } from '@/components/cross/platform-cards'
import { PlatformRadar } from '@/components/cross/platform-radar'
import { DimensionHeatmap } from '@/components/cross/dimension-heatmap'
import { DescriptionDiff } from '@/components/cross/description-diff'
import { WeakPoints } from '@/components/cross/weak-points'
import { seriesColors } from '@/lib/chart-style'
import type { CrossReport } from '@/lib/cross-eval'

export function CrossReportView({ report }: { report: CrossReport }) {
  const [focusId, setFocusId] = useState(report.brands[0].id)
  const focus = report.brands.find((b) => b.id === focusId) ?? report.brands[0]
  const multi = report.brands.length > 1

  return (
    <div className="flex flex-col gap-6">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="accent">
                <FileText className="size-3" />
                多平台交叉报告
              </Badge>
              <Badge variant={report.hallucinations ? 'warning' : 'success'}>
                {report.hallucinations ? `${report.hallucinations} 处幻觉描述` : '无幻觉描述'}
              </Badge>
            </div>
            <h3 className="mt-2.5 text-balance text-xl font-bold">{report.name}</h3>
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
                {report.brands.length} 个品牌 × {report.keywords.length} 个关键词 × {report.platforms.length} 个平台 ·{' '}
                {report.samplesTotal.toLocaleString()} 次采样
              </span>
            </div>
            <dl className="mt-4 grid gap-2.5 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <dt className="w-12 shrink-0 text-muted-foreground">品牌</dt>
                {report.brands.map((b, i) => (
                  <dd
                    key={b.id}
                    className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-[11px] font-medium"
                  >
                    <span className="size-2 rounded-full" style={{ background: seriesColors[i % seriesColors.length] }} />
                    {b.name}
                  </dd>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <dt className="w-12 shrink-0 text-muted-foreground">关键词</dt>
                {report.keywords.map((k) => (
                  <dd key={k} className="rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                    {k}
                  </dd>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <dt className="w-12 shrink-0 text-muted-foreground">平台</dt>
                {report.platforms.map((p) => (
                  <dd key={p.id} className="rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground">
                    {p.name}
                  </dd>
                ))}
              </div>
            </dl>
          </div>
          <Button variant="outline" size="lg" className="shrink-0">
            <Download />
            导出交叉报告
          </Button>
        </div>
      </section>

      <section aria-label="关键结论" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {report.insights.map((it) => {
          const Icon = it.tone === 'good' ? Lightbulb : TriangleAlert
          return (
            <Card key={it.title}>
              <CardContent className="flex gap-3 p-5">
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                    it.tone === 'good' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                  }`}
                >
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{it.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{it.desc}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>{multi ? '品牌 × 平台 横向对比' : '平台横向对比'}</CardTitle>
          <CardDescription>
            {multi
              ? '同一套探针与统一口径下，对比各品牌在所选平台的综合表现；SOV 为所选品牌与其他品牌间的声量份额'
              : '同一套探针与统一口径下，对比品牌在所选平台的综合表现'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BrandCompare report={report} />
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <div>
          <h3 className="text-sm font-semibold">品牌聚焦 · {focus.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {multi ? '切换品牌，查看其分平台指标、描述质量与待处理问题' : '该品牌在各平台的指标、描述质量与待处理问题'}
          </p>
        </div>
        {multi && (
          <Segmented
            value={focus.id}
            onChange={setFocusId}
            aria-label="聚焦品牌"
            options={report.brands.map((b) => ({ value: b.id, label: b.name }))}
          />
        )}
      </div>

      <section aria-label="分平台核心指标">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">核心指标横向对比</h3>
          <span className="text-xs text-muted-foreground">高亮为该指标最高 / 最低平台</span>
        </div>
        <PlatformCards report={report} brand={focus} />
      </section>

      <section className="grid gap-5 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>平台能力雷达</CardTitle>
            <CardDescription>6 个维度 0–100 归一得分，点选叠加对比</CardDescription>
          </CardHeader>
          <CardContent>
            <PlatformRadar key={focus.id} report={report} brand={focus} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>热力矩阵</CardTitle>
            <CardDescription>极差 ≥ 35 说明各平台口径分歧较大，应优先纠偏</CardDescription>
          </CardHeader>
          <CardContent>
            <DimensionHeatmap report={report} brand={focus} />
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>描述差异对照</CardTitle>
          <CardDescription>以品牌知识库的官方口径为基准，逐平台判定“一致 / 偏差 / 幻觉 / 缺失”</CardDescription>
        </CardHeader>
        <CardContent>
          <DescriptionDiff key={focus.id} brand={focus} />
        </CardContent>
      </Card>

      <WeakPoints brand={focus} />
    </div>
  )
}
