import { platforms as basePlatforms } from '@/lib/geo-data'
import { completenessOf, type BrandProfile, type BrandStatus } from '@/lib/brand-kb'
import { avg, clamp, hash, mulberry32, pad, r1 } from '@/lib/geo-eval'
import { heatDimDefs, platformQuality, xingheDiffs, type DiffDim, type DiffStatus } from '@/lib/cross-data'

export const SAMPLES_PER_PROBE = 5
export const MAX_BRANDS = 4

const OTHER_BASELINE = 130
const statusOffset: Record<BrandStatus, number> = { 运营中: 0, 筹备中: -16, 已停用: -28 }

export type Cell = {
  mention: number
  first: number
  top3: number
  sov: number
  pos: number
  neu: number
  neg: number
  delta: number
}

export type WeakPoint = {
  level: '高' | '中' | '低'
  platform: string
  title: string
  evidence: string
  impact: string
}

export type BrandResult = {
  id: string
  name: string
  status: BrandStatus
  completeness: number
  cells: Record<string, Cell>
  overall: { mention: number; first: number; top3: number; sov: number; pos: number }
  keywordCells: { keyword: string; cells: Record<string, number> }[]
  radar: Record<string, number[]>
  heat: { dim: string; scores: Record<string, number> }[]
  diffs: DiffDim[]
  weakPoints: WeakPoint[]
}

export type CrossInsight = { tone: 'good' | 'warn'; title: string; desc: string }

export type CrossReport = {
  id: string
  name: string
  createdAt: string
  keywords: string[]
  platforms: { id: string; name: string }[]
  brands: BrandResult[]
  insights: CrossInsight[]
  samplesTotal: number
  hallucinations: number
}

export type CrossInput = {
  brands: BrandProfile[]
  keywords: string[]
  platformIds: string[]
  now: Date
}

const levelOrder = { 高: 0, 中: 1, 低: 2 } as const
const firstSentence = (s: string) => (s.split(/[。！？]/)[0] ?? s).trim()

function buildDiffs(
  brand: BrandProfile,
  chosen: { id: string; name: string }[],
  completeness: number,
  rnd: () => number,
): DiffDim[] {
  if (brand.id === 'xinghe') {
    return xingheDiffs.map((d) => ({
      ...d,
      items: chosen.flatMap((p) => d.items.filter((i) => i.platform === p.name)),
    }))
  }

  const dims: { dim: string; official: string; hall: string }[] = []
  if (brand.summary.trim()) {
    dims.push({ dim: '品牌定位', official: firstSentence(brand.summary), hall: '是一家主打高端豪华市场的合资品牌' })
  }
  const prods = brand.products.map((p) => p.name.trim()).filter(Boolean)
  if (prods.length) dims.push({ dim: '核心产品', official: prods.join('、'), hall: '已在售多款官方未发布的车型' })
  const usps = brand.sellingPoints.map((s) => s.trim()).filter(Boolean).slice(0, 2)
  if (usps.length) dims.push({ dim: '独特卖点', official: usps.join('；'), hall: '拥有行业领先的 L4 级自动驾驶与超长续航' })
  if (brand.audiences.length) dims.push({ dim: '目标用户', official: brand.audiences.join('、'), hall: '主要面向高端商务用户' })
  if (!dims.length) {
    dims.push({ dim: '品牌定位', official: `${brand.name}（品牌知识库暂未录入详细信息）`, hall: '是一家主打高端豪华市场的合资品牌' })
  }

  return dims.map((d) => {
    const snippet = d.official.length > 14 ? `${d.official.slice(0, 14)}…` : d.official
    const items = chosen.map((p) => {
      const pAcc = clamp(platformQuality[p.id] / 100 - 0.1 + completeness / 400, 0.3, 0.9)
      const r = rnd()
      const status: DiffStatus =
        r < pAcc ? '一致' : r < pAcc + (1 - pAcc) * 0.45 ? '偏差' : r < pAcc + (1 - pAcc) * 0.75 ? '缺失' : '幻觉'
      const text =
        status === '一致'
          ? `根据公开资料，${brand.name}的${d.dim}为：${d.official}。`
          : status === '偏差'
            ? `大致提到“${snippet}”，但细节与官方表述不完全一致。`
            : status === '缺失'
              ? `未检索到${brand.name}关于“${d.dim}”的明确信息。`
              : `称${brand.name}${d.hall}。`
      return { platform: p.name, text, status }
    })
    return { dim: d.dim, official: d.official, items }
  })
}

function buildWeakPoints(
  name: string,
  diffs: DiffDim[],
  cells: Record<string, Cell>,
  chosen: { id: string; name: string }[],
  keywordCells: BrandResult['keywordCells'],
): WeakPoint[] {
  const list: WeakPoint[] = []

  for (const d of diffs) {
    for (const it of d.items) {
      if (it.status === '幻觉') {
        list.push({
          level: '高',
          platform: it.platform,
          title: `${it.platform} 对“${d.dim}”出现幻觉描述`,
          evidence: `“${it.text}”与官方口径“${d.official}”冲突。`,
          impact: '存在误导与合规风险，建议优先补充权威信源并纠偏。',
        })
      } else if (it.status === '偏差') {
        list.push({
          level: '中',
          platform: it.platform,
          title: `${it.platform} 对“${d.dim}”描述存在偏差`,
          evidence: `“${it.text}”与官方口径“${d.official}”不完全一致。`,
          impact: '影响用户对关键信息的认知，建议在品牌知识库补充精确口径。',
        })
      } else if (it.status === '缺失') {
        list.push({
          level: '低',
          platform: it.platform,
          title: `${it.platform} 缺少“${d.dim}”信息`,
          evidence: `回答中未能提供“${d.dim}”相关内容：“${it.text}”`,
          impact: '说明可被采信的结构化来源不足，建议通过 UGC 信源补强。',
        })
      }
    }
  }

  if (chosen.length > 1) {
    const ranked = chosen.map((p) => ({ p, v: cells[p.id].mention })).sort((a, b) => a.v - b.v)
    const low = ranked[0]
    const top = ranked[ranked.length - 1]
    list.push({
      level: '中',
      platform: low.p.name,
      title: `${low.p.name} 提及率偏低`,
      evidence: `${name} 在该平台提及率仅 ${r1(low.v)}%，较最强平台 ${top.p.name} 低 ${r1(top.v - low.v)}pp。`,
      impact: '该平台是当前最明显的曝光洼地，建议定向补充该平台采信度高的内容。',
    })
  }

  const worstKw = [...keywordCells]
    .map((k) => ({ keyword: k.keyword, v: avg(Object.values(k.cells)) }))
    .sort((a, b) => a.v - b.v)[0]
  if (worstKw) {
    list.push({
      level: '中',
      platform: '全平台',
      title: `“${worstKw.keyword}”存在曝光缺口`,
      evidence: `该关键词在所选平台的平均提及率仅 ${r1(worstKw.v)}%，是当前最需要补位的提问场景。`,
      impact: '建议结合需求洞察拓展相关高潜力词，并生成针对性内容。',
    })
  }

  return list.sort((a, b) => levelOrder[a.level] - levelOrder[b.level]).slice(0, 6)
}

export function generateCrossReport({ brands, keywords, platformIds, now }: CrossInput): CrossReport {
  const chosen = basePlatforms.filter((p) => platformIds.includes(p.id)).map((p) => ({ id: p.id, name: p.name }))
  const sortedIds = [...platformIds].sort().join(',')

  const results: BrandResult[] = brands.map((brand) => {
    const rnd = mulberry32(hash(`${brand.name}|${keywords.join('|')}|${sortedIds}`))
    const completeness = completenessOf(brand)
    const offset = (hash(brand.name) % 17) - 8 + statusOffset[brand.status]

    const mentionBy: Record<string, number[]> = {}
    const firstBy: Record<string, number[]> = {}
    const top3By: Record<string, number[]> = {}
    const keywordCells: BrandResult['keywordCells'] = []

    for (const kw of keywords) {
      const bias = (rnd() - 0.5) * 20
      const cells: Record<string, number> = {}
      for (const p of chosen) {
        const base = basePlatforms.find((x) => x.id === p.id)!
        const m = clamp(base.mention - 6 + offset + bias + (rnd() - 0.5) * 18, 4, 96)
        const f = m * (0.28 + rnd() * 0.18)
        const t = Math.max(f, m * (0.66 + rnd() * 0.2))
        cells[p.id] = r1(m)
        ;(mentionBy[p.id] ??= []).push(m)
        ;(firstBy[p.id] ??= []).push(f)
        ;(top3By[p.id] ??= []).push(t)
      }
      keywordCells.push({ keyword: kw, cells })
    }

    const cells: Record<string, Cell> = {}
    const radar: Record<string, number[]> = {}
    for (const p of chosen) {
      const pos = Math.round(clamp(45 + rnd() * 22 + offset * 0.3, 25, 75))
      const neg = Math.round(3 + rnd() * 8)
      const cell: Cell = {
        mention: r1(avg(mentionBy[p.id])),
        first: r1(avg(firstBy[p.id])),
        top3: r1(avg(top3By[p.id])),
        sov: 0,
        pos,
        neu: 100 - pos - neg,
        neg,
        delta: r1((rnd() - 0.4) * 6),
      }
      cells[p.id] = cell
      const accuracy = clamp(platformQuality[p.id] + (completeness - 60) * 0.25 + (rnd() - 0.5) * 10, 35, 96)
      const full = clamp(platformQuality[p.id] - 4 + (completeness - 60) * 0.3 + (rnd() - 0.5) * 10, 35, 96)
      radar[p.id] = [
        cell.mention,
        Math.min(100, cell.first * 2.6),
        Math.min(100, cell.top3 * 1.4),
        Math.min(100, pos + 14),
        accuracy,
        full,
      ].map((v) => Math.round(v))
    }

    const heat = heatDimDefs.map((def) => {
      const scores: Record<string, number> = {}
      for (const p of chosen) {
        scores[p.id] = Math.round(
          clamp(platformQuality[p.id] + (completeness - 60) * 0.2 + offset * 0.5 - def.hard + (rnd() - 0.5) * 22, 28, 96),
        )
      }
      return { dim: def.dim, scores }
    })

    const diffs = buildDiffs(brand, chosen, completeness, rnd)
    const weakPoints = buildWeakPoints(brand.name, diffs, cells, chosen, keywordCells)

    return {
      id: brand.id,
      name: brand.name,
      status: brand.status,
      completeness,
      cells,
      overall: { mention: 0, first: 0, top3: 0, sov: 0, pos: 0 },
      keywordCells,
      radar,
      heat,
      diffs,
      weakPoints,
    }
  })

  for (const p of chosen) {
    const total = results.reduce((s, b) => s + b.cells[p.id].mention, 0) + OTHER_BASELINE
    for (const b of results) b.cells[p.id].sov = r1((b.cells[p.id].mention / total) * 100)
  }
  for (const b of results) {
    const list = chosen.map((p) => b.cells[p.id])
    b.overall = {
      mention: r1(avg(list.map((c) => c.mention))),
      first: r1(avg(list.map((c) => c.first))),
      top3: r1(avg(list.map((c) => c.top3))),
      sov: r1(avg(list.map((c) => c.sov))),
      pos: Math.round(avg(list.map((c) => c.pos))),
    }
  }

  const hallucinations = results.reduce(
    (n, b) => n + b.diffs.reduce((m, d) => m + d.items.filter((i) => i.status === '幻觉').length, 0),
    0,
  )

  const ranked = [...results].sort((a, b) => b.overall.sov - a.overall.sov)
  const leader = ranked[0]
  const insights: CrossInsight[] = []

  insights.push(
    results.length > 1
      ? {
          tone: 'good',
          title: `${leader.name} 综合表现领先`,
          desc: `SOV ${leader.overall.sov}%、提及率 ${leader.overall.mention}%、首推率 ${leader.overall.first}%，在 ${results.length} 个对比品牌中排名第一，领先第二名 ${r1(leader.overall.sov - ranked[1].overall.sov)}pp。`,
        }
      : {
          tone: 'good',
          title: `${leader.name} 综合提及率 ${leader.overall.mention}%`,
          desc: `首推率 ${leader.overall.first}%、TOP3 ${leader.overall.top3}%、SOV ${leader.overall.sov}%。可增加对比品牌，查看相对竞品的位置。`,
        },
  )

  if (results.length > 1) {
    const gaps = chosen.map((p) => {
      const sorted = [...results].sort((a, b) => b.cells[p.id].mention - a.cells[p.id].mention)
      const hi = sorted[0]
      const lo = sorted[sorted.length - 1]
      return { p, hi, lo, gap: hi.cells[p.id].mention - lo.cells[p.id].mention }
    })
    const g = gaps.sort((a, b) => b.gap - a.gap)[0]
    insights.push({
      tone: 'warn',
      title: `${g.p.name} 上品牌差距最大`,
      desc: `${g.hi.name} 提及率 ${g.hi.cells[g.p.id].mention}%，${g.lo.name} 仅 ${g.lo.cells[g.p.id].mention}%，相差 ${r1(g.gap)}pp。落后品牌应优先在该平台补强内容。`,
    })
  }

  if (chosen.length > 1) {
    const byPlatform = chosen
      .map((p) => ({ p, v: avg(results.map((b) => b.cells[p.id].mention)) }))
      .sort((a, b) => b.v - a.v)
    const hi = byPlatform[0]
    const lo = byPlatform[byPlatform.length - 1]
    insights.push({
      tone: 'warn',
      title: `${lo.p.name} 是整体薄弱平台`,
      desc: `所选品牌在 ${lo.p.name} 的平均提及率为 ${r1(lo.v)}%，较 ${hi.p.name}（${r1(hi.v)}%）低 ${r1(hi.v - lo.v)}pp。`,
    })
  }

  const gapKw = results
    .flatMap((b) =>
      b.keywordCells.map((k) => ({ brand: b.name, keyword: k.keyword, v: avg(Object.values(k.cells)) })),
    )
    .sort((a, b) => a.v - b.v)[0]
  if (gapKw) {
    insights.push({
      tone: 'warn',
      title: `“${gapKw.keyword}”曝光缺口最大`,
      desc: `${gapKw.brand} 在该关键词下平均提及率仅 ${r1(gapKw.v)}%，建议结合需求洞察补充相关内容。`,
    })
  }

  insights.push(
    hallucinations > 0
      ? {
          tone: 'warn',
          title: `发现 ${hallucinations} 处幻觉描述`,
          desc: '部分平台对品牌关键信息的表述与品牌知识库官方口径冲突，建议优先纠偏并补充权威信源。',
        }
      : {
          tone: 'good',
          title: '未发现幻觉描述',
          desc: '各平台对品牌关键信息的描述未与官方口径冲突，可继续通过 UGC 信源巩固优势。',
        },
  )

  const names = results.map((b) => b.name)
  const brandLabel = names.length > 2 ? `${names[0]} 等 ${names.length} 个品牌` : names.join(' vs ')
  const name = `${brandLabel} · ${keywords.length} 词 × ${chosen.length} 平台`
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`

  return {
    id: `CRS-${stamp}-${String(hash(`${name}|${now.getTime()}`) % 1000).padStart(3, '0')}`,
    name,
    createdAt: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
    keywords,
    platforms: chosen,
    brands: results,
    insights,
    samplesTotal: results.length * keywords.length * chosen.length * SAMPLES_PER_PROBE,
    hallucinations,
  }
}

export function brandColorIndex(report: CrossReport, brandId: string) {
  return Math.max(0, report.brands.findIndex((b) => b.id === brandId))
}
