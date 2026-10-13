import { Badge } from '@/components/ui/badge'

const probes = [
  { q: '30 万以内的纯电中大型 SUV 有哪些值得推荐？', type: '选型推荐', mention: 74.2, first: 31.0, samples: 6 * 5 * 30 },
  { q: '带孩子出行买什么新能源车比较好？', type: '选型推荐', mention: 52.4, first: 14.6, samples: 6 * 5 * 30 },
  { q: '星河 S7 和极光 A8 怎么选？', type: '对比选型', mention: 96.8, first: 44.1, samples: 6 * 5 * 30 },
  { q: '纯电车冬季续航缩水怎么办？有什么车型表现好？', type: '痛点解决', mention: 33.5, first: 8.2, samples: 6 * 5 * 30 },
  { q: '星河汽车的售后服务怎么样？', type: '品牌评价', mention: 100, first: 88.4, samples: 6 * 5 * 30 },
  { q: '800V 平台的车型有哪些？', type: '品类词', mention: 61.9, first: 22.7, samples: 6 * 5 * 30 },
]

export function ProbeLibrary() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="py-2 pr-3 font-medium">探针问题（口径锁定）</th>
            <th className="px-3 py-2 font-medium">类型</th>
            <th className="px-3 py-2 text-right font-medium">采样量</th>
            <th className="px-3 py-2 text-right font-medium">提及率</th>
            <th className="py-2 pl-3 text-right font-medium">首推率</th>
          </tr>
        </thead>
        <tbody>
          {probes.map((p) => (
            <tr key={p.q} className="border-b border-border/60 last:border-0">
              <td className="py-3 pr-3 font-medium">{p.q}</td>
              <td className="px-3 py-3">
                <Badge variant="muted">{p.type}</Badge>
              </td>
              <td className="px-3 py-3 text-right font-mono text-xs text-muted-foreground">{p.samples}</td>
              <td className="px-3 py-3 text-right font-mono">{p.mention}%</td>
              <td className="py-3 pl-3 text-right font-mono">{p.first}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
