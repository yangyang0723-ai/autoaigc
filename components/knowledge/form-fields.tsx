'use client'

import { useId, useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { uid, type Product } from '@/lib/brand-kb'

export const inputClass =
  'h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/40'

export const textareaClass =
  'w-full resize-none rounded-lg border border-border bg-background p-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/40'

export function Field({
  label,
  htmlFor,
  required,
  hint,
  className,
  children,
}: {
  label: string
  htmlFor?: string
  required?: boolean
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline gap-1.5 text-xs font-medium">
        <span>
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </span>
        {hint && <span className="font-normal text-muted-foreground">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

const SPLITTER = /[,，、;；\n]+/

export function TagInput({
  tags,
  onChange,
  placeholder,
  max = 8,
  suggestions = [],
  ariaLabel,
}: {
  tags: string[]
  onChange: (next: string[]) => void
  placeholder: string
  max?: number
  suggestions?: string[]
  ariaLabel?: string
}) {
  const [draft, setDraft] = useState('')
  const id = useId()

  function commit(raw: string) {
    const parts = raw
      .split(SPLITTER)
      .map((s) => s.trim().slice(0, 30))
      .filter(Boolean)
    if (!parts.length) {
      setDraft('')
      return
    }
    const next = [...tags]
    for (const p of parts) {
      if (!next.includes(p) && next.length < max) next.push(p)
    }
    onChange(next)
    setDraft('')
  }

  const remaining = suggestions.filter((s) => !tags.includes(s))

  return (
    <div>
      <label
        htmlFor={id}
        className="flex min-h-9 cursor-text flex-wrap items-center gap-1.5 rounded-lg border border-border bg-background p-1.5 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/40"
      >
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex max-w-full items-center gap-1 rounded-md bg-primary/15 py-1 pr-1 pl-2 text-xs font-medium text-primary"
          >
            <span className="truncate">{t}</span>
            <button
              type="button"
              onClick={() => onChange(tags.filter((x) => x !== t))}
              aria-label={`移除 ${t}`}
              className="flex size-4 items-center justify-center rounded text-primary/70 hover:bg-primary/20 hover:text-primary"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          aria-label={ariaLabel}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing || e.keyCode === 229) return
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault()
              commit(draft)
            } else if (e.key === 'Backspace' && !draft && tags.length) {
              onChange(tags.slice(0, -1))
            }
          }}
          onBlur={() => draft.trim() && commit(draft)}
          disabled={tags.length >= max}
          placeholder={tags.length ? '' : placeholder}
          className="min-w-32 flex-1 bg-transparent px-1.5 py-1 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
        />
      </label>
      {remaining.length > 0 && tags.length < max && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-muted-foreground">快捷添加：</span>
          {remaining.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onChange([...tags, s])}
              className="inline-flex items-center gap-0.5 rounded-md border border-dashed border-border px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Plus className="size-3" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function ProductEditor({
  products,
  onChange,
  max = 6,
}: {
  products: Product[]
  onChange: (next: Product[]) => void
  max?: number
}) {
  function patch(id: string, p: Partial<Product>) {
    onChange(products.map((x) => (x.id === id ? { ...x, ...p } : x)))
  }

  return (
    <div className="flex flex-col gap-2.5">
      {products.map((p, i) => (
        <div key={p.id} className="flex items-start gap-2 rounded-lg border border-border bg-background/60 p-2.5">
          <span className="mt-1.5 flex size-5 shrink-0 items-center justify-center rounded bg-primary/12 font-mono text-[11px] text-primary">
            {i + 1}
          </span>
          <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <input
              value={p.name}
              onChange={(e) => patch(p.id, { name: e.target.value })}
              placeholder="产品 / 服务名称，如：星河 S7 Max"
              aria-label={`产品 ${i + 1} 名称`}
              className={inputClass}
            />
            <input
              value={p.desc}
              onChange={(e) => patch(p.id, { desc: e.target.value })}
              placeholder="一句话说明，如：旗舰纯电轿车，CLTC 续航 620km"
              aria-label={`产品 ${i + 1} 描述`}
              className={inputClass}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange(products.filter((x) => x.id !== p.id))}
            aria-label={`删除产品 ${i + 1}`}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        disabled={products.length >= max}
        onClick={() => onChange([...products, { id: uid('p'), name: '', desc: '' }])}
      >
        <Plus />
        添加产品 / 服务
      </Button>
    </div>
  )
}

export function LineListEditor({
  lines,
  onChange,
  placeholder,
  max = 5,
  addLabel,
}: {
  lines: string[]
  onChange: (next: string[]) => void
  placeholder: string
  max?: number
  addLabel: string
}) {
  return (
    <div className="flex flex-col gap-2">
      {lines.map((l, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="flex size-5 shrink-0 items-center justify-center rounded bg-accent/15 font-mono text-[11px] text-accent">
            {i + 1}
          </span>
          <input
            value={l}
            onChange={(e) => onChange(lines.map((x, j) => (j === i ? e.target.value : x)))}
            placeholder={placeholder}
            aria-label={`${addLabel} ${i + 1}`}
            className={cn(inputClass, 'flex-1')}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange(lines.filter((_, j) => j !== i))}
            aria-label={`删除第 ${i + 1} 条`}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        disabled={lines.length >= max}
        onClick={() => onChange([...lines, ''])}
      >
        <Plus />
        {addLabel}
      </Button>
    </div>
  )
}
