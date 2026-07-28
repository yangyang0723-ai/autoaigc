'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Sparkles,
  Play,
  Film,
  UserSquare2,
  AudioLines,
  Scissors,
  Copy,
  Radio,
  Wand2,
  Captions,
} from 'lucide-react'

const videoTypes = ['口播短视频', '车型展示视频', '促销快闪视频', '直播切片', '用户证言视频']
const digitalHumans = ['专业男主播', '亲和女主播', '活力年轻款', '商务精英款']
const voices = ['磁性男声', '甜美女声', '沉稳解说', '激情促销']

const storyboard = [
  { t: '00:00', desc: '开场：车辆缓缓驶入，聚焦前脸科技灯组', dur: '3s', img: '/cars/blue-suv-poster.png' },
  { t: '00:03', desc: '外观环绕：贯穿式尾灯 + 低风阻车身', dur: '5s', img: '/cars/city-night.png' },
  { t: '00:08', desc: '座舱展示：15.6" 中控屏智能交互', dur: '6s', img: '/cars/showroom.png' },
  { t: '00:14', desc: '越野场景：雪地脱困，四驱性能', dur: '4s', img: '/cars/red-suv-snow.png' },
  { t: '00:18', desc: '结尾 CTA：0 首付 3 年免息，立即预约', dur: '2s', img: '/cars/blue-suv-poster.png' },
]

const variants = [
  { label: '15s 竖版', ratio: '9:16', tag: '抖音' },
  { label: '30s 横版', ratio: '16:9', tag: '视频号' },
  { label: '60s 方形', ratio: '1:1', tag: '朋友圈' },
]

export default function VideoPage() {
  const [type, setType] = useState(videoTypes[0])
  const [human, setHuman] = useState(digitalHumans[0])
  const [voice, setVoice] = useState(voices[0])
  const [active, setActive] = useState(0)

  return (
    <div className="mx-auto grid max-w-[1400px] gap-6 lg:grid-cols-[360px_1fr]">
      {/* Left controls */}
      <div className="flex flex-col gap-4">
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="size-4 text-primary" />
            AI 脚本生成（FR-VID-001）
          </div>
          <textarea
            rows={3}
            defaultValue="主题：2026 星海 SUV 上市；卖点：智能座舱、城市 NOA、700km 续航；风格：科技讲解"
            className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm leading-relaxed outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          />
          <p className="mb-2 mt-4 text-xs font-semibold">视频类型</p>
          <div className="flex flex-wrap gap-2">
            {videoTypes.map((v) => (
              <Chip key={v} active={type === v} onClick={() => setType(v)}>
                {v}
              </Chip>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <UserSquare2 className="size-4 text-primary" />
            数字人形象（FR-VID-003）
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {digitalHumans.map((h) => (
              <Chip key={h} active={human === h} onClick={() => setHuman(h)}>
                {h}
              </Chip>
            ))}
          </div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <AudioLines className="size-4 text-primary" />
            AI 配音音色
          </div>
          <div className="flex flex-wrap gap-2">
            {voices.map((v) => (
              <Chip key={v} active={voice === v} onClick={() => setVoice(v)}>
                {v}
              </Chip>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Radio className="size-4 text-primary" />
            直播切片（FR-VID-007）
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            接入直播流，AI 自动识别高光时刻（互动高峰 / 成交时刻 / 精彩讲解），一次直播产出 10-30 条切片。
          </p>
          <Button variant="outline" size="sm" className="mt-3 h-8 w-full gap-1.5">
            <Scissors className="size-3.5" />
            上传直播回放
          </Button>
        </Card>

        <Button className="h-11 gap-2">
          <Sparkles className="size-4" />
          一键成片（≤ 3 分钟）
        </Button>
      </div>

      {/* Main preview + timeline */}
      <div className="flex flex-col gap-4">
        <Card className="overflow-hidden p-0">
          <div className="relative aspect-video">
            <Image
              src={storyboard[active].img || '/placeholder.svg'}
              alt="视频预览"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <button className="flex size-16 items-center justify-center rounded-full bg-primary/90 text-primary-foreground transition-transform hover:scale-105">
                <Play className="size-7 fill-current" />
              </button>
            </div>
            <div className="absolute left-4 top-4 flex gap-2">
              <Badge variant="accent">{human}</Badge>
              <Badge variant="muted">{voice}</Badge>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-black/60 px-4 py-1.5 text-sm text-white">
              {storyboard[active].desc}
            </div>
          </div>
          {/* Timeline */}
          <div className="border-t border-border p-4">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-semibold">
                <Film className="size-3.5 text-primary" />
                智能分镜时间轴 · 共 20s
              </span>
              <span className="flex items-center gap-3 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Wand2 className="size-3" />
                  智能卡点
                </span>
                <span className="flex items-center gap-1">
                  <Captions className="size-3" />
                  自动字幕
                </span>
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {storyboard.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={cn(
                    'group relative w-28 shrink-0 overflow-hidden rounded-lg border text-left transition-all',
                    active === i ? 'border-primary ring-2 ring-primary/40' : 'border-border',
                  )}
                >
                  <div className="relative aspect-video">
                    <Image src={s.img || '/placeholder.svg'} alt={`分镜 ${i + 1}`} fill className="object-cover" />
                    <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1 text-[9px] text-white">
                      {s.dur}
                    </span>
                  </div>
                  <p className="truncate px-1.5 py-1 text-[10px] text-muted-foreground">{s.t}</p>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Variants */}
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Copy className="size-4 text-primary" />
            视频变体生成（FR-VID-006）· 一条母视频多版本 A/B 测试
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {variants.map((v) => (
              <div
                key={v.label}
                className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
              >
                <div
                  className={cn(
                    'flex shrink-0 items-center justify-center rounded bg-primary/15 text-primary',
                    v.ratio === '9:16' ? 'h-12 w-7' : v.ratio === '1:1' ? 'size-10' : 'h-7 w-12',
                  )}
                >
                  <Play className="size-3.5 fill-current" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{v.label}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {v.ratio} · {v.tag}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
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
