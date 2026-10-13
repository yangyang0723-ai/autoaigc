import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { PageHero } from '@/components/geo/page-hero'
import { StatCard } from '@/components/geo/stat-card'
import { KnowledgeLibrary } from '@/components/knowledge/knowledge-library'
import { KnowledgeGraph } from '@/components/knowledge/knowledge-graph'
import { VerifyPlayground } from '@/components/knowledge/verify-playground'
import { Library, FileUp, Database, ShieldCheck, Bug, Quote, Radar, Sparkles, Share2 } from 'lucide-react'

const schema = `{
  "@type": "Product",
  "name": "星河 S7 Max",
  "brand": "星河汽车",
  "offers": { "priceRange": "24.98–31.98 万元" },
  "additionalProperty": [
    { "name": "CLTC 续航", "value": "620 km" },
    { "name": "快充", "value": "10%–80% 约 15 分钟" },
    { "name": "辅助驾驶", "value": "组合辅助驾驶（L2）" }
  ],
  "award": "C-NCAP 五星安全认证"
}`

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

export default function KnowledgePage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHero
        module="品牌知识库"
        icon={Library}
        title="统一品牌官方口径，从源头减少 AI 对品牌的幻觉错误"
        desc="构建品牌结构化知识，为 GEO 评估与 AI 内容生成提供数据支撑，同时约束智能体内容创作的准确性。"
      >
        <Button size="lg">
          <FileUp />
          上传资料
        </Button>
      </PageHero>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Database} label="结构化知识条目" value="1,284" delta="+86" hint="本月新增" />
        <StatCard icon={ShieldCheck} label="信息结构化覆盖率" value="92.4" unit="%" delta="+5.1pp" />
        <StatCard icon={Bug} label="内容创作拦截" value="326" delta="+12%" hint="拦截错误参数与禁用话术" />
        <StatCard icon={Quote} label="AI 引用概率提升" value="+18.7" unit="%" delta="+3.4pp" hint="结构化后被大模型采信" />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>知识条目管理</CardTitle>
          <CardDescription>上传品牌介绍、产品参数、资质专利、官方话术，自动解析为结构化条目</CardDescription>
        </CardHeader>
        <CardContent>
          <KnowledgeLibrary />
        </CardContent>
      </Card>

      <section className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>品牌专属知识图谱</CardTitle>
            <CardDescription>实体与关系统一建模，便于大模型识别与采信</CardDescription>
          </CardHeader>
          <CardContent>
            <KnowledgeGraph />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>AI 友好的结构化输出</CardTitle>
              <CardDescription className="mt-1">发布时自动生成标准化数据块，提升被引用概率</CardDescription>
            </div>
            <Badge variant="accent">Schema 标准</Badge>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg border border-border bg-background p-4 font-mono text-xs leading-relaxed text-muted-foreground">
              <code>{schema}</code>
            </pre>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>创作校验演示</CardTitle>
          <CardDescription>体验内容创作环节如何自动调用知识库，校验并修正文案</CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyPlayground />
        </CardContent>
      </Card>

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
