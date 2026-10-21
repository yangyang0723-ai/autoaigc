'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, ClipboardPlus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Segmented } from '@/components/geo/segmented'
import {
  DispatchBadge,
  fieldClass,
  HealthMeter,
  PlatformMark,
  RiskBadge,
} from '@/components/matrix/matrix-ui'
import {
  evaluateAccount,
  getLevel,
  REF_DATE,
  violationTypes,
  type MatrixAccount,
  type MatrixState,
  type Severity,
} from '@/lib/matrix-data'
import { addViolation } from '@/lib/matrix-store'
import { cn } from '@/lib/utils'

const severityVariant = { 轻: 'warning', 中: 'warning', 重: 'danger' } as const

function suggestion(dispatch: string, risk: string) {
  if (dispatch === '已冻结') return '暂停使用，待平台解封后重新评估'
  if (dispatch === '待授权') return '完成平台授权后再参与分发'
  if (dispatch === '已规避') return '提升账号权重与合规表现，达标后自动恢复'
  if (risk === '中') return '正常分发，建议降低营销强度'
  if (dispatch === '核心优选') return '承接核心内容，保持当前节奏'
  return '状态良好'
}

function ViolationForm({ accountId }: { accountId: string }) {
  const [type, setType] = useState<string>(violationTypes[0])
  const [severity, setSeverity] = useState<Severity>('轻')
  const [note, setNote] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    addViolation(accountId, {
      date: REF_DATE.toISOString().slice(0, 10),
      type,
      severity,
      note: note.trim() || '无补充说明',
    })
    setNote('')
  }

  return (
    <form onSubmit={submit} className="mt-3 flex flex-col gap-3 rounded-lg border border-border bg-card p-3">
      <p className="text-xs font-semibold">登记违规记录</p>
      <div className="grid gap-3 md:grid-cols-[160px_auto_1fr_auto]">
        <select className={fieldClass} value={type} onChange={(e) => setType(e.target.value)} aria-label="违规类型">
          {violationTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <Segmented
          value={severity}
          onChange={setSeverity}
          aria-label="严重程度"
          options={[
            { value: '轻', label: '轻度' },
            { value: '中', label: '中度' },
            { value: '重', label: '重度' },
          ]}
        />
        <input
          className={fieldClass}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="违规说明（可选）"
          maxLength={60}
          aria-label="违规说明"
        />
        <Button type="submit">
          <ClipboardPlus />
          登记
        </Button>
      </div>
    </form>
  )
}

export function HealthPanel({ state, visible }: { state: MatrixState; visible: MatrixAccount[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const [sort, setSort] = useState<'risk' | 'index'>('risk')

  const rows = useMemo(() => {
    const list = visible.map((a) => ({ a, e: evaluateAccount(a, state.settings) }))
    return list.sort((x, y) => (sort === 'risk' ? x.e.health - y.e.health : (y.a.indexRate ?? -1) - (x.a.indexRate ?? -1)))
  }, [visible, state.settings, sort])

  const high = rows.filter((r) => r.e.risk === '高').length
  const mid = rows.filter((r) => r.e.risk === '中').length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="muted">健康度 = 权重 × 35% + 收录率 × 40% + 合规分 × 25%</Badge>
          <span>合规分按 90 天内违规记录扣分：轻 8 · 中 18 · 重 35</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            高风险 <span className="font-mono text-destructive">{high}</span> · 中风险{' '}
            <span className="font-mono text-amber-400">{mid}</span>
          </span>
          <Segmented
            value={sort}
            onChange={setSort}
            aria-label="排序方式"
            options={[
              { value: 'risk', label: '风险优先' },
              { value: 'index', label: '收录率优先' },
            ]}
          />
        </div>
      </div>

      <ul className="flex flex-col gap-2">
        {rows.map(({ a, e }) => {
          const expanded = openId === a.id
          const canManage = getLevel(state, state.currentMemberId, a.poolId) === '管理'
          return (
            <li key={a.id} className="rounded-xl border border-border bg-background">
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpenId(expanded ? null : a.id)}
                className="flex w-full flex-wrap items-center gap-x-6 gap-y-2 p-3 text-left"
              >
                <span className="flex min-w-48 flex-1 items-center gap-3">
                  <PlatformMark platform={a.platform} />
                  <span>
                    <span className="block text-sm font-medium">{a.name}</span>
                    <span className="block text-[11px] text-muted-foreground">
                      {a.platform} · {a.persona}
                    </span>
                  </span>
                </span>
                <span className="w-32">
                  <span className="mb-0.5 block text-[11px] text-muted-foreground">健康度</span>
                  <HealthMeter score={e.health} />
                </span>
                <span className="w-14">
                  <span className="block text-[11px] text-muted-foreground">权重</span>
                  <span className="font-mono text-sm font-semibold">{a.weight}</span>
                </span>
                <span className="w-16">
                  <span className="block text-[11px] text-muted-foreground">收录率</span>
                  <span className="font-mono text-sm font-semibold">{a.indexRate === null ? '—' : `${a.indexRate}%`}</span>
                </span>
                <span className="w-20">
                  <span className="block text-[11px] text-muted-foreground">违规（90 天 / 累计）</span>
                  <span className="font-mono text-sm font-semibold">
                    {e.recent} / {a.violations.length}
                  </span>
                </span>
                <span className="flex w-24 items-center gap-1.5">
                  <RiskBadge risk={e.risk} />
                </span>
                <span className="flex w-20 items-center">
                  <DispatchBadge dispatch={e.dispatch} />
                </span>
                <span className="min-w-40 flex-1 text-xs text-muted-foreground">{suggestion(e.dispatch, e.risk)}</span>
                <ChevronDown
                  className={cn('size-4 shrink-0 text-muted-foreground transition-transform', expanded && 'rotate-180')}
                />
              </button>
              {expanded && (
                <div className="border-t border-border p-4">
                  <p className="mb-2 text-xs font-semibold">历史违规记录</p>
                  {a.violations.length === 0 ? (
                    <p className="text-xs text-muted-foreground">暂无违规记录，合规分 100</p>
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {a.violations.map((v) => (
                        <li key={v.id} className="flex flex-wrap items-center gap-3 text-xs">
                          <span className="w-24 font-mono text-muted-foreground">{v.date}</span>
                          <Badge variant={severityVariant[v.severity]}>{v.severity}度</Badge>
                          <span className="font-medium">{v.type}</span>
                          <span className="text-muted-foreground">{v.note}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-3 text-[11px] text-muted-foreground">
                    {e.reason} · 合规分 {e.compliance}
                  </p>
                  {canManage ? (
                    <ViolationForm accountId={a.id} />
                  ) : (
                    <p className="mt-3 text-[11px] text-muted-foreground">仅账号池管理员可登记违规记录</p>
                  )}
                </div>
              )}
            </li>
          )
        })}
        {rows.length === 0 && (
          <li className="py-12 text-center text-sm text-muted-foreground">当前身份没有可查看的账号</li>
        )}
      </ul>
    </div>
  )
}
