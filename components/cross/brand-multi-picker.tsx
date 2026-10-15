'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Check, Plus, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { completenessOf, type BrandProfile, type BrandStatus } from '@/lib/brand-kb'
import { scoreBrand } from '@/lib/brands'
import { seriesColors } from '@/lib/chart-style'
import { cn } from '@/lib/utils'

const statusVariant: Record<BrandStatus, 'success' | 'warning' | 'muted'> = {
  运营中: 'success',
  筹备中: 'warning',
  已停用: 'muted',
}

export function BrandMultiPicker({
  brands,
  value,
  onChange,
  max,
}: {
  brands: BrandProfile[]
  value: string[]
  onChange: (next: string[]) => void
  max: number
}) {
  const [query, setQuery] = useState('')
  const full = value.length >= max

  const results = useMemo(
    () =>
      brands
        .map((b) => ({
          b,
          score: scoreBrand({ id: b.id, name: b.name, aliases: [b.nameEn, ...b.aliases].filter(Boolean), kind: '自有品牌' }, query),
        }))
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((r) => r.b),
    [brands, query],
  )

  function toggle(id: string) {
    if (value.includes(id)) onChange(value.filter((v) => v !== id))
    else if (!full) onChange([...value, id])
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <label className="relative block w-full sm:w-72">
          <span className="sr-only">搜索品牌</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索品牌名 / 英文名 / 别名"
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
          />
        </label>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground" role="status">
            已选 <span className="font-mono text-foreground">{value.length}</span> / {max} 个品牌
          </span>
          {value.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="rounded-md px-2 py-1 font-medium text-primary hover:bg-primary/10"
            >
              清空
            </button>
          )}
          <Link
            href="/knowledge/new"
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium text-primary hover:bg-primary/10"
          >
            <Plus className="size-3.5" />
            新增品牌
          </Link>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-xs text-muted-foreground">
          品牌知识库中没有匹配“{query}”的品牌，
          <Link href="/knowledge/new" className="font-medium text-primary hover:underline">
            去新增品牌
          </Link>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((b) => {
            const idx = value.indexOf(b.id)
            const on = idx >= 0
            const blocked = !on && full
            return (
              <li key={b.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  disabled={blocked}
                  onClick={() => toggle(b.id)}
                  className={cn(
                    'flex h-full w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-colors',
                    on ? 'border-primary/50 bg-primary/10' : 'border-border bg-background hover:bg-muted/60',
                    blocked && 'cursor-not-allowed opacity-45 hover:bg-background',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border text-primary-foreground',
                      on ? 'border-transparent' : 'border-border',
                    )}
                    style={on ? { background: seriesColors[idx % seriesColors.length] } : undefined}
                  >
                    {on && <Check className="size-3.5" strokeWidth={3} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold">{b.name}</span>
                      <Badge variant={statusVariant[b.status]}>{b.status}</Badge>
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                      {b.nameEn || '未填写英文名'} · {b.type}
                    </span>
                    <span className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                      知识库完整度
                      <span className="font-mono text-foreground">{completenessOf(b)}%</span>
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
