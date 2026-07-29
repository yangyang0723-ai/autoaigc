import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { WeeklyOutputChart } from '@/components/home/weekly-output-chart'
import { ComponentShowcase } from '@/components/home/component-showcase'
import { navGroups } from '@/lib/nav'
import {
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Layers,
  Zap,
  Timer,
} from 'lucide-react'

const kpis = [
  { label: '本月生成素材', value: '2,847', delta: '+18.2%', up: true, icon: Layers },
  { label: '平均生成时长', value: '6.4 分', delta: '-24%', up: true, icon: Timer },
  { label: '审核通过率', value: '88.6%', delta: '+3.1%', up: true, icon: CheckCircle2 },
  { label: '素材复用率', value: '64%', delta: '+9.4%', up: true, icon: Zap },
]

const engines = navGroups[1].items

const queue = [
  { name: '2026款 星海 SUV 上市主视觉', type: 'AI 图片', status: '生成中', progress: 72, variant: 'default' as const },
  { name: '618 购车节 · 30s 卡点视频', type: 'AI 视频', status: '排队中', progress: 0, variant: 'muted' as const },
  { name: '小红书种草笔记 · 家用旗舰', type: 'AI 图文', status: '已完成', progress: 100, variant: 'success' as const },
  { name: '经销商月度经营汇报 PPT', type: 'AI PPT', status: '已完成', progress: 100, variant: 'success' as const },
]

const templates = [
  { title: '科技新车海报', tag: '图片 · 科技感', img: '/cars/blue-suv-poster.png', uses: '1.2k', href: '/image' },
  { title: '雪地越野大片', tag: '图片 · 运动感', img: '/cars/red-suv-snow.png', uses: '860', href: '/image' },
  { title: '都市夜景视频', tag: '视频 · 15s', img: '/cars/city-night.png', uses: '2.4k', href: '/video' },
  { title: '展厅豪华场景', tag: '图片 · 豪华感', img: '/cars/showroom.png', uses: '640', href: '/image' },
]

export default function WorkbenchPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card grid-bg">
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/85 to-transparent" />
        <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
          <div className="max-w-xl">
            <Badge variant="accent" className="mb-3">
              <Sparkles className="size-3" />
              AI 驱动 · 分钟级出稿
            </Badge>
            <h2 className="text-pretty text-2xl font-bold lg:text-3xl">
              早上好，张经理 👋
            </h2>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
              今天有 <span className="font-semibold text-foreground">3 个营销 campaign</span> 待产出内容。
              选择一个生成引擎，让每一位汽车营销人都能像专业创意团队一样高效创作。
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link
                href="/image"
                className={buttonVariants({ className: 'h-9 gap-1.5 px-4 transition-transform active:scale-95' })}
              >
                <Sparkles className="size-4" />
                开始创作
              </Link>
              <Link
                href="/analytics"
                className={buttonVariants({
                  variant: 'outline',
                  className: 'h-9 gap-1.5 px-4 transition-transform active:scale-95',
                })}
              >
                查看数据看板
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
          <div className="relative hidden aspect-[16/10] w-full max-w-md overflow-hidden rounded-xl border border-border lg:block">
            <Image
              src="/cars/blue-suv-poster.png"
              alt="AI 生成的科技风格新车海报示例"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => {
          const Icon = k.icon
          return (
            <Card key={k.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/12 text-primary">
                    <Icon className="size-[18px]" />
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-400">
                    <TrendingUp className="size-3" />
                    {k.delta}
                  </span>
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight">{k.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{k.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </section>

      {/* Quick create engines */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">五大生成引擎</h3>
          <span className="text-xs text-muted-foreground">选择引擎，快速创作</span>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {engines.map((e) => {
            const Icon = e.icon
            return (
              <Link
                key={e.href}
                href={e.href}
                className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:glow-primary active:translate-y-0 active:scale-[0.98]"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/12 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{e.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{e.desc}</p>
                </div>
                <ArrowUpRight className="absolute right-3 top-3 size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            )
          })}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weekly output chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>近 7 天生成趋势</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">按内容类型统计的每日产出量</p>
            </div>
            <Badge variant="muted">周环比 +18.2%</Badge>
          </CardHeader>
          <CardContent>
            <WeeklyOutputChart />
          </CardContent>
        </Card>

        {/* Generation queue */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>生成任务队列</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {queue.map((q) => (
              <div key={q.name} className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{q.name}</p>
                    <p className="text-[11px] text-muted-foreground">{q.type}</p>
                  </div>
                  <Badge variant={q.variant}>{q.status}</Badge>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${q.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Component showcase */}
      <ComponentShowcase />

      {/* Popular templates */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">热门模板</h3>
          <Link
            href="/assets"
            className="inline-flex items-center gap-0.5 text-xs text-primary transition-opacity hover:underline active:opacity-70"
          >
            查看全部模板库
            <ArrowRight className="size-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {templates.map((t) => (
            <Link key={t.title} href={t.href} className="block">
              <Card className="group overflow-hidden p-0 transition-all hover:border-primary/40 hover:shadow-lg active:scale-[0.98]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={t.img || '/placeholder.svg'}
                    alt={t.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-primary/90 px-2 py-1 text-[11px] font-medium text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    <Sparkles className="size-3" />
                    使用模板
                  </span>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-sm font-semibold text-white">{t.title}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[11px] text-white/70">{t.tag}</span>
                      <span className="text-[11px] text-white/70">{t.uses} 次使用</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
