'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Save, Sparkles, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { KeywordInput } from '@/components/geo/keyword-input'
import { Segmented } from '@/components/geo/segmented'
import { FieldLabel, StepSection } from '@/components/geo/geo-workbench'
import { useBrands } from '@/lib/brand-kb'
import { DispatchBadge } from '@/components/matrix/matrix-ui'
import { evaluateAccount, getLevel, isEligible, matrixPlatforms } from '@/lib/matrix-data'
import { useMatrix } from '@/lib/matrix-store'
import type { Job, Stage } from '@/lib/ugc-data'
import { addJobs, nextJobId } from '@/lib/ugc-store'
import { cn } from '@/lib/utils'

const ugcPlatforms = matrixPlatforms.map((p) => p.name)
type PublishMode = 'review' | 'schedule' | 'now'

const modeMeta: Record<PublishMode, { stage: Stage; hint: string }> = {
  review: { stage: '草稿预审', hint: '先进入草稿预审，人工通过后再进入定时队列' },
  schedule: { stage: '已定时', hint: '直接进入定时队列，到点自动发布' },
  now: { stage: '发布中', hint: '保存后立即向所选账号发布' },
}

const inputClass =
  'h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function toLocalInput(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function defaultTime() {
  const d = new Date()
  d.setHours(d.getHours() + 2, 0, 0, 0)
  return toLocalInput(d)
}

function formatTime(value: string) {
  const d = new Date(value)
  return `${d.getMonth() + 1}月${d.getDate()}日 ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function UgcCreateForm() {
  const router = useRouter()
  const brands = useBrands()
  const matrix = useMatrix()

  const [taskName, setTaskName] = useState('')
  const [brandId, setBrandId] = useState('')
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [platforms, setPlatforms] = useState<string[]>([])
  const [accountIds, setAccountIds] = useState<string[]>([])
  const [core, setCore] = useState(false)
  const [mode, setMode] = useState<PublishMode>('review')
  const [time, setTime] = useState(defaultTime)

  const { settings } = matrix
  const operable = useMemo(
    () =>
      matrix.accounts
        .filter((a) => {
          const level = getLevel(matrix, matrix.currentMemberId, a.poolId)
          return level === '管理' || level === '运营'
        })
        .map((a) => ({ a, e: evaluateAccount(a, settings) }))
        .sort((x, y) => (settings.corePriority ? (y.a.indexRate ?? -1) - (x.a.indexRate ?? -1) : 0)),
    [matrix, settings],
  )
  const coreOnly = core && settings.corePriority
  const usable = (e: { dispatch: Parameters<typeof isEligible>[0] }) =>
    isEligible(e.dispatch) && (!coreOnly || e.dispatch === '核心优选')
  const selectedAccounts = useMemo(
    () =>
      operable
        .filter((x) => platforms.includes(x.a.platform) && accountIds.includes(x.a.id) && usable(x.e))
        .map((x) => x.a),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [operable, platforms, accountIds, coreOnly],
  )

  const basicDone = taskName.trim().length > 0 && topic.trim().length > 0
  const ready = basicDone && platforms.length > 0 && selectedAccounts.length > 0 && (mode === 'now' || !!time)

  const missing = useMemo(() => {
    const list: string[] = []
    if (!taskName.trim()) list.push('任务名称')
    if (!topic.trim()) list.push('内容主题')
    if (!platforms.length) list.push('发布平台')
    else if (!selectedAccounts.length) list.push('发布账号')
    return list
  }, [taskName, topic, platforms.length, selectedAccounts.length])

  function togglePlatform(p: string) {
    setPlatforms((cur) => (cur.includes(p) ? cur.filter((v) => v !== p) : [...cur, p]))
  }

  function toggleAccount(id: string) {
    setAccountIds((cur) => (cur.includes(id) ? cur.filter((v) => v !== id) : [...cur, id]))
  }

  function smartPick(targets: string[]) {
    const picked = targets.flatMap((p) =>
      operable
        .filter((x) => x.a.platform === p && usable(x.e))
        .sort((x, y) => (y.a.indexRate ?? -1) - (x.a.indexRate ?? -1))
        .slice(0, 2)
        .map((x) => x.a.id),
    )
    setAccountIds((cur) => {
      const keep = cur.filter((id) => !operable.some((x) => x.a.id === id && targets.includes(x.a.platform)))
      return [...keep, ...picked]
    })
  }

  function fillExample() {
    setTaskName('纯电 SUV 选购指南 · 全平台分发')
    setBrandId(brands[0]?.id ?? '')
    setTopic('三十万内纯电 SUV 怎么选？一份不踩坑清单')
    setKeywords(['纯电SUV', '选车攻略'])
    setPlatforms(['小红书', '知乎'])
    const ids = ['小红书', '知乎'].flatMap((p) =>
      operable
        .filter((x) => x.a.platform === p && isEligible(x.e.dispatch))
        .sort((x, y) => (y.a.indexRate ?? -1) - (x.a.indexRate ?? -1))
        .slice(0, 2)
        .map((x) => x.a.id),
    )
    setAccountIds(ids)
  }

  function save() {
    if (!ready) return
    const stage = modeMeta[mode].stage
    const label = mode === 'now' ? '正在发布' : formatTime(time)
    const start = nextJobId()
    const created: Job[] = selectedAccounts.map((a, i) => ({
      id: start + i,
      title: topic.trim(),
      platform: a.platform,
      account: a.name,
      time: label,
      stage,
    }))
    addJobs(created)
    router.push('/ugc')
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          <StepSection
            index={1}
            title="任务信息"
            desc="填写任务名称与要分发的内容主题，可关联品牌与关键词，便于发布后同步 GEO 监测"
            done={basicDone}
            action={
              <Button variant="ghost" size="sm" onClick={fillExample}>
                <Wand2 />
                填入示例
              </Button>
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel required>任务名称</FieldLabel>
                <input
                  className={inputClass}
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="例如：纯电 SUV 选购指南 · 全平台分发"
                  maxLength={40}
                  aria-label="任务名称"
                />
              </div>
              <div>
                <FieldLabel>关联品牌</FieldLabel>
                <select
                  className={inputClass}
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  aria-label="关联品牌"
                >
                  <option value="">不关联品牌</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <FieldLabel required>内容主题 / 标题</FieldLabel>
                <input
                  className={inputClass}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="例如：三十万内纯电 SUV 怎么选？一份不踩坑清单"
                  maxLength={60}
                  aria-label="内容主题"
                />
              </div>
              <div className="md:col-span-2">
                <FieldLabel>关联关键词</FieldLabel>
                <KeywordInput keywords={keywords} onChange={setKeywords} />
              </div>
            </div>
          </StepSection>

          <StepSection
            index={2}
            title="选择发布平台与账号"
            desc="先选平台，再从矩阵账号中勾选；每个账号生成一条分发任务，低权重、高风险与待授权账号会按矩阵策略自动规避"
            done={platforms.length > 0 && selectedAccounts.length > 0}
          >
            <div role="group" aria-label="发布平台" className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {ugcPlatforms.map((p) => {
                const checked = platforms.includes(p)
                return (
                  <label key={p} className="relative block cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePlatform(p)}
                      className="peer sr-only"
                    />
                    <span
                      className={cn(
                        'flex items-center gap-3 rounded-xl border p-3.5 transition-colors',
                        'peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50',
                        checked
                          ? 'border-primary/60 bg-primary/10'
                          : 'border-border bg-background hover:border-primary/30 hover:bg-muted/40',
                      )}
                    >
                      <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-sm font-bold">
                        {p.slice(0, 1)}
                      </span>
                      <span className="flex-1 text-sm font-semibold">{p}</span>
                      <span
                        className={cn(
                          'flex size-5 items-center justify-center rounded-md border',
                          checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
                        )}
                      >
                        {checked && <Check className="size-3.5" strokeWidth={3} />}
                      </span>
                    </span>
                  </label>
                )
              })}
            </div>

            {platforms.length > 0 && (
              <div className="mt-5 flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2.5">
                  <label className="flex cursor-pointer items-center gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={core}
                      onChange={(e) => setCore(e.target.checked)}
                      className="size-4 accent-[var(--primary)]"
                    />
                    <span className="font-medium">核心内容</span>
                    <span className="text-muted-foreground">
                      {settings.corePriority
                        ? `仅分发至收录率 ≥ ${settings.coreIndexRate}% 的核心优选账号`
                        : '矩阵管理中未开启“核心内容优先”策略'}
                    </span>
                  </label>
                  <Button type="button" variant="outline" size="sm" onClick={() => smartPick(platforms)}>
                    <Sparkles />
                    按收录率智能选号
                  </Button>
                </div>
                {ugcPlatforms
                  .filter((p) => platforms.includes(p))
                  .map((p) => {
                    const list = operable.filter((x) => x.a.platform === p)
                    return (
                      <div key={p}>
                        <p className="mb-2 text-xs font-medium text-muted-foreground">{p} 账号</p>
                        {list.length === 0 && (
                          <p className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
                            该平台暂无你有权操作的账号，请在账号矩阵管理中绑定或申请权限
                          </p>
                        )}
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                          {list.map(({ a, e }) => {
                            const eligible = isEligible(e.dispatch)
                            const disabled = !usable(e)
                            const checked = !disabled && accountIds.includes(a.id)
                            const note = !eligible
                              ? e.reason
                              : disabled
                                ? '非核心优选账号，核心内容已自动规避'
                                : `健康度 ${e.health} · 收录率 ${a.indexRate ?? '—'}${a.indexRate === null ? '' : '%'}`
                            return (
                              <label
                                key={a.id}
                                className={cn('relative block', disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer')}
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  disabled={disabled}
                                  onChange={() => toggleAccount(a.id)}
                                  className="peer sr-only"
                                />
                                <span
                                  className={cn(
                                    'flex items-center gap-3 rounded-xl border p-3 transition-colors',
                                    'peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50',
                                    checked
                                      ? 'border-primary/60 bg-primary/10'
                                      : 'border-border bg-background hover:border-primary/30',
                                  )}
                                >
                                  <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-medium">{a.name}</span>
                                    <span className="block truncate text-[11px] text-muted-foreground">
                                      {a.persona} · {note}
                                    </span>
                                  </span>
                                  <DispatchBadge dispatch={e.dispatch} />
                                </span>
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
            {platforms.length === 0 && (
              <p className="mt-4 text-xs text-muted-foreground">请先选择至少一个发布平台</p>
            )}
          </StepSection>

          <StepSection
            index={3}
            title="发布方式与时间"
            desc="选择内容进入哪一个环节，定时发布需指定发布时间"
            done={mode === 'now' || !!time}
          >
            <div className="flex flex-col gap-4">
              <Segmented
                value={mode}
                onChange={setMode}
                aria-label="发布方式"
                options={[
                  { value: 'review', label: '草稿预审' },
                  { value: 'schedule', label: '定时发布' },
                  { value: 'now', label: '立即发布' },
                ]}
              />
              <p className="text-xs text-muted-foreground">{modeMeta[mode].hint}</p>
              {mode !== 'now' && (
                <div className="max-w-xs">
                  <FieldLabel required>计划发布时间</FieldLabel>
                  <input
                    type="datetime-local"
                    className={inputClass}
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    aria-label="计划发布时间"
                  />
                </div>
              )}
            </div>
          </StepSection>
        </div>

        <div className="flex flex-col gap-4 border-t border-border bg-background/40 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground" role="status">
            {ready ? (
              <>
                将在 <span className="font-mono text-foreground">{platforms.length}</span> 个平台、
                <span className="font-mono text-foreground">{selectedAccounts.length}</span> 个账号上创建{' '}
                <span className="font-mono text-foreground">{selectedAccounts.length}</span> 条分发任务
              </>
            ) : (
              <>请先完成：{missing.join('、')}</>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="lg" onClick={() => router.push('/ugc')} className="h-10 px-4 text-sm">
              取消
            </Button>
            <Button size="lg" onClick={save} disabled={!ready} className={cn('h-10 px-5 text-sm', ready && 'glow-primary')}>
              <Save />
              保存并创建任务
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
