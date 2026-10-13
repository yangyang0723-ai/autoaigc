import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHero } from '@/components/geo/page-hero'
import { StatCard } from '@/components/geo/stat-card'
import { PeriodFilter } from '@/components/geo/segmented'
import { GeoTrendChart } from '@/components/geo/geo-trend-chart'
import { SovPie } from '@/components/geo/sov-pie'
import { ProbeLibrary } from '@/components/geo/probe-library'
import { SnapshotViewer } from '@/components/geo/snapshot-viewer'
import { platforms } from '@/lib/geo-data'
import {
  Radar,
  Eye,
  Crown,
  Medal,
  PieChart,
  Download,
  Library,
  Repeat,
  BrainCircuit,
  Archive,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

const pipeline = [
  {
    icon: Library,
    title: '标准化探针词库',
    desc: '固定问题口径，保证不同周期、不同品牌的数据具备可比性。',
  },
  {
    icon: Repeat,
    title: '批量模拟 · 多次采样',
    desc: '模拟真实用户身份与上下文，定时轮询主流大模型，同题多次采样抵消随机性误差。',
  },
  {
    icon: BrainCircuit,
    title: 'NLP 语义解析',
    desc: '识别推荐品牌及顺位，区分“主动推荐”与“单纯提及”，按统一口径统计指标。',
  },
  {
    icon: Archive,
    title: '原始快照留存',
    desc: '全量留存 AI 回答原文，支持回溯核验与问题定位。',
  },
]

export default function GeoPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHero
        module="GEO 品牌评估"
        icon={Radar}
        title="量化星河汽车在各大模型中的推荐优先级"
        desc="检测并评判品牌在各 AI 搜索引擎中的提及率、排名与情感倾向，追踪品牌 AI 可见度的长期趋势与短期波动。"
      >
        <PeriodFilter />
        <Button variant="outline" size="lg">
          <Download />
          导出报告
        </Button>
      </PageHero>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={Eye}
          label="AI 提及率"
          value="71.3"
          unit="%"
          delta="+4.2pp"
          hint="被提及次数 / 总采样次数"
        />
        <StatCard
          icon={Crown}
          label="首推率"
          value="24.6"
          unit="%"
          delta="+2.1pp"
          hint="回答中顺位排第 1 的占比"
        />
        <StatCard
          icon={Medal}
          label="TOP3 推荐率"
          value="52.1"
          unit="%"
          delta="+3.7pp"
          hint="回答中顺位进入前 3 的占比"
        />
        <StatCard
          icon={PieChart}
          label="SOV 声量份额"
          value="28.4"
          unit="%"
          delta="-0.6pp"
          direction="down"
          good={false}
          hint="本品推荐占全部品牌推荐的份额"
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>可见度趋势</CardTitle>
            <CardDescription>近 30 天 · 每日聚合自 6 平台 × 186 条探针 × 5 次采样</CardDescription>
          </CardHeader>
          <CardContent>
            <GeoTrendChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>SOV 声量份额</CardTitle>
            <CardDescription>中大型纯电 SUV 品类 · 全平台加权</CardDescription>
          </CardHeader>
          <CardContent>
            <SovPie />
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>分平台表现</CardTitle>
            <CardDescription className="mt-1">各大模型对本品牌的推荐优先级与情感倾向</CardDescription>
          </div>
          <Badge variant="muted">6 个平台</Badge>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-medium">AI 平台</th>
                <th className="px-3 py-2 font-medium">提及率</th>
                <th className="px-3 py-2 text-right font-medium">首推率</th>
                <th className="px-3 py-2 text-right font-medium">TOP3</th>
                <th className="px-3 py-2 text-right font-medium">SOV</th>
                <th className="px-3 py-2 font-medium">情感倾向（正 / 中 / 负）</th>
                <th className="py-2 pl-3 text-right font-medium">周环比</th>
              </tr>
            </thead>
            <tbody>
              {platforms.map((p) => (
                <tr key={p.id} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-3 font-medium">{p.name}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${p.mention}%` }} />
                      </div>
                      <span className="font-mono text-xs">{p.mention}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right font-mono">{p.first}%</td>
                  <td className="px-3 py-3 text-right font-mono">{p.top3}%</td>
                  <td className="px-3 py-3 text-right font-mono">{p.sov}%</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                        <div className="bg-emerald-500" style={{ width: `${p.pos}%` }} />
                        <div className="bg-muted-foreground/50" style={{ width: `${p.neu}%` }} />
                        <div className="bg-destructive" style={{ width: `${p.neg}%` }} />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">
                        {p.pos}/{p.neu}/{p.neg}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pl-3 text-right">
                    <span
                      className={`inline-flex items-center gap-0.5 font-mono text-xs ${
                        p.delta >= 0 ? 'text-emerald-400' : 'text-destructive'
                      }`}
                    >
                      {p.delta >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                      {p.delta >= 0 ? '+' : ''}
                      {p.delta}pp
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-5">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>标准探针词库</CardTitle>
              <CardDescription className="mt-1">词库 v2.4 · 186 条探针 · 季度统一校准</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              管理词库
            </Button>
          </CardHeader>
          <CardContent>
            <ProbeLibrary />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI 回答快照</CardTitle>
            <CardDescription>NLP 解析结果与原始回答并排核验</CardDescription>
          </CardHeader>
          <CardContent>
            <SnapshotViewer />
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">评估方法</h3>
          <span className="text-xs text-muted-foreground">四步闭环，保证数据可比、可复现、可追溯</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pipeline.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={s.title} className="relative rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/12 text-primary">
                    <Icon className="size-[18px]" />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                </div>
                <p className="mt-3 text-sm font-semibold">{s.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
