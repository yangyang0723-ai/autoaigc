'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { seriesColors, tooltipStyle } from '@/lib/chart-style'

const defaultSov = [
  { name: '星河汽车', value: 28.4 },
  { name: '极光汽车', value: 24.1 },
  { name: '远山汽车', value: 19.3 },
  { name: '澜海汽车', value: 14.8 },
  { name: '云岭汽车', value: 8.9 },
  { name: '其他', value: 4.5 },
]

export function SovPie({ data: sov = defaultSov }: { data?: { name: string; value: number }[] }) {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row lg:flex-col xl:flex-row">
      <div className="relative h-48 w-48 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
            <Pie data={sov} dataKey="value" nameKey="name" innerRadius={54} outerRadius={84} paddingAngle={3} strokeWidth={0}>
              {sov.map((s, i) => (
                <Cell key={s.name} fill={seriesColors[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-xl font-bold">{sov[0].value}%</span>
          <span className="text-[11px] text-muted-foreground">本品 SOV</span>
        </div>
      </div>
      <ul className="w-full space-y-2 text-sm">
        {sov.map((s, i) => (
          <li key={s.name} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full" style={{ background: seriesColors[i] }} />
            <span className={i === 0 ? 'font-medium' : 'text-muted-foreground'}>{s.name}</span>
            <span className="ml-auto font-mono text-xs">{s.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
