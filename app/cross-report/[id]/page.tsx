import Link from 'next/link'
import { ArrowLeft, GitCompareArrows } from 'lucide-react'
import { PageHero } from '@/components/geo/page-hero'
import { buttonVariants } from '@/components/ui/button'
import { CrossReportDetail } from '@/components/cross/cross-report-detail'

export const metadata = {
  title: '交叉报告详情 · 多平台交叉报告 | 车智绘',
  description: '查看多平台交叉报告的品牌对比、能力雷达、热力矩阵与薄弱点。',
}

export default async function CrossReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHero
        module="多平台交叉报告 · 报告详情"
        icon={GitCompareArrows}
        title="交叉报告详情"
        desc="查看品牌 × 平台对比、能力雷达、热力矩阵、描述差异对照与薄弱点建议。"
      >
        <Link href="/cross-report" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
          <ArrowLeft />
          返回报告列表
        </Link>
      </PageHero>
      <CrossReportDetail id={decodeURIComponent(id)} />
    </div>
  )
}
