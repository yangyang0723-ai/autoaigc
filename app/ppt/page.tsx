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
  MessageSquareText,
  Download,
  FileDown,
  Play,
  LayoutTemplate,
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

const notes =
  '本页重点强调星海 SUV 在 25 万级市场的差异化优势。开场先抛出"智能座舱越级体验"的核心卖点，配合现场大屏演示 15.6 英寸中控实机操作。数据引用车型数据库最新参数，过渡到下一页竞品对比。建议停留 90 秒。'

export default function PptPage() {
  const [scene, setScene] = useState(scenes[0])
  const [template, setTemplate] = useState(templates[0])
  const [current, setCurrent] = useState(0)

  return (
    <div className="mx-auto grid max-w-[1400px] gap-6 lg:grid-cols-[340px_1fr]">
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

        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <ListTree className="size-4 text-primary" />
            PPT 大纲（{slides.length} 页）
          </div>
          <div className="space-y-1.5">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs transition-colors',
                  current === i ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-muted',
                )}
              >
                <span className="w-4 text-[10px]">{i + 1}</span>
                <span className="flex-1 truncate font-medium">{s.title}</span>
              </button>
            ))}
          </div>
        </Card>

        <Button className="h-11 gap-2">
          <Sparkles className="size-4" />
          AI 一键生成 PPT（≤ 2 分钟）
        </Button>
      </div>

      {/* Main slide preview */}
      <div className="flex flex-col gap-4">
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Presentation className="size-4 text-primary" />
              第 {current + 1} / {slides.length} 页 · {template}模板
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <Play className="size-3.5" />
                演示
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <FileDown className="size-3.5" />
                PPTX
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1.5">
                <Download className="size-3.5" />
                PDF
              </Button>
            </div>
          </div>

          {/* Slide canvas */}
          <div className="p-5">
            <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-background grid-bg">
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

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <BarChart3 className="size-4 text-primary" />
              数据智能可视化（FR-PPT-003）
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              粘贴 Excel 数据，AI 自动推荐最佳图表类型并生成。图表与数据联动，数据更新后自动刷新。
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['销量趋势', '市场份额', '客户画像', '漏���转化'].map((c) => (
                <Badge key={c} variant="outline" className="text-[10px]">
                  {c}
                </Badge>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <MessageSquareText className="size-4 text-primary" />
              演讲者备注（FR-PPT-005）
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{notes}</p>
          </Card>
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
