'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Sparkles,
  Presentation,
  ListTree,
  BarChart3,
  Download,
  FileDown,
  Play,
  LayoutTemplate,
  Loader2,
  CheckCircle2,
  ScanText,
  PenTool,
  Images,
} from 'lucide-react'

const scenes = ['新车发布会', '销售培训课件', '月度经营汇报', '投资人路演']
const templates = ['科技蓝', '豪华金', '活力橙', '商务灰']

const slides = [
  { title: '2026 星海 SUV 上市发布', sub: '重新定义智能出行', type: 'cover' },
  { title: '市场背景与机遇', sub: '新能源 SUV 渗透率', type: 'chart' },
  { title: '产品核心亮点', sub: '智能座舱 · 城市 NOA · 700km', type: 'points' },
  { title: '竞品对比分析', sub: '星海 vs 理想 vs 蔚来', type: 'table' },
  { title: '价格与金融政策', sub: '0 首付 3 年免息', type: 'points' },
  { title: '销量目标与预测', sub: '首年 8 万台', type: 'chart' },
]

const genSteps = [
  { icon: ScanText, label: '解析主题与受众', desc: '提炼汇报目标与核心信息' },
  { icon: ListTree, label: '智能编排大纲', desc: '生成 6 页逻辑结构' },
  { icon: LayoutTemplate, label: '套用专业模板', desc: '匹配汽车行业视觉风格' },
  { icon: BarChart3, label: '数据可视化生成', desc: '自动生成图表与对比表' },
  { icon: PenTool, label: '排版与备注生成', desc: '智能配图并撰写演讲备注' },
]

export default function PptPage() {
  const [scene, setScene] = useState(scenes[0])
  const [template, setTemplate] = useState(templates[0])
  const [current, setCurrent] = useState(0)
  const [status, setStatus] = useState<'idle' | 'generating' | 'done'>('idle')
  const [step, setStep] = useState(0)
  const [presenting, setPresenting] = useState(false)
  const [exporting, setExporting] = useState<null | 'PPTX' | 'PDF'>(null)
  const [exported, setExported] = useState<null | 'PPTX' | 'PDF'>(null)

  function generate() {
    setStatus('generating')
    setStep(0)
    let i = 0
    const timer = setInterval(() => {
      i += 1
      setStep(i)
      if (i >= genSteps.length) {
        clearInterval(timer)
        setTimeout(() => setStatus('done'), 600)
      }
    }, 780)
  }

  function handleExport(fmt: 'PPTX' | 'PDF') {
    if (exporting) return
    setExporting(fmt)
    setExported(null)
    setTimeout(() => {
      setExporting(null)
      setExported(fmt)
      setTimeout(() => setExported((cur) => (cur === fmt ? null : cur)), 2200)
    }, 1100)
  }

  return (
    <div className="mx-auto grid max-w-[1400px] gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
      {/* Left controls */}
      <div className="flex flex-col gap-4">
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="size-4 text-primary" />
            智能大纲生成（FR-PPT-001）
          </div>
          <textarea
            rows={3}
            defaultValue="主题：2026 星海 SUV 上市发布会；受众：媒体 + 经销商；目的：传递产品力与订单转化"
            className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm leading-relaxed outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
          <p className="mb-2 mt-4 text-xs font-semibold">应用场景</p>
          <div className="flex flex-wrap gap-2">
            {scenes.map((s) => (
              <Chip key={s} active={scene === s} onClick={() => setScene(s)}>
                {s}
              </Chip>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <LayoutTemplate className="size-4 text-primary" />
            汽车专业模板库（100+）
          </div>
          <div className="grid grid-cols-2 gap-2">
            {templates.map((t) => (
              <button
                key={t}
                onClick={() => setTemplate(t)}
                className={cn(
                  'rounded-lg border p-3 text-left text-xs transition-colors',
                  template === t
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/40',
                )}
              >
                <span className="mb-2 block h-8 rounded bg-gradient-to-br from-primary/40 to-accent/30" />
                {t}
              </button>
            ))}
          </div>
        </Card>

        <Button className="h-11 gap-2" onClick={generate} disabled={status === 'generating'}>
          {status === 'generating' ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              AI 正在生成 PPT…
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              {status === 'done' ? '重新一键生成 PPT' : 'AI 一键生成 PPT（≤ 2 分钟）'}
            </>
          )}
        </Button>
      </div>

      {/* Main slide preview */}
      <div className="flex flex-col gap-4">
        {status === 'generating' ? (
          <GenerationProcess step={step} scene={scene} template={template} />
        ) : (
        <>
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Presentation className="size-4 text-primary" />
              第 {current + 1} / {slides.length} 页 · {template}模板
            </div>
            <div className="flex gap-2">
              <Button
                variant={presenting ? 'default' : 'outline'}
                size="sm"
                className="h-8 gap-1.5 transition-colors active:scale-95"
                onClick={() => setPresenting((p) => !p)}
              >
                <Play className="size-3.5" />
                {presenting ? '退出演示' : '演示'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn('h-8 gap-1.5 transition-colors active:scale-95', exported === 'PPTX' && 'border-primary/50 text-primary')}
                onClick={() => handleExport('PPTX')}
                disabled={exporting === 'PPTX'}
              >
                {exporting === 'PPTX' ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : exported === 'PPTX' ? (
                  <CheckCircle2 className="size-3.5" />
                ) : (
                  <FileDown className="size-3.5" />
                )}
                {exported === 'PPTX' ? '已导出' : 'PPTX'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn('h-8 gap-1.5 transition-colors active:scale-95', exported === 'PDF' && 'border-primary/50 text-primary')}
                onClick={() => handleExport('PDF')}
                disabled={exporting === 'PDF'}
              >
                {exporting === 'PDF' ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : exported === 'PDF' ? (
                  <CheckCircle2 className="size-3.5" />
                ) : (
                  <Download className="size-3.5" />
                )}
                {exported === 'PDF' ? '已导出' : 'PDF'}
              </Button>
            </div>
          </div>

          {/* Slide canvas */}
          <div className="p-5">
            <div
              className={cn(
                'relative aspect-video overflow-hidden rounded-xl border bg-gradient-to-br from-card to-background grid-bg transition-shadow',
                presenting ? 'border-primary ring-2 ring-primary/40 shadow-lg' : 'border-border',
              )}
            >
              {presenting && (
                <Badge variant="accent" className="absolute right-3 top-3 z-10 gap-1">
                  <Play className="size-3 fill-current" />
                  演示中
                </Badge>
              )}
              <div className="absolute inset-0 flex flex-col justify-center gap-4 p-10">
                <Badge variant="accent" className="w-fit">
                  {scene}
                </Badge>
                <h2 className="text-3xl font-bold text-balance">{slides[current].title}</h2>
                <p className="text-lg text-muted-foreground">{slides[current].sub}</p>

                {slides[current].type === 'chart' && (
                  <div className="mt-2 flex h-32 items-end gap-3">
                    {[45, 62, 58, 78, 90, 72].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-gradient-to-t from-primary/40 to-primary"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                )}
                {slides[current].type === 'points' && (
                  <ul className="mt-2 space-y-2">
                    {['15.6" 3K 中控屏 + 高通 8295', '城市 NOA 智能驾驶', '综合续航 700km'].map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm">
                        <span className="size-1.5 rounded-full bg-primary" />
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
                {slides[current].type === 'cover' && (
                  <div className="absolute bottom-6 right-6 h-40 w-64 overflow-hidden rounded-lg">
                    <Image src="/cars/blue-suv-poster.png" alt="封面配图" fill className="object-cover" />
                  </div>
                )}
                {slides[current].type === 'table' && (
                  <div className="mt-2 grid grid-cols-4 gap-px overflow-hidden rounded-lg border border-border bg-border text-xs">
                    {['车型', '星海', '理想 L7', '蔚来'].map((c) => (
                      <div key={c} className="bg-primary/15 p-2 font-semibold text-primary">
                        {c}
                      </div>
                    ))}
                    {['续航', '700km', '210km', '150km'].map((c, i) => (
                      <div key={i} className="bg-card p-2">
                        {c}
                      </div>
                    ))}
                    {['智驾', '城市 NOA', '高速 NOA', '城市 NOA'].map((c, i) => (
                      <div key={i} className="bg-background p-2">
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-2 overflow-x-auto border-t border-border p-4">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  'flex aspect-video w-28 shrink-0 flex-col justify-center gap-1 rounded-lg border p-2 text-left transition-all',
                  current === i ? 'border-primary ring-2 ring-primary/40' : 'border-border bg-background',
                )}
              >
                <span className="text-[9px] text-muted-foreground">{i + 1}</span>
                <span className="line-clamp-2 text-[10px] font-medium leading-tight">{s.title}</span>
              </button>
            ))}
          </div>
        </Card>

        </>
        )}
      </div>
    </div>
  )
}

function GenerationProcess({
  step,
  scene,
  template,
}: {
  step: number
  scene: string
  template: string
}) {
  const progress = Math.round((Math.min(step, genSteps.length) / genSteps.length) * 100)
  return (
    <Card className="glow-primary overflow-hidden p-0">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
        <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-primary">
          <Sparkles className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">AI 正在生成 PPT</p>
          <p className="text-xs text-muted-foreground">
            {scene} · {template}模板 · 智能编排与排版中
          </p>
        </div>
        <Badge variant="accent" className="ml-auto shrink-0 gap-1">
          <Loader2 className="size-3 animate-spin" />
          {progress}%
        </Badge>
      </div>

      {/* Deck skeleton */}
      <div className="p-5">
        <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-background grid-bg">
          <div className="absolute inset-0 flex flex-col justify-center gap-4 p-10">
            <div className="h-5 w-20 animate-pulse rounded bg-primary/30" />
            <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="mt-2 flex h-24 items-end gap-3">
              {[45, 62, 58, 78, 90].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 animate-pulse rounded-t bg-gradient-to-t from-primary/30 to-primary/60"
                  style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          </div>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
            <Images className="size-3" />
            正在生成第 {Math.min(step + 1, genSteps.length)} / {genSteps.length} 环节
          </div>
        </div>
      </div>

      <div className="px-5">
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step timeline */}
      <div className="space-y-1 p-5">
        {genSteps.map((s, i) => {
          const done = i < step
          const activeStep = i === step
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className={cn(
                'flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors',
                activeStep
                  ? 'border-primary/40 bg-primary/8'
                  : done
                    ? 'border-transparent'
                    : 'border-transparent opacity-50',
              )}
            >
              <span
                className={cn(
                  'grid size-8 shrink-0 place-items-center rounded-lg',
                  done
                    ? 'bg-primary/15 text-primary'
                    : activeStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                )}
              >
                {done ? (
                  <CheckCircle2 className="size-4" />
                ) : activeStep ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Icon className="size-4" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{s.label}</p>
                <p className="truncate text-xs text-muted-foreground">{s.desc}</p>
              </div>
              {done && (
                <Badge variant="success" className="shrink-0 text-[10px]">
                  完成
                </Badge>
              )}
              {activeStep && (
                <Badge variant="muted" className="shrink-0 text-[10px]">
                  进行中
                </Badge>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
        active
          ? 'border-primary/50 bg-primary/15 text-primary'
          : 'border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}
