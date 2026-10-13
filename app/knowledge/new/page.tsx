import Link from 'next/link'
import { ArrowLeft, BadgePlus } from 'lucide-react'
import { PageHero } from '@/components/geo/page-hero'
import { buttonVariants } from '@/components/ui/button'
import { BrandForm } from '@/components/knowledge/brand-form'

export const metadata = {
  title: '新增品牌 · 品牌知识库 | 车智绘',
  description: '录入品牌基本信息、品牌介绍与资料，生成品牌结构化知识，为 GEO 评估与 AI 内容生成提供数据支撑。',
}

export default function NewBrandPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHero
        module="品牌知识库 · 新增品牌"
        icon={BadgePlus}
        title="录入品牌信息，生成可被 AI 采信的结构化知识"
        desc="依次填写基本信息、品牌介绍与资料，系统将输出品牌结构化知识，作为 GEO 评估与 AI 内容生成的数据底座，并约束智能体创作的准确性。"
      >
        <Link href="/knowledge" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
          <ArrowLeft />
          返回品牌知识库
        </Link>
      </PageHero>
      <BrandForm />
    </div>
  )
}
