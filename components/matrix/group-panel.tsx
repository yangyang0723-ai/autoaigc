'use client'

import { useState } from 'react'
import { Plus, Tag, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { fieldClass, HealthMeter } from '@/components/matrix/matrix-ui'
import { evaluateAccount, type MatrixAccount, type MatrixState } from '@/lib/matrix-data'
import { addGroup, removeGroup } from '@/lib/matrix-store'
import type { MatrixFilters } from '@/components/matrix/account-table'

function countBy(list: string[]) {
  const map = new Map<string, number>()
  list.forEach((k) => map.set(k, (map.get(k) ?? 0) + 1))
  return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
}

export function GroupPanel({
  state,
  visible,
  onFilter,
}: {
  state: MatrixState
  visible: MatrixAccount[]
  onFilter: (patch: Partial<MatrixFilters>) => void
}) {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [error, setError] = useState('')
  const isAdmin = state.members.find((m) => m.id === state.currentMemberId)?.role === '管理员'

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const n = name.trim()
    if (!n) return setError('请输入分组名称')
    if (state.groups.some((g) => g.name === n)) return setError('分组名称已存在')
    addGroup({ name: n, desc: desc.trim() || '自定义分组' })
    setName('')
    setDesc('')
    setError('')
  }

  const personaCounts = countBy(visible.map((a) => a.persona))
  const lineCounts = countBy(visible.flatMap((a) => a.lines))
  const ungrouped = visible.filter((a) => !a.groupId)

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {state.groups.map((g) => {
          const members = visible.filter((a) => a.groupId === g.id)
          const evals = members.map((a) => evaluateAccount(a, state.settings))
          const avg = evals.length ? Math.round(evals.reduce((s, e) => s + e.health, 0) / evals.length) : 0
          const risky = evals.filter((e) => e.risk === '高').length
          const platforms = Array.from(new Set(members.map((a) => a.platform)))
          return (
            <div key={g.id} className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{g.name}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{g.desc}</p>
                </div>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => removeGroup(g.id)}
                    aria-label={`删除分组 ${g.name}`}
                    className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <p className="text-[11px] text-muted-foreground">账号</p>
                  <p className="font-mono text-lg font-bold">{members.length}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">平均健康</p>
                  {members.length ? <HealthMeter score={avg} /> : <p className="font-mono text-lg font-bold">—</p>}
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">高风险</p>
                  <p className="font-mono text-lg font-bold text-destructive">{risky}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {platforms.map((p) => (
                  <Badge key={p} variant="outline" className="px-1.5 py-0 text-[10px]">
                    {p}
                  </Badge>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={() => onFilter({ groupId: g.id })}>
                查看分组账号
              </Button>
            </div>
          )
        })}
        {ungrouped.length > 0 && (
          <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border bg-background p-4">
            <p className="text-sm font-semibold">未分组</p>
            <p className="text-[11px] text-muted-foreground">
              {ungrouped.length} 个账号尚未归入分组，可在账号编辑中指定分组
            </p>
            <div className="flex flex-wrap gap-1">
              {ungrouped.map((a) => (
                <Badge key={a.id} variant="muted">
                  {a.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {isAdmin && (
        <form onSubmit={submit} className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
          <p className="text-sm font-semibold">新增分组</p>
          <div className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
            <input
              className={fieldClass}
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              placeholder="分组名称，如：竞品对比矩阵"
              maxLength={16}
              aria-label="分组名称"
            />
            <input
              className={fieldClass}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="分组说明（可选）"
              maxLength={40}
              aria-label="分组说明"
            />
            <Button type="submit" size="lg">
              <Plus />
              添加分组
            </Button>
          </div>
          {error && (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          )}
        </form>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Tag className="size-4 text-primary" />
            人设标签
            <span className="text-[11px] font-normal text-muted-foreground">测评号 / 种草号 / 问答号…</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {personaCounts.map(([k, n]) => (
              <button
                key={k}
                type="button"
                onClick={() => onFilter({ persona: k })}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium transition-colors hover:border-primary/50 hover:bg-primary/10"
              >
                {k}
                <span className="font-mono text-muted-foreground">{n}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Tag className="size-4 text-accent" />
            品类 / 产品线标签
            <span className="text-[11px] font-normal text-muted-foreground">按产品线管理账号</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {lineCounts.map(([k, n]) => (
              <button
                key={k}
                type="button"
                onClick={() => onFilter({ line: k })}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium transition-colors hover:border-accent/50 hover:bg-accent/10"
              >
                {k}
                <span className="font-mono text-muted-foreground">{n}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground">
        点击分组或标签将跳转到账号矩阵并自动筛选；当前统计仅包含「{state.members.find((m) => m.id === state.currentMemberId)?.name}」有权访问的{' '}
        {visible.length} 个账号
      </p>
    </div>
  )
}
