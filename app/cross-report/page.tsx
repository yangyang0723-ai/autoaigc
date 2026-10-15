import { PageHero } from '@/components/geo/page-hero'
import { CrossWorkbench } from '@/components/cross/cross-workbench'
import { GitCompareArrows } from 'lucide-react'

export default function CrossReportPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHero
        module="多平台交叉报告"
        icon={GitCompareArrows}
        title="多品牌、多关键词、多平台交叉对比"
        desc="选择一个或多个品牌，配合多个关键词与多个 AI 平台，基于统一探针口径创建交叉报告，对比品牌间与平台间的推荐优先级和描述准确度，定位薄弱品牌、平台与维度。"
      />
      <CrossWorkbench />
    </div>
  )
}
