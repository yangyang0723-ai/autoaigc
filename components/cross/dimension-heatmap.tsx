'use client'

import { useState } from 'react'
import { Segmented } from '@/components/geo/segmented'
import type { BrandResult, CrossReport } from '@/lib/cross-eval'
import { cn } from '@/lib/utils'

type Mode = 'dim' | 'keyword'

function cellClass(v: number) {
  if (v < 50) return 'bg-destructive/20 text-destructive'
  if (v < 65) return 'bg-amber-500/15 text-amber-400'
  if (v < 80) return 'bg-primary/15 text-primary'
  return 'bg-primary/30 text-foreground'
}

export function DimensionHeatmap({ report, brand }: { report: CrossReport; brand: BrandResult }) {
  const [mode, setMode] = useState<Mode>('dim')

  const rows =
    mode === 'dim'
      ? brand.heat.map((h) => ({ label: h.dim, scores: report.platforms.map((p) => h.scores[p.id]) }))
      : brand.keywordCells.map((k) => ({ label: k.keyword, scores: report.platforms.map((p) => k.cells[p.id]) }))

  return (
    <div>
      <Segmented
        className="mb-3"
        value={mode}
        onChange={setMode}
        aria-label="矩阵行维度"
        options={[
          { value: 'dim', label: '描述维度 × 平台' },
          { value: 'keyword', label: '关键词 × 平台' },
        ]}
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-1 text-center text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground">
              <th className="px-2 py-1.5 text-left font-medium">{mode === 'dim' ? '描述维度' : '关键词'}</th>
              {report.platforms.map((p) => (
                <th key={p.id} className="px-2 py-1.5 font-medium">
                  {p.name}
                </th>
              ))}
              <th className="px-2 py-1.5 font-medium">极差</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const spread = Math.round(Math.max(...row.scores) - Math.min(...row.scores))
              return (
                <tr key={row.label}>
                  <td className="max-w-48 truncate px-2 py-2 text-left font-medium" title={row.label}>
                    {row.label}
                  </td>
                  {row.scores.map((v, i) => (
                    <td key={i} className={cn('rounded-md py-2 font-mono text-sm', cellClass(v))}>
                      {Math.round(v)}
                    </td>
                  ))}
                  <td className="px-2 py-2 font-mono text-xs text-muted-foreground">
                    <span className={spread >= 35 ? 'font-semibold text-amber-400' : ''}>{spread}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
          <span>{mode === 'dim' ? '描述质量得分' : 'AI 提及率 %'}</span>
          <span className="inline-flex items-center gap-1">
            <i className="size-2.5 rounded bg-destructive/40" /> &lt; 50 薄弱
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="size-2.5 rounded bg-amber-500/40" /> 50–64 待改善
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="size-2.5 rounded bg-primary/40" /> 65–79 良好
          </span>
          <span className="inline-flex items-center gap-1">
            <i className="size-2.5 rounded bg-primary/60" /> ≥ 80 优秀
          </span>
        </div>
      </div>
    </div>
  )
}
