'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { BarChart3, Check, Loader2, Play, RotateCcw, Settings2, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { KeywordInput } from '@/components/geo/keyword-input'
import { BrandCombobox } from '@/components/geo/brand-combobox'
import { BrandManagerDialog } from '@/components/geo/brand-manager-dialog'
import { PlatformPicker } from '@/components/geo/platform-picker'
import { EvalProgress } from '@/components/geo/eval-progress'
import { EvalReportView } from '@/components/geo/eval-report'
import { initialBrands, type Brand } from '@/lib/brands'
import { generateReport, SAMPLES_PER_PROBE, type EvalReport } from '@/lib/geo-eval'
import { cn } from '@/lib/utils'

export function StepSection({
  index,
  title,
  desc,
  done,
  action,
  children,
}: {
  index: number
  title: string
  desc: string
  done: boolean
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="flex gap-4 p-6">
      <span
        aria-hidden
        className={cn(
          'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors',
          done ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400' : 'border-primary/40 bg-primary/12 text-primary',
        )}
      >
        {done ? <Check className="size-4" strokeWidth={3} /> : index}
      </span>
      <div className="min-w-0 flex-1">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">
              <span className="sr-only">步骤 {index}：</span>
              {title}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
          </div>
          {action}
        </div>
        {children}
      </div>
    </section>
  )
}

export function FieldLabel({ children, extra, required }: { children: React.ReactNode; extra?: React.ReactNode; required?: boolean }) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <span className="text-xs font-medium">
        {children}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </span>
      {extra}
    </div>
  )
}

export function GeoWorkbench() {
  const [brands, setBrands] = useState<Brand[]>(initialBrands)
  const [brandId, setBrandId] = useState<string | null>(null)
  const [keywords, setKeywords] = useState<string[]>([])
  const [platformIds, setPlatformIds] = useState<string[]>([])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogKey, setDialogKey] = useState(0)
  const [prefill, setPrefill] = useState('')

  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle')
  const [progress, setProgress] = useState(0)
  const [report, setReport] = useState<EvalReport | null>(null)

  const timer = useRef<number | null>(null)
  const reportRef = useRef<HTMLDivElement>(null)

  const brand = brands.find((b) => b.id === brandId) ?? null
  const running = status === 'running'
  const step1Done = keywords.length > 0 && !!brand
  const step2Done = platformIds.length > 0
  const canRun = step1Done && step2Done && !running
  const samplesTotal = keywords.length * platformIds.length * SAMPLES_PER_PROBE

  const missing = useMemo(() => {
    const list: string[] = []
    if (!keywords.length) list.push('检测关键词')
    if (!brand) list.push('目标品牌')
    if (!platformIds.length) list.push('检测平台')
    return list
  }, [keywords.length, brand, platformIds.length])

  useEffect(
    () => () => {
      if (timer.current) window.clearInterval(timer.current)
    },
    [],
  )

  useEffect(() => {
    if (status !== 'running' || progress < 100) return
    if (timer.current) window.clearInterval(timer.current)
    if (brand) {
      setReport(
        generateReport({
          brand,
          competitors: brands.filter((b) => b.id !== brand.id).map((b) => b.name),
          keywords,
          platformIds,
          now: new Date(),
        }),
      )
    }
    setStatus('done')
  }, [progress, status, brand, brands, keywords, platformIds])

  useEffect(() => {
    if (status === 'done') reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [status])

  function runEvaluation() {
    if (!canRun) return
    setReport(null)
    setProgress(0)
    setStatus('running')
    timer.current = window.setInterval(() => setProgress((p) => Math.min(100, p + 2.5)), 90)
  }

  function openManager(text = '') {
    setPrefill(text)
    setDialogKey((k) => k + 1)
    setDialogOpen(true)
  }

  function addBrand(input: Omit<Brand, 'id'>) {
    const id = `brand-${Date.now().toString(36)}`
    setBrands((prev) => [...prev, { ...input, id }])
    if (!brandId && input.kind === '自有品牌') setBrandId(id)
  }

  function removeBrand(id: string) {
    setBrands((prev) => prev.filter((b) => b.id !== id))
    if (brandId === id) setBrandId(null)
  }

  function fillExample() {
    setKeywords(['30万以内纯电SUV推荐', '家用新能源车怎么选', '纯电车冬季续航哪款好'])
    setBrandId('xinghe')
    setPlatformIds(['deepseek', 'doubao', 'qwen', 'kimi'])
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="p-0">
          <fieldset disabled={running} className="m-0 min-w-0 divide-y divide-border border-0 p-0">
            <legend className="sr-only">GEO 品牌评估配置</legend>
            <StepSection
              index={1}
              title="填写关键词与品牌"
              desc="输入需要检测的关键词，并搜索选择目标品牌"
              done={step1Done}
              action={
                <Button variant="ghost" size="sm" onClick={fillExample}>
                  <Wand2 />
                  填入示例
                </Button>
              }
            >
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <FieldLabel required>检测关键词</FieldLabel>
                  <KeywordInput keywords={keywords} onChange={setKeywords} />
                </div>
                <div>
                  <FieldLabel
                    required
                    extra={
                      <Button variant="ghost" size="xs" onClick={() => openManager()}>
                        <Settings2 />
                        管理品牌
                      </Button>
                    }
                  >
                    目标品牌
                  </FieldLabel>
                  <BrandCombobox brands={brands} value={brandId} onChange={setBrandId} onManage={openManager} />
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    支持模糊搜索，品牌库中的其他品牌将作为竞品参与 SOV 计算
                  </p>
                </div>
              </div>
            </StepSection>

            <StepSection
              index={2}
              title="选择检测平台"
              desc="可同时选择多个 AI 平台，每个关键词在每个平台上采样 5 次以抵消随机性"
              done={step2Done}
            >
              <PlatformPicker value={platformIds} onChange={setPlatformIds} />
            </StepSection>
          </fieldset>

          <div className="flex flex-col gap-4 border-t border-border bg-background/40 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-muted-foreground" role="status">
              {canRun || running || status === 'done' ? (
                <>
                  <span className="font-mono text-foreground">{keywords.length}</span> 个关键词 ×{' '}
                  <span className="font-mono text-foreground">{platformIds.length}</span> 个平台 ×{' '}
                  <span className="font-mono text-foreground">{SAMPLES_PER_PROBE}</span> 次采样 ={' '}
                  <span className="font-mono text-foreground">{samplesTotal}</span> 次探针调用
                </>
              ) : (
                <>请先完成：{missing.join('、')}</>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              {status === 'done' && (
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    setReport(null)
                    setStatus('idle')
                  }}
                >
                  <RotateCcw />
                  清除报告
                </Button>
              )}
              <Button
                size="lg"
                onClick={runEvaluation}
                disabled={!canRun}
                className={cn('h-10 px-5 text-sm', canRun && 'glow-primary')}
              >
                {running ? <Loader2 className="animate-spin" /> : <Play />}
                {running ? '评估中…' : status === 'done' ? '重新评估' : '点击评估'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div ref={reportRef} className="scroll-mt-20">
        {running && <EvalProgress progress={progress} samplesTotal={samplesTotal} />}
        {!running && report && <EvalReportView report={report} />}
        {!running && !report && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <BarChart3 className="size-6" />
            </span>
            <p className="text-sm font-semibold">评估报告将在这里生成</p>
            <p className="max-w-md text-pretty text-xs leading-relaxed text-muted-foreground">
              完成上方两个步骤后点击“点击评估”，将输出 AI 提及率、首推率、TOP3 推荐率、SOV 声量份额、分平台表现、关键词热力图与优化建议。
            </p>
          </div>
        )}
      </div>

      <BrandManagerDialog
        key={dialogKey}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        brands={brands}
        selectedId={brandId}
        prefill={prefill}
        onAdd={addBrand}
        onRemove={removeBrand}
      />
    </div>
  )
}
