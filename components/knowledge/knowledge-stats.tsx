'use client'

import { useMemo } from 'react'
import { Building2, Database, ShieldCheck, Bug } from 'lucide-react'
import { StatCard } from '@/components/geo/stat-card'
import { deriveKnowledge, useBrands } from '@/lib/brand-kb'

export function KnowledgeStats() {
  const brands = useBrands()
  const { entities, avg } = useMemo(() => {
    const all = brands.map((b) => deriveKnowledge(b))
    return {
      entities: all.reduce((n, d) => n + d.entityCount, 0),
      avg: all.length ? Math.round(all.reduce((n, d) => n + d.completeness, 0) / all.length) : 0,
    }
  }, [brands])

  return (
    <section aria-label="知识库概览" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard icon={Building2} label="已接入品牌" value={String(brands.length)} hint="自有、竞品与多品牌矩阵" />
      <StatCard icon={Database} label="结构化知识条目" value={entities.toLocaleString()} delta="+86" hint="本月新增" />
      <StatCard icon={ShieldCheck} label="平均信息完整度" value={String(avg)} unit="%" delta="+5.1pp" />
      <StatCard icon={Bug} label="内容创作拦截" value="326" delta="+12%" hint="拦截错误参数与禁用话术" />
    </section>
  )
}
