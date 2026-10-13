'use client'

import { useId, useMemo, useRef, useState } from 'react'
import { Check, ChevronsUpDown, Plus, Search, Settings2, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { searchBrands, type Brand } from '@/lib/brands'
import { cn } from '@/lib/utils'

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim().toLowerCase()
  const idx = q ? text.toLowerCase().indexOf(q) : -1
  if (idx < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-primary/25 px-0.5 text-primary">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  )
}

export function BrandCombobox({
  brands,
  value,
  onChange,
  onManage,
}: {
  brands: Brand[]
  value: string | null
  onChange: (id: string | null) => void
  onManage: (prefill?: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()

  const selected = brands.find((b) => b.id === value) ?? null
  const results = useMemo(() => searchBrands(brands, query), [brands, query])
  const trimmed = query.trim()
  const canAddNew = trimmed.length > 0 && !brands.some((b) => b.name === trimmed)

  function pick(b: Brand) {
    onChange(b.id)
    setQuery(b.name)
    setOpen(false)
  }

  function close() {
    setOpen(false)
    setQuery('')
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node | null)) close()
      }}
    >
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && results[active] ? `${listId}-${results[active].id}` : undefined}
          aria-label="目标品牌"
          value={open ? query : (selected?.name ?? '')}
          placeholder="搜索品牌名称、英文名或拼音缩写"
          onFocus={() => {
            setQuery(selected?.name ?? '')
            setActive(0)
            setOpen(true)
            requestAnimationFrame(() => inputRef.current?.select())
          }}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
            setOpen(true)
          }}
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing || e.keyCode === 229) return
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setOpen(true)
              setActive((i) => Math.min(i + 1, Math.max(results.length - 1, 0)))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActive((i) => Math.max(i - 1, 0))
            } else if (e.key === 'Enter') {
              e.preventDefault()
              if (open && results[active]) pick(results[active])
            } else if (e.key === 'Escape') {
              close()
            }
          }}
          className="h-10 w-full rounded-lg border border-border bg-background pr-16 pl-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/40"
        />
        <div className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1">
          {selected && (
            <button
              type="button"
              aria-label="清除已选品牌"
              onClick={() => {
                onChange(null)
                setQuery('')
                inputRef.current?.focus()
              }}
              className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
          <ChevronsUpDown className="size-4 text-muted-foreground" aria-hidden />
        </div>
      </div>

      {open && (
        <div className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-xl shadow-black/40">
          <ul id={listId} role="listbox" aria-label="品牌搜索结果" className="max-h-60 overflow-y-auto p-1.5">
            {results.map((b, i) => (
              <li
                key={b.id}
                id={`${listId}-${b.id}`}
                role="option"
                aria-selected={b.id === value}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(b)}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  'flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm',
                  i === active ? 'bg-muted' : '',
                )}
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/12 text-xs font-bold text-primary">
                  {b.name.slice(0, 1)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">
                    <Highlight text={b.name} query={query} />
                  </span>
                  {b.aliases.length > 0 && (
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {b.aliases.join(' · ')}
                    </span>
                  )}
                </span>
                <Badge variant={b.kind === '自有品牌' ? 'default' : 'muted'}>{b.kind}</Badge>
                {b.id === value && <Check className="size-4 text-primary" />}
              </li>
            ))}
            {results.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground" role="presentation">
                未找到匹配的品牌
              </li>
            )}
          </ul>
          <div className="flex flex-col border-t border-border bg-card/60 p-1.5">
            {canAddNew && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onManage(trimmed)
                  close()
                }}
                className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-primary hover:bg-muted"
              >
                <Plus className="size-4" />
                <span className="truncate">添加“{trimmed}”为新品牌</span>
              </button>
            )}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onManage()
                close()
              }}
              className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <Settings2 className="size-4" />
              管理品牌
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
