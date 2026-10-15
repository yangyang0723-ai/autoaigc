'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { BarChart3, BrainCircuit, Archive, Layers, Loader2, Play, Repeat, Wand2, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { KeywordInput } from '@/components/geo/keyword-input'
import { PlatformPicker } from '@/components/geo/platform-picker'
import { EvalProgress } from '@/components/geo/eval-progress'
import { FieldLabel, StepSection } from '@/components/geo/geo-workbench'
import { BrandMultiPicker } from '@/components/cross/brand-multi-picker'
import { CrossReportView } from '@/components/cross/cross-report-view'
import { useBrands } from '@/lib/brand-kb'
import { generateCrossReport, MAX_BRANDS, SAMPLES_PER_PROBE, type CrossReport } from '@/lib/cross-eval'
import { cn } from '@/lib/utils'

const progressSteps = [
  { icon: Layers, label: '构建品牌探针', desc: '按品牌 × 关键词生成统一口径的探针问题' },
  { icon: Repeat, label: '多平台批量采样', desc: '每个品牌在每个平台同题多次采样' },
  { icon: BrainCircuit, label: '品牌 × 平台交叉解析', desc: '识别顺位、情感，并与知识库口径比对' },
  { icon: Archive, label: '生成交叉报告', desc: '汇总对比矩阵、差异与薄弱点' },
]

const SEED_BRAND_IDS = ['xinghe', 'chenxi']
const SEED_KEYWORDS = ['30万以内纯电SUV推荐', '家用新能源车怎么选', '纯电车冬季续航哪款好']
const SEED_PLATFORMS = ['deepseek', 'doubao', 'qwen', 'wenxin', 'kimi', 'yuanbao']
const SEED_TIME = new Date(2026, 9, 15, 9, 30)

export function CrossWorkbench() {
  const profiles = useBrands()

  const [brandIds, setBrandIds] = useState<string[]>([])
  const [keywords, setKeywords] = useState<string[]>([])
  const [platformIds, setPlatformIds] = useState<string[]>([])

  const [reports, setReports] = useState<CrossReport[]>(() => {
    const seeds = profiles.filter((b) => SEED_BRAND_IDS.includes(b.id))
    return seeds.length
      ? [generateCrossReport({ brands: seeds, keywords: SEED_KEYWORDS, platformIds: SEED_PLATFORMS, now: SEED_TIME })]
      : []
  })
  const [activeId, setActiveId] = useState<string | null>(() => reports[0]?.id ?? null)

  const [status, setStatus] = useState<'idle' | 'running'>('idle')
  const [progress, setProgress] = useState(0)
  const timer = useRef<number | null>(null)
  const reportRef = useRef<HTMLDivElement>(null)
  const justCreated = useRef(false)

  const selectedBrands = useMemo(
    () => brandIds.flatMap((id) => profiles.filter((b) => b.id === id)),
    [brandIds, profiles],
  )
  const running = status === 'running'
  const isCross = selectedBrands.length >= 2 || platformIds.length >= 2
  const ready = selectedBrands.length > 0 && keywords.length > 0 && platformIds.length > 0
  const canRun = ready && isCross && !running
  const samplesTotal = selectedBrands.length * keywords.length * platformIds.length * SAMPLES_PER_PROBE
  const active = reports.find((r) => r.id === activeId) ?? null

  const missing = useMemo(() => {
    const list: string[] = []
    if (!selectedBrands.length) list.push('检测品牌')
    if (!keywords.length) list.push('检测关键词')
    if (!platformIds.length) list.push('检测平台')
    return list
  }, [selectedBrands.length, keywords.length, platformIds.length])

  useEffect(
    () => () => {
      if (timer.current) window.clearInterval(timer.current)
    },
    [],
  )

  useEffect(() => {
    if (status !== 'running' || progress < 100) return
    if (timer.current) window.clearInterval(timer.current)
    const created = generateCrossReport({ brands: selectedBrands, keywords, platformIds, now: new Date() })
    justCreated.current = true
    setReports((prev) => [created, ...prev])
    setActiveId(created.id)
    setStatus('idle')
  }, [progress, status, selectedBrands, keywords, platformIds])

  useEffect(() => {
    if (justCreated.current && status === 'idle') {
      justCreated.current = false
      reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [status, activeId])

  function run() {
    if (!canRun) return
    setProgress(0)
    setStatus('running')
    timer.current = window.setInterval(() => setProgress((p) => Math.min(100, p + 2.5)), 90)
  }

  function removeReport(id: string) {
    const next = reports.filter((r) => r.id !== id)
    setReports(next)
    if (activeId === id) setActiveId(next[0]?.id ?? null)
  }

  function fillExample() {
    const ids = profiles.slice(0, 2).map((b) => b.id)
    setBrandIds(ids)
    setKeywords(SEED_KEYWORDS)
    setPlatformIds(['deepseek', 'doubao', 'qwen', 'kimi'])
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="p-0">
          <fieldset disabled={running} className="m-0 min-w-0 divide-y divide-border border-0 p-0">
            <legend className="sr-only">创建交叉报告</legend>
            <StepSection
              index={1}
              title="选择检测品牌"
              desc={`从品牌知识库选择 1–${MAX_BRANDS} 个品牌；选择多个品牌时，将额外生成品牌间的横向对比`}
              done={selectedBrands.length > 0}
              action={
                <Button variant="ghost" size="sm" onClick={fillExample}>
                  <Wand2 />
                  填入示例
                </Button>
              }
            >
              <BrandMultiPicker brands={profiles} value={brandIds} onChange={setBrandIds} max={MAX_BRANDS} />
            </StepSection>

            <StepSection
              index={2}
              title="填写检测关键词"
              desc="可输入多个关键词，所有品牌将使用同一套关键词，保证对比口径一致"
              done={keywords.length > 0}
            >
              <FieldLabel required>检测关键词</FieldLabel>
              <KeywordInput keywords={keywords} onChange={setKeywords} />
            </StepSection>

            <StepSection
              index={3}
              title="选择检测平台"
              desc="可同时选择多个 AI 平台，每个品牌的每个关键词在每个平台上采样 5 次以抵消随机性"
              done={platformIds.length > 0}
            >
              <PlatformPicker value={platformIds} onChange={setPlatformIds} />
            </StepSection>
          </fieldset>

          <div className="flex flex-col gap-4 border-t border-border bg-background/40 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-muted-foreground" role="status">
              {ready ? (
                <>
                  <span className="font-mono text-foreground">{selectedBrands.length}</span> 个品牌 ×{' '}
                  <span className="font-mono text-foreground">{keywords.length}</span> 个关键词 ×{' '}
                  <span className="font-mono text-foreground">{platformIds.length}</span> 个平台 ×{' '}
                  <span className="font-mono text-foreground">{SAMPLES_PER_PROBE}</span> 次采样 ={' '}
                  <span className="font-mono text-foreground">{samplesTotal}</span> 次探针调用
                  {!isCross && <span className="ml-2 text-amber-400">交叉报告至少需要 2 个品牌或 2 个平台</span>}
                </>
              ) : (
                <>请先完成：{missing.join('、')}</>
              )}
            </div>
            <Button size="lg" onClick={run} disabled={!canRun} className={cn('h-10 px-5 text-sm', canRun && 'glow-primary')}>
              {running ? <Loader2 className="animate-spin" /> : <Play />}
              {running ? '生成中…' : '创建交叉报告'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div ref={reportRef} className="flex scroll-mt-20 flex-col gap-6">
        {running && (
          <EvalProgress
            progress={progress}
            samplesTotal={samplesTotal}
            title="正在创建交叉报告，请稍候…"
            steps={progressSteps}
          />
        )}

        {!running && reports.length > 0 && (
          <section aria-label="已创建的交叉报告">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">已创建的交叉报告</h3>
              <Badge variant="muted">{reports.length} 份</Badge>
            </div>
            <ul className="flex flex-wrap gap-2.5">
              {reports.map((r) => {
                const on = r.id === activeId
                return (
                  <li
                    key={r.id}
                    className={cn(
                      'flex items-stretch overflow-hidden rounded-xl border transition-colors',
                      on ? 'border-primary/50 bg-primary/10' : 'border-border bg-card hover:bg-muted/60',
                    )}
                  >
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => setActiveId(r.id)}
                      className="px-3.5 py-2.5 text-left"
                    >
                      <span className="block max-w-72 truncate text-sm font-medium">{r.name}</span>
                      <span className="mt-0.5 block text-[11px] text-muted-foreground">
                        {r.createdAt} · {r.brands.length} 品牌 · {r.keywords.length} 词 · {r.platforms.length} 平台
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label={`删除报告 ${r.name}`}
                      onClick={() => removeReport(r.id)}
                      className="flex w-8 items-center justify-center border-l border-border/60 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="size-3.5" />
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {!running && active && <CrossReportView key={active.id} report={active} />}

        {!running && !active && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <BarChart3 className="size-6" />
            </span>
            <p className="text-sm font-semibold">交叉报告将在这里生成</p>
            <p className="max-w-md text-pretty text-xs leading-relaxed text-muted-foreground">
              选择多个品牌、关键词与平台后点击“创建交叉报告”，将输出品牌 × 平台对比、能力雷达、热力矩阵、描述差异对照与薄弱点建议。
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
