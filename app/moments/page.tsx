'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Sparkles,
  Mic,
  Copy,
  QrCode,
  Smile,
  ImagePlus,
  Check,
  Loader2,
  CheckCircle2,
  Heart,
  ScanText,
  PenLine,
  ShieldCheck,
} from 'lucide-react'

const sceneList = ['每日早安', '车型推荐', '促销活动', '交车仪式', '用车知识', '节日祝福']
const personas = ['专业顾问', '亲切朋友', '幽默达人', '励志导师']
const imageSizes = [
  { label: '方图 1:1', ratio: 'aspect-square' },
  { label: '竖图 3:4', ratio: 'aspect-[3/4]' },
  { label: '横图 4:3', ratio: 'aspect-[4/3]' },
]

const copywriting = `【提前锁定爱车 · 抢占0首付名额】🚗

这台2026款星海SUV，真的太懂年轻家庭了：
✅ 15.6"3K中控屏 + 高通8295，丝滑不卡顿
✅ 城市NOA智驾，通勤更轻松
✅ 综合续航700km，一周一充

本周到店即享：0首付 / 3年免息 / 万元礼包 🎁
懂车的朋友都在问，名额有限，私信我帮你算方案～

#星海SUV #新能源 #0首付购车`

const genSteps = [
  { icon: ScanText, label: '解析场景与人设', desc: '结合内容日历与人设风格' },
  { icon: PenLine, label: 'AI 文案撰写', desc: '生成高转化朋友圈文案' },
  { icon: ImagePlus, label: '智能配图匹配', desc: '从素材库挑选场景图' },
  { icon: QrCode, label: '添加水印二维码', desc: '嵌入专属二维码与门店信息' },
  { icon: ShieldCheck, label: '合规润色校验', desc: '规避违禁词并优化表达' },
]

export default function MomentsPage() {
  const [scene, setScene] = useState(sceneList[1])
  const [persona, setPersona] = useState(personas[0])
  const [imageSize, setImageSize] = useState(imageSizes[0])
  const [step, setStep] = useState(3)
  const [status, setStatus] = useState<'idle' | 'generating' | 'done'>('idle')
  const [genStep, setGenStep] = useState(0)
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)
  const watermarks = ['个人二维码 / 联系方式']

  function generate() {
    setStatus('generating')
    setGenStep(0)
    let i = 0
    const timer = setInterval(() => {
      i += 1
      setGenStep(i)
      if (i >= genSteps.length) {
        clearInterval(timer)
        setTimeout(() => setStatus('done'), 600)
      }
    }, 720)
  }

  function handleCopy() {
    const done = () => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(copywriting).then(done).catch(done)
    } else {
      done()
    }
  }

  return (
    <div className="mx-auto grid max-w-[1400px] gap-6 lg:grid-cols-[1fr_400px]">
      {/* Left: 3-step flow */}
      <div className="flex flex-col gap-4">
        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="size-4 text-primary" />
            极简 3 步生成（FR-MOM-001）
          </div>
          <div className="flex items-center gap-2">
            {['选择场景', '选择图片', '一键生成'].map((s, i) => (
              <div key={s} className="flex flex-1 items-center gap-2">
                <div
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full text-xs font-semibold',
                    step > i + 1
                      ? 'bg-primary text-primary-foreground'
                      : step === i + 1
                        ? 'bg-primary/20 text-primary ring-2 ring-primary'
                        : 'bg-muted text-muted-foreground',
                  )}
                >
                  {step > i + 1 ? <Check className="size-3.5" /> : i + 1}
                </div>
                <span className={cn('text-xs', step >= i + 1 ? 'text-foreground' : 'text-muted-foreground')}>
                  {s}
                </span>
                {i < 2 && <div className="h-px flex-1 bg-border" />}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <p className="mb-2 text-xs font-semibold">场景（每日内容日历自动推荐）</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {sceneList.map((s) => (
              <Chip key={s} active={scene === s} onClick={() => setScene(s)}>
                {s}
              </Chip>
            ))}
          </div>

          <p className="mb-2 text-xs font-semibold">人设风格</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {personas.map((p) => (
              <Chip key={p} active={persona === p} onClick={() => setPersona(p)}>
                {p}
              </Chip>
            ))}
          </div>

          <p className="mb-2 text-xs font-semibold">上传/选择图片</p>
          <div className="grid grid-cols-4 gap-2">
            {['/cars/blue-suv-poster.png', '/cars/red-suv-snow.png', '/cars/city-night.png'].map(
              (src, i) => (
                <div
                  key={src}
                  className={cn(
                    'relative aspect-square overflow-hidden rounded-lg border',
                    i === 0 ? 'border-primary ring-2 ring-primary/40' : 'border-border',
                  )}
                >
                  <Image src={src || '/placeholder.svg'} alt={`素材 ${i + 1}`} fill className="object-cover" />
                </div>
              ),
            )}
            <button className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground active:scale-95">
              <ImagePlus className="size-5" />
              <span className="text-[10px]">上传</span>
            </button>
          </div>

          <p className="mb-2 mt-4 text-xs font-semibold">配图尺寸</p>
          <div className="flex flex-wrap gap-2">
            {imageSizes.map((s) => (
              <Chip key={s.label} active={imageSize.label === s.label} onClick={() => setImageSize(s)}>
                {s.label}
              </Chip>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              className="h-10 flex-1 gap-2"
              onClick={generate}
              disabled={status === 'generating'}
            >
              {status === 'generating' ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  AI 正在生成文案…
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  {status === 'done' ? '重新生成文案' : '一键生成文案'}
                </>
              )}
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 active:scale-95" aria-label="语音输入">
              <Mic className="size-4" />
            </Button>
          </div>
        </Card>

      </div>

      {/* Right: phone preview */}
      <div className="flex flex-col gap-4">
        {status === 'generating' ? (
          <GenerationProcess step={genStep} scene={scene} persona={persona} />
        ) : (
        <>
        <div className="mx-auto w-full max-w-[340px] rounded-[2.5rem] border-4 border-border bg-card p-3 shadow-2xl">
          <div className="mb-2 flex items-center justify-between px-2 text-[11px] text-muted-foreground">
            <span>9:41</span>
            <span>微信 · 朋友圈</span>
          </div>
          <div className="rounded-2xl bg-background p-4">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-xs font-semibold text-primary">
                李
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-primary">李运营 · 星海 4S 店</p>
                <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-foreground">
                  {copywriting}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  {['/cars/blue-suv-poster.png', '/cars/showroom.png'].map((src) => (
                    <div key={src} className={cn('relative overflow-hidden rounded-md', imageSize.ratio)}>
                      <Image src={src || '/placeholder.svg'} alt="朋友圈配图" fill className="object-cover" />
                      {watermarks.includes('个人二维码 / 联系方式') && (
                        <span className="absolute bottom-1 right-1 flex items-center gap-0.5 rounded bg-black/50 px-1 py-0.5 text-[8px] text-white">
                          <QrCode className="size-2.5" />
                          专属二维码
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span>刚刚</span>
                  <button
                    type="button"
                    onClick={() => setLiked((v) => !v)}
                    aria-pressed={liked}
                    aria-label="点赞"
                    className={cn(
                      'flex items-center gap-1 transition-colors active:scale-90',
                      liked ? 'text-primary' : 'hover:text-foreground',
                    )}
                  >
                    <Heart className={cn('size-3', liked && 'fill-current')} />
                    {liked ? 33 : 32}
                  </button>
                  <span className="flex items-center gap-1">
                    <Smile className="size-3" />
                    评论
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className={cn('h-10 gap-1 transition-colors active:scale-95', copied && 'border-primary/50 text-primary')}
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <CheckCircle2 className="size-4" />
                已复制
              </>
            ) : (
              <>
                <Copy className="size-4" />
                复制文案
              </>
            )}
          </Button>
        </div>
        </>
        )}
      </div>
    </div>
  )
}

function GenerationProcess({
  step,
  scene,
  persona,
}: {
  step: number
  scene: string
  persona: string
}) {
  const progress = Math.round((Math.min(step, genSteps.length) / genSteps.length) * 100)
  return (
    <Card className="glow-primary overflow-hidden p-0">
      <div className="flex items-center gap-2 border-b border-border px-5 py-3.5">
        <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-primary">
          <Sparkles className="size-4" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold">AI 正在生成朋友圈文案</p>
          <p className="truncate text-xs text-muted-foreground">
            {scene} · {persona}
          </p>
        </div>
        <Badge variant="accent" className="ml-auto shrink-0 gap-1">
          <Loader2 className="size-3 animate-spin" />
          {progress}%
        </Badge>
      </div>

      {/* Phone skeleton */}
      <div className="p-5">
        <div className="mx-auto w-full max-w-[300px] rounded-[2rem] border-4 border-border bg-card p-3">
          <div className="rounded-2xl bg-background p-4">
            <div className="flex items-start gap-3">
              <span className="size-9 shrink-0 animate-pulse rounded-lg bg-primary/20" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3 w-24 animate-pulse rounded bg-primary/20" />
                <div className="h-2.5 w-full animate-pulse rounded bg-muted" />
                <div className="h-2.5 w-11/12 animate-pulse rounded bg-muted" />
                <div className="h-2.5 w-3/4 animate-pulse rounded bg-muted" />
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  <div className="aspect-square animate-pulse rounded-md bg-muted" />
                  <div className="aspect-square animate-pulse rounded-md bg-muted" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-center gap-1.5 rounded-full bg-primary/10 py-1 text-[11px] text-primary">
            <Loader2 className="size-3 animate-spin" />
            正在生成第 {Math.min(step + 1, genSteps.length)} / {genSteps.length} 步
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
