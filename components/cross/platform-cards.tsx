import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { BrandResult, CrossReport } from '@/lib/cross-eval'

const cols = [
  { key: 'mention', label: '提及率' },
  { key: 'first', label: '首推率' },
  { key: 'top3', label: 'TOP3' },
  { key: 'sov', label: 'SOV' },
] as const

export function PlatformCards({ report, brand }: { report: CrossReport; brand: BrandResult }) {
  const values = (key: (typeof cols)[number]['key']) => report.platforms.map((p) => brand.cells[p.id][key])
  const multi = report.platforms.length > 1

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {report.platforms.map((p) => {
        const cell = brand.cells[p.id]
        return (
          <Card key={p.id}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{p.name}</p>
                <Badge variant="muted">
                  {(report.keywords.length * 5).toLocaleString()} 次采样
                </Badge>
              </div>
              <dl className="mt-4 grid grid-cols-4 gap-2">
                {cols.map((c) => {
                  const v = cell[c.key]
                  const isBest = multi && v === Math.max(...values(c.key))
                  const isWorst = multi && v === Math.min(...values(c.key))
                  return (
                    <div key={c.key}>
                      <dt className="text-[11px] text-muted-foreground">{c.label}</dt>
                      <dd
                        className={`mt-1 font-mono text-base font-bold ${
                          isBest ? 'text-emerald-400' : isWorst ? 'text-destructive' : ''
                        }`}
                      >
                        {v}
                        <span className="text-[10px] font-medium text-muted-foreground">%</span>
                      </dd>
                    </div>
                  )
                })}
              </dl>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
