import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { PageHero } from '@/components/geo/page-hero'
import { KnowledgeStats } from '@/components/knowledge/knowledge-stats'
import { KnowledgeWorkspace } from '@/components/knowledge/knowledge-workspace'
import { Library, Plus, Radar, Sparkles, Share2 } from 'lucide-react'

const consumers = [
  {
    icon: Radar,
    href: '/cross-report',
    title: 'GEO 评估',
    desc: '作为“官方口径”基准，判定各 AI 平台的描述是否一致、偏差或幻觉。',
    stat: '4,128 次判定',
  },
  {
    icon: Sparkles,
    href: '/content',
    title: 'AI 内容创作',
    desc: '创作环节自动调用知识库校验，拦截错误参数与违规话术。',
    stat: '326 次拦截',
  },
  {
    icon: Share2,
    href: '/ugc',
    title: 'UGC 信源分发',
    desc: '分发前再次校验事实一致性，保证第三方口碑素材的准确可采信。',
    stat: '100% 发布前校验',
  },
]

export default async function KnowledgePage({ searchParams }: { searchParams: Promise<{ brand?: string }> }) {
  const { brand } = await searchParams

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHero
        module="品牌知识库"
        icon={Library}
        title="统一品牌官方口径，从源头减少 AI 对品牌的幻觉错误"
        desc="按品牌构建结构化知识，为 GEO 评估与 AI 内容生成提供数据支撑，同时约束智能体内容创作的准确性。"
      >
        <Link href="/knowledge/new" className={buttonVariants({ size: 'lg', className: 'glow-primary' })}>
          <Plus />
          新增品牌
        </Link>
      </PageHero>

      <KnowledgeStats />

      <KnowledgeWorkspace initialId={brand} />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">知识库被谁调用</h3>
          <span className="text-xs text-muted-foreground">一份口径，贯穿评估、创作与分发</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {consumers.map((c) => {
            const Icon = c.icon
            return (
              <div key={c.title} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/12 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <Badge variant="muted">{c.stat}</Badge>
                </div>
                <div>
                  <p className="text-sm font-semibold">{c.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.desc}</p>
                </div>
                <Link href={c.href} className={buttonVariants({ variant: 'outline', size: 'sm', className: 'mt-auto w-fit' })}>
                  前往查看
                </Link>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
