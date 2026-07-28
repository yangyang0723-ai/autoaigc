'use client'

import { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Image as ImageIcon,
  FileText,
  Clock,
  Download,
  ThumbsUp,
  Users,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  TrendChart,
  EngineBarChart,
  ChannelPieChart,
  EfficiencyLineChart,
  channelLegend,
} from '@/components/analytics/charts'

const ranges = ['近 7 天', '近 30 天', '本季度', '本年'] as const

const kpis = [
  { label: '内容生成总量', value: '12,480', delta: '+18.2%', up: true, icon: ImageIcon },
  { label: '素材采纳率', value: '78.6%', delta: '+4.3%', up: true, icon: ThumbsUp },
  { label: '平均生成耗时', value: '32s', delta: '-12.5%', up: true, icon: Clock },
  { label: '活跃门店数', value: '326', delta: '+9', up: true, icon: Users },
]

const topContent = [
  { title: '星耀 07 雪地试驾大片', type: '视频', channel: '视频号', views: '48.2w', rate: 92 },
  { title: '双旦购车节朋友圈九宫格', type: '图片', channel: '朋友圈', views: '31.6w', rate: 88 },
  { title: '智能座舱功能图文', type: '图文', channel: '小红书', views: '22.4w', rate: 81 },
  { title: '限时置换补贴海报', type: '图片', channel: '朋友圈', views: '18.9w', rate: 76 },
  { title: '城市夜景氛围短片', type: '视频', channel: '抖音', views: '15.3w', rate: 73 },
]

const stores = [
  { name: '华东-上海旗舰店', count: 1240, rate: 86 },
  { name: '华南-深圳福田店', count: 1086, rate: 82 },
  { name: '华北-北京朝阳店', count: 968, rate: 79 },
  { name: '西南-成都高新店', count: 842, rate: 77 },
  { name: '华中-武汉光谷店', count: 736, rate: 74 },
]

export default function AnalyticsPage() {
  const [range, setRange] = useState<(typeof ranges)[number]>('近 7 天')

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">数据分析中台</h1>
          <p className="text-sm text-muted-foreground">
            全域内容生产与传播效果洞察，辅助营销策略决策
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm transition-colors',
                range === r ? 'bg-secondary text-foreground' : 'text-muted-foreground',
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-4">
            <div className="flex items-center justify-between">
              <span className="grid size-9 place-items-center rounded-lg bg-primary/12 text-primary">
                <k.icon className="size-4.5" />
              </span>
              <Badge
                variant={k.up ? 'success' : 'danger'}
                className="gap-0.5 px-1.5 py-0 text-[11px]"
              >
                {k.up ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                {k.delta}
              </Badge>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{k.value}</p>
            <p className="text-sm text-muted-foreground">{k.label}</p>
          </Card>
        ))}
      </div>

      {/* Trend + channel */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">生成量 vs 采纳量趋势</h2>
              <p className="text-xs text-muted-foreground">{range}内容生产走势</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-chart-1" />
                生成量
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-chart-2" />
                采纳量
              </span>
            </div>
          </div>
          <TrendChart />
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold">渠道分发占比</h2>
          <p className="text-xs text-muted-foreground">各平台内容投放分布</p>
          <ChannelPieChart />
          <div className="mt-2 grid grid-cols-2 gap-2">
            {channelLegend.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="size-2 rounded-full" style={{ background: c.color }} />
                  {c.name}
                </span>
                <span className="font-medium tabular-nums">{c.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Engine usage + efficiency */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-sm font-semibold">各生成引擎使用量</h2>
          <p className="text-xs text-muted-foreground">五大引擎调用次数对比</p>
          <EngineBarChart />
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">单条内容生产耗时（分钟）</h2>
              <p className="text-xs text-muted-foreground">人工制作 vs 平台生成</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-chart-5" />
                人工
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-chart-2" />
                平台
              </span>
            </div>
          </div>
          <EfficiencyLineChart />
        </Card>
      </div>

      {/* Top content + store ranking */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">热门内容 TOP 5</h2>
            <button className="flex items-center gap-1 text-xs text-primary hover:underline">
              <Download className="size-3.5" />
              导出报表
            </button>
          </div>
          <div className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="py-2 pr-3 font-medium">内容标题</th>
                  <th className="px-3 py-2 font-medium">类型</th>
                  <th className="px-3 py-2 font-medium">渠道</th>
                  <th className="px-3 py-2 font-medium">曝光</th>
                  <th className="px-3 py-2 font-medium">互动率</th>
                </tr>
              </thead>
              <tbody>
                {topContent.map((c, i) => (
                  <tr
                    key={c.title}
                    className="border-b border-border/60 last:border-0 transition-colors hover:bg-secondary/40"
                  >
                    <td className="py-2.5 pr-3">
                      <span className="flex items-center gap-2">
                        <span className="grid size-5 place-items-center rounded bg-secondary text-[11px] font-medium text-muted-foreground">
                          {i + 1}
                        </span>
                        <span className="font-medium">{c.title}</span>
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge variant="muted" className="px-1.5 py-0 text-[11px]">
                        {c.type}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{c.channel}</td>
                    <td className="px-3 py-2.5 tabular-nums">{c.views}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${c.rate}%` }}
                          />
                        </div>
                        <span className="tabular-nums text-muted-foreground">{c.rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <FileText className="size-4 text-primary" />
            <h2 className="text-sm font-semibold">门店活跃榜</h2>
          </div>
          <div className="space-y-3">
            {stores.map((s, i) => (
              <div key={s.name} className="flex items-center gap-3">
                <span
                  className={cn(
                    'grid size-6 shrink-0 place-items-center rounded-md text-[11px] font-semibold',
                    i < 3 ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground',
                  )}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-sm font-medium">{s.name}</span>
                    <span className="tabular-nums text-xs text-muted-foreground">{s.count}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${s.rate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
