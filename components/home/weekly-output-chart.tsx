'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const data = [
  { day: '周一', 图片: 120, 视频: 32, 图文: 68 },
  { day: '周二', 图片: 145, 视频: 40, 图文: 72 },
  { day: '周三', 图片: 132, 视频: 38, 图文: 90 },
  { day: '周四', 图片: 168, 视频: 52, 图文: 84 },
  { day: '周五', 图片: 195, 视频: 61, 图文: 110 },
  { day: '周六', 图片: 152, 视频: 45, 图文: 96 },
  { day: '周日', 图片: 178, 视频: 58, 图文: 105 },
]

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="mb-1.5 font-medium text-popover-foreground">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.dataKey}</span>
          <span className="ml-auto font-medium text-popover-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export function WeeklyOutputChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="c1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.5} />
              <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="c2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.5} />
              <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="c3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="day"
            stroke="var(--muted-foreground)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="图片" stroke="var(--chart-1)" fill="url(#c1)" strokeWidth={2} />
          <Area type="monotone" dataKey="图文" stroke="var(--chart-3)" fill="url(#c3)" strokeWidth={2} />
          <Area type="monotone" dataKey="视频" stroke="var(--chart-2)" fill="url(#c2)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
