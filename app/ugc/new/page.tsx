import Link from 'next/link'
import { ArrowLeft, SendHorizontal } from 'lucide-react'
import { PageHero } from '@/components/geo/page-hero'
import { buttonVariants } from '@/components/ui/button'
import { UgcCreateForm } from '@/components/ugc/ugc-create-form'

export const metadata = {
  title: '新建分发任务 · UGC 信源分发 | 车智绘',
  description: '选择发布平台与矩阵账号，创建 UGC 信源分发任务。',
}

export default function NewUgcTaskPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHero
        module="UGC 信源分发 · 新建任务"
        icon={SendHorizontal}
        title="选择平台与账号，新建一条分发任务"
        desc="填写内容主题，选择发布平台与矩阵账号及发布方式，保存后任务会进入分发工作台的对应队列。"
      >
        <Link href="/ugc" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
          <ArrowLeft />
          返回分发工作台
        </Link>
      </PageHero>
      <UgcCreateForm />
    </div>
  )
}
