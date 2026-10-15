'use client'

import { useState } from 'react'
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Segmented } from '@/components/geo/segmented'
import { radarDims } from '@/lib/cross-data'
import type { BrandResult, CrossReport } from '@/lib/cross-eval'
import { seriesColors, tooltipStyle } from '@/lib/chart-style'
import { cn } from '@/lib/utils'

type Mode = 'platform' | 'brand'

type Series = { key: string; label: string; color: string; values: number[] }

export function PlatformRadar({ report, brand }: { report: CrossReport; brand: BrandResult }) {
  const multiBrand = report.brands.length > 1
  const [mode, setMode] = useState<Mode>('platform')
  const [selPlatforms, setSelPlatforms] = useState<string[]>(report.platforms.slice(0, 3).map((p) => p.id))
  const [selBrands, setSelBrands] = useState<string[]>(report.brands.map((b) => b.id))

  const series: Series[] =
    mode === 'platform'
      ? report.platforms.map((p, i) => ({
          key: p.id,
          label: p.name,
          color: seriesColors[i % seriesColors.length],
          values: brand.radar[p.id],
        }))
      : report.brands.map((b, i) => ({
          key: b.id,
          label: b.name,
          color: seriesColors[i % seriesColors.length],
          values: radarDims.map((_, d) =>
            Math.round(report.platforms.reduce((s, p) => s + b.radar[p.id][d], 0) / report.platforms.length),
          ),
        }))

  const selected = mode === 'platform' ? selPlatforms : selBrands
  const setSelected = mode === 'platform' ? setSelPlatforms : setSelBrands
  const toggle = (key: string) =>
    setSelected((s) => (s.includes(key) ? (s.length > 1 ? s.filter((x) => x !== key) : s) : [...s, key]))

  const data = radarDims.map((dim, i) => {
    const row: Record<string, string | number> = { dim }
    series.forEach((s) => {
      row[s.label] = s.values[i]
    })
    return row
  })

  return (
    <div>
      {multiBrand && (
        <Segmented
          className="mb-3"
          value={mode}
          onChange={setMode}
          aria-label="雷达叠加方式"
          options={[
            { value: 'platform', label: `按平台叠加 · ${brand.name}` },
            { value: 'brand', label: '按品牌叠加 · 平台均值' },
          ]}
        />
      )}
      <div className="flex flex-wrap gap-2">
        {series.map((s) => {
          const on = selected.includes(s.key)
          return (
            <button
              key={s.key}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(s.key)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                on ? 'border-primary/40 bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:bg-muted',
              )}
            >
              <span className="size-2 rounded-full" style={{ background: s.color }} />
              {s.label}
            </button>
          )
        })}
      </div>
      <div className="mt-2 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="oklch(1 0 0 / 0.1)" />
            <PolarAngleAxis dataKey="dim" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            {series.map((s) =>
              selected.includes(s.key) ? (
                <Radar
                  key={s.key}
                  name={s.label}
                  dataKey={s.label}
                  stroke={s.color}
                  fill={s.color}
                  fillOpacity={0.12}
                  strokeWidth={2}
                />
              ) : null,
            )}
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
