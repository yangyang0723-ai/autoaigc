import type { Derived } from '@/lib/brand-kb'

const cx = 300
const cy = 190
const branchAngles = [-90, -18, 54, 126, 198]

function polar(angleDeg: number, rx: number, ry: number) {
  const a = (angleDeg * Math.PI) / 180
  return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a), cos: Math.cos(a) }
}

function leafOffsets(n: number) {
  if (n === 1) return [0]
  if (n === 2) return [-11, 11]
  return [-18, 0, 18]
}

export function KnowledgeGraph({ graph }: { graph: Derived['graph'] }) {
  return (
    <svg viewBox="0 0 600 380" className="h-auto w-full" role="img" aria-label={`${graph.center} 品牌知识图谱`}>
      {graph.branches.map((b, i) => {
        const angle = branchAngles[i]
        const node = polar(angle, 108, 70)
        const empty = b.leaves.length === 0
        const offsets = leafOffsets(b.leaves.length)
        return (
          <g key={b.label} opacity={empty ? 0.45 : 1}>
            <line x1={cx} y1={cy} x2={node.x} y2={node.y} className="stroke-primary/50" strokeWidth={1.5} strokeDasharray={empty ? '4 4' : undefined} />
            {b.leaves.map((leaf, j) => {
              const p = polar(angle + offsets[j], 192, 146)
              const side = Math.abs(p.cos) < 0.35 ? 'middle' : p.cos > 0 ? 'start' : 'end'
              const dx = side === 'middle' ? 0 : p.cos > 0 ? 10 : -10
              const dy = side === 'middle' ? (p.y < cy ? -11 : 20) : 5
              return (
                <g key={`${leaf}-${j}`}>
                  <line x1={node.x} y1={node.y} x2={p.x} y2={p.y} className="stroke-border" strokeWidth={1} />
                  <circle cx={p.x} cy={p.y} r={5} className="fill-accent" />
                  <text x={p.x + dx} y={p.y + dy} textAnchor={side} className="fill-muted-foreground text-[13px]">
                    {leaf}
                  </text>
                </g>
              )
            })}
            <circle cx={node.x} cy={node.y} r={28} className="fill-card stroke-primary" strokeWidth={1.5} />
            <text x={node.x} y={node.y + 4} textAnchor="middle" className="fill-foreground text-[12px] font-medium">
              {b.label}
            </text>
          </g>
        )
      })}
      <circle cx={cx} cy={cy} r={42} className="fill-primary" />
      <text x={cx} y={cy + 5} textAnchor="middle" className="fill-primary-foreground text-[15px] font-bold">
        {graph.center.length > 6 ? `${graph.center.slice(0, 6)}…` : graph.center}
      </text>
    </svg>
  )
}
