'use client'

import { useState } from 'react'
import { BookOpenText, FileBadge2, Gauge, MessageSquareText, HelpCircle, UploadCloud, FileUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Entry = {
  title: string
  status: '已发布' | '待审核'
  version: string
  refs: number
  fields: [string, string][]
}

type Category = { id: string; label: string; icon: LucideIcon; entries: Entry[] }

const categories: Category[] = [
  {
    id: 'intro',
    label: '品牌介绍',
    icon: BookOpenText,
    entries: [
      {
        title: '品牌定位与理念',
        status: '已发布',
        version: 'v3.1',
        refs: 412,
        fields: [
          ['品牌定位', '高端智能纯电，面向家庭用户'],
          ['成立时间', '2018 年'],
          ['品牌理念', '让智能出行更安心'],
        ],
      },
      {
        title: '核心技术优势',
        status: '已发布',
        version: 'v2.4',
        refs: 286,
        fields: [
          ['电驱平台', '800V 高压平台'],
          ['座舱', '旗舰智能座舱 · 车规级 AI 芯片'],
          ['安全', '笼式车身 · 电池安全五重防护'],
        ],
      },
    ],
  },
  {
    id: 'spec',
    label: '产品参数',
    icon: Gauge,
    entries: [
      {
        title: '星河 S7 Max',
        status: '已发布',
        version: 'v4.0',
        refs: 603,
        fields: [
          ['CLTC 续航', '620 km'],
          ['电池容量', '100 kWh'],
          ['百公里加速', '3.9 s'],
          ['快充', '10%–80% 约 15 分钟'],
          ['指导价', '24.98–31.98 万元'],
        ],
      },
      {
        title: '星河 S7 Pro',
        status: '待审核',
        version: 'v1.2',
        refs: 0,
        fields: [
          ['CLTC 续航', '520 km'],
          ['电池容量', '82 kWh'],
          ['百公里加速', '5.6 s'],
        ],
      },
    ],
  },
  {
    id: 'cert',
    label: '资质专利',
    icon: FileBadge2,
    entries: [
      {
        title: 'C-NCAP 五星安全认证',
        status: '已发布',
        version: 'v1.0',
        refs: 198,
        fields: [
          ['认证机构', 'C-NCAP'],
          ['评级', '五星 · 2025 版规程'],
          ['证明文件', 'C-NCAP-2025-0417.pdf'],
        ],
      },
      {
        title: '电池热失控防护专利',
        status: '已发布',
        version: 'v1.1',
        refs: 74,
        fields: [
          ['专利号', 'ZL2023 1 0xxxxxx.x'],
          ['类型', '发明专利'],
        ],
      },
    ],
  },
  {
    id: 'script',
    label: '官方话术',
    icon: MessageSquareText,
    entries: [
      {
        title: '智能驾驶宣传话术',
        status: '已发布',
        version: 'v2.0',
        refs: 321,
        fields: [
          ['推荐表述', '组合辅助驾驶（L2），需驾驶员全程监控'],
          ['禁用表述', '自动驾驶 / 无人驾驶 / 解放双手'],
        ],
      },
      {
        title: '续航宣传话术',
        status: '已发布',
        version: 'v1.8',
        refs: 267,
        fields: [
          ['推荐表述', 'CLTC 工况续航 620km，实际续航因路况而异'],
          ['禁用表述', '续航无忧 / 超长续航 / 续航 800km'],
        ],
      },
    ],
  },
  {
    id: 'faq',
    label: '常见问答',
    icon: HelpCircle,
    entries: [
      {
        title: '电池质保政策是什么？',
        status: '已发布',
        version: 'v1.3',
        refs: 156,
        fields: [['标准回答', '首任车主电池终身质保，具体以购车合同为准']],
      },
      {
        title: '星河 S7 支持哪些充电方式？',
        status: '已发布',
        version: 'v1.0',
        refs: 92,
        fields: [['标准回答', '支持 800V 超充、家用交流桩及 V2L 对外放电']],
      },
    ],
  },
]

export function KnowledgeLibrary() {
  const [active, setActive] = useState(categories[1].id)
  const cat = categories.find((c) => c.id === active) ?? categories[0]

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      <div className="flex flex-col gap-3 lg:col-span-1">
        <ul className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {categories.map((c) => {
            const Icon = c.icon
            const on = c.id === active
            return (
              <li key={c.id} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setActive(c.id)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors',
                    on ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border hover:bg-muted',
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="flex-1 whitespace-nowrap font-medium">{c.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">{c.entries.length * 64}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="hidden rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 text-center lg:block">
          <span className="mx-auto flex size-10 items-center justify-center rounded-lg bg-primary/12 text-primary">
            <UploadCloud className="size-5" />
          </span>
          <p className="mt-2 text-sm font-semibold">上传结构化资料</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            支持品牌介绍、产品参数表、资质专利、官方话术（xlsx / docx / pdf / csv）
          </p>
          <Button size="sm" className="mt-3">
            <FileUp />
            选择文件
          </Button>
        </div>
      </div>

      <div className="space-y-3 lg:col-span-3">
        {cat.entries.map((e) => (
          <div key={e.title} className="rounded-xl border border-border bg-background p-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold">{e.title}</p>
              <Badge variant={e.status === '已发布' ? 'success' : 'warning'}>{e.status}</Badge>
              <Badge variant="outline" className="font-mono">
                {e.version}
              </Badge>
              <span className="ml-auto text-xs text-muted-foreground">
                近 30 天被引用 <span className="font-mono text-foreground">{e.refs}</span> 次
              </span>
            </div>
            <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {e.fields.map(([k, v]) => (
                <div key={k} className="flex items-baseline gap-3 border-b border-border/50 pb-1.5 text-sm">
                  <dt className="w-20 shrink-0 text-xs text-muted-foreground">{k}</dt>
                  <dd className="min-w-0 flex-1 font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  )
}
