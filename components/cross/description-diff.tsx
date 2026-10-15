'use client'

import { useState } from 'react'
import { BadgeCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Segmented } from '@/components/geo/segmented'
import type { DiffStatus } from '@/lib/cross-data'
import type { BrandResult } from '@/lib/cross-eval'

const statusVariant: Record<DiffStatus, 'success' | 'warning' | 'danger' | 'muted'> = {
  一致: 'success',
  偏差: 'warning',
  幻觉: 'danger',
  缺失: 'muted',
}

export function DescriptionDiff({ brand }: { brand: BrandResult }) {
  const [dim, setDim] = useState(brand.diffs[0].dim)
  const active = brand.diffs.find((d) => d.dim === dim) ?? brand.diffs[0]

  return (
    <div className="flex flex-col gap-4">
      <Segmented
        value={active.dim}
        onChange={setDim}
        aria-label="描述维度"
        options={brand.diffs.map((d) => ({ value: d.dim, label: d.dim }))}
      />
      <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/10 p-3">
        <BadgeCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
            品牌知识库 · {brand.name} 官方口径
          </p>
          <p className="mt-0.5 text-sm font-medium">{active.official}</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {active.items.map((it) => (
          <div key={it.platform} className="flex flex-col gap-2 rounded-lg border border-border bg-background p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">{it.platform}</span>
              <Badge variant={statusVariant[it.status]}>{it.status}</Badge>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{it.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
