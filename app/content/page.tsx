import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { WeeklyOutputChart } from '@/components/home/weekly-output-chart'
import { StatCard } from '@/components/geo/stat-card'
import { contentChildren } from '@/lib/nav'
import {
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Layers,
  Zap,
  Timer,
  Library,
  ShieldCheck,
} from 'lucide-react'

const engines = contentChildren.filter((c) => c.href !== '/content')

export default function ContentWorkbenchPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card grid-bg">
        <div className="absolute inset-0 bg-gradient-to-r from-card via-card/85 to-transparent" />
        <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-8">
          <div className="max-w-xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="accent">
                <Sparkles className="size-3" />
                AI 内容创作 · 二期能力
              </Badge>
              <Badge variant="success">
                <ShieldCheck className="size-3" />
                已接入品牌知识库校验
              </Badge>
            </div>
            <h2 className="text-pretty text-2xl font-bold lg:text-3xl">AI 内容创作</h2>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
              让每一位汽车营销人都能像专业创意团队一样高效创作。三期起，创作环节自动调用品牌知识库校验事实，并可一键把成稿送入 UGC 信源矩阵分发。
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
                href="/knowledge"
                className={buttonVariants({
                  variant: 'outline',
                  className: 'h-9 gap-1.5 px-4 transition-transform active:scale-95',
                })}
              >
                <Library className="size-4" />
                查看品牌知识库
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

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="本月生成素材" value="2,847" delta="+18.2%" icon={Layers} />
        <StatCard label="平均生成时长" value="6.4" unit="分" delta="-24%" icon={Timer} />
        <StatCard label="审核通过率" value="88.6" unit="%" delta="+3.1%" icon={CheckCircle2} />
        <StatCard label="素材复用率" value="64" unit="%" delta="+9.4%" icon={Zap} />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">内容生成引擎</h3>
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

      <Card>
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
    </div>
  )
}
