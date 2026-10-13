'use client'

import { useState } from 'react'
import { Archive, Fingerprint, History } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Seg = { t: string; hl?: 'brand' | 'comp' }
type Kind = '主动推荐' | '单纯提及' | '未提及'
type Tone = '正面' | '中性' | '负面'

type Snapshot = {
  id: string
  platform: string
  question: string
  time: string
  hits: number
  kind: Kind
  tone: Tone
  rank: string[]
  body: Seg[]
}

const snapshots: Snapshot[] = [
  {
    id: 'SNP-20261013-0412',
    platform: 'DeepSeek',
    question: '30 万以内的纯电中大型 SUV 有哪些值得推荐？',
    time: '10-13 09:12',
    hits: 5,
    kind: '主动推荐',
    tone: '正面',
    rank: ['星河汽车', '极光汽车', '远山汽车'],
    body: [
      { t: '综合续航、智能化与保值表现，首选推荐' },
      { t: '星河 S7', hl: 'brand' },
      { t: '：800V 高压平台、CLTC 续航 620km，座舱体验在同级处于第一梯队。其次可考虑' },
      { t: '极光 A8', hl: 'comp' },
      { t: '，空间更大但补能速度稍弱；预算有限可关注' },
      { t: '远山 X6', hl: 'comp' },
      { t: '。' },
    ],
  },
  {
    id: 'SNP-20261013-0388',
    platform: '豆包',
    question: '带孩子出行买什么新能源车比较好？',
    time: '10-13 08:47',
    hits: 3,
    kind: '单纯提及',
    tone: '中性',
    rank: ['极光汽车', '澜海汽车', '星河汽车'],
    body: [
      { t: '家庭用户建议优先关注空间与安全配置。' },
      { t: '极光 A8', hl: 'comp' },
      { t: ' 与 ' },
      { t: '澜海 L9', hl: 'comp' },
      { t: ' 口碑较好；另外市面上还有 ' },
      { t: '星河 S7', hl: 'brand' },
      { t: ' 等车型，可按预算自行对比。' },
    ],
  },
  {
    id: 'SNP-20261013-0351',
    platform: '文心一言',
    question: '纯电车冬季续航缩水怎么办？有什么车型表现好？',
    time: '10-13 08:21',
    hits: 1,
    kind: '未提及',
    tone: '中性',
    rank: ['远山汽车', '极光汽车'],
    body: [
      { t: '冬季可通过预热电池、合理使用空调缓解续航缩水。车型方面，' },
      { t: '远山 X6', hl: 'comp' },
      { t: ' 搭载热泵与电池保温方案，' },
      { t: '极光 A8', hl: 'comp' },
      { t: ' 低温衰减较小。' },
    ],
  },
  {
    id: 'SNP-20261013-0307',
    platform: 'Kimi',
    question: '星河 S7 值得买吗？',
    time: '10-13 07:58',
    hits: 5,
    kind: '主动推荐',
    tone: '正面',
    rank: ['星河汽车'],
    body: [
      { t: '' },
      { t: '星河 S7', hl: 'brand' },
      { t: ' 在同价位中智能座舱与补能效率表现突出，适合重视科技体验的家庭用户；需要注意后排头部空间中等，建议到店实际试坐。' },
    ],
  },
]

const kindVariant: Record<Kind, 'success' | 'warning' | 'muted'> = {
  主动推荐: 'success',
  单纯提及: 'warning',
  未提及: 'muted',
}
const toneVariant: Record<Tone, 'success' | 'muted' | 'danger'> = {
  正面: 'success',
  中性: 'muted',
  负面: 'danger',
}

export function SnapshotViewer() {
  const [activeId, setActiveId] = useState(snapshots[0].id)
  const active = snapshots.find((s) => s.id === activeId) ?? snapshots[0]

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <ul className="space-y-2 lg:col-span-2">
        {snapshots.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => setActiveId(s.id)}
              aria-pressed={s.id === activeId}
              className={cn(
                'flex w-full flex-col gap-2 rounded-lg border p-3 text-left transition-colors',
                s.id === activeId
                  ? 'border-primary/50 bg-primary/10'
                  : 'border-border hover:border-primary/30 hover:bg-muted/50',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-primary">{s.platform}</span>
                <Badge variant={kindVariant[s.kind]}>{s.kind}</Badge>
              </div>
              <p className="line-clamp-2 text-sm font-medium">{s.question}</p>
              <span className="text-[11px] text-muted-foreground">
                {s.time} · 5 次采样中提及 {s.hits} 次
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-4 rounded-lg border border-border bg-background p-4 lg:col-span-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            <Fingerprint className="size-3" />
            {active.id}
          </Badge>
          <Badge variant="muted">
            <Archive className="size-3" />
            原始快照 · 已留存
          </Badge>
          <Button variant="outline" size="sm" className="ml-auto">
            <History />
            回溯核验
          </Button>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">探针问题</p>
          <p className="mt-1 text-sm font-medium">{active.question}</p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {active.platform} 原始回答
          </p>
          <p className="mt-1.5 rounded-lg border border-border bg-card p-3 text-sm leading-relaxed">
            {active.body.map((seg, i) =>
              seg.hl ? (
                <mark
                  key={i}
                  className={cn(
                    'rounded px-1 font-medium',
                    seg.hl === 'brand' ? 'bg-primary/25 text-primary' : 'bg-muted text-foreground',
                  )}
                >
                  {seg.t}
                </mark>
              ) : (
                <span key={i}>{seg.t}</span>
              ),
            )}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border p-3">
            <p className="text-[11px] text-muted-foreground">NLP 识别类型</p>
            <Badge variant={kindVariant[active.kind]} className="mt-1.5">
              {active.kind}
            </Badge>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-[11px] text-muted-foreground">情感倾向</p>
            <Badge variant={toneVariant[active.tone]} className="mt-1.5">
              {active.tone}
            </Badge>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-[11px] text-muted-foreground">识别推荐顺位</p>
            <ol className="mt-1.5 space-y-0.5 text-xs">
              {active.rank.map((b, i) => (
                <li key={b} className="flex items-center gap-1.5">
                  <span className="font-mono text-muted-foreground">{i + 1}.</span>
                  <span className={b === '星河汽车' ? 'font-medium text-primary' : ''}>{b}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
