export const matrixPlatforms = [
  { name: '小红书', mark: '红' },
  { name: '知乎', mark: '知' },
  { name: '抖音', mark: '抖' },
  { name: '公众号', mark: '公' },
  { name: '什么值得买', mark: '值' },
  { name: '百度贴吧', mark: '贴' },
] as const

export type PlatformName = (typeof matrixPlatforms)[number]['name']

export const personaOptions = ['官方号', '车主号', '测评号', '种草号', '问答号'] as const

export type AccountStatus = '正常' | '限流' | '待授权' | '已冻结'
export type Severity = '轻' | '中' | '重'
export type PoolLevel = '管理' | '运营' | '只读'
export type MemberRole = '管理员' | '运营主管' | '内容运营' | '外部协作'

export type Violation = {
  id: string
  date: string
  type: string
  severity: Severity
  note: string
}

export type MatrixAccount = {
  id: string
  platform: string
  name: string
  persona: string
  lines: string[]
  groupId: string
  fans: number
  status: AccountStatus
  weight: number
  indexRate: number | null
  violations: Violation[]
  poolId: string
  plan: number
  monthPosts: number
}

export type AccountGroup = { id: string; name: string; desc: string }

export type Member = { id: string; name: string; role: MemberRole }

export type Pool = {
  id: string
  name: string
  desc: string
  members: { memberId: string; level: PoolLevel }[]
}

export type MatrixSettings = {
  autoAvoid: boolean
  corePriority: boolean
  minWeight: number
  coreIndexRate: number
}

export type MatrixState = {
  accounts: MatrixAccount[]
  groups: AccountGroup[]
  pools: Pool[]
  members: Member[]
  settings: MatrixSettings
  currentMemberId: string
}

export const violationTypes = ['内容违规', '限流提醒', '账号处罚', '外链违规', '疑似刷评', '虚假宣传'] as const

export const REF_DATE = new Date('2026-10-21T00:00:00')
const WINDOW_DAYS = 90

const v = (id: string, date: string, type: string, severity: Severity, note: string): Violation => ({
  id,
  date,
  type,
  severity,
  note,
})

export const initialGroups: AccountGroup[] = [
  { id: 'g1', name: '官方品牌矩阵', desc: '品牌官方发声，口径统一、权威背书' },
  { id: 'g2', name: '车主口碑矩阵', desc: '真实车主视角，沉淀第三方口碑' },
  { id: 'g3', name: '专业测评矩阵', desc: '测评、对比、问答类深度内容' },
  { id: 'g4', name: '种草引流矩阵', desc: '场景化种草，承接泛流量' },
]

export const initialMembers: Member[] = [
  { id: 'm1', name: '张经理', role: '管理员' },
  { id: 'm2', name: '李明', role: '运营主管' },
  { id: 'm3', name: '王小红', role: '内容运营' },
  { id: 'm4', name: '赵宇', role: '外部协作' },
]

export const initialPools: Pool[] = [
  {
    id: 'p1',
    name: '官方账号池',
    desc: '品牌官方号，仅核心运营可操作',
    members: [
      { memberId: 'm1', level: '管理' },
      { memberId: 'm2', level: '运营' },
    ],
  },
  {
    id: 'p2',
    name: '车主口碑池',
    desc: '真实车主与社群账号',
    members: [
      { memberId: 'm1', level: '管理' },
      { memberId: 'm2', level: '管理' },
      { memberId: 'm3', level: '运营' },
    ],
  },
  {
    id: 'p3',
    name: '测评与问答池',
    desc: '测评号、问答号、对比选型账号',
    members: [
      { memberId: 'm1', level: '管理' },
      { memberId: 'm3', level: '运营' },
      { memberId: 'm4', level: '只读' },
    ],
  },
  {
    id: 'p4',
    name: '种草引流池',
    desc: '种草账号，可开放外部协作团队',
    members: [
      { memberId: 'm1', level: '管理' },
      { memberId: 'm3', level: '运营' },
      { memberId: 'm4', level: '运营' },
    ],
  },
]

export const initialSettings: MatrixSettings = {
  autoAvoid: true,
  corePriority: true,
  minWeight: 60,
  coreIndexRate: 75,
}

export const initialAccounts: MatrixAccount[] = [
  { id: 'a1', platform: '小红书', name: '星河车主说', persona: '车主号', lines: ['S7 系列'], groupId: 'g2', fans: 8.2, status: '正常', weight: 82, indexRate: 78, violations: [], poolId: 'p2', plan: 6, monthPosts: 38 },
  { id: 'a2', platform: '小红书', name: '通勤日记', persona: '种草号', lines: ['S7 系列', '品牌通用'], groupId: 'g4', fans: 3.6, status: '正常', weight: 70, indexRate: 71, violations: [v('v1', '2026-09-02', '内容违规', '轻', '正文含广告法敏感词，已自行修改')], poolId: 'p4', plan: 4, monthPosts: 31 },
  { id: 'a3', platform: '小红书', name: '亲子出行手册', persona: '种草号', lines: ['X5 系列'], groupId: 'g4', fans: 5.1, status: '限流', weight: 58, indexRate: 54, violations: [v('v2', '2026-10-05', '限流提醒', '中', '疑似营销导流，笔记推荐量下降'), v('v3', '2026-08-20', '内容违规', '轻', '图片含联系方式')], poolId: 'p4', plan: 3, monthPosts: 22 },
  { id: 'a4', platform: '小红书', name: '选车小助手', persona: '测评号', lines: ['X5 系列'], groupId: 'g3', fans: 2.4, status: '正常', weight: 66, indexRate: 69, violations: [], poolId: 'p3', plan: 3, monthPosts: 19 },
  { id: 'a5', platform: '知乎', name: '新能源老张', persona: '问答号', lines: ['S7 系列', 'X5 系列'], groupId: 'g3', fans: 12.4, status: '正常', weight: 90, indexRate: 86, violations: [], poolId: 'p3', plan: 5, monthPosts: 34 },
  { id: 'a6', platform: '知乎', name: '车评人阿木', persona: '测评号', lines: ['品牌通用'], groupId: 'g3', fans: 6.8, status: '正常', weight: 84, indexRate: 82, violations: [], poolId: 'p3', plan: 4, monthPosts: 29 },
  { id: 'a7', platform: '知乎', name: '星河官方回答', persona: '官方号', lines: ['品牌通用'], groupId: 'g1', fans: 1.9, status: '正常', weight: 76, indexRate: 74, violations: [], poolId: 'p1', plan: 2, monthPosts: 18 },
  { id: 'a8', platform: '抖音', name: '星河小智', persona: '官方号', lines: ['品牌通用'], groupId: 'g1', fans: 21.7, status: '正常', weight: 80, indexRate: 63, violations: [v('v4', '2026-07-01', '内容违规', '轻', '背景音乐版权提示，已替换')], poolId: 'p1', plan: 7, monthPosts: 46 },
  { id: 'a9', platform: '抖音', name: '路上的星河', persona: '车主号', lines: ['X5 系列'], groupId: 'g2', fans: 9.3, status: '待授权', weight: 72, indexRate: null, violations: [], poolId: 'p2', plan: 0, monthPosts: 0 },
  { id: 'a10', platform: '抖音', name: '试驾阿杰', persona: '测评号', lines: ['S7 系列'], groupId: 'g3', fans: 15.8, status: '正常', weight: 52, indexRate: 41, violations: [v('v5', '2026-10-12', '虚假宣传', '重', '视频续航数据被判定夸大，作品下架并警告')], poolId: 'p3', plan: 0, monthPosts: 22 },
  { id: 'a11', platform: '公众号', name: '星河汽车官方', persona: '官方号', lines: ['品牌通用'], groupId: 'g1', fans: 34.5, status: '正常', weight: 95, indexRate: 91, violations: [], poolId: 'p1', plan: 3, monthPosts: 22 },
  { id: 'a12', platform: '公众号', name: '星河车主会', persona: '车主号', lines: ['品牌通用'], groupId: 'g2', fans: 4.9, status: '正常', weight: 74, indexRate: 68, violations: [], poolId: 'p2', plan: 2, monthPosts: 18 },
  { id: 'a13', platform: '什么值得买', name: '值友小河', persona: '测评号', lines: ['S7 系列'], groupId: 'g3', fans: 3.1, status: '正常', weight: 78, indexRate: 81, violations: [], poolId: 'p3', plan: 3, monthPosts: 16 },
  { id: 'a14', platform: '什么值得买', name: '好物清单君', persona: '种草号', lines: ['品牌通用'], groupId: 'g4', fans: 1.8, status: '正常', weight: 61, indexRate: 64, violations: [v('v6', '2026-09-18', '外链违规', '轻', '文末外链被移除')], poolId: 'p4', plan: 2, monthPosts: 12 },
  { id: 'a15', platform: '什么值得买', name: '车载好物', persona: '种草号', lines: ['X5 系列'], groupId: 'g4', fans: 0.9, status: '正常', weight: 49, indexRate: 45, violations: [v('v7', '2026-09-30', '疑似刷评', '中', '评论区互动异常，触发人工审核')], poolId: 'p4', plan: 0, monthPosts: 8 },
  { id: 'a16', platform: '百度贴吧', name: '星河车友会吧', persona: '车主号', lines: ['品牌通用'], groupId: 'g2', fans: 6.4, status: '正常', weight: 73, indexRate: 66, violations: [], poolId: 'p2', plan: 3, monthPosts: 21 },
  { id: 'a17', platform: '百度贴吧', name: '纯电选车吧', persona: '问答号', lines: ['S7 系列', 'X5 系列'], groupId: 'g3', fans: 11.2, status: '正常', weight: 68, indexRate: 72, violations: [v('v8', '2026-08-11', '内容违规', '轻', '帖子被吧务删除一次')], poolId: 'p3', plan: 3, monthPosts: 17 },
  { id: 'a18', platform: '百度贴吧', name: '新能源讨论吧', persona: '种草号', lines: ['X5 系列'], groupId: 'g4', fans: 2.2, status: '已冻结', weight: 35, indexRate: 22, violations: [v('v9', '2026-10-08', '账号处罚', '重', '多次发布广告，账号被封禁 30 天'), v('v10', '2026-09-14', '内容违规', '中', '广告帖被批量删除')], poolId: 'p4', plan: 0, monthPosts: 3 },
]

export const initialMatrixState: MatrixState = {
  accounts: initialAccounts,
  groups: initialGroups,
  pools: initialPools,
  members: initialMembers,
  settings: initialSettings,
  currentMemberId: 'm1',
}

const severityPenalty: Record<Severity, number> = { 轻: 8, 中: 18, 重: 35 }

export function recentViolations(a: MatrixAccount) {
  return a.violations.filter((x) => {
    const days = (REF_DATE.getTime() - new Date(x.date).getTime()) / 86400000
    return days <= WINDOW_DAYS
  })
}

export type Risk = '低' | '中' | '高'
export type Dispatch = '核心优选' | '可分发' | '已规避' | '待授权' | '已冻结'

export type AccountEval = {
  health: number
  compliance: number
  risk: Risk
  dispatch: Dispatch
  reason: string
  recent: number
}

export function evaluateAccount(a: MatrixAccount, s: MatrixSettings): AccountEval {
  const recent = recentViolations(a)
  const penalty = Math.min(60, recent.reduce((sum, x) => sum + severityPenalty[x.severity], 0))
  const compliance = 100 - penalty
  const health = Math.round(a.weight * 0.35 + (a.indexRate ?? 50) * 0.4 + compliance * 0.25)

  const hasSevere = recent.some((x) => x.severity === '重')
  let risk: Risk = '低'
  if (hasSevere || health < 55 || a.status === '已冻结') risk = '高'
  else if (a.status === '限流' || health < 72 || recent.length > 0) risk = '中'

  let dispatch: Dispatch = '可分发'
  let reason = '状态良好，可正常分发'

  if (a.status === '待授权') {
    dispatch = '待授权'
    reason = '尚未完成平台授权'
  } else if (a.status === '已冻结') {
    dispatch = '已冻结'
    reason = '账号被平台冻结，暂停所有分发'
  } else if (s.autoAvoid && risk === '高') {
    dispatch = '已规避'
    reason = hasSevere ? '90 天内有重度违规，已自动规避' : '健康度偏低，已自动规避'
  } else if (s.autoAvoid && a.weight < s.minWeight) {
    dispatch = '已规避'
    reason = `账号权重低于 ${s.minWeight}，已自动规避`
  } else if (s.corePriority && risk === '低' && (a.indexRate ?? 0) >= s.coreIndexRate) {
    dispatch = '核心优选'
    reason = `收录率 ${a.indexRate}% 且风险低，优先承接核心内容`
  }

  return { health, compliance, risk, dispatch, reason, recent: recent.length }
}

export const levelRank: Record<PoolLevel, number> = { 只读: 1, 运营: 2, 管理: 3 }

export function getLevel(state: MatrixState, memberId: string, poolId: string): PoolLevel | null {
  const member = state.members.find((m) => m.id === memberId)
  if (!member) return null
  if (member.role === '管理员') return '管理'
  const pool = state.pools.find((p) => p.id === poolId)
  return pool?.members.find((m) => m.memberId === memberId)?.level ?? null
}

export function isEligible(d: Dispatch) {
  return d === '核心优选' || d === '可分发'
}

export function formatFans(n: number) {
  return `${n.toFixed(1)} 万`
}
