'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  CartesianGrid,
  Cell,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'
import { Sparkles, Plus, Waves } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants, Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Segmented } from '@/components/geo/segmented'
import { axis, gridStroke, tooltipStyle } from '@/lib/chart-style'
import { cn } from '@/lib/utils'

type IntentType = '选型推荐' | '品牌评价' | '对比选型' | '痛点解决' | '品牌词' | '品类词'
type Filter = IntentType | '全部'

type Keyword = { q: string; type: IntentType; heat: number; cover: number; trend: string }

const HEAT_LINE = 60
const COVER_LINE = 35

const keywords: Keyword[] = [
  { q: '30 万内纯电 SUV 哪款值得买', type: '选型推荐', heat: 92, cover: 41, trend: '+18%' },
  { q: '家用中大型 SUV 推荐 2026', type: '选型推荐', heat: 88, cover: 58, trend: '+9%' },
  { q: '带孩子出行买什么车好', type: '选型推荐', heat: 71, cover: 22, trend: '+34%' },
  { q: '适合北方冬天的电动车推荐', type: '选型推荐', heat: 64, cover: 18, trend: '+41%' },
  { q: '星河 S7 值得买吗', type: '品牌评价', heat: 58, cover: 82, trend: '+6%' },
  { q: '星河汽车售后怎么样', type: '品牌评价', heat: 49, cover: 64, trend: '+3%' },
  { q: '星河 S7 真实车主口碑', type: '品牌评价', heat: 52, cover: 46, trend: '+12%' },
  { q: '星河汽车靠谱吗', type: '品牌评价', heat: 44, cover: 77, trend: '+2%' },
  { q: '星河 S7 和极光 A8 怎么选', type: '对比选型', heat: 76, cover: 52, trend: '+15%' },
  { q: '星河 S7 vs 远山 X6 续航对比', type: '对比选型', heat: 61, cover: 31, trend: '+27%' },
  { q: '20 万级纯电轿车对比', type: '对比选型', heat: 66, cover: 36, trend: '+11%' },
  { q: '800V 平台车型有哪些', type: '对比选型', heat: 57, cover: 24, trend: '+38%' },
  { q: '纯电车冬季续航缩水怎么办', type: '痛点解决', heat: 84, cover: 19, trend: '+46%' },
  { q: '电动车充电焦虑怎么解决', type: '痛点解决', heat: 79, cover: 33, trend: '+21%' },
  { q: '新能源车电池衰减多久换', type: '痛点解决', heat: 68, cover: 26, trend: '+29%' },
  { q: '辅助驾驶安全吗', type: '痛点解决', heat: 72, cover: 38, trend: '+16%' },
  { q: '星河汽车', type: '品牌词', heat: 96, cover: 94, trend: '+2%' },
  { q: '星河 S7', type: '品牌词', heat: 90, cover: 91, trend: '+4%' },
  { q: '星河汽车官网', type: '品牌词', heat: 46, cover: 88, trend: '+1%' },
  { q: '星河汽车门店', type: '品牌词', heat: 39, cover: 59, trend: '+8%' },
  { q: '中大型纯电 SUV', type: '品类词', heat: 85, cover: 47, trend: '+14%' },
  { q: '高端新能源品牌', type: '品类词', heat: 74, cover: 39, trend: '+19%' },
  { q: '增程还是纯电', type: '品类词', heat: 81, cover: 28, trend: '+25%' },
  { q: '换电和快充哪个好', type: '品类词', heat: 63, cover: 21, trend: '+33%' },
]

const isBlueOcean = (k: Keyword) => k.heat >= HEAT_LINE && k.cover <= COVER_LINE
const opportunity = (k: Keyword) => Math.round((k.heat * (100 - k.cover)) / 100)

const filters: Filter[] = ['全部', '选型推荐', '品牌评价', '对比选型', '痛点解决', '品牌词', '品类词']

function ScatterTooltip({ active, payload }: { active?: boolean; payload?: { payload: Keyword }[] }) {
  if (!active || !payload?.length) return null
  const k = payload[0].payload
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-medium text-popover-foreground">{k.q}</p>
      <p className="text-muted-foreground">
        热度 <span className="font-mono text-popover-foreground">{k.heat}</span> · 占位率{' '}
        <span className="font-mono text-popover-foreground">{k.cover}%</span>
      </p>
    </div>
  )
}

export function IntentExplorer() {
  const [filter, setFilter] = useState<Filter>('全部')
  const [onlyBlue, setOnlyBlue] = useState(false)

  const rows = useMemo(
    () =>
      keywords
        .filter((k) => (filter === '全部' ? true : k.type === filter))
        .filter((k) => (onlyBlue ? isBlueOcean(k) : true))
        .sort((a, b) => opportunity(b) - opportunity(a)),
    [filter, onlyBlue],
  )

  const scatterData = useMemo(
    () => keywords.filter((k) => (filter === '全部' ? true : k.type === filter)),
    [filter],
  )

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <Segmented
          value={filter}
          onChange={setFilter}
          aria-label="意图类型"
          options={filters.map((f) => ({ value: f, label: f }))}
        />
        <button
          type="button"
          aria-pressed={onlyBlue}
          onClick={() => setOnlyBlue((v) => !v)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
            onlyBlue
              ? 'border-accent/40 bg-accent/15 text-accent'
              : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          <Waves className="size-3.5" />
          仅看蓝海词
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>机会象限图</CardTitle>
          <CardDescription>
            横轴为用户提问热度，纵轴为品牌在该问题回答中的占位率；右下角为高流量、低占位的蓝海区
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 12, right: 16, left: -8, bottom: 8 }}>
                <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="heat"
                  name="热度"
                  domain={[30, 100]}
                  tick={axis}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: '提问热度', position: 'insideBottom', offset: -2, fill: 'var(--muted-foreground)', fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="cover"
                  name="占位率"
                  domain={[0, 100]}
                  tick={axis}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <ZAxis range={[70, 70]} />
                <ReferenceArea
                  x1={HEAT_LINE}
                  x2={100}
                  y1={0}
                  y2={COVER_LINE}
                  fill="var(--accent)"
                  fillOpacity={0.1}
                  label={{ value: '蓝海区', fill: 'var(--accent)', fontSize: 12, position: 'insideBottomRight' }}
                />
                <ReferenceLine x={HEAT_LINE} stroke="oklch(1 0 0 / 0.2)" strokeDasharray="4 4" />
                <ReferenceLine y={COVER_LINE} stroke="oklch(1 0 0 / 0.2)" strokeDasharray="4 4" />
                <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={scatterData}>
                  {scatterData.map((k) => (
                    <Cell
                      key={k.q}
                      fill={isBlueOcean(k) ? 'var(--accent)' : 'var(--chart-1)'}
                      fillOpacity={isBlueOcean(k) ? 1 : 0.6}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>意图词矩阵</CardTitle>
            <CardDescription className="mt-1">按机会分 = 热度 × (1 − 占位率) 降序</CardDescription>
          </div>
          <Badge variant="muted">{rows.length} 个意图词</Badge>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-medium">意图词</th>
                <th className="px-3 py-2 font-medium">类型</th>
                <th className="px-3 py-2 font-medium">提问热度</th>
                <th className="px-3 py-2 text-right font-medium">品牌占位率</th>
                <th className="px-3 py-2 text-right font-medium">热度趋势</th>
                <th className="px-3 py-2 text-right font-medium">机会分</th>
                <th className="py-2 pl-3 text-right font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((k) => {
                const blue = isBlueOcean(k)
                return (
                  <tr key={k.q} className="border-b border-border/60 last:border-0">
                    <td className="py-3 pr-3">
                      <span className="font-medium">{k.q}</span>
                      {blue && (
                        <Badge variant="accent" className="ml-2">
                          蓝海
                        </Badge>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <Badge variant="muted">{k.type}</Badge>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${k.heat}%` }} />
                        </div>
                        <span className="font-mono text-xs">{k.heat}</span>
                      </div>
                    </td>
                    <td
                      className={cn(
                        'px-3 py-3 text-right font-mono',
                        k.cover <= COVER_LINE ? 'text-destructive' : k.cover >= 70 ? 'text-emerald-400' : '',
                      )}
                    >
                      {k.cover}%
                    </td>
                    <td className="px-3 py-3 text-right font-mono text-xs text-emerald-400">{k.trend}</td>
                    <td className="px-3 py-3 text-right font-mono font-semibold">{opportunity(k)}</td>
                    <td className="py-3 pl-3">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Plus />
                          监测
                        </Button>
                        <Link href="/text" className={buttonVariants({ variant: blue ? 'default' : 'outline', size: 'sm' })}>
                          <Sparkles />
                          生成内容
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                    当前筛选下暂无意图词
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
