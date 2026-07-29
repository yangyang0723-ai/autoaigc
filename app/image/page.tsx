'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GenerateGuardButton } from '@/components/generate-guard-button'
import { cn } from '@/lib/utils'
import {
  Sparkles,
  Wand2,
  Layers,
  Download,
  Heart,
  Maximize2,
  RefreshCw,
  Check,
  ImageIcon,
  Loader2,
  Car,
  Palette,
  Ratio,
  Upload,
} from 'lucide-react'

const scenes = ['新车上市海报', '促销海报', '车型对比图', '展厅布置图', '社交媒体配图']
const brands = ['星海', '蔚来', '理想', '比亚迪', '奥迪', '奔驰']
const styles = [
  { name: '科技感', color: 'from-sky-500/30' },
  { name: '豪华感', color: 'from-amber-500/30' },
  { name: '运动感', color: 'from-red-500/30' },
  { name: '家庭温馨', color: 'from-emerald-500/30' },
  { name: '商务精英', color: 'from-slate-500/30' },
]
const tones = ['冷色调', '暖色调', '高对比', '低饱和', '黑金']
const ratios = [
  { label: '朋友圈', value: '1:1' },
  { label: '抖音', value: '9:16' },
  { label: '小红书', value: '3:4' },
  { label: '微博', value: '16:9' },
  { label: '公众号封面', value: '2.35:1' },
]

const resultImages = [
  '/cars/blue-suv-poster.png',
  '/cars/city-night.png',
  '/cars/red-suv-snow.png',
  '/cars/showroom.png',
]

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

function FieldLabel({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-foreground">
      <Icon className="size-3.5 text-primary" />
      {children}
    </div>
  )
}

export default function ImagePage() {
  const [scene, setScene] = useState(scenes[0])
  const [brand, setBrand] = useState(brands[0])
  const [style, setStyle] = useState(styles[0].name)
  const [tone, setTone] = useState(tones[0])
  const [ratio, setRatio] = useState(ratios[0].value)
  const [prompt, setPrompt] = useState(
    '生成一张 2026 款星海 SUV 上市海报，科技风格，蓝色调，突出智能驾驶功能，画面留白便于叠加促销文案',
  )
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('done')
  const [selected, setSelected] = useState(0)

  const generate = () => {
    setStatus('loading')
    setTimeout(() => setStatus('done'), 1800)
  }

  const optimizePrompt = () => {
    setPrompt(
      (p) =>
        p +
        '，8K 超清，专业汽车广告摄影，电影级布光，浅景深，品牌 VI 蓝 #0A84FF 点缀',
    )
  }

  return (
    <div className="mx-auto grid max-w-[1400px] gap-6 lg:grid-cols-[380px_1fr]">
      {/* Control panel */}
      <div className="flex flex-col gap-4">
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="size-4 text-primary" />
              提示词助手
            </div>
            <Badge variant="accent">FR-IMG-001</Badge>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm leading-relaxed outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            placeholder="用自然语言描述你想要的画面…"
          />
          <div className="mt-2 flex gap-2">
            <Button variant="outline" size="sm" className="h-8 flex-1 gap-1.5" onClick={optimizePrompt}>
              <Wand2 className="size-3.5" />
              AI 优化提示词
            </Button>
            <Button variant="outline" size="icon-sm" className="h-8" aria-label="上传参考图">
              <Upload className="size-3.5" />
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <FieldLabel icon={ImageIcon}>营销场景</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {scenes.map((s) => (
              <Chip key={s} active={scene === s} onClick={() => setScene(s)}>
                {s}
              </Chip>
            ))}
          </div>

          <div className="mt-4">
            <FieldLabel icon={Car}>车型品牌（车型数据库 · 1000+ 车型）</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {brands.map((b) => (
                <Chip key={b} active={brand === b} onClick={() => setBrand(b)}>
                  {b}
                </Chip>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <FieldLabel icon={Palette}>风格模板</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {styles.map((s) => (
                <Chip key={s.name} active={style === s.name} onClick={() => setStyle(s.name)}>
                  {s.name}
                </Chip>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <FieldLabel icon={Palette}>色调</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <Chip key={t} active={tone === t} onClick={() => setTone(t)}>
                  {t}
                </Chip>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <FieldLabel icon={Ratio}>多尺寸适配</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {ratios.map((r) => (
                <Chip key={r.value} active={ratio === r.value} onClick={() => setRatio(r.value)}>
                  {r.label} {r.value}
                </Chip>
              ))}
            </div>
          </div>
        </Card>

        <GenerateGuardButton
          content={prompt}
          label="生成图片（一次 4 张）"
          generatingLabel="AI 正在生成 4 张预览…"
          onProceed={generate}
        />
        <p className="-mt-1 text-center text-[11px] text-muted-foreground">
          单张高清图生成 ≤ 30 秒 · 支持批量导入 CSV 最多 50 张
        </p>
      </div>

      {/* Results */}
      <div className="flex flex-col gap-4">
        <Card className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">生成结果</span>
            <Badge variant="muted">{scene}</Badge>
            <Badge variant="muted">{style}</Badge>
            <Badge variant="muted">{ratio}</Badge>
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1.5" onClick={generate}>
            <RefreshCw className="size-3.5" />
            重新生成
          </Button>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {resultImages.map((src, i) => (
            <Card
              key={src}
              className={cn(
                'group relative cursor-pointer overflow-hidden p-0 transition-all',
                selected === i ? 'ring-2 ring-primary' : 'hover:ring-1 hover:ring-primary/40',
              )}
              onClick={() => setSelected(i)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {status === 'loading' ? (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <Loader2 className="size-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <Image
                    src={src || '/placeholder.svg'}
                    alt={`${scene} 生成结果 ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                {selected === i && status === 'done' && (
                  <span className="absolute left-3 top-3 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3.5" />
                  </span>
                )}
                {status === 'done' && (
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-1.5 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button size="icon-sm" variant="secondary" aria-label="收藏">
                      <Heart className="size-3.5" />
                    </Button>
                    <Button size="icon-sm" variant="secondary" aria-label="放大">
                      <Maximize2 className="size-3.5" />
                    </Button>
                    <Button size="icon-sm" variant="secondary" aria-label="下载">
                      <Download className="size-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Smart edit toolbar */}
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Layers className="size-4 text-primary" />
            智能编辑（FR-IMG-005）
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              { label: 'AI 局部重绘', icon: Wand2 },
              { label: '文字智能嵌入', icon: ImageIcon },
              { label: '元素替换', icon: RefreshCw },
              { label: 'AI 扩图', icon: Maximize2 },
            ].map((a) => {
              const Icon = a.icon
              return (
                <button
                  key={a.label}
                  className="flex flex-col items-center gap-2 rounded-lg border border-border bg-background p-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <Icon className="size-4 text-primary" />
                  {a.label}
                </button>
              )
            })}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg bg-muted p-3">
            <span className="text-xs text-muted-foreground">已选中第 {selected + 1} 张 · 一键导出：</span>
            {ratios.map((r) => (
              <Badge key={r.value} variant="outline">
                {r.label} {r.value}
              </Badge>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
