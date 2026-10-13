import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { StatCard } from '@/components/geo/stat-card'
import { GeoTrendChart } from '@/components/geo/geo-trend-chart'
import {
  Sparkles,
  Radar,
  GitCompareArrows,
  Telescope,
  Library,
  Share2,
  ArrowUpRight,
  ArrowRight,
  Eye,
  Crown,
  Medal,
  PieChart,
  Bell,
} from 'lucide-react'

const modules = [
  {
    href: '/geo',
    icon: Radar,
    title: 'GEO 品牌评估',
    desc: '检测品牌在各 AI 搜索引擎中的提及率、排名与情感倾向。',
    stat: 'AI 提及率 71.3%',
  },
  {
    href: '/cross-report',
    icon: GitCompareArrows,
    title: '多平台交叉报告',
    desc: '横向对比各 AI 平台对品牌的描述差异，找出薄弱点。',
    stat: '5 个薄弱点待处理',
  },
  {
    href: '/insights',
    icon: Telescope,
    title: '需求洞察',
    desc: '发现用户在 AI 搜索中的真实意图，拓展高潜力词。',
    stat: '328 个蓝海意图词',
  },
  {
    href: '/knowledge',
    icon: Library,
    title: '品牌知识库',
    desc: '构建品牌结构化知识，约束 AI 幻觉与内容创作准确性。',
    stat: '1,284 条结构化知识',
  },
  {
    href: '/content',
    icon: Sparkles,
    title: 'AI 内容创作',
    desc: '二期能力整体并入：图片 / 图文 / 视频 / 朋友圈 / 素材资产。',
    stat: '本月生成 2,847 份',
    tag: '二期',
  },
  {
    href: '/ugc',
    icon: Share2,
    title: 'UGC 信源分发',
    desc: '多平台矩阵自动发布，批量搭建可被大模型采信的第三方口碑。',
    stat: '24 个矩阵账号',
  },
]

const loop = [
  { label: '需求洞察', note: '发现机会词', href: '/insights' },
  { label: '品牌知识库', note: '统一官方口径', href: '/knowledge' },
  { label: 'AI 内容创作', note: '生成并校验', href: '/content' },
  { label: 'UGC 信源分发', note: '矩阵发布', href: '/ugc' },
  { label: 'GEO 品牌评估', note: '监测可见度', href: '/geo' },
  { label: '多平台交叉报告', note: '定位薄弱点', href: '/cross-report' },
]

const alerts = [
  {
    variant: 'warning',
    label: '波动',
    text: '豆包 首推率较上周下降 2.4pp，家庭场景被竞品替代',
    href: '/cross-report',
  },
  {
    variant: 'danger',
    label: '幻觉',
    text: '文心一言 出现“续航 800km”“L4 自动驾驶”错误描述',
    href: '/cross-report',
  },
  {
    variant: 'default',
    label: '机会',
    text: '新增蓝海词“纯电车冬季续航缩水怎么办”，热度 +46%',
    href: '/insights',
  },
  {
    variant: 'success',
    label: '收录',
    text: '知乎、小红书 7 篇内容已被 DeepSeek、Kimi 引用',
    href: '/ugc',
  },
] as const

export default function OverviewPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card grid-bg">
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/85 to-transparent" />
        <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
          <div className="max-w-2xl">
            <Badge variant="accent" className="mb-3">
              <Radar className="size-3" />
              车智绘 三期 · GEO 品牌可见度
            </Badge>
            <h2 className="text-balance text-2xl font-bold lg:text-3xl">
              从“生成内容”，到“被 AI 推荐”
            </h2>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
              在二期 AI 内容创作的基础上，三期新增 GEO 评估、交叉报告、需求洞察、品牌知识库与 UGC 信源分发，形成“洞察 – 校准 – 创作 – 分发 – 评估”的完整闭环。
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/geo" className={buttonVariants({ className: 'h-9 gap-1.5 px-4 transition-transform active:scale-95' })}>
                <Radar className="size-4" />
                查看 GEO 评估
              </Link>
              <Link
                href="/content"
                className={buttonVariants({
                  variant: 'outline',
                  className: 'h-9 gap-1.5 px-4 transition-transform active:scale-95',
                })}
              >
                <Sparkles className="size-4" />
                进入 AI 内容创作
              </Link>
            </div>
          </div>
          <div className="grid shrink-0 grid-cols-2 gap-3 lg:w-80">
            {[
              ['监测平台', '6 个'],
              ['探针词库', '186 条'],
              ['每日采样', '5,580 次'],
              ['快照留存', '全量'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-border bg-background/60 p-3 backdrop-blur">
                <p className="text-[11px] text-muted-foreground">{k}</p>
                <p className="mt-1 font-mono text-lg font-bold">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Eye} label="AI 提及率" value="71.3" unit="%" delta="+4.2pp" />
        <StatCard icon={Crown} label="首推率" value="24.6" unit="%" delta="+2.1pp" />
        <StatCard icon={Medal} label="TOP3 推荐率" value="52.1" unit="%" delta="+3.7pp" />
        <StatCard icon={PieChart} label="SOV 声量份额" value="28.4" unit="%" delta="-0.6pp" direction="down" good={false} />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">功能模块</h3>
          <span className="text-xs text-muted-foreground">三期共 6 个模块</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => {
            const Icon = m.icon
            return (
              <Link
                key={m.href}
                href={m.href}
                className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:glow-primary active:translate-y-0 active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/12 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </span>
                  {'tag' in m ? (
                    <Badge variant="accent">{m.tag}</Badge>
                  ) : (
                    <Badge variant="default">三期新增</Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">{m.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{m.desc}</p>
                </div>
                <p className="mt-auto font-mono text-xs text-primary">{m.stat}</p>
                <ArrowUpRight className="absolute right-4 top-16 size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            )
          })}
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>GEO 优化闭环</CardTitle>
          <CardDescription>六个模块首尾相接，评估结果持续反哺下一轮洞察</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="flex flex-wrap items-center gap-2">
            {loop.map((s, i) => (
              <li key={s.label} className="flex items-center gap-2">
                <Link
                  href={s.href}
                  className="flex flex-col rounded-lg border border-border bg-background px-3.5 py-2 transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="text-sm font-medium">
                    <span className="mr-1.5 font-mono text-xs text-primary">0{i + 1}</span>
                    {s.label}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{s.note}</span>
                </Link>
                {i < loop.length - 1 && <ArrowRight className="size-4 text-muted-foreground" />}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <section className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>品牌 AI 可见度趋势</CardTitle>
            <CardDescription>近 30 天 · 星河汽车 vs 竞品均值</CardDescription>
          </CardHeader>
          <CardContent>
            <GeoTrendChart />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-4 text-primary" />
              今日提醒
            </CardTitle>
            <Badge variant="muted">{alerts.length} 条</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((a) => (
              <Link
                key={a.text}
                href={a.href}
                className="flex flex-col gap-1.5 rounded-lg border border-border p-3 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <Badge variant={a.variant} className="w-fit">
                  {a.label}
                </Badge>
                <p className="text-sm leading-relaxed">{a.text}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
