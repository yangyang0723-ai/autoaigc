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
  Send,
  CalendarDays,
  QrCode,
  Smile,
  ImagePlus,
  Check,
} from 'lucide-react'

const sceneList = ['每日早安', '车型推荐', '促销活动', '交车仪式', '用车知识', '节日祝福']
const personas = ['专业顾问', '亲切朋友', '幽默达人', '励志导师']
const calendar = [
  { day: '周一', topic: '早安 · 正能量', done: true },
  { day: '周二', topic: '车型种草 · 星海 SUV', done: true },
  { day: '周三', topic: '养车知识 · 夏季用车', done: false },
  { day: '周四', topic: '限时促销 · 0 首付', done: false },
  { day: '周五', topic: '交车喜报', done: false },
]

const copywriting = `【提前锁定爱车 · 抢占0首付名额】🚗

这台2026款星海SUV，真的太懂年轻家庭了：
✅ 15.6"3K中控屏 + 高通8295，丝滑不卡顿
✅ 城市NOA智驾，通勤更轻松
✅ 综合续航700km，一周一充

本周到店即享：0首付 / 3年免息 / 万元礼包 🎁
懂车的朋友都在问，名额有限，私信我帮你算方案～

#星海SUV #新能源 #0首付购车`

export default function MomentsPage() {
  const [scene, setScene] = useState(sceneList[1])
  const [persona, setPersona] = useState(personas[0])
  const [step, setStep] = useState(3)

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
            <button className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
              <ImagePlus className="size-5" />
              <span className="text-[10px]">上传</span>
            </button>
          </div>

          <div className="mt-4 flex gap-2">
            <Button className="h-10 flex-1 gap-2">
              <Sparkles className="size-4" />
              一键生成文案
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10" aria-label="语音输入">
              <Mic className="size-4" />
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <CalendarDays className="size-4 text-primary" />
            每日内容日历（FR-MOM-003）
          </div>
          <div className="space-y-2">
            {calendar.map((c) => (
              <div
                key={c.day}
                className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2 text-xs"
              >
                <span className="w-8 font-semibold text-muted-foreground">{c.day}</span>
                <span className="flex-1">{c.topic}</span>
                {c.done ? (
                  <Badge variant="success">已排期</Badge>
                ) : (
                  <Badge variant="muted">待生成</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Right: phone preview */}
      <div className="flex flex-col gap-4">
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
                    <div key={src} className="relative aspect-square overflow-hidden rounded-md">
                      <Image src={src || '/placeholder.svg'} alt="朋友圈配图" fill className="object-cover" />
                      <span className="absolute bottom-1 right-1 flex items-center gap-0.5 rounded bg-black/50 px-1 py-0.5 text-[8px] text-white">
                        <QrCode className="size-2.5" />
                        专属二维码
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span>刚刚</span>
                  <span className="flex items-center gap-1">
                    <Smile className="size-3" />
                    32
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <QrCode className="size-4 text-primary" />
            素材水印（FR-MOM-006）
          </div>
          <div className="space-y-2 text-xs">
            {['个人二维码 / 联系方式', '品牌 Logo + 门店信息', '水印位置 · 右下角'].map((w) => (
              <label key={w} className="flex items-center gap-2 text-muted-foreground">
                <span className="flex size-4 items-center justify-center rounded bg-primary text-primary-foreground">
                  <Check className="size-3" />
                </span>
                {w}
              </label>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" className="h-10 gap-1.5">
            <Copy className="size-4" />
            复制文案
          </Button>
          <Button className="h-10 gap-1.5">
            <Send className="size-4" />
            发送到微信
          </Button>
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
