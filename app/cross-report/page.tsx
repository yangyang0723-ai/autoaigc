import Link from 'next/link'
import { GitCompareArrows, Plus } from 'lucide-react'
import { PageHero } from '@/components/geo/page-hero'
import { buttonVariants } from '@/components/ui/button'
import { CrossReportList } from '@/components/cross/cross-report-list'

export const metadata = {
  title: '多平台交叉报告 | 车智绘',
  description: '多品牌、多关键词、多 AI 平台交叉对比报告列表。',
}

export default function CrossReportPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHero
        module="多平台交叉报告"
        icon={GitCompareArrows}
        title="多品牌、多关键词、多平台交叉对比"
        desc="基于统一探针口径，对比品牌间与平台间的推荐优先级和描述准确度，定位薄弱品牌、平台与维度。点击“查看”进入报告详情。"
      >
        <Link href="/cross-report/new" className={buttonVariants({ size: 'lg', className: 'glow-primary' })}>
          <Plus />
          创建交叉报告
        </Link>
      </PageHero>
      <CrossReportList />
    </div>
  )
}
