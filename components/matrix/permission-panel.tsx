'use client'

import { Badge } from '@/components/ui/badge'
import { fieldClass } from '@/components/matrix/matrix-ui'
import { getLevel, type PoolLevel, type MatrixState } from '@/lib/matrix-data'
import { setMemberLevel } from '@/lib/matrix-store'

const levelDesc: { level: PoolLevel; variant: 'accent' | 'default' | 'muted'; text: string }[] = [
  { level: '管理', variant: 'accent', text: '编辑 / 授权 / 解绑账号，登记违规，参与分发' },
  { level: '运营', variant: 'default', text: '查看账号并选入分发任务，不可修改绑定信息' },
  { level: '只读', variant: 'muted', text: '仅查看账号与健康度，不可参与分发' },
]

export function PermissionPanel({ state }: { state: MatrixState }) {
  const me = state.members.find((m) => m.id === state.currentMemberId)
  const isAdmin = me?.role === '管理员'

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 md:grid-cols-3">
        {levelDesc.map((l) => (
          <div key={l.level} className="rounded-xl border border-border bg-background p-4">
            <Badge variant={l.variant}>{l.level}权限</Badge>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{l.text}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="py-2 pr-3 font-medium">账号池</th>
              <th className="px-3 py-2 text-right font-medium">账号数</th>
              {state.members.map((m) => (
                <th key={m.id} className="px-3 py-2 font-medium">
                  <span className="block text-foreground">{m.name}</span>
                  <span className="text-[11px] font-normal">{m.role}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {state.pools.map((p) => {
              const count = state.accounts.filter((a) => a.poolId === p.id).length
              return (
                <tr key={p.id} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-3">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground">{p.desc}</p>
                  </td>
                  <td className="px-3 py-3 text-right font-mono">{count}</td>
                  {state.members.map((m) => {
                    const level = getLevel(state, m.id, p.id)
                    const memberIsAdmin = m.role === '管理员'
                    return (
                      <td key={m.id} className="px-3 py-3">
                        {memberIsAdmin ? (
                          <Badge variant="accent">管理（全局）</Badge>
                        ) : (
                          <div className="w-28">
                            <select
                              className={`${fieldClass} h-8 text-xs`}
                              value={level ?? ''}
                              disabled={!isAdmin}
                              aria-label={`${m.name} 在 ${p.name} 的权限`}
                              onChange={(e) => setMemberLevel(p.id, m.id, (e.target.value || null) as PoolLevel | null)}
                            >
                              <option value="">无权限</option>
                              <option value="只读">只读</option>
                              <option value="运营">运营</option>
                              <option value="管理">管理</option>
                            </select>
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-muted-foreground">
        {isAdmin
          ? '你是管理员，可调整任意成员在各账号池的权限；调整后立即生效，无权限成员将看不到账号详情。'
          : `当前身份「${me?.name}」不是管理员，权限矩阵为只读。可在页面顶部切换身份预览不同成员的可见范围。`}
      </p>
    </div>
  )
}
