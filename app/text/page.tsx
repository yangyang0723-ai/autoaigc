'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { GenerateGuardButton } from '@/components/generate-guard-button'
import { cn } from '@/lib/utils'
import {
  FileText,
  Lightbulb,
  Layers,
  Search,
  Wand2,
  Copy,
  ListTree,
  Gauge,
} from 'lucide-react'

const contentTypes = ['公众号推文', '小红书种草', '知乎回答', '商品详情页', '微博文案']
const writeStyles = ['专业评测风', '种草安利风', '故事叙事风', '硬核技术风', '幽默吐槽风']
const tones = ['正式', '轻松', '激情', '理性']
const lengths = ['短文案 100字', '中文案 500字', '长文案 2000字+']
const platforms = ['公众号', '小红书', '微博', '知乎']

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

export default function TextPage() {
  const [type, setType] = useState(contentTypes[0])
  const [style, setStyle] = useState(writeStyles[0])
  const [tone, setTone] = useState(tones[1])
  const [length, setLength] = useState(lengths[2])
  const [platform, setPlatform] = useState(platforms[0])

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
          <div className="flex flex-wrap gap-2">
            {lengths.map((l) => (
              <Chip key={l} active={length === l} onClick={() => setLength(l)}>
                {l}
              </Chip>
            ))}
          </div>
        </Card>

        <GenerateGuardButton
          content={`实测 2026 款星海 SUV：这台旗舰把智能座舱卷到了新高度。${type} · ${style} · ${platform}。综合续航 700km，城市 NOA 智驾，0 首付 3 年免息购车方案。`}
          label="生成图文内容"
          generatingLabel="AI 正在生成图文内容…"
        />
      </div>

      {/* Main editor */}
      <div className="flex flex-col gap-4">
        {/* Outline */}
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <ListTree className="size-4 text-primary" />
            AI 生成大纲
            <Badge variant="muted" className="ml-auto">可拖拽调整</Badge>
          </div>
          <div className="space-y-2">
            {outline.map((o, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <span className="text-xs text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                <span className="flex-1">{o.h}</span>
                {o.img && (
                  <Badge variant="accent" className="text-[10px]">
                    建议配图
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Article preview + SEO */}
        <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
          <Card className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <FileText className="size-4 text-primary" />
                图文混排预览
              </div>
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <Copy className="size-3.5" />
                复制
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
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                <Image src="/cars/blue-suv-poster.png" alt="星海 SUV 外观" fill className="object-cover" />
              </div>
              <p className="text-xs text-primary">图 1 · 星海 SUV 外观科技美学</p>
              <h3 className="text-base font-semibold">外观设计：科技美学的极致表达</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                贯穿式日间行车灯配合封闭式前脸，风阻系数低至 0.23Cd。车身长度 4980mm，轴距
                2950mm，为后排腿部空间打下扎实基础。
                <span className="rounded bg-primary/15 px-1 text-primary">
                  （数据来源：车型数据库 · FR-TXT-003 专业知识注入）
                </span>
              </p>
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
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
                  {['星海SUV怎么样', '25万新能源SUV', '智能座舱对比', '0首付购车'].map((k) => (
                    <Badge key={k} variant="outline" className="text-[10px]">
                      {k}
                    </Badge>
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
              <Button variant="outline" size="sm" className="mt-3 h-8 w-full gap-1.5">
                <Wand2 className="size-3.5" />
                转换为「{platform}」格式
              </Button>
            </Card>
          </div>
        </div>
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
