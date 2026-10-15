'use client'

import Link from 'next/link'
import { Eye, FileText, Plus, Trash2, TriangleAlert } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { seriesColors } from '@/lib/chart-style'
import { removeCrossReport, useCrossReports } from '@/lib/cross-store'
import { cn } from '@/lib/utils'

export function CrossReportList() {
  const reports = useCrossReports()

  if (!reports.length) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-primary/12 text-primary">
          <FileText className="size-6" />
        </span>
        <p className="text-sm font-semibold">还没有交叉报告</p>
        <p className="max-w-md text-pretty text-xs leading-relaxed text-muted-foreground">
          选择多个品牌、关键词与平台，创建第一份交叉报告。
        </p>
        <Link href="/cross-report/new" className={buttonVariants({ size: 'lg', className: 'glow-primary' })}>
          <Plus />
          创建交叉报告
        </Link>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold">已创建的交叉报告</h2>
          <Badge variant="muted">{reports.length} 份</Badge>
        </div>

        <div
          className="hidden grid-cols-[minmax(0,2.2fr)_minmax(0,1.6fr)_minmax(0,1.4fr)_100px_120px_150px] gap-4 border-b border-border bg-muted/30 px-5 py-2.5 text-xs text-muted-foreground lg:grid"
          role="presentation"
        >
          <span>报告名称</span>
          <span>检测品牌</span>
          <span>关键词 / 平台</span>
          <span>幻觉描述</span>
          <span>创建时间</span>
          <span className="text-right">操作</span>
        </div>

        <ul className="divide-y divide-border">
          {reports.map((r) => (
            <li
              key={r.id}
              className="grid gap-3 px-5 py-4 transition-colors hover:bg-muted/30 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1.6fr)_minmax(0,1.4fr)_100px_120px_150px] lg:items-center lg:gap-4"
            >
              <div className="min-w-0">
                <Link
                  href={`/cross-report/${r.id}`}
                  className="block truncate text-sm font-medium hover:text-primary"
                  title={r.name}
                >
                  {r.name}
                </Link>
                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">{r.id}</p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {r.brands.map((b, i) => (
                  <span
                    key={b.id}
                    className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-1 text-[11px] font-medium"
                  >
                    <span className="size-2 rounded-full" style={{ background: seriesColors[i % seriesColors.length] }} />
                    {b.name}
                  </span>
                ))}
              </div>

              <div className="text-xs text-muted-foreground">
                <p>{r.keywords.length} 个关键词</p>
                <p className="mt-0.5">{r.platforms.length} 个平台 · {r.samplesTotal.toLocaleString()} 次采样</p>
              </div>

              <div>
                {r.hallucinations ? (
                  <Badge variant="warning">
                    <TriangleAlert className="size-3" />
                    {r.hallucinations} 处
                  </Badge>
                ) : (
                  <Badge variant="success">无</Badge>
                )}
              </div>

              <span className="text-xs text-muted-foreground">{r.createdAt}</span>

              <div className="flex items-center gap-2 lg:justify-end">
                <Link
                  href={`/cross-report/${r.id}`}
                  className={buttonVariants({ variant: 'outline', size: 'sm' })}
                >
                  <Eye />
                  查看
                </Link>
                <button
                  type="button"
                  aria-label={`删除报告 ${r.name}`}
                  onClick={() => removeCrossReport(r.id)}
                  className={cn(buttonVariants({ variant: 'ghost', size: 'icon-sm' }), 'text-muted-foreground hover:text-destructive')}
                >
                  <Trash2 />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
