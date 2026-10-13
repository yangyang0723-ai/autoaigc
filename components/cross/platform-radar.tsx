'use client'

import { useState } from 'react'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { radarDims, radarScores } from '@/lib/cross-data'
import { seriesColors, tooltipStyle } from '@/lib/chart-style'
import { cn } from '@/lib/utils'

const names = Object.keys(radarScores)

export function PlatformRadar() {
  const [selected, setSelected] = useState<string[]>(['DeepSeek', '豆包', '文心一言'])

  const toggle = (n: string) =>
    setSelected((s) => (s.includes(n) ? (s.length > 1 ? s.filter((x) => x !== n) : s) : [...s, n]))

  const data = radarDims.map((dim, i) => {
    const row: Record<string, string | number> = { dim }
    names.forEach((n) => {
      row[n] = radarScores[n][i]
    })
    return row
  })

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {names.map((n, i) => {
          const on = selected.includes(n)
          return (
            <button
              key={n}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(n)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                on ? 'border-primary/40 bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:bg-muted',
              )}
            >
              <span className="size-2 rounded-full" style={{ background: seriesColors[i] }} />
              {n}
            </button>
          )
        })}
      </div>
      <div className="mt-2 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="oklch(1 0 0 / 0.1)" />
            <PolarAngleAxis dataKey="dim" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
            <PolarRadiusAxis domain={[40, 100]} tick={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            {names.map((n, i) =>
              selected.includes(n) ? (
                <Radar
                  key={n}
                  name={n}
                  dataKey={n}
                  stroke={seriesColors[i]}
                  fill={seriesColors[i]}
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
