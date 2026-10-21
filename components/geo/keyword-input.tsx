'use client'

import { useId, useState } from 'react'
import { X } from 'lucide-react'

const SPLITTER = /[,，、;；\n]+/

export function KeywordInput({
  keywords,
  onChange,
  max = 10,
}: {
  keywords: string[]
  onChange: (next: string[]) => void
  max?: number
}) {
  const [draft, setDraft] = useState('')
  const [notice, setNotice] = useState('')
  const inputId = useId()

  function commit(raw: string) {
    const parts = raw
      .split(SPLITTER)
      .map((s) => s.trim().slice(0, 30))
      .filter(Boolean)
    if (!parts.length) {
      setDraft('')
      return
    }
    const next = [...keywords]
    let skippedDup = false
    let skippedMax = false
    for (const p of parts) {
      if (next.includes(p)) {
        skippedDup = true
        continue
      }
      if (next.length >= max) {
        skippedMax = true
        break
      }
      next.push(p)
    }
    onChange(next)
    setDraft('')
    setNotice(skippedMax ? `最多添加 ${max} 个关键词` : skippedDup ? '已自动忽略重复关键词' : '')
  }

  function remove(kw: string) {
    onChange(keywords.filter((k) => k !== kw))
    setNotice('')
  }

  return (
    <div>
      <label
        htmlFor={inputId}
        className="flex min-h-[88px] cursor-text flex-wrap content-start items-start gap-2 rounded-lg border border-border bg-background p-2.5 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/40"
      >
        {keywords.map((kw) => (
          <span
            key={kw}
            className="inline-flex max-w-full items-center gap-1 rounded-md bg-primary/15 py-1 pr-1 pl-2 text-xs font-medium text-primary"
          >
            <span className="truncate">{kw}</span>
            <button
              type="button"
              onClick={() => remove(kw)}
              aria-label={`移除关键词 ${kw}`}
              className="flex size-4 items-center justify-center rounded text-primary/70 hover:bg-primary/20 hover:text-primary"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          id={inputId}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value)
            if (notice) setNotice('')
          }}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing || e.keyCode === 229) return
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              commit(draft)
            } else if (e.key === 'Backspace' && !draft && keywords.length) {
              onChange(keywords.slice(0, -1))
            }
          }}
          onBlur={() => draft.trim() && commit(draft)}
          onPaste={(e) => {
            const text = e.clipboardData.getData('text')
            if (SPLITTER.test(text)) {
              e.preventDefault()
              commit(text)
            }
          }}
          disabled={keywords.length >= max && !draft}
          placeholder={keywords.length ? '继续输入…' : '输入关键词，回车添加，如：30万以内纯电SUV推荐'}
          className="min-w-40 flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
      </label>
      <div className="mt-1.5 flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
        <span className={notice ? 'text-amber-400' : ''} role="status">
          {notice || '回车或逗号分隔，支持粘贴多个关键词'}
        </span>
        <span className="font-mono">
          {keywords.length}/{max}
        </span>
      </div>
    </div>
  )
}
