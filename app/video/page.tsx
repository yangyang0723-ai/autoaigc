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
  Pause,
  Film,
  UserSquare2,
  AudioLines,
  Scissors,
  Radio,
  Wand2,
  Captions,
  Loader2,
  CheckCircle2,
  FileVideo,
  Mic2,
  Music4,
} from 'lucide-react'

const videoTypes = ['口播短视频', '车型展示视频', '促销快闪视频', '直播切片', '用户证言视频']
const digitalHumans = ['专业男主播', '亲和女主播', '活力年轻款', '商务精英款']
const voices = ['磁性男声', '甜美女声', '沉稳解说', '激情促销']
const videoSizes = [
  { label: '横版 16:9', ratio: 'aspect-video', wrap: 'max-w-full', tag: '视频号 / 官网' },
  { label: '竖版 9:16', ratio: 'aspect-[9/16]', wrap: 'mx-auto max-w-[300px]', tag: '抖音 / 快手' },
  { label: '方形 1:1', ratio: 'aspect-square', wrap: 'mx-auto max-w-[460px]', tag: '朋友圈' },
]

const storyboard = [
  { t: '00:00', desc: '开场：车辆缓缓驶入，聚焦前脸科技灯组', dur: '3s', img: '/cars/blue-suv-poster.png' },
  { t: '00:03', desc: '外观环绕：贯穿式尾灯 + 低风阻车身', dur: '5s', img: '/cars/city-night.png' },
  { t: '00:08', desc: '座舱展示：15.6" 中控屏智能交互', dur: '6s', img: '/cars/showroom.png' },
  { t: '00:14', desc: '越野场景：雪地脱困，四驱性能', dur: '4s', img: '/cars/red-suv-snow.png' },
  { t: '00:18', desc: '结尾 CTA：0 首付 3 年免息，立即预约', dur: '2s', img: '/cars/blue-suv-poster.png' },
]

const genSteps = [
  { icon: Sparkles, label: '解析脚本与卖点', desc: '拆解主题、卖点与目标平台' },
  { icon: Film, label: '生成智能分镜', desc: '编排 5 个镜头与运镜节奏' },
  { icon: UserSquare2, label: '渲染数字人口播', desc: '驱动数字人表情与唇形同步' },
  { icon: Mic2, label: 'AI 配音与字幕', desc: '合成音色并对齐自动字幕' },
  { icon: Music4, label: '智能卡点合成', desc: '匹配 BGM 卡点并输出成片' },
]

export default function VideoPage() {
  const [type, setType] = useState(videoTypes[0])
  const [human, setHuman] = useState(digitalHumans[0])
  const [voice, setVoice] = useState(voices[0])
  const [videoSize, setVideoSize] = useState(videoSizes[0])
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [status, setStatus] = useState<'idle' | 'generating' | 'done'>('idle')
  const [step, setStep] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [uploaded, setUploaded] = useState(false)

  function generate() {
    setStatus('generating')
    setStep(0)
    setPlaying(false)
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

  function handleUpload() {
    if (uploading) return
    setUploading(true)
    setUploaded(false)
    setTimeout(() => {
      setUploading(false)
      setUploaded(true)
      setTimeout(() => setUploaded(false), 2200)
    }, 1200)
  }

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
          <div className="mb-4 flex flex-wrap gap-2">
            {videoTypes.map((v) => (
              <Chip key={v} active={type === v} onClick={() => setType(v)}>
                {v}
              </Chip>
            ))}
          </div>
          <p className="mb-2 text-xs font-semibold">视频尺寸</p>
          <div className="grid grid-cols-3 gap-2">
            {videoSizes.map((s) => {
              const on = videoSize.label === s.label
              return (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setVideoSize(s)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-lg border p-2.5 transition-all active:scale-[0.97]',
                    on
                      ? 'border-primary bg-primary/8 ring-1 ring-primary/30'
                      : 'border-border hover:border-primary/40 hover:bg-secondary/40',
                  )}
                >
                  <span
                    className={cn(
                      'rounded-sm border-2',
                      on ? 'border-primary' : 'border-muted-foreground/50',
                      s.ratio === 'aspect-[9/16]'
                        ? 'h-6 w-3.5'
                        : s.ratio === 'aspect-square'
                          ? 'size-5'
                          : 'h-3.5 w-6',
                    )}
                  />
                  <span className={cn('text-[11px] font-medium', on ? 'text-primary' : 'text-foreground')}>
                    {s.label}
                  </span>
                  <span className="text-[9px] text-muted-foreground">{s.tag}</span>
                </button>
              )
            })}
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
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'mt-3 h-8 w-full gap-1.5 transition-colors active:scale-95',
              uploaded && 'border-primary/50 text-primary',
            )}
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                正在解析直播流…
              </>
            ) : uploaded ? (
              <>
                <CheckCircle2 className="size-3.5" />
                已生成 18 条切片
              </>
            ) : (
              <>
                <Scissors className="size-3.5" />
                上传直播回放
              </>
            )}
          </Button>
        </Card>

        <Button
          className="h-11 gap-2"
          onClick={generate}
          disabled={status === 'generating'}
        >
          {status === 'generating' ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              AI 正在合成视频…
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              {status === 'done' ? '重新一键成片' : '一键成片（≤ 3 分钟）'}
            </>
          )}
        </Button>
      </div>

      {/* Main preview + timeline */}
      <div className="flex flex-col gap-4">
        {status === 'generating' ? (
          <GenerationProcess step={step} human={human} voice={voice} size={videoSize} />
        ) : (
        <>
        <Card className="overflow-hidden p-0">
          <div className="flex justify-center bg-black/5">
          <div className={cn('relative w-full', videoSize.ratio, videoSize.wrap)}>
            <Image
              src={storyboard[active].img || '/placeholder.svg'}
              alt="视频预览"
              fill
              className="object-cover"
            />
            <div className={cn('absolute inset-0 flex items-center justify-center transition-colors', playing ? 'bg-black/10' : 'bg-black/30')}>
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? '暂停' : '播放'}
                className="flex size-16 items-center justify-center rounded-full bg-primary/90 text-primary-foreground transition-transform hover:scale-105 active:scale-95"
              >
                {playing ? <Pause className="size-7 fill-current" /> : <Play className="size-7 fill-current" />}
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
        </>
        )}
      </div>
    </div>
  )
}

function GenerationProcess({
  step,
  human,
  voice,
  size,
}: {
  step: number
  human: string
  voice: string
  size: { label: string; ratio: string; wrap: string }
}) {
  const progress = Math.round((Math.min(step, genSteps.length) / genSteps.length) * 100)
  return (
    <Card className="glow-primary overflow-hidden p-0">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
        <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-primary">
          <Sparkles className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">AI 正在合成视频</p>
          <p className="text-xs text-muted-foreground">
            {human} · {voice} · {size.label} · 智能分镜与卡点合成中
          </p>
        </div>
        <Badge variant="accent" className="ml-auto shrink-0 gap-1">
          <Loader2 className="size-3 animate-spin" />
          {progress}%
        </Badge>
      </div>

      {/* Rendering canvas skeleton */}
      <div className={cn('relative bg-muted', size.ratio, size.wrap)}>
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted to-secondary" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <span className="grid size-14 place-items-center rounded-full bg-primary/90 text-primary-foreground">
            <FileVideo className="size-6" />
          </span>
          <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
            <Loader2 className="size-3 animate-spin" />
            正在渲染第 {Math.min(step + 1, genSteps.length)} / {genSteps.length} 阶段
          </div>
        </div>
        {/* faux waveform */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-end gap-0.5">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="w-1 animate-pulse rounded-full bg-primary/70"
              style={{ height: `${8 + ((i * 7) % 20)}px`, animationDelay: `${(i % 6) * 90}ms` }}
            />
          ))}
        </div>
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
