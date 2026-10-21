'use client'

import { useMemo, useState } from 'react'
import { Link2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { KeywordInput } from '@/components/geo/keyword-input'
import { fieldClass, Modal } from '@/components/matrix/matrix-ui'
import {
  getLevel,
  matrixPlatforms,
  personaOptions,
  type MatrixAccount,
  type MatrixState,
} from '@/lib/matrix-data'
import { addAccount, updateAccount } from '@/lib/matrix-store'
import { cn } from '@/lib/utils'

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
    </div>
  )
}

function AccountForm({
  state,
  editing,
  onClose,
}: {
  state: MatrixState
  editing: MatrixAccount | null
  onClose: () => void
}) {
  const pools = useMemo(
    () => state.pools.filter((p) => getLevel(state, state.currentMemberId, p.id) === '管理'),
    [state],
  )

  const [platform, setPlatform] = useState(editing?.platform ?? matrixPlatforms[0].name)
  const [name, setName] = useState(editing?.name ?? '')
  const [persona, setPersona] = useState(editing?.persona ?? personaOptions[0])
  const [customPersona, setCustomPersona] = useState('')
  const [lines, setLines] = useState<string[]>(editing?.lines ?? [])
  const [groupId, setGroupId] = useState(editing?.groupId ?? state.groups[0]?.id ?? '')
  const [poolId, setPoolId] = useState(editing?.poolId ?? pools[0]?.id ?? '')
  const [fans, setFans] = useState(String(editing?.fans ?? ''))
  const [weight, setWeight] = useState(String(editing?.weight ?? 60))
  const [authorized, setAuthorized] = useState(true)
  const [error, setError] = useState('')

  const personaChoices = useMemo(() => {
    const extra = state.accounts.map((a) => a.persona).filter((p) => !personaOptions.includes(p as never))
    return Array.from(new Set([...personaOptions, ...extra]))
  }, [state.accounts])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return setError('请填写账号名称')
    if (!poolId) return setError('请选择账号所属权限池')
    if (state.accounts.some((a) => a.name === trimmed && a.platform === platform && a.id !== editing?.id)) {
      return setError('该平台下已绑定同名账号')
    }
    const finalPersona = customPersona.trim() || persona
    const base = {
      platform,
      name: trimmed,
      persona: finalPersona,
      lines,
      groupId,
      poolId,
      fans: Math.max(0, Number(fans) || 0),
      weight: Math.min(100, Math.max(0, Number(weight) || 0)),
    }
    if (editing) {
      updateAccount(editing.id, base)
    } else {
      addAccount({ ...base, status: authorized ? '正常' : '待授权', indexRate: null })
    }
    onClose()
  }

  return (
    <form onSubmit={submit}>
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <Field label="所属平台" required>
          <select
            className={fieldClass}
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            disabled={!!editing}
            aria-label="所属平台"
          >
            {matrixPlatforms.map((p) => (
              <option key={p.name}>{p.name}</option>
            ))}
          </select>
        </Field>
        <Field label="账号名称" required>
          <input
            className={fieldClass}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            placeholder="如：星河车主说"
            maxLength={30}
            aria-label="账号名称"
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="人设标签" required>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="人设标签">
              {personaChoices.map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={!customPersona && persona === p}
                  onClick={() => {
                    setPersona(p)
                    setCustomPersona('')
                  }}
                  className={cn(
                    'rounded-md border px-3 py-1 text-xs font-medium transition-colors',
                    !customPersona && persona === p
                      ? 'border-primary/60 bg-primary/15 text-primary'
                      : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {p}
                </button>
              ))}
              <input
                className={cn(fieldClass, 'h-8 w-36')}
                value={customPersona}
                onChange={(e) => setCustomPersona(e.target.value)}
                placeholder="自定义人设"
                maxLength={8}
                aria-label="自定义人设标签"
              />
            </div>
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="品类 / 产品线标签">
            <KeywordInput
              keywords={lines}
              onChange={setLines}
              max={5}
              noun="标签"
              placeholder="如：S7 系列、X5 系列，回车添加"
            />
          </Field>
        </div>

        <Field label="所属分组">
          <select className={fieldClass} value={groupId} onChange={(e) => setGroupId(e.target.value)} aria-label="所属分组">
            <option value="">未分组</option>
            {state.groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="所属权限池" required>
          <select className={fieldClass} value={poolId} onChange={(e) => setPoolId(e.target.value)} aria-label="所属权限池">
            {pools.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="粉丝数（万）">
          <input
            type="number"
            min={0}
            step="0.1"
            className={fieldClass}
            value={fans}
            onChange={(e) => setFans(e.target.value)}
            placeholder="如：8.2"
            aria-label="粉丝数"
          />
        </Field>
        <Field label="账号权重（0–100）">
          <input
            type="number"
            min={0}
            max={100}
            className={fieldClass}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            aria-label="账号权重"
          />
        </Field>

        {!editing && (
          <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border bg-background p-3 sm:col-span-2">
            <input
              type="checkbox"
              checked={authorized}
              onChange={(e) => setAuthorized(e.target.checked)}
              className="mt-0.5 size-4 accent-[var(--primary)]"
            />
            <span>
              <span className="block text-sm font-medium">绑定后立即完成平台授权</span>
              <span className="block text-[11px] text-muted-foreground">
                取消勾选则账号以“待授权”状态加入矩阵，授权完成前不会参与分发
              </span>
            </span>
          </label>
        )}

        {error && (
          <p role="alert" className="text-xs text-destructive sm:col-span-2">
            {error}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-border p-4">
        <Button type="button" variant="outline" size="lg" onClick={onClose}>
          取消
        </Button>
        <Button type="submit" size="lg">
          {editing ? <Save /> : <Link2 />}
          {editing ? '保存修改' : '绑定账号'}
        </Button>
      </div>
    </form>
  )
}

export function AccountDialog({
  open,
  onClose,
  state,
  editing,
}: {
  open: boolean
  onClose: () => void
  state: MatrixState
  editing: MatrixAccount | null
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? `编辑账号 · ${editing.name}` : '绑定新账号'}
      desc={
        editing
          ? '修改账号的人设、产品线、分组与权限池归属'
          : '支持小红书、知乎、抖音、公众号、什么值得买、百度贴吧；绑定后可参与分发与健康度评估'
      }
    >
      <AccountForm key={editing?.id ?? 'new'} state={state} editing={editing} onClose={onClose} />
    </Modal>
  )
}
