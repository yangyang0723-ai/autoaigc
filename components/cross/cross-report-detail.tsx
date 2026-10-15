'use client'

import Link from 'next/link'
import { ArrowLeft, FileQuestion } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { CrossReportView } from '@/components/cross/cross-report-view'
import { useCrossReport } from '@/lib/cross-store'

export function CrossReportDetail({ id }: { id: string }) {
  const report = useCrossReport(id)

  if (!report) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <FileQuestion className="size-6" />
        </span>
        <p className="text-sm font-semibold">未找到该交叉报告</p>
        <p className="max-w-md text-pretty text-xs leading-relaxed text-muted-foreground">
          报告可能已被删除，或页面刷新后临时数据已清空。
        </p>
        <Link href="/cross-report" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
          <ArrowLeft />
          返回报告列表
        </Link>
      </div>
    )
  }

  return <CrossReportView report={report} />
}
