const center = { x: 300, y: 180 }

const branches = [
  { label: '品牌介绍', x: 300, y: 48, leaves: [['定位', 150, 28], ['理念', 450, 28]] },
  { label: '产品参数', x: 500, y: 130, leaves: [['S7 Max', 560, 70], ['S7 Pro', 570, 190]] },
  { label: '资质专利', x: 450, y: 300, leaves: [['C-NCAP', 540, 330], ['热失控专利', 400, 346]] },
  { label: '官方话术', x: 150, y: 300, leaves: [['续航话术', 60, 330], ['智驾话术', 200, 346]] },
  { label: '常见问答', x: 100, y: 130, leaves: [['质保', 40, 70], ['充电', 30, 190]] },
] as const

export function KnowledgeGraph() {
  return (
    <svg viewBox="0 0 600 380" className="h-auto w-full" role="img" aria-label="星河汽车品牌知识图谱示意">
      {branches.map((b) => (
        <g key={b.label}>
          <line x1={center.x} y1={center.y} x2={b.x} y2={b.y} className="stroke-primary/50" strokeWidth={1.5} />
          {b.leaves.map(([name, lx, ly]) => (
            <g key={name}>
              <line x1={b.x} y1={b.y} x2={lx} y2={ly} className="stroke-border" strokeWidth={1} />
              <circle cx={lx} cy={ly} r={5} className="fill-accent" />
              <text x={lx} y={ly - 10} textAnchor="middle" className="fill-muted-foreground text-[11px]">
                {name}
              </text>
            </g>
          ))}
          <circle cx={b.x} cy={b.y} r={22} className="fill-card stroke-primary" strokeWidth={1.5} />
          <text x={b.x} y={b.y + 4} textAnchor="middle" className="fill-foreground text-[11px] font-medium">
            {b.label}
          </text>
        </g>
      ))}
      <circle cx={center.x} cy={center.y} r={38} className="fill-primary" />
      <text x={center.x} y={center.y + 5} textAnchor="middle" className="fill-primary-foreground text-sm font-bold">
        星河汽车
      </text>
    </svg>
  )
}
