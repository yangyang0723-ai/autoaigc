'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Sparkles,
  FileText,
  Lightbulb,
  Layers,
  Search,
  Wand2,
  Copy,
  ListTree,
  Gauge,
  Loader2,
  CheckCircle2,
  PenLine,
  ImageIcon,
  GripVertical,
} from 'lucide-react'

const contentTypes = ['公众号推文', '小红书种草', '知乎回答', '商品详情页', '微博文案']
const writeStyles = ['专业评测风', '种草安利风', '故事叙事风', '硬核技术风', '幽默吐槽风']
const tones = ['正式', '轻松', '激情', '理性']
const lengths = ['短文案 100字', '中文案 500字', '长文案 2000字+']
const platforms = ['公众号', '小红书', '微博', '知乎']
const imageSizes = [
  { label: '横图 16:9', ratio: 'aspect-[16/9]' },
  { label: '标准 4:3', ratio: 'aspect-[4/3]' },
  { label: '方图 1:1', ratio: 'aspect-square' },
  { label: '竖图 3:4', ratio: 'aspect-[3/4]' },
]

const outline = [
  { h: '一、开篇：为什么这台旗舰 SUV 值得等待', img: false },
  { h: '二、外观设计：科技美学的极致表达', img: true },
  { h: '三、智能座舱：越级的数字化体验', img: true },
  { h: '四、动力与续航：实测数据说话', img: false },
  { h: '五、金融政策：0 首付 3 年免息购车方案', img: false },
  { h: '六、总结：谁适合入手这台车', img: false },
]

const topics = [
  { t: '2026 新能源 SUV 选购指南', hot: '热度 98' },
  { t: '星海 SUV vs 理想 L7 深度对比', hot: '热度 92' },
  { t: '年轻家庭的第一台电车怎么选', hot: '热度 87' },
]

const genSteps = [
  { icon: Search, label: '智能选题分析', desc: '解析行业热点与目标人群' },
  { icon: ListTree, label: '生成内容大纲', desc: '构建六段式文章结构' },
  { icon: PenLine, label: 'AI 正文撰写', desc: '逐段生成专业图文内容' },
  { icon: ImageIcon, label: '智能配图匹配', desc: '从素材库匹配场景图' },
  { icon: Gauge, label: 'SEO 优化排版', desc: '关键词密度与可读性调优' },
]

function SeoBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function TextPage() {
  const [type, setType] = useState(contentTypes[0])
  const [style, setStyle] = useState(writeStyles[0])
  const [tone, setTone] = useState(tones[1])
  const [length, setLength] = useState(lengths[2])
  const [platform, setPlatform] = useState(platforms[0])
  const [imageSize, setImageSize] = useState(imageSizes[0])
  const [status, setStatus] = useState<'idle' | 'generating' | 'done'>('idle')
  const [step, setStep] = useState(0)
  const [items, setItems] = useState(outline)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [converting, setConverting] = useState(false)
  const [convertedTo, setConvertedTo] = useState<string | null>(null)

  const articleText = `实测 2026 款星海 SUV：这台旗舰把智能座舱卷到了新高度

作为一台定价 25 万级的新能源旗舰 SUV，星海用一块 15.6 英寸 3K 中控屏、高通 8295 芯片和城市 NOA 智驾，重新定义了这个价位的科技体感。

外观设计：科技美学的极致表达
贯穿式日间行车灯配合封闭式前脸，风阻系数低至 0.23Cd。车身长度 4980mm，轴距 2950mm。`

  async function copyText(text: string, onDone: () => void) {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // 剪贴板不可用时静默降级，仍给出视觉反馈
    }
    onDone()
  }

  function handleCopyArticle() {
    copyText(articleText, () => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  function handleConvert() {
    if (converting) return
    setConverting(true)
    setConvertedTo(null)
    setTimeout(() => {
      setConverting(false)
      setConvertedTo(platform)
      setTimeout(() => setConvertedTo((cur) => (cur === platform ? null : cur)), 2200)
    }, 1100)
  }

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
    }, 760)
  }

  function handleDrop(target: number) {
    if (dragIndex === null || dragIndex === target) {
      setDragIndex(null)
      setOverIndex(null)
      return
    }
    setItems((prev) => {
      const next = [...prev]
      const [moved] = next.splice(dragIndex, 1)
      next.splice(target, 0, moved)
      return next
    })
    setDragIndex(null)
    setOverIndex(null)
  }

  return (
    <div className="mx-auto grid max-w-[1400px] gap-6 lg:grid-cols-[360px_1fr]">
      {/* Left controls */}
      <div className="flex flex-col gap-4">
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Lightbulb className="size-4 text-primary" />
            智能选题推荐（FR-TXT-001）
          </div>
          <div className="space-y-2">
            {topics.map((t) => (
              <button
                key={t.t}
                className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-left text-xs transition-colors hover:border-primary/40"
              >
                <span className="font-medium">{t.t}</span>
                <Badge variant="warning">{t.hot}</Badge>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <p className="mb-2 text-xs font-semibold">内容类型</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {contentTypes.map((c) => (
              <Chip key={c} active={type === c} onClick={() => setType(c)}>
                {c}
              </Chip>
            ))}
          </div>
          <p className="mb-2 text-xs font-semibold">写作风格</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {writeStyles.map((s) => (
              <Chip key={s} active={style === s} onClick={() => setStyle(s)}>
                {s}
              </Chip>
            ))}
          </div>
          <p className="mb-2 text-xs font-semibold">语气</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {tones.map((t) => (
              <Chip key={t} active={tone === t} onClick={() => setTone(t)}>
                {t}
              </Chip>
            ))}
          </div>
          <p className="mb-2 text-xs font-semibold">字数控制</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {lengths.map((l) => (
              <Chip key={l} active={length === l} onClick={() => setLength(l)}>
                {l}
              </Chip>
            ))}
          </div>
          <p className="mb-2 text-xs font-semibold">配图尺寸</p>
          <div className="flex flex-wrap gap-2">
            {imageSizes.map((s) => (
              <Chip key={s.label} active={imageSize.label === s.label} onClick={() => setImageSize(s)}>
                {s.label}
              </Chip>
            ))}
          </div>
        </Card>

        <Button className="h-11 gap-2" onClick={generate} disabled={status === 'generating'}>
          {status === 'generating' ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              AI 正在生成内容…
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              {status === 'done' ? '重新生成图文内容' : '生成图文内容'}
            </>
          )}
        </Button>
      </div>

      {/* Main editor */}
      <div className="flex flex-col gap-4">
        {status === 'generating' ? (
          <GenerationProcess step={step} />
        ) : (
        <>
        {/* Outline */}
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <ListTree className="size-4 text-primary" />
            AI 生成大纲
            <Badge variant="muted" className="ml-auto gap-1">
              <GripVertical className="size-3" />
              拖拽调整顺序
            </Badge>
          </div>
          <div className="space-y-2">
            {items.map((o, i) => {
              const isDragging = dragIndex === i
              const isOver = overIndex === i && dragIndex !== null && dragIndex !== i
              return (
                <div
                  key={o.h}
                  draggable
                  onDragStart={(e) => {
                    setDragIndex(i)
                    e.dataTransfer.effectAllowed = 'move'
                  }}
                  onDragEnter={() => setOverIndex(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(i)}
                  onDragEnd={() => {
                    setDragIndex(null)
                    setOverIndex(null)
                  }}
                  className={cn(
                    'flex cursor-grab items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm transition-all duration-200 active:cursor-grabbing',
                    isDragging
                      ? 'scale-[0.98] border-primary/60 opacity-50 shadow-lg ring-1 ring-primary/40'
                      : 'border-border hover:border-primary/40 hover:bg-secondary/40',
                    isOver && 'border-primary border-dashed bg-primary/8 ring-1 ring-primary/30',
                  )}
                >
                  <GripVertical className="size-4 shrink-0 text-muted-foreground/60" />
                  <span className="w-6 text-xs text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1">{o.h}</span>
                  {o.img && (
                    <Badge variant="accent" className="text-[10px]">
                      建议配图
                    </Badge>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Article preview + SEO */}
        <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
          <Card className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="size-4 text-primary" />
                图文预览
              </div>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-8 gap-1.5 transition-colors active:scale-95',
                  copied && 'border-primary/50 text-primary',
                )}
                onClick={handleCopyArticle}
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="size-3.5" />
                    已复制
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" />
                    复制
                  </>
                )}
              </Button>
            </div>
            <div className="max-h-[520px] space-y-4 overflow-y-auto p-6">
              <h2 className="text-xl font-bold text-balance">
                实测 2026 款星海 SUV：这台旗舰把智能座舱卷到了新高度
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                作为一台定价 25 万级的新能源旗舰 SUV，星海用一块 15.6 英寸 3K 中控屏、高通 8295
                芯片和城市 NOA 智驾，重新定义了这个价位的科技体感。这篇实测带你从外观、座舱、动力到金融政策，一次看懂。
              </p>
              <div className={cn('relative overflow-hidden rounded-lg', imageSize.ratio)}>
                <Image src="/cars/blue-suv-poster.png" alt="星海 SUV 外观" fill className="object-cover" />
              </div>
              <p className="text-xs text-primary">图 1 · 星海 SUV 外观科技美学</p>
              <h3 className="text-base font-semibold">外观设计：科技美学的极致表达</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                贯穿式日间行车灯配合封闭式前脸，风阻���数低至 0.23Cd。车身长度 4980mm，轴距
                2950mm，为后排腿部空间打下扎实基础。
                <span className="rounded bg-primary/15 px-1 text-primary">
                  （数据来源：车型数据库 · FR-TXT-003 专业知识注入）
                </span>
              </p>
              <div className={cn('relative overflow-hidden rounded-lg', imageSize.ratio)}>
                <Image src="/cars/showroom.png" alt="星海 SUV 座舱" fill className="object-cover" />
              </div>
              <p className="text-xs text-primary">图 2 · 越级数字化座舱体验</p>
            </div>
          </Card>

          <div className="flex flex-col gap-4">
            <Card className="p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Gauge className="size-4 text-primary" />
                SEO 优化（FR-TXT-005）
              </div>
              <div className="space-y-3">
                <SeoBar label="关键词密度" value={72} />
                <SeoBar label="标题吸引力" value={88} />
                <SeoBar label="可读性评分" value={81} />
              </div>
              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold">长尾关键词建议</p>
                <div className="flex flex-wrap gap-1.5">
                  {['星海SUV怎么样', '25万新能源SUV', '智能座舱对比', '0首付购车'].map((keyword) => (
                    <span key={keyword} className="rounded-md border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <Layers className="size-4 text-primary" />
                多平台一键适配
              </div>
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <Chip key={p} active={platform === p} onClick={() => setPlatform(p)}>
                    {p}
                  </Chip>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'mt-3 h-8 w-full gap-1.5 transition-colors active:scale-95',
                  convertedTo === platform && 'border-primary/50 text-primary',
                )}
                onClick={handleConvert}
                disabled={converting}
              >
                {converting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    正在适配「{platform}」…
                  </>
                ) : convertedTo === platform ? (
                  <>
                    <CheckCircle2 className="size-3.5" />
                    已适配「{platform}」格式
                  </>
                ) : (
                  <>
                    <Wand2 className="size-3.5" />
                    转换为「{platform}」格式
                  </>
                )}
              </Button>
            </Card>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
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

function GenerationProcess({ step }: { step: number }) {
  const progress = Math.round((Math.min(step, genSteps.length) / genSteps.length) * 100)
  return (
    <Card className="glow-primary overflow-hidden p-0">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
        <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-primary">
          <Sparkles className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">AI 正在生成图文内容</p>
          <p className="text-xs text-muted-foreground">智能体正在调用知识库与素材库协同创作</p>
        </div>
        <Badge variant="accent" className="ml-auto shrink-0 gap-1">
          <Loader2 className="size-3 animate-spin" />
          {progress}%
        </Badge>
      </div>

      <div className="px-5 pt-4">
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
          const active = i === step
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className={cn(
                'flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors',
                active
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
                    : active
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                )}
              >
                {done ? (
                  <CheckCircle2 className="size-4" />
                ) : active ? (
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
              {active && (
                <Badge variant="muted" className="shrink-0 text-[10px]">
                  进行中
                </Badge>
              )}
            </div>
          )
        })}
      </div>

      {/* Streaming skeleton preview */}
      <div className="space-y-3 border-t border-border p-5">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <PenLine className="size-3.5 text-primary" />
          实时渲染预览
        </div>
        <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-11/12 animate-pulse rounded bg-muted" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
        </div>
        <div className="aspect-[16/9] w-full animate-pulse rounded-lg bg-muted" />
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </Card>
  )
}

