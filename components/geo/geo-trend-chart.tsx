'use client'

import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Segmented } from '@/components/geo/segmented'
import { axis, gridStroke, tooltipStyle } from '@/lib/chart-style'

type MetricKey = 'mention' | 'first' | 'top3' | 'sov'

const metrics: Record<MetricKey, { label: string; start: number; end: number; comp: number; amp: number }> = {
  mention: { label: 'AI 提及率', start: 62, end: 71.3, comp: 58, amp: 1.6 },
  first: { label: '首推率', start: 18, end: 24.6, comp: 21, amp: 1.3 },
  top3: { label: 'TOP3 推荐率', start: 41, end: 52.1, comp: 47, amp: 1.8 },
  sov: { label: 'SOV 声量份额', start: 22, end: 28.4, comp: 19, amp: 1.1 },
}

const DIP_FROM = 17
const DIP_TO = 19

function buildSeries(key: MetricKey) {
  const m = metrics[key]
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(2026, 8, 14 + i)
    const label = `${d.getMonth() + 1}/${d.getDate()}`
    const dip = i >= DIP_FROM && i <= DIP_TO ? m.amp * 2.4 : 0
    const brand = m.start + ((m.end - m.start) * i) / 29 + Math.sin(i * 1.3) * m.amp - dip
    const comp = m.comp + Math.sin(i * 0.9 + 1) * m.amp * 0.8 + i * 0.03
    return { label, brand: Number(brand.toFixed(1)), comp: Number(comp.toFixed(1)) }
  })
}

export function GeoTrendChart({ defaultMetric = 'mention' }: { defaultMetric?: MetricKey }) {
  const [metric, setMetric] = useState<MetricKey>(defaultMetric)
  const data = useMemo(() => buildSeries(metric), [metric])

  return (
    <div>
      <Segmented
        value={metric}
        onChange={setMetric}
        aria-label="指标切换"
        options={(Object.keys(metrics) as MetricKey[]).map((k) => ({ value: k, label: metrics[k].label }))}
      />
      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis dataKey="label" tick={axis} tickLine={false} axisLine={false} interval={4} />
            <YAxis
              tick={axis}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={{ stroke: gridStroke }}
              formatter={(v) => `${v}%`}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <ReferenceArea
              x1={data[DIP_FROM].label}
              x2={data[DIP_TO].label}
              fill="var(--chart-5)"
              fillOpacity={0.1}
              label={{ value: '模型升级波动', fill: 'var(--muted-foreground)', fontSize: 11, position: 'insideTop' }}
            />
            <Line
              type="monotone"
              dataKey="brand"
              name="星河汽车"
              stroke="var(--chart-1)"
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="comp"
              name="竞品均值"
              stroke="var(--chart-4)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
