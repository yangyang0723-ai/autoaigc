import { platforms as basePlatforms, type Platform } from '@/lib/geo-data'
import type { Brand } from '@/lib/brands'

export const SAMPLES_PER_PROBE = 5

export type Seg = { t: string; hl?: 'brand' | 'comp' }
export type Kind = '主动推荐' | '单纯提及' | '未提及'
export type Tone = '正面' | '中性' | '负面'

export type EvalSnapshot = {
  id: string
  platform: string
  question: string
  time: string
  hits: number
  kind: Kind
  tone: Tone
  rank: string[]
  body: Seg[]
}

export type EvalInput = {
  brand: Brand
  competitors: string[]
  keywords: string[]
  platformIds: string[]
  now: Date
}

export type PlatformRow = Pick<Platform, 'id' | 'name' | 'mention' | 'first' | 'top3' | 'sov' | 'pos' | 'neu' | 'neg' | 'delta'> & {
  samples: number
}

export type KeywordRow = {
  keyword: string
  mention: number
  first: number
  top3: number
  cells: Record<string, number>
}

export type Insight = {
  tone: 'good' | 'warn'
  title: string
  desc: string
  action: { label: string; href: string }
}

export type Overall = {
  mention: number
  first: number
  top3: number
  sov: number
  pos: number
  neu: number
  neg: number
}

export type EvalReport = {
  id: string
  brandName: string
  createdAt: string
  keywords: string[]
  platforms: PlatformRow[]
  keywordRows: KeywordRow[]
  overall: Overall
  deltas: Record<'mention' | 'first' | 'top3' | 'sov', number>
  sovShares: { name: string; value: number }[]
  snapshots: EvalSnapshot[]
  insights: Insight[]
  samplesTotal: number
  grade: { label: string; variant: 'success' | 'warning' | 'danger' }
}

function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const r1 = (v: number) => Math.round(v * 10) / 10
const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)
const pad = (n: number) => String(n).padStart(2, '0')

function buildSnapshot(
  kw: string,
  platformName: string,
  value: number,
  brandName: string,
  comps: string[],
  now: Date,
  rnd: () => number,
  seq: number,
): EvalSnapshot {
  const kind: Kind = value >= 60 ? '主动推荐' : value >= 35 ? '单纯提及' : '未提及'
  const [c1, c2] = [comps[0] ?? '其他品牌', comps[1] ?? comps[0] ?? '其他品牌']
  const hits = kind === '未提及' ? 0 : kind === '单纯提及' ? 1 + Math.floor(rnd() * 2) : 3 + Math.floor(rnd() * 3)

  const body: Seg[] =
    kind === '主动推荐'
      ? [
          { t: `针对“${kw}”，综合产品力、口碑与服务表现，首选推荐` },
          { t: brandName, hl: 'brand' },
          { t: '，在同级中智能化与补能体验处于第一梯队。其次可考虑' },
          { t: c1, hl: 'comp' },
          { t: '，预算有限也可关注' },
          { t: c2, hl: 'comp' },
          { t: '。' },
        ]
      : kind === '单纯提及'
        ? [
            { t: `关于“${kw}”，市面上口碑较好的有` },
            { t: c1, hl: 'comp' },
            { t: ' 与 ' },
            { t: c2, hl: 'comp' },
            { t: '；另外还有 ' },
            { t: brandName, hl: 'brand' },
            { t: ' 等品牌，可根据预算自行对比。' },
          ]
        : [
            { t: `关于“${kw}”，建议优先关注` },
            { t: c1, hl: 'comp' },
            { t: ' 与 ' },
            { t: c2, hl: 'comp' },
            { t: '，两者在该场景下的用户评价和实测表现更稳定。' },
          ]

  const rank = kind === '主动推荐' ? [brandName, c1, c2] : kind === '单纯提及' ? [c1, c2, brandName] : [c1, c2]
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`

  return {
    id: `SNP-${stamp}-${String(1000 + seq * 37 + Math.floor(rnd() * 30)).slice(-4)}`,
    platform: platformName,
    question: `关于“${kw}”，有哪些值得推荐的品牌和车型？`,
    time: `${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
    hits,
    kind,
    tone: kind === '主动推荐' ? '正面' : '中性',
    rank,
    body,
  }
}

export function generateReport({ brand, competitors, keywords, platformIds, now }: EvalInput): EvalReport {
  const rnd = mulberry32(hash(`${brand.name}|${keywords.join('|')}|${[...platformIds].sort().join(',')}`))
  const comps = competitors.length ? competitors.slice(0, 4) : ['其他品牌']
  const chosen = basePlatforms.filter((p) => platformIds.includes(p.id))
  const brandOffset = (hash(brand.name) % 17) - 8

  const keywordRows: KeywordRow[] = []
  const firstMatrix: Record<string, number[]> = {}
  const top3Matrix: Record<string, number[]> = {}
  const mentionMatrix: Record<string, number[]> = {}

  for (const kw of keywords) {
    const bias = (rnd() - 0.5) * 20
    const cells: Record<string, number> = {}
    const firsts: number[] = []
    const top3s: number[] = []
    for (const p of chosen) {
      const m = clamp(p.mention - 6 + brandOffset + bias + (rnd() - 0.5) * 18, 6, 96)
      const f = m * (0.28 + rnd() * 0.18)
      const t = Math.max(f, m * (0.66 + rnd() * 0.2))
      cells[p.id] = r1(m)
      firsts.push(f)
      top3s.push(t)
      ;(mentionMatrix[p.id] ??= []).push(m)
      ;(firstMatrix[p.id] ??= []).push(f)
      ;(top3Matrix[p.id] ??= []).push(t)
    }
    keywordRows.push({
      keyword: kw,
      mention: r1(avg(Object.values(cells))),
      first: r1(avg(firsts)),
      top3: r1(avg(top3s)),
      cells,
    })
  }

  const brandShares: number[] = []
  const compShares: number[][] = comps.map(() => [])

  const platformRows: PlatformRow[] = chosen.map((p) => {
    const mention = avg(mentionMatrix[p.id])
    const compScores = comps.map(() => 30 + rnd() * 45)
    const total = mention + compScores.reduce((a, b) => a + b, 0)
    const share = (mention / total) * 100
    brandShares.push(share)
    compScores.forEach((s, i) => compShares[i].push((s / total) * 100))

    const pos = Math.round(45 + rnd() * 22)
    const neg = Math.round(3 + rnd() * 8)
    return {
      id: p.id,
      name: p.name,
      mention: r1(mention),
      first: r1(avg(firstMatrix[p.id])),
      top3: r1(avg(top3Matrix[p.id])),
      sov: r1(share),
      pos,
      neu: 100 - pos - neg,
      neg,
      samples: keywords.length * SAMPLES_PER_PROBE,
      delta: r1((rnd() - 0.4) * 6),
    }
  })

  const sovShares = [
    { name: brand.name, value: r1(avg(brandShares)) },
    ...comps.map((name, i) => ({ name, value: r1(avg(compShares[i])) })),
  ]

  const overall: Overall = {
    mention: r1(avg(platformRows.map((p) => p.mention))),
    first: r1(avg(platformRows.map((p) => p.first))),
    top3: r1(avg(platformRows.map((p) => p.top3))),
    sov: sovShares[0].value,
    pos: Math.round(avg(platformRows.map((p) => p.pos))),
    neu: Math.round(avg(platformRows.map((p) => p.neu))),
    neg: Math.round(avg(platformRows.map((p) => p.neg))),
  }

  const deltas = {
    mention: r1((rnd() - 0.35) * 8),
    first: r1((rnd() - 0.35) * 5),
    top3: r1((rnd() - 0.35) * 7),
    sov: r1((rnd() - 0.45) * 4),
  }

  const byMention = [...platformRows].sort((a, b) => b.mention - a.mention)
  const bestP = byMention[0]
  const worstP = byMention[byMention.length - 1]
  const worstK = [...keywordRows].sort((a, b) => a.mention - b.mention)[0]
  const mostNeg = [...platformRows].sort((a, b) => b.neg - a.neg)[0]

  const insights: Insight[] = [
    {
      tone: 'good',
      title: `${bestP.name} 是当前最强阵地`,
      desc: `提及率 ${bestP.mention}%、首推率 ${bestP.first}%。建议复用该平台采信度高的内容结构，批量生产同类内容。`,
      action: { label: '去创作内容', href: '/content' },
    },
    platformRows.length > 1
      ? {
          tone: 'warn',
          title: `${worstP.name} 存在明显薄弱点`,
          desc: `提及率仅 ${worstP.mention}%，较最强平台低 ${r1(bestP.mention - worstP.mention)}pp。建议对比各平台的品牌描述差异后定向补强。`,
          action: { label: '查看交叉报告', href: '/cross-report' },
        }
      : {
          tone: 'warn',
          title: '仅评估了单个平台',
          desc: '单平台结论受模型偏好影响较大，建议增加检测平台，进行横向对比后再制定优化动作。',
          action: { label: '查看交叉报告', href: '/cross-report' },
        },
    {
      tone: 'warn',
      title: `“${worstK.keyword}”存在曝光缺口`,
      desc: `该关键词综合提及率仅 ${worstK.mention}%，是当前最需要补位的提问场景，可结合需求洞察拓展相关高潜力词。`,
      action: { label: '查看需求洞察', href: '/insights' },
    },
    mostNeg.neg >= 8
      ? {
          tone: 'warn',
          title: `${mostNeg.name} 负面倾向偏高`,
          desc: `负面占比 ${mostNeg.neg}%。建议核对品牌知识库中的官方口径，减少 AI 幻觉与过时信息。`,
          action: { label: '完善品牌知识库', href: '/knowledge' },
        }
      : {
          tone: 'good',
          title: '用 UGC 信源继续放大优势',
          desc: '整体情感倾向健康。建议通过多平台 UGC 信源矩阵，为大模型持续提供可采信的第三方口碑素材。',
          action: { label: '去分发信源', href: '/ugc' },
        },
  ]

  const combos = keywordRows.flatMap((row) =>
    chosen.map((p) => ({ kw: row.keyword, platform: p.name, v: row.cells[p.id] })),
  )
  combos.sort((a, b) => b.v - a.v)
  const picks = Array.from(
    new Set([0, Math.floor(combos.length / 3), Math.floor((combos.length * 2) / 3), combos.length - 1]),
  )
  const snapshots = picks.map((idx, i) =>
    buildSnapshot(combos[idx].kw, combos[idx].platform, combos[idx].v, brand.name, comps, now, rnd, i),
  )

  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
  const grade: EvalReport['grade'] =
    overall.mention >= 65
      ? { label: 'AI 可见度良好', variant: 'success' }
      : overall.mention >= 45
        ? { label: 'AI 可见度中等', variant: 'warning' }
        : { label: 'AI 可见度偏低', variant: 'danger' }

  return {
    id: `GEO-${stamp}-${String(hash(brand.name + keywords.join('')) % 1000).padStart(3, '0')}`,
    brandName: brand.name,
    createdAt: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
    keywords,
    platforms: platformRows,
    keywordRows,
    overall,
    deltas,
    sovShares,
    snapshots,
    insights,
    samplesTotal: keywords.length * chosen.length * SAMPLES_PER_PROBE,
    grade,
  }
}
