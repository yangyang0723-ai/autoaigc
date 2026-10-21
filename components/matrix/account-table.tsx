'use client'

import { useMemo, useState } from 'react'
import { KeyRound, Lock, Pencil, Search, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Segmented } from '@/components/geo/segmented'
import {
  DispatchBadge,
  fieldClass,
  HealthMeter,
  PlatformMark,
} from '@/components/matrix/matrix-ui'
import {
  evaluateAccount,
  formatFans,
  getLevel,
  matrixPlatforms,
  type MatrixAccount,
  type MatrixState,
} from '@/lib/matrix-data'
import { authorizeAccount, removeAccount } from '@/lib/matrix-store'

export type MatrixFilters = {
  q: string
  platform: string
  groupId: string
  persona: string
  line: string
}

export const emptyFilters: MatrixFilters = { q: '', platform: '全部', groupId: '', persona: '', line: '' }

const stateVariant = { 正常: 'success', 限流: 'warning', 待授权: 'danger', 已冻结: 'muted' } as const

export function AccountTable({
  state,
  filters,
  onFilters,
  onEdit,
}: {
  state: MatrixState
  filters: MatrixFilters
  onFilters: (next: MatrixFilters) => void
  onEdit: (account: MatrixAccount) => void
}) {
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const { accounts, groups, pools, settings, currentMemberId } = state

  const personas = useMemo(() => Array.from(new Set(accounts.map((a) => a.persona))), [accounts])
  const lines = useMemo(() => Array.from(new Set(accounts.flatMap((a) => a.lines))), [accounts])

  const rows = useMemo(() => {
    const q = filters.q.trim().toLowerCase()
    return accounts.filter((a) => {
      const level = getLevel(state, currentMemberId, a.poolId)
      if (q && (!level || !a.name.toLowerCase().includes(q))) return false
      if (filters.platform !== '全部' && a.platform !== filters.platform) return false
      if (filters.groupId && a.groupId !== filters.groupId) return false
      if (filters.persona && a.persona !== filters.persona) return false
      if (filters.line && !a.lines.includes(filters.line)) return false
      return true
    })
  }, [accounts, filters, state, currentMemberId])

  const set = (patch: Partial<MatrixFilters>) => onFilters({ ...filters, ...patch })
  const active =
    filters.q || filters.platform !== '全部' || filters.groupId || filters.persona || filters.line

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <Segmented
          value={filters.platform}
          onChange={(v) => set({ platform: v })}
          aria-label="平台筛选"
          options={[{ value: '全部', label: '全部平台' }, ...matrixPlatforms.map((p) => ({ value: p.name, label: p.name }))]}
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative lg:col-span-2">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              className={`${fieldClass} pl-9`}
              value={filters.q}
              onChange={(e) => set({ q: e.target.value })}
              placeholder="搜索账号名称"
              aria-label="搜索账号名称"
            />
          </div>
          <select className={fieldClass} value={filters.groupId} onChange={(e) => set({ groupId: e.target.value })} aria-label="分组筛选">
            <option value="">全部分组</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          <select className={fieldClass} value={filters.persona} onChange={(e) => set({ persona: e.target.value })} aria-label="人设标签筛选">
            <option value="">全部人设</option>
            {personas.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          <select className={fieldClass} value={filters.line} onChange={(e) => set({ line: e.target.value })} aria-label="产品线筛选">
            <option value="">全部产品线</option>
            {lines.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span role="status">
            共 <span className="font-mono text-foreground">{rows.length}</span> 个账号
          </span>
          {active && (
            <Button variant="ghost" size="sm" onClick={() => onFilters(emptyFilters)}>
              清除筛选
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="py-2 pr-3 font-medium">账号</th>
              <th className="px-3 py-2 font-medium">分组</th>
              <th className="px-3 py-2 text-right font-medium">粉丝</th>
              <th className="px-3 py-2 font-medium">健康度</th>
              <th className="px-3 py-2 text-right font-medium">权重</th>
              <th className="px-3 py-2 text-right font-medium">收录率</th>
              <th className="px-3 py-2 font-medium">账号状态</th>
              <th className="px-3 py-2 font-medium">分发状态</th>
              <th className="px-3 py-2 font-medium">权限池 / 我的权限</th>
              <th className="py-2 pl-3 text-right font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => {
              const level = getLevel(state, currentMemberId, a.poolId)
              const pool = pools.find((p) => p.id === a.poolId)
              if (!level) {
                return (
                  <tr key={a.id} className="border-b border-border/60 bg-muted/20 last:border-0">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <span className="flex size-8 items-center justify-center rounded-lg bg-muted">
                          <Lock className="size-4" />
                        </span>
                        <div>
                          <p className="text-sm font-medium">无权限账号</p>
                          <p className="text-[11px]">{a.platform}</p>
                        </div>
                      </div>
                    </td>
                    <td colSpan={7} className="px-3 py-3 text-xs text-muted-foreground">
                      该账号属于「{pool?.name}」，当前身份无访问权限，详情已隐藏
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">无权限</td>
                    <td />
                  </tr>
                )
              }
              const e = evaluateAccount(a, settings)
              const group = groups.find((g) => g.id === a.groupId)
              const canManage = level === '管理'
              return (
                <tr key={a.id} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-3">
                    <div className="flex items-center gap-3">
                      <PlatformMark platform={a.platform} />
                      <div className="min-w-0">
                        <p className="font-medium">{a.name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-1">
                          <span className="text-[11px] text-muted-foreground">{a.platform}</span>
                          <Badge variant="accent" className="px-1.5 py-0 text-[10px]">
                            {a.persona}
                          </Badge>
                          {a.lines.map((l) => (
                            <Badge key={l} variant="muted" className="px-1.5 py-0 text-[10px]">
                              {l}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{group?.name ?? '未分组'}</td>
                  <td className="px-3 py-3 text-right font-mono">{formatFans(a.fans)}</td>
                  <td className="px-3 py-3">
                    <HealthMeter score={e.health} />
                  </td>
                  <td className="px-3 py-3 text-right font-mono">{a.weight}</td>
                  <td className="px-3 py-3 text-right font-mono">{a.indexRate === null ? '—' : `${a.indexRate}%`}</td>
                  <td className="px-3 py-3">
                    <Badge variant={stateVariant[a.status]}>{a.status}</Badge>
                  </td>
                  <td className="px-3 py-3" title={e.reason}>
                    <DispatchBadge dispatch={e.dispatch} />
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-xs">{pool?.name}</p>
                    <p className="text-[11px] text-muted-foreground">{level}权限</p>
                  </td>
                  <td className="py-3 pl-3">
                    <div className="flex items-center justify-end gap-1">
                      {canManage && confirmId === a.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              removeAccount(a.id)
                              setConfirmId(null)
                            }}
                          >
                            确认解绑
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setConfirmId(null)}>
                            取消
                          </Button>
                        </>
                      ) : canManage ? (
                        <>
                          {a.status === '待授权' && (
                            <Button size="sm" variant="outline" onClick={() => authorizeAccount(a.id)}>
                              <KeyRound />
                              授权
                            </Button>
                          )}
                          <Button size="icon-sm" variant="ghost" aria-label={`编辑 ${a.name}`} onClick={() => onEdit(a)}>
                            <Pencil />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            aria-label={`解绑 ${a.name}`}
                            onClick={() => setConfirmId(a.id)}
                          >
                            <Trash2 />
                          </Button>
                        </>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">无管理权限</span>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={10} className="py-12 text-center text-sm text-muted-foreground">
                  没有符合条件的账号
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
