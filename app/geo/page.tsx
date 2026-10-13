import { PageHero } from '@/components/geo/page-hero'
import { GeoWorkbench } from '@/components/geo/geo-workbench'
import { Radar, Library, Repeat, BrainCircuit, Archive } from 'lucide-react'

const pipeline = [
  {
    icon: Library,
    title: '标准化探针词库',
    desc: '固定问题口径，保证不同周期、不同品牌的数据具备可比性。',
  },
  {
    icon: Repeat,
    title: '批量模拟 · 多次采样',
    desc: '模拟真实用户身份与上下文，定时轮询主流大模型，同题多次采样抵消随机性误差。',
  },
  {
    icon: BrainCircuit,
    title: 'NLP 语义解析',
    desc: '识别推荐品牌及顺位，区分“主动推荐”与“单纯提及”，按统一口径统计指标。',
  },
  {
    icon: Archive,
    title: '原始快照留存',
    desc: '全量留存 AI 回答原文，支持回溯核验与问题定位。',
  },
]

export default function GeoPage() {
  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      <PageHero
        module="GEO 品牌评估"
        icon={Radar}
        title="输入关键词与目标品牌，一键评估品牌在 AI 搜索中的可见度"
        desc="检测并评判品牌在各 AI 搜索引擎中的提及率、排名与情感倾向，量化推荐优先级，输出 AI 提及率、首推率、TOP3 推荐率与 SOV 声量份额。"
      />

      <GeoWorkbench />

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">评估方法</h3>
          <span className="text-xs text-muted-foreground">四步闭环，保证数据可比、可复现、可追溯</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pipeline.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={s.title} className="relative rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/12 text-primary">
                    <Icon className="size-[18px]" />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                </div>
                <p className="mt-3 text-sm font-semibold">{s.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
