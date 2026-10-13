import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHero } from '@/components/geo/page-hero'
import { StatCard } from '@/components/geo/stat-card'
import { PeriodFilter } from '@/components/geo/segmented'
import { IntentExplorer } from '@/components/insights/intent-explorer'
import {
  Telescope,
  Download,
  Hash,
  Waves,
  Target,
  Flame,
  Globe2,
  Wand2,
  Filter,
  MessageSquareQuote,
} from 'lucide-react'

const path = [
  { stage: '认知', desc: '品类入门、需求唤起', words: 2860, cover: 52 },
  { stage: '兴趣', desc: '品牌了解、产品信息', words: 3120, cover: 61 },
  { stage: '对比', desc: '竞品对比、选型对照', words: 2740, cover: 38 },
  { stage: '决策', desc: '价格权益、试驾预约', words: 2290, cover: 47 },
  { stage: '售后', desc: '使用痛点、口碑复购', words: 1476, cover: 29 },
]

const samples = [
  { q: '预算 30 万，家里有两个小孩，纯电 SUV 选哪个？', tag: '选型推荐', scene: '亲子家用' },
  { q: '冬天开电车去东北，续航真的能保住吗？', tag: '痛点解决', scene: '低温续航' },
  { q: '星河 S7 的智驾和极光 A8 比差在哪里？', tag: '对比选型', scene: '智驾对比' },
]

const method = [
  { icon: Globe2, title: '全网真实提问采集', desc: '汇聚全网用户真实提问数据，还原 AI 搜索场景下的提问方式。' },
  { icon: Wand2, title: '大模型语义扩展', desc: '自动生成覆盖全消费决策路径的意图词矩阵，覆盖品牌词、品类词、对比选型词、场景痛点词。' },
  { icon: Filter, title: '分类监测与蓝海识别', desc: '按提问类型输出品牌表现，识别高流量、低占位的蓝海意图词，作为 GEO 优化重点方向。' },
]

export default function InsightsPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHero
        module="需求洞察"
        icon={Telescope}
        title="发现用户在 AI 搜索中的真实意图"
        desc="挖掘真实提问场景，拓展品牌相关高潜力词，定位星河汽车在高价值提问场景中的曝光缺口。"
      >
        <PeriodFilter />
        <Button variant="outline" size="lg">
          <Download />
          导出意图词
        </Button>
      </PageHero>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Hash} label="监测意图词总量" value="12,486" delta="+1,284" hint="本月新增语义扩展词" />
        <StatCard icon={Waves} label="蓝海意图词" value="328" delta="+46" hint="高热度 · 低占位" />
        <StatCard icon={Target} label="全场景品牌占位率" value="47.8" unit="%" delta="+3.2pp" />
        <StatCard icon={Flame} label="热度飙升词" value="92" delta="+21" hint="周环比提问量 > 30%" />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>全消费决策路径覆盖</CardTitle>
          <CardDescription>对比阶段与售后阶段占位偏低，是当前最大的曝光缺口</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {path.map((p, i) => (
              <li key={p.stage} className="relative rounded-xl border border-border bg-background p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{p.stage}</span>
                  <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
                <p className="mt-3 font-mono text-lg font-bold">
                  {p.words.toLocaleString()}
                  <span className="ml-1 text-xs font-medium text-muted-foreground">词</span>
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${p.cover < 40 ? 'bg-destructive' : 'bg-primary'}`}
                      style={{ width: `${p.cover}%` }}
                    />
                  </div>
                  <span
                    className={`font-mono text-xs ${p.cover < 40 ? 'text-destructive' : 'text-muted-foreground'}`}
                  >
                    {p.cover}%
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <IntentExplorer />

      <section className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquareQuote className="size-4 text-primary" />
                真实提问样本
              </CardTitle>
              <CardDescription className="mt-1">来自全网用户的真实提问，保留原始语境</CardDescription>
            </div>
            <Badge variant="muted">近 7 天抽样</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {samples.map((s) => (
              <div key={s.q} className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-relaxed">“{s.q}”</p>
                <div className="flex shrink-0 gap-2">
                  <Badge variant="muted">{s.tag}</Badge>
                  <Badge variant="outline">{s.scene}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>洞察方法</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {method.map((m) => {
              const Icon = m.icon
              return (
                <div key={m.title} className="flex gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                    <Icon className="size-[18px]" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{m.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{m.desc}</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
