import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHero } from '@/components/geo/page-hero'
import { StatCard } from '@/components/geo/stat-card'
import { UgcBoard } from '@/components/ugc/ugc-board'
import { UgcTracking } from '@/components/ugc/ugc-tracking'
import { Share2, Plus, Users, Send, FileCheck2, Link2, RefreshCw } from 'lucide-react'

const channels = [
  { name: '小红书', mark: '红', accounts: 6, month: 142, index: 74, api: '接口正常' },
  { name: '知乎', mark: '知', accounts: 5, month: 96, index: 82, api: '接口正常' },
  { name: '抖音', mark: '抖', accounts: 7, month: 108, index: 58, api: '1 个账号待授权' },
  { name: '公众号', mark: '公', accounts: 6, month: 40, index: 88, api: '接口正常' },
]

export default function UgcPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHero
        module="UGC 信源分发"
        icon={Share2}
        title="批量搭建 UGC 信源矩阵，为大模型提供可采信的第三方口碑"
        desc="把创作好的内容自动发布到各大社媒平台，支持多账号矩阵、定时发布、草稿预审与分平台差异化分发，并把收录与传播数据回流至 GEO 监测。"
      >
        <Button size="lg">
          <Plus />
          新建分发任务
        </Button>
      </PageHero>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="矩阵账号" value="24" delta="+3" hint="覆盖 4 大平台" />
        <StatCard icon={Send} label="本月已发布" value="386" delta="+22%" />
        <StatCard icon={FileCheck2} label="平台收录率" value="71.2" unit="%" delta="+6.4pp" hint="发布后 72 小时内收录" />
        <StatCard icon={Link2} label="被 AI 引用信源" value="281" delta="+55" hint="已被至少 1 个大模型采信" />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">平台对接状态</h3>
          <span className="text-xs text-muted-foreground">对接各平台发布接口</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((c) => (
            <Card key={c.name}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/12 text-base font-bold text-primary">
                    {c.mark}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground">{c.accounts} 个账号</p>
                  </div>
                  <Badge variant={c.api === '接口正常' ? 'success' : 'warning'}>{c.api}</Badge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] text-muted-foreground">本月发布</p>
                    <p className="mt-0.5 font-mono text-lg font-bold">{c.month}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">收录率</p>
                    <p className="mt-0.5 font-mono text-lg font-bold">{c.index}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

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
