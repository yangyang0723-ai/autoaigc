import Link from 'next/link'
import { ArrowLeft, FilePlus2 } from 'lucide-react'
import { PageHero } from '@/components/geo/page-hero'
import { buttonVariants } from '@/components/ui/button'
import { CrossCreateForm } from '@/components/cross/cross-create-form'

export const metadata = {
  title: '创建交叉报告 · 多平台交叉报告 | 车智绘',
  description: '选择多个品牌、关键词与 AI 平台，创建多平台交叉报告。',
}

export default function NewCrossReportPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHero
        module="多平台交叉报告 · 创建"
        icon={FilePlus2}
        title="选择品牌、关键词与平台，创建交叉报告"
        desc="依次选择检测品牌、填写关键词并选择平台，保存后将自动生成报告并返回报告列表。"
      >
        <Link href="/cross-report" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
          <ArrowLeft />
          返回报告列表
        </Link>
      </PageHero>
      <CrossCreateForm />
    </div>
  )
}
