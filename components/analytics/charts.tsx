'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const axis = { fontSize: 12, fill: 'oklch(0.68 0.02 255)' }
const gridStroke = 'oklch(1 0 0 / 0.06)'

const tooltipStyle = {
  background: 'oklch(0.21 0.025 255)',
  border: '1px solid oklch(1 0 0 / 0.1)',
  borderRadius: 10,
  fontSize: 12,
  color: 'oklch(0.96 0.005 250)',
}

const trend = [
  { d: '周一', 生成量: 320, 采纳量: 240 },
  { d: '周二', 生成量: 418, 采纳量: 300 },
  { d: '周三', 生成量: 386, 采纳量: 286 },
  { d: '周四', 生成量: 502, 采纳量: 388 },
  { d: '周五', 生成量: 640, 采纳量: 512 },
  { d: '周六', 生成量: 468, 采纳量: 360 },
  { d: '周日', 生成量: 402, 采纳量: 322 },
]

export function TrendChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={trend} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.65 0.19 250)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="oklch(0.65 0.19 250)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.72 0.15 195)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="oklch(0.72 0.15 195)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
        <XAxis dataKey="d" tick={axis} tickLine={false} axisLine={false} />
        <YAxis tick={axis} tickLine={false} axisLine={false} width={48} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: gridStroke }} />
        <Area
          type="monotone"
          dataKey="生成量"
          stroke="oklch(0.65 0.19 250)"
          strokeWidth={2}
          fill="url(#g1)"
        />
        <Area
          type="monotone"
          dataKey="采纳量"
          stroke="oklch(0.72 0.15 195)"
          strokeWidth={2}
          fill="url(#g2)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

const engineData = [
  { name: 'AI 图片', value: 4200 },
  { name: 'AI 图文', value: 3100 },
  { name: '朋友圈', value: 2600 },
  { name: 'AI 视频', value: 1400 },
  { name: 'AI PPT', value: 900 },
]

export function EngineBarChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={engineData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
        <XAxis dataKey="name" tick={axis} tickLine={false} axisLine={false} />
        <YAxis tick={axis} tickLine={false} axisLine={false} width={48} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'oklch(1 0 0 / 0.04)' }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="oklch(0.65 0.19 250)" barSize={38} />
      </BarChart>
    </ResponsiveContainer>
  )
}

const channelData = [
  { name: '朋友圈', value: 38, color: 'oklch(0.65 0.19 250)' },
  { name: '视频号', value: 24, color: 'oklch(0.72 0.15 195)' },
  { name: '抖音', value: 21, color: 'oklch(0.75 0.16 85)' },
  { name: '小红书', value: 17, color: 'oklch(0.7 0.16 300)' },
]

export function ChannelPieChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Tooltip contentStyle={tooltipStyle} />
        <Pie
          data={channelData}
          dataKey="value"
          nameKey="name"
          innerRadius={58}
          outerRadius={92}
          paddingAngle={3}
          strokeWidth={0}
        >
          {channelData.map((c) => (
            <Cell key={c.name} fill={c.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

export const channelLegend = channelData

const efficiency = [
  { m: '1月', 人工: 42, 平台: 8 },
  { m: '2月', 人工: 44, 平台: 6 },
  { m: '3月', 人工: 40, 平台: 5 },
  { m: '4月', 人工: 46, 平台: 4 },
  { m: '5月', 人工: 43, 平台: 3.5 },
  { m: '6月', 人工: 45, 平台: 3 },
]

export function EfficiencyLineChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={efficiency} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
        <XAxis dataKey="m" tick={axis} tickLine={false} axisLine={false} />
        <YAxis tick={axis} tickLine={false} axisLine={false} width={36} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: gridStroke }} />
        <Line
          type="monotone"
          dataKey="人工"
          stroke="oklch(0.68 0.18 25)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="平台"
          stroke="oklch(0.72 0.15 195)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
