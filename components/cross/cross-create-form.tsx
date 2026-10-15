'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Archive, BrainCircuit, Layers, Loader2, Repeat, Save, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { KeywordInput } from '@/components/geo/keyword-input'
import { PlatformPicker } from '@/components/geo/platform-picker'
import { EvalProgress } from '@/components/geo/eval-progress'
import { FieldLabel, StepSection } from '@/components/geo/geo-workbench'
import { BrandMultiPicker } from '@/components/cross/brand-multi-picker'
import { useBrands } from '@/lib/brand-kb'
import { generateCrossReport, MAX_BRANDS, SAMPLES_PER_PROBE } from '@/lib/cross-eval'
import { addCrossReport, SEED_KEYWORDS } from '@/lib/cross-store'
import { cn } from '@/lib/utils'

const progressSteps = [
  { icon: Layers, label: '构建品牌探针', desc: '按品牌 × 关键词生成统一口径的探针问题' },
  { icon: Repeat, label: '多平台批量采样', desc: '每个品牌在每个平台同题多次采样' },
  { icon: BrainCircuit, label: '品牌 × 平台交叉解析', desc: '识别顺位、情感，并与知识库口径比对' },
  { icon: Archive, label: '生成交叉报告', desc: '汇总对比矩阵、差异与薄弱点' },
]

export function CrossCreateForm() {
  const router = useRouter()
  const profiles = useBrands()

  const [brandIds, setBrandIds] = useState<string[]>([])
  const [keywords, setKeywords] = useState<string[]>([])
  const [platformIds, setPlatformIds] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'running'>('idle')
  const [progress, setProgress] = useState(0)
  const timer = useRef<number | null>(null)

  const selectedBrands = useMemo(
    () => brandIds.flatMap((id) => profiles.filter((b) => b.id === id)),
    [brandIds, profiles],
  )
  const running = status === 'running'
  const isCross = selectedBrands.length >= 2 || platformIds.length >= 2
  const ready = selectedBrands.length > 0 && keywords.length > 0 && platformIds.length > 0
  const canSave = ready && isCross && !running
  const samplesTotal = selectedBrands.length * keywords.length * platformIds.length * SAMPLES_PER_PROBE

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
    addCrossReport(generateCrossReport({ brands: selectedBrands, keywords, platformIds, now: new Date() }))
    router.push('/cross-report')
  }, [progress, status, selectedBrands, keywords, platformIds, router])

  function save() {
    if (!canSave) return
    setProgress(0)
    setStatus('running')
    timer.current = window.setInterval(() => setProgress((p) => Math.min(100, p + 2.5)), 90)
  }

  function cancel() {
    router.push('/cross-report')
  }

  function fillExample() {
    setBrandIds(profiles.slice(0, 2).map((b) => b.id))
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
            <div className="flex items-center gap-2">
              <Button variant="outline" size="lg" onClick={cancel} disabled={running} className="h-10 px-4 text-sm">
                取消
              </Button>
              <Button
                size="lg"
                onClick={save}
                disabled={!canSave}
                className={cn('h-10 px-5 text-sm', canSave && 'glow-primary')}
              >
                {running ? <Loader2 className="animate-spin" /> : <Save />}
                {running ? '生成中…' : '保存并生成报告'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {running && (
        <EvalProgress
          progress={progress}
          samplesTotal={samplesTotal}
          title="正在创建交叉报告，请稍候…"
          steps={progressSteps}
        />
      )}
    </div>
  )
}
