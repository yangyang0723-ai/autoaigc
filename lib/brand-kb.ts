import { useSyncExternalStore } from 'react'

export const brandTypes = ['整车厂商', '经销商集团', '4S 店', '零部件供应商', '其他'] as const
export type BrandType = (typeof brandTypes)[number]

export const brandStatuses = ['运营中', '筹备中', '已停用'] as const
export type BrandStatus = (typeof brandStatuses)[number]

export const linkKinds = ['官网', '线上文章', '百科 / 资讯', '其他'] as const
export type LinkKind = (typeof linkKinds)[number]

export type Product = { id: string; name: string; desc: string }
export type SourceFile = { id: string; name: string; size: number; status: '解析中' | '已解析' }
export type SourceLink = { id: string; url: string; kind: LinkKind; status: '抓取中' | '已抓取' }
export type GuardRule = {
  claim: string
  field: string
  official: string
  fix: string
  kind: '参数冲突' | '禁用话术'
}

export type BrandDraft = {
  name: string
  nameEn: string
  aliases: string[]
  type: BrandType
  status: BrandStatus
  company: string
  founded: string
  hq: string
  slogan: string
  summary: string
  products: Product[]
  audiences: string[]
  sellingPoints: string[]
  competitors: string[]
  files: SourceFile[]
  links: SourceLink[]
}

export type BrandProfile = BrandDraft & {
  id: string
  createdAt: string
  customRules?: GuardRule[]
  verifySample?: string
  hasLibrary?: boolean
}

export function createEmptyDraft(): BrandDraft {
  return {
    name: '',
    nameEn: '',
    aliases: [],
    type: '整车厂商',
    status: '运营中',
    company: '',
    founded: '',
    hq: '',
    slogan: '',
    summary: '',
    products: [],
    audiences: [],
    sellingPoints: [],
    competitors: [],
    files: [],
    links: [],
  }
}

export function uid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function hash(s: string) {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}

export type FactSource = '手动录入' | '文档解析' | '链接抓取'
export type FactGroupKey = 'brand' | 'product' | 'user' | 'usp' | 'rival' | 'source'
export type FactGroup = {
  key: FactGroupKey
  label: string
  facts: { label: string; value: string; source: FactSource }[]
}

export type ChecklistItem = { label: string; done: boolean; weight: number; hint: string }

export type Derived = {
  completeness: number
  checklist: ChecklistItem[]
  groups: FactGroup[]
  entityCount: number
  extractedCount: number
  schema: string
  contextBlock: string
  probes: { type: string; query: string }[]
  guardrails: GuardRule[]
  verifySample: string
  graph: { center: string; branches: { label: string; leaves: string[] }[] }
}

export function computeChecklist(b: BrandDraft): ChecklistItem[] {
  return [
    { label: '品牌名称', done: !!b.name.trim(), weight: 10, hint: '填写品牌中文名称' },
    { label: '英文名称', done: !!b.nameEn.trim(), weight: 5, hint: '补充英文名，便于 AI 识别跨语言提及' },
    { label: '企业与总部信息', done: !!b.company.trim() && !!b.hq.trim(), weight: 5, hint: '补充所属企业与总部所在地' },
    { label: '品牌总述（≥ 30 字）', done: b.summary.trim().length >= 30, weight: 15, hint: '用 2–3 句话讲清定位、背景与主打方向' },
    { label: '核心产品 / 服务', done: b.products.some((p) => p.name.trim()), weight: 15, hint: '至少录入 1 个核心产品或服务' },
    { label: '目标用户群体', done: b.audiences.length > 0, weight: 10, hint: '至少添加 1 类目标用户' },
    { label: '独特卖点（≥ 3 条）', done: b.sellingPoints.filter((s) => s.trim()).length >= 3, weight: 15, hint: '建议提炼 3–5 条可核验的卖点' },
    { label: '竞品品牌', done: b.competitors.length > 0, weight: 10, hint: '添加竞品，用于对比选型类探针与 SOV 计算' },
    { label: '资料来源（文档 / 链接）', done: b.files.length + b.links.length > 0, weight: 15, hint: '上传文档或填写官网、线上文章链接' },
  ]
}

export function completenessOf(b: BrandDraft) {
  return computeChecklist(b).reduce((sum, c) => sum + (c.done ? c.weight : 0), 0)
}

export function deriveKnowledge(b: BrandDraft & { customRules?: GuardRule[]; verifySample?: string }): Derived {
  const checklist = computeChecklist(b)
  const completeness = completenessOf(b)

  const products = b.products.filter((p) => p.name.trim())
  const usps = b.sellingPoints.map((s) => s.trim()).filter(Boolean)
  const official = b.links.find((l) => l.kind === '官网')

  const groups: FactGroup[] = []

  const brandFacts: FactGroup['facts'] = [
    { label: '品牌名称', value: b.name || '—', source: '手动录入' as FactSource },
    b.nameEn && { label: '英文名称', value: b.nameEn, source: '手动录入' as FactSource },
    b.aliases.length > 0 && { label: '品牌别名', value: b.aliases.join('、'), source: '手动录入' as FactSource },
    { label: '品牌类型', value: b.type, source: '手动录入' as FactSource },
    { label: '品牌状态', value: b.status, source: '手动录入' as FactSource },
    b.company && { label: '所属企业', value: b.company, source: '手动录入' as FactSource },
    b.founded && { label: '成立时间', value: `${b.founded} 年`, source: '手动录入' as FactSource },
    b.hq && { label: '总部所在地', value: b.hq, source: '手动录入' as FactSource },
    b.slogan && { label: '品牌口号', value: b.slogan, source: '手动录入' as FactSource },
    b.summary.trim() && { label: '品牌总述', value: b.summary.trim(), source: '手动录入' as FactSource },
  ].filter(Boolean) as FactGroup['facts']
  groups.push({ key: 'brand', label: '品牌实体', facts: brandFacts })

  if (products.length)
    groups.push({
      key: 'product',
      label: '核心产品 / 服务',
      facts: products.map((p) => ({ label: p.name, value: p.desc.trim() || '待补充产品描述', source: '手动录入' })),
    })
  if (b.audiences.length)
    groups.push({
      key: 'user',
      label: '目标用户群体',
      facts: b.audiences.map((a, i) => ({ label: `人群 ${i + 1}`, value: a, source: '手动录入' })),
    })
  if (usps.length)
    groups.push({
      key: 'usp',
      label: '独特卖点',
      facts: usps.map((u, i) => ({ label: `卖点 ${i + 1}`, value: u, source: '手动录入' })),
    })
  if (b.competitors.length)
    groups.push({
      key: 'rival',
      label: '竞品关系',
      facts: b.competitors.map((c) => ({ label: c, value: '对比选型 / SOV 对照品牌', source: '手动录入' })),
    })

  const sourceFacts: FactGroup['facts'] = [
    ...b.files.map((f) => ({
      label: f.name,
      value: `抽取 ${3 + (hash(f.name) % 9)} 条候选事实，待审核`,
      source: '文档解析' as FactSource,
    })),
    ...b.links.map((l) => ({
      label: hostOf(l.url),
      value: `${l.kind} · 抓取 ${2 + (hash(l.url) % 7)} 条候选事实，待审核`,
      source: '链接抓取' as FactSource,
    })),
  ]
  if (sourceFacts.length) groups.push({ key: 'source', label: '资料来源抽取', facts: sourceFacts })

  const manualCount = groups.filter((g) => g.key !== 'source').reduce((n, g) => n + g.facts.length, 0)
  const extractedCount =
    b.files.reduce((n, f) => n + 3 + (hash(f.name) % 9), 0) + b.links.reduce((n, l) => n + 2 + (hash(l.url) % 7), 0)

  const schemaObj: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: b.company.trim() || b.name,
    brand: {
      '@type': 'Brand',
      name: b.name,
      ...(b.nameEn || b.aliases.length ? { alternateName: [b.nameEn, ...b.aliases].filter(Boolean) } : {}),
      ...(b.slogan ? { slogan: b.slogan } : {}),
    },
    ...(b.summary.trim() ? { description: b.summary.trim() } : {}),
    ...(b.founded ? { foundingDate: b.founded } : {}),
    ...(b.hq ? { address: { '@type': 'PostalAddress', addressLocality: b.hq } } : {}),
    ...(official ? { url: official.url } : {}),
    ...(b.links.filter((l) => l !== official).length ? { sameAs: b.links.filter((l) => l !== official).map((l) => l.url) } : {}),
    ...(products.length
      ? {
          makesOffer: products.map((p) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Product', name: p.name, ...(p.desc.trim() ? { description: p.desc.trim() } : {}) },
          })),
        }
      : {}),
    ...(b.audiences.length ? { audience: b.audiences.map((a) => ({ '@type': 'Audience', audienceType: a })) } : {}),
    ...(usps.length ? { knowsAbout: usps } : {}),
  }

  const first = b.competitors.slice(0, 2)
  const guardrails: GuardRule[] = [
    ...(b.customRules ?? []),
    { claim: '销量第一', field: '广告用语', official: '禁用绝对化用语', fix: '广受好评', kind: '禁用话术' },
    { claim: '行业领先', field: '广告用语', official: '禁用绝对化用语', fix: '表现出色', kind: '禁用话术' },
    ...first.map<GuardRule>((c) => ({
      claim: `碾压${c}`,
      field: '竞品对比',
      official: '禁止贬低竞品，仅作客观对比',
      fix: `与${c}各有特点`,
      kind: '禁用话术',
    })),
  ]

  const subject = b.name || '该品牌'
  const category = products[0]?.name
  const probes: { type: string; query: string }[] = [
    { type: '品牌词', query: `${subject}怎么样` },
    { type: '品牌词', query: `${subject}口碑如何` },
    category ? { type: '品类词', query: `${category}值得买吗` } : { type: '品类词', query: `${b.type === '整车厂商' ? '汽车' : '汽车服务'}品牌推荐` },
    ...(b.competitors[0] ? [{ type: '对比选型词', query: `${subject}和${b.competitors[0]}哪个好` }] : []),
    ...(b.competitors[1] ? [{ type: '对比选型词', query: `${subject} vs ${b.competitors[1]} 怎么选` }] : []),
    { type: '场景痛点词', query: b.audiences[0] ? `${b.audiences[0]}买车选什么品牌` : `预算内选哪个品牌更靠谱` },
  ]

  const contextBlock = [
    `【品牌口径 · ${subject}】`,
    `${subject}${b.nameEn ? `（${b.nameEn}）` : ''}｜${b.type}｜${b.status}`,
    b.summary.trim(),
    products.length ? `\n【核心产品 / 服务】\n${products.map((p) => `- ${p.name}${p.desc.trim() ? `：${p.desc.trim()}` : ''}`).join('\n')}` : '',
    b.audiences.length ? `\n【目标用户】${b.audiences.join('、')}` : '',
    usps.length ? `\n【必须体现的卖点】\n${usps.map((u, i) => `${i + 1}. ${u}`).join('\n')}` : '',
    b.competitors.length ? `\n【竞品关系】仅作客观对比，不得贬低：${b.competitors.join('、')}` : '',
    `\n【禁用表述】${guardrails.map((g) => g.claim).join('、')}`,
  ]
    .filter(Boolean)
    .join('\n')

  const verifySample =
    b.verifySample ??
    `${subject}${products[0] ? ` ${products[0].name}` : ''} 是同级销量第一的车型，行业领先${first[0] ? `，碾压${first[0]}` : ''}。`

  const trim = (s: string) => (s.length > 6 ? `${s.slice(0, 6)}…` : s)
  const graph = {
    center: subject,
    branches: [
      { label: '产品服务', leaves: products.slice(0, 3).map((p) => trim(p.name)) },
      { label: '目标用户', leaves: b.audiences.slice(0, 3).map(trim) },
      { label: '核心卖点', leaves: usps.slice(0, 3).map(trim) },
      { label: '竞品品牌', leaves: b.competitors.slice(0, 3).map(trim) },
      {
        label: '资料来源',
        leaves: [...b.files.map((f) => f.name), ...b.links.map((l) => hostOf(l.url))].slice(0, 3).map(trim),
      },
    ],
  }

  return {
    completeness,
    checklist,
    groups,
    entityCount: manualCount + extractedCount,
    extractedCount,
    schema: JSON.stringify(schemaObj, null, 2),
    contextBlock,
    probes,
    guardrails,
    verifySample,
    graph,
  }
}

export const seedBrands: BrandProfile[] = [
  {
    id: 'xinghe',
    name: '星河汽车',
    nameEn: 'Xinghe Auto',
    aliases: ['Xinghe', 'xhqc'],
    type: '整车厂商',
    status: '运营中',
    company: '星河智能汽车科技有限公司',
    founded: '2018',
    hq: '上海 · 临港',
    slogan: '让智能出行更安心',
    summary:
      '星河汽车成立于 2018 年，专注高端智能纯电车型，主要面向家庭用户，主打 800V 高压平台、旗舰智能座舱与全方位安全防护。',
    products: [
      { id: 'p1', name: '星河 S7 Max', desc: '旗舰纯电轿车，CLTC 续航 620km，百公里加速 3.9s' },
      { id: 'p2', name: '星河 S7 Pro', desc: '主销纯电轿车，CLTC 续航 520km，82kWh 电池' },
      { id: 'p3', name: '星河超充服务', desc: '800V 超充网络，10%–80% 约 15 分钟' },
    ],
    audiences: ['家庭用户', '科技爱好者', '25–40 岁城市新中产'],
    sellingPoints: [
      '800V 高压平台，10%–80% 快充约 15 分钟',
      '电池安全五重防护，通过 C-NCAP 五星安全认证',
      '旗舰智能座舱，搭载车规级 AI 芯片',
      '首任车主电池终身质保',
    ],
    competitors: ['极光汽车', '远山汽车', '澜海汽车'],
    files: [
      { id: 'f1', name: '星河品牌手册 2025.pdf', size: 4_404_019, status: '已解析' },
      { id: 'f2', name: '星河 S7 参数表.xlsx', size: 286_720, status: '已解析' },
    ],
    links: [
      { id: 'l1', url: 'https://www.xinghe-auto.example', kind: '官网', status: '已抓取' },
      { id: 'l2', url: 'https://baike.example.com/xinghe-auto', kind: '百科 / 资讯', status: '已抓取' },
    ],
    createdAt: '2026-03-12',
    hasLibrary: true,
    customRules: [
      { claim: '续航高达 800km', field: 'CLTC 续航', official: '620 km', fix: 'CLTC 工况续航 620km', kind: '参数冲突' },
      { claim: '3.5 秒', field: '百公里加速', official: '3.9 s', fix: '3.9 秒', kind: '参数冲突' },
      { claim: 'L4 级自动驾驶', field: '智驾等级', official: '组合辅助驾驶（L2）', fix: 'L2 级组合辅助驾驶', kind: '禁用话术' },
    ],
    verifySample:
      '星河 S7 续航高达 800km，百公里加速 3.5 秒，拥有 L4 级自动驾驶，是同级销量第一的豪华 SUV。',
  },
  {
    id: 'chenxi',
    name: '晨曦新能源',
    nameEn: 'Chenxi NEV',
    aliases: ['Chenxi'],
    type: '整车厂商',
    status: '筹备中',
    company: '',
    founded: '2024',
    hq: '',
    slogan: '',
    summary: '晨曦新能源是面向年轻用户的新能源品牌，计划于明年推出首款紧凑型纯电 SUV。',
    products: [{ id: 'p1', name: '晨曦 C1', desc: '紧凑型纯电 SUV（规划中）' }],
    audiences: ['年轻首购用户'],
    sellingPoints: ['高性价比纯电出行'],
    competitors: ['星河汽车'],
    files: [],
    links: [],
    createdAt: '2026-05-08',
  },
]

let brands: BrandProfile[] = seedBrands
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function addBrand(draft: BrandDraft): string {
  const id = `brand-${Date.now().toString(36)}`
  const profile: BrandProfile = {
    ...draft,
    id,
    createdAt: new Date().toISOString().slice(0, 10),
  }
  brands = [profile, ...brands]
  emit()
  return id
}

export function removeBrand(id: string) {
  brands = brands.filter((b) => b.id !== id)
  emit()
}

export function useBrands() {
  return useSyncExternalStore(
    subscribe,
    () => brands,
    () => seedBrands,
  )
}
