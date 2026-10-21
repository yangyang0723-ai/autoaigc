'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { FileCheck2, Link2, Send, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { StatCard } from '@/components/geo/stat-card'
import { PlatformMark } from '@/components/matrix/matrix-ui'
import { matrixPlatforms } from '@/lib/matrix-data'
import { useMatrix } from '@/lib/matrix-store'

function useOverview() {
  const { accounts } = useMatrix()
  return useMemo(() => {
    const rates = accounts.map((a) => a.indexRate).filter((r): r is number => r !== null)
    const avg = (list: number[]) => (list.length ? list.reduce((s, r) => s + r, 0) / list.length : 0)
    const channels = matrixPlatforms.map((p) => {
      const list = accounts.filter((a) => a.platform === p.name)
      const pending = list.filter((a) => a.status === '待授权').length
      const frozen = list.filter((a) => a.status === '已冻结').length
      return {
        name: p.name,
        count: list.length,
        month: list.reduce((s, a) => s + a.monthPosts, 0),
        index: Math.round(avg(list.map((a) => a.indexRate).filter((r): r is number => r !== null))),
        api: pending ? `${pending} 个账号待授权` : frozen ? `${frozen} 个账号已冻结` : '接口正常',
        ok: !pending && !frozen,
      }
    })
    return {
      total: accounts.length,
      platforms: channels.filter((c) => c.count > 0).length,
      month: accounts.reduce((s, a) => s + a.monthPosts, 0),
      rate: Math.round(avg(rates) * 10) / 10,
      channels,
    }
  }, [accounts])
}

export function UgcStatCards() {
  const o = useOverview()
  return (
    <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard icon={Users} label="矩阵账号" value={String(o.total)} delta="+3" hint={`覆盖 ${o.platforms} 大平台`} />
      <StatCard icon={Send} label="本月已发布" value={String(o.month)} delta="+22%" />
      <StatCard icon={FileCheck2} label="平台收录率" value={String(o.rate)} unit="%" delta="+6.4pp" hint="发布后 72 小时内收录" />
      <StatCard icon={Link2} label="被 AI 引用信源" value="281" delta="+55" hint="已被至少 1 个大模型采信" />
    </section>
  )
}

export function UgcChannels() {
  const o = useOverview()
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">平台对接状态</h3>
        <Link href="/ugc/accounts" className="text-xs text-primary hover:underline">
          管理账号矩阵
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {o.channels.map((c) => (
          <Card key={c.name}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <PlatformMark platform={c.name} className="size-10 text-base" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.count} 个账号</p>
                </div>
                <Badge variant={c.ok ? 'success' : 'warning'}>{c.api}</Badge>
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
  )
}
