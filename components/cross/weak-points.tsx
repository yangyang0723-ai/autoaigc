import Link from 'next/link'
import { AlertTriangle, CheckCircle2, Library, Share2, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { BrandResult } from '@/lib/cross-eval'

const levelVariant = { 高: 'danger', 中: 'warning', 低: 'muted' } as const

export function WeakPoints({ brand }: { brand: BrandResult }) {
  const list = brand.weakPoints

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-amber-400" />
            {brand.name} · 薄弱点与建议动作
          </CardTitle>
          <CardDescription className="mt-1">按影响程度排序，可一键进入对应模块处理</CardDescription>
        </div>
        <Badge variant={list.length ? 'warning' : 'success'}>{list.length} 项待处理</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {list.length === 0 && (
          <p className="flex items-center gap-2 rounded-lg border border-border p-4 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4 text-emerald-400" />
            未发现明显薄弱点，保持当前内容节奏即可。
          </p>
        )}
        {list.map((w) => (
          <div
            key={w.title}
            className="flex flex-col gap-3 rounded-lg border border-border p-4 lg:flex-row lg:items-center lg:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={levelVariant[w.level]}>{w.level}优先级</Badge>
                <Badge variant="outline">{w.platform}</Badge>
                <p className="text-sm font-semibold">{w.title}</p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{w.evidence}</p>
              <p className="mt-1 text-xs text-muted-foreground/80">{w.impact}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Link href="/knowledge" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                <Library />
                补充知识库
              </Link>
              <Link href="/text" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                <Sparkles />
                生成纠偏内容
              </Link>
              <Link href="/ugc" className={buttonVariants({ size: 'sm' })}>
                <Share2 />
                分发信源
              </Link>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
