'use client'

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import { axis, gridStroke, tooltipStyle } from '@/lib/chart-style'

const trend = [
  { w: '第 1 周', sources: 12, mention: 58.1 },
  { w: '第 2 周', sources: 31, mention: 60.4 },
  { w: '第 3 周', sources: 56, mention: 62.9 },
  { w: '第 4 周', sources: 88, mention: 65.2 },
  { w: '第 5 周', sources: 127, mention: 67.4 },
  { w: '第 6 周', sources: 174, mention: 69.1 },
  { w: '第 7 周', sources: 226, mention: 70.2 },
  { w: '第 8 周', sources: 281, mention: 71.3 },
]

type Index = '已收录' | '待收录' | '未收录'
const indexVariant: Record<Index, 'success' | 'warning' | 'danger'> = {
  已收录: 'success',
  待收录: 'warning',
  未收录: 'danger',
}

const tracked: {
  title: string
  platform: string
  time: string
  index: Index
  reads: string
  likes: string
  cited: number
}[] = [
  { title: '星河 S7 vs 同级竞品：参数与体验对照', platform: '知乎', time: '昨天 12:00', index: '已收录', reads: '12,480', likes: '1,026', cited: 4 },
  { title: '家庭第二辆车，我为什么选了纯电 SUV', platform: '小红书', time: '昨天 19:30', index: '已收录', reads: '8,931', likes: '1,540', cited: 3 },
  { title: '一图看懂星河 S7 配置与价格', platform: '公众号', time: '周一 08:00', index: '待收录', reads: '5,206', likes: '312', cited: 0 },
  { title: '纯电车冬季续航真相：十项实测', platform: '知乎', time: '周日 12:00', index: '已收录', reads: '21,364', likes: '2,877', cited: 5 },
  { title: '800V 超充到底快在哪？', platform: '抖音', time: '周六 21:00', index: '未收录', reads: '36,720', likes: '4,201', cited: 0 },
]

export function UgcTracking() {
  return (
    <div className="flex flex-col gap-5">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={trend} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
            <XAxis dataKey="w" tick={axis} tickLine={false} axisLine={false} />
            <YAxis yAxisId="l" tick={axis} tickLine={false} axisLine={false} />
            <YAxis
              yAxisId="r"
              orientation="right"
              tick={axis}
              tickLine={false}
              axisLine={false}
              domain={[55, 75]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'oklch(1 0 0 / 0.04)' }} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Bar yAxisId="l" dataKey="sources" name="累计被收录信源数" fill="var(--chart-2)" fillOpacity={0.7} radius={[6, 6, 0, 0]} barSize={32} />
            <Line yAxisId="r" type="monotone" dataKey="mention" name="AI 提及率" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="py-2 pr-3 font-medium">已发布内容</th>
              <th className="px-3 py-2 font-medium">平台</th>
              <th className="px-3 py-2 font-medium">收录状态</th>
              <th className="px-3 py-2 text-right font-medium">阅读</th>
              <th className="px-3 py-2 text-right font-medium">互动</th>
              <th className="py-2 pl-3 text-right font-medium">被 AI 引用</th>
            </tr>
          </thead>
          <tbody>
            {tracked.map((t) => (
              <tr key={t.title} className="border-b border-border/60 last:border-0">
                <td className="py-3 pr-3">
                  <p className="font-medium">{t.title}</p>
                  <p className="text-[11px] text-muted-foreground">{t.time}</p>
                </td>
                <td className="px-3 py-3">
                  <Badge variant="outline">{t.platform}</Badge>
                </td>
                <td className="px-3 py-3">
                  <Badge variant={indexVariant[t.index]}>{t.index}</Badge>
                </td>
                <td className="px-3 py-3 text-right font-mono">{t.reads}</td>
                <td className="px-3 py-3 text-right font-mono">{t.likes}</td>
                <td className="py-3 pl-3 text-right font-mono">{t.cited} 个模型</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
