'use client'

import { useState } from 'react'
import { ShieldCheck, ShieldAlert, ScanSearch, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { GuardRule } from '@/lib/brand-kb'

export function VerifyPlayground({ rules, sample }: { rules: GuardRule[]; sample: string }) {
  const [text, setText] = useState(sample)
  const [checked, setChecked] = useState(false)

  const hits = rules.filter((r) => text.includes(r.claim))
  const fixed = hits.reduce((t, r) => t.split(r.claim).join(r.fix), text)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="kb-verify" className="text-xs font-medium text-muted-foreground">
          模拟 AI 内容创作环节产出的文案
        </label>
        <textarea
          id="kb-verify"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setChecked(false)
          }}
          rows={3}
          className="mt-1.5 w-full resize-none rounded-lg border border-input bg-background p-3 text-sm leading-relaxed outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => setChecked(true)}>
          <ScanSearch />
          调用知识库校验
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setText(sample)
            setChecked(false)
          }}
        >
          恢复示例
        </Button>
      </div>

      {checked && (
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
          <div className="flex items-center gap-2">
            {hits.length === 0 ? (
              <>
                <ShieldCheck className="size-5 text-emerald-400" />
                <p className="text-sm font-semibold">校验通过，未发现与知识库冲突的内容</p>
              </>
            ) : (
              <>
                <ShieldAlert className="size-5 text-amber-400" />
                <p className="text-sm font-semibold">发现 {hits.length} 处与品牌知识库不一致</p>
              </>
            )}
          </div>
          {hits.map((h) => (
            <div key={h.claim} className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-2.5 text-sm">
              <Badge variant={h.kind === '参数冲突' ? 'warning' : 'danger'}>{h.kind}</Badge>
              <span className="text-muted-foreground">{h.field}</span>
              <span className="rounded bg-destructive/15 px-1.5 font-mono text-xs text-destructive line-through">
                {h.claim}
              </span>
              <ArrowRight className="size-3.5 text-muted-foreground" />
              <span className="rounded bg-emerald-500/15 px-1.5 font-mono text-xs text-emerald-400">{h.official}</span>
            </div>
          ))}
          {hits.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                自动修正后的文案
              </p>
              <p className="mt-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm leading-relaxed">
                {fixed}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
