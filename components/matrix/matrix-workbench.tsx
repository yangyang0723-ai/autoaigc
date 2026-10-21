'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, HeartPulse, Link2, ShieldAlert, Target, UserCog, Users } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHero } from '@/components/geo/page-hero'
import { Segmented } from '@/components/geo/segmented'
import { StatCard } from '@/components/geo/stat-card'
import { AccountDialog } from '@/components/matrix/account-dialog'
import { AccountTable, emptyFilters, type MatrixFilters } from '@/components/matrix/account-table'
import { GroupPanel } from '@/components/matrix/group-panel'
import { HealthPanel } from '@/components/matrix/health-panel'
import { fieldClass } from '@/components/matrix/matrix-ui'
import { MatrixStrategy } from '@/components/matrix/matrix-strategy'
import { PermissionPanel } from '@/components/matrix/permission-panel'
import { evaluateAccount, getLevel, type MatrixAccount } from '@/lib/matrix-data'
import { setCurrentMember, useMatrix } from '@/lib/matrix-store'

type Tab = 'accounts' | 'groups' | 'health' | 'permissions'

export function MatrixWorkbench() {
  const state = useMatrix()
  const [tab, setTab] = useState<Tab>('accounts')
  const [filters, setFilters] = useState<MatrixFilters>(emptyFilters)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<MatrixAccount | null>(null)

  const me = state.members.find((m) => m.id === state.currentMemberId) ?? state.members[0]
  const isAdmin = me.role === '管理员'

  const visible = useMemo(
    () => state.accounts.filter((a) => getLevel(state, state.currentMemberId, a.poolId)),
    [state],
  )
  const canBind = state.pools.some((p) => getLevel(state, state.currentMemberId, p.id) === '管理')

  const stats = useMemo(() => {
    const evals = visible.map((a) => evaluateAccount(a, state.settings))
    const avg = evals.length ? Math.round(evals.reduce((s, e) => s + e.health, 0) / evals.length) : 0
    const high = evals.filter((e) => e.risk === '高').length
    const eligible = evals.filter((e) => e.dispatch === '可分发' || e.dispatch === '核心优选').length
    const rates = visible.map((a) => a.indexRate).filter((r): r is number => r !== null)
    const rate = rates.length ? Math.round((rates.reduce((s, r) => s + r, 0) / rates.length) * 10) / 10 : 0
    return { avg, high, eligible, rate }
  }, [visible, state.settings])

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(a: MatrixAccount) {
    setEditing(a)
    setDialogOpen(true)
  }

  function applyFilter(patch: Partial<MatrixFilters>) {
    setFilters({ ...emptyFilters, ...patch })
    setTab('accounts')
  }

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHero
        module="UGC 信源分发 · 账号矩阵"
        icon={Users}
        title="多平台账号矩阵管理，让每一个账号资产可分组、可评估、可管控"
        desc="统一绑定小红书、知乎、抖音、公众号、什么值得买、百度贴吧等账号，按人设与产品线打标签；以权重、违规记录与收录率评估健康度，自动规避高风险账号，并按团队权限隔离账号池。"
      >
        <Link href="/ugc" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
          <ArrowLeft />
          返回分发工作台
        </Link>
        <Button size="lg" onClick={openCreate} disabled={!canBind}>
          <Link2 />
          绑定新账号
        </Button>
      </PageHero>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-border bg-card px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-medium">
          <UserCog className="size-4 text-primary" />
          当前操作身份
        </span>
        <div className="w-52">
          <select
            className={fieldClass}
            value={state.currentMemberId}
            onChange={(e) => setCurrentMember(e.target.value)}
            aria-label="切换操作身份"
          >
            {state.members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} · {m.role}
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs text-muted-foreground" role="status">
          {isAdmin
            ? '管理员可访问全部账号池并管理权限'
            : `可访问 ${visible.length} / ${state.accounts.length} 个账号，其余账号已隐藏`}
          ；切换身份可预览不同成员的权限范围
        </p>
      </div>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="可见矩阵账号" value={String(visible.length)} hint={`可参与分发 ${stats.eligible} 个`} />
        <StatCard icon={HeartPulse} label="平均健康度" value={String(stats.avg)} unit="分" hint="权重 + 收录率 + 合规" />
        <StatCard
          icon={ShieldAlert}
          label="高风险账号"
          value={String(stats.high)}
          good={stats.high === 0}
          direction="up"
          hint={state.settings.autoAvoid ? '已自动规避' : '未开启自动规避'}
        />
        <StatCard icon={Target} label="平均收录率" value={String(stats.rate)} unit="%" hint="发布后 72 小时内收录" />
      </section>

      <MatrixStrategy accounts={visible} settings={state.settings} canEdit={isAdmin} />

      <Card>
        <CardContent className="flex flex-col gap-5 p-5">
          <Segmented
            value={tab}
            onChange={setTab}
            aria-label="账号矩阵视图"
            options={[
              { value: 'accounts', label: '账号矩阵' },
              { value: 'groups', label: '分组与标签' },
              { value: 'health', label: '健康度与风险' },
              { value: 'permissions', label: '权限与账号池' },
            ]}
          />
          {tab === 'accounts' && (
            <AccountTable state={state} filters={filters} onFilters={setFilters} onEdit={openEdit} />
          )}
          {tab === 'groups' && <GroupPanel state={state} visible={visible} onFilter={applyFilter} />}
          {tab === 'health' && <HealthPanel state={state} visible={visible} />}
          {tab === 'permissions' && <PermissionPanel state={state} />}
        </CardContent>
      </Card>

      <AccountDialog open={dialogOpen} onClose={() => setDialogOpen(false)} state={state} editing={editing} />
    </div>
  )
}
