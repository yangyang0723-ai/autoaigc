import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { PageHero } from '@/components/geo/page-hero'
import { UgcBoard } from '@/components/ugc/ugc-board'
import { UgcChannels, UgcStatCards } from '@/components/ugc/ugc-overview'
import { UgcTracking } from '@/components/ugc/ugc-tracking'
import { Share2, Plus, Users, RefreshCw } from 'lucide-react'

export default function UgcPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHero
        module="UGC 信源分发"
        icon={Share2}
        title="批量搭建 UGC 信源矩阵，为大模型提供可采信的第三方口碑"
        desc="把创作好的内容自动发布到各大社媒平台，支持多账号矩阵、定时发布、草稿预审与分平台差异化分发，并把收录与传播数据回流至 GEO 监测。"
      >
        <Link href="/ugc/accounts" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
          <Users />
          账号矩阵管理
        </Link>
        <Link href="/ugc/new" className={buttonVariants({ size: 'lg' })}>
          <Plus />
          新建分发任务
        </Link>
      </PageHero>

      <UgcStatCards />
      <UgcChannels />

      <Card>
        <CardHeader>
          <CardTitle>分发工作台</CardTitle>
          <CardDescription>草稿预审通过后进入定时队列，按平台规范差异化发布</CardDescription>
        </CardHeader>
        <CardContent>
          <UgcBoard />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>发布后追踪 · 同步 GEO 监测</CardTitle>
            <CardDescription className="mt-1">信源被收录越多，品牌在大模型中的提及率越高</CardDescription>
          </div>
          <Badge variant="success">
            <RefreshCw className="size-3" />
            已同步至 GEO · 10 分钟前
          </Badge>
        </CardHeader>
        <CardContent>
          <UgcTracking />
        </CardContent>
      </Card>
    </div>
  )
}
