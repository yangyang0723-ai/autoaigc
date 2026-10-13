import { heatDims, radarScores } from '@/lib/cross-data'
import { cn } from '@/lib/utils'

const names = Object.keys(radarScores)

function cellClass(v: number) {
  if (v < 50) return 'bg-destructive/20 text-destructive'
  if (v < 65) return 'bg-amber-500/15 text-amber-400'
  if (v < 80) return 'bg-primary/15 text-primary'
  return 'bg-primary/30 text-foreground'
}

export function DimensionHeatmap() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-separate border-spacing-1 text-center text-sm">
        <thead>
          <tr className="text-xs text-muted-foreground">
            <th className="px-2 py-1.5 text-left font-medium">描述维度</th>
            {names.map((n) => (
              <th key={n} className="px-2 py-1.5 font-medium">
                {n}
              </th>
            ))}
            <th className="px-2 py-1.5 font-medium">极差</th>
          </tr>
        </thead>
        <tbody>
          {heatDims.map((row) => {
            const spread = Math.max(...row.scores) - Math.min(...row.scores)
            return (
              <tr key={row.dim}>
                <td className="px-2 py-2 text-left font-medium">{row.dim}</td>
                {row.scores.map((v, i) => (
                  <td key={i} className={cn('rounded-md py-2 font-mono text-sm', cellClass(v))}>
                    {v}
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
        <span>描述质量得分</span>
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
  )
}
