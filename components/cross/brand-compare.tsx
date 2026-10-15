'use client'

import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Segmented } from '@/components/geo/segmented'
import { axis, gridStroke, seriesColors, tooltipStyle } from '@/lib/chart-style'
import type { CrossReport } from '@/lib/cross-eval'
import { cn } from '@/lib/utils'

type Metric = 'mention' | 'first' | 'top3' | 'sov'

const metrics: { value: Metric; label: string }[] = [
  { value: 'mention', label: '提及率' },
  { value: 'first', label: '首推率' },
  { value: 'top3', label: 'TOP3' },
  { value: 'sov', label: 'SOV' },
]

export function BrandCompare({ report }: { report: CrossReport }) {
  const [metric, setMetric] = useState<Metric>('mention')
  const multi = report.brands.length > 1
  const ranked = [...report.brands].sort((a, b) => b.overall.sov - a.overall.sov)

  const best = (key: Metric | 'pos') => Math.max(...report.brands.map((b) => b.overall[key]))

  const data = report.platforms.map((p) => {
    const row: Record<string, string | number> = { name: p.name }
    report.brands.forEach((b) => {
      row[b.name] = b.cells[p.id][metric]
    })
    return row
  })

  const cols: { key: Metric | 'pos'; label: string }[] = [
    { key: 'mention', label: '提及率' },
    { key: 'first', label: '首推率' },
    { key: 'top3', label: 'TOP3' },
    { key: 'sov', label: 'SOV' },
    { key: 'pos', label: '正面情感' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="w-12 px-3 py-2 font-medium">排名</th>
              <th className="px-3 py-2 font-medium">品牌</th>
              {cols.map((c) => (
                <th key={c.key} className="px-3 py-2 text-right font-medium">
                  {c.label}
                </th>
              ))}
              <th className="px-3 py-2 font-medium">最强平台</th>
              <th className="px-3 py-2 font-medium">最弱平台</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((b, rank) => {
              const sorted = [...report.platforms].sort((x, y) => b.cells[y.id].mention - b.cells[x.id].mention)
              const idx = report.brands.findIndex((x) => x.id === b.id)
              return (
                <tr key={b.id} className="border-b border-border/60 last:border-0">
                  <td className="px-3 py-3 font-mono text-xs text-muted-foreground">#{rank + 1}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-2 font-semibold">
                      <span className="size-2.5 rounded-full" style={{ background: seriesColors[idx % seriesColors.length] }} />
                      {b.name}
                    </span>
                  </td>
                  {cols.map((c) => {
                    const v = b.overall[c.key]
                    const isBest = multi && v === best(c.key)
                    return (
                      <td
                        key={c.key}
                        className={cn('px-3 py-3 text-right font-mono', isBest && 'font-bold text-emerald-400')}
                      >
                        {v}
                        <span className="text-[10px] text-muted-foreground">%</span>
                      </td>
                    )
                  })}
                  <td className="px-3 py-3 text-xs">
                    {sorted[0].name}
                    <span className="ml-1 font-mono text-muted-foreground">{b.cells[sorted[0].id].mention}%</span>
                  </td>
                  <td className="px-3 py-3 text-xs">
                    {sorted[sorted.length - 1].name}
                    <span className="ml-1 font-mono text-muted-foreground">
                      {b.cells[sorted[sorted.length - 1].id].mention}%
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            {multi ? '分平台品牌对比' : '分平台表现'}
            ，单位 %
          </p>
          <Segmented options={metrics} value={metric} onChange={setMetric} aria-label="对比指标" />
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid stroke={gridStroke} vertical={false} />
              <XAxis dataKey="name" tick={axis} tickLine={false} axisLine={false} />
              <YAxis tick={axis} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'oklch(1 0 0 / 0.04)' }} formatter={(v) => `${v}%`} />
              {multi && <Legend wrapperStyle={{ fontSize: 12 }} />}
              {report.brands.map((b, i) => (
                <Bar
                  key={b.id}
                  dataKey={b.name}
                  fill={seriesColors[i % seriesColors.length]}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={36}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
