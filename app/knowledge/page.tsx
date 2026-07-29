'use client'

import { useEffect, useState } from 'react'
import {
  ShieldCheck,
  ScanLine,
  Gavel,
  AlertTriangle,
  BookOpen,
  Loader2,
  CheckCircle2,
  XCircle,
  Database,
  ChevronRight,
  Sparkles,
  X,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type Severity = 'high' | 'medium' | 'low'
type Finding = {
  category: 'platform' | 'sensitive' | 'knowhow'
  rule: string
  matched: string
  severity: Severity
  advice: string
  source: string
}
type ValidateResult = {
  checkedAt: string
  kbVersion: string
  length: number
  score: number
  passed: boolean
  counts: { platform: number; sensitive: number; knowhow: number }
  findings: Finding[]
}

const categoryMeta = {
  platform: { label: '平台规则', icon: Gavel, tone: 'text-chart-2' },
  sensitive: { label: '敏感词', icon: AlertTriangle, tone: 'text-destructive' },
  knowhow: { label: '行业规范', icon: BookOpen, tone: 'text-accent' },
} as const

const severityBadge: Record<Severity, { variant: 'danger' | 'warning' | 'muted'; label: string }> = {
  high: { variant: 'danger', label: '高风险' },
  medium: { variant: 'warning', label: '中风险' },
  low: { variant: 'muted', label: '提示' },
}

type LibraryEntry = {
  term: string
  note: string
  tag: { variant: 'danger' | 'warning' | 'muted' | 'success'; label: string }
}
type Library = {
  key: string
  icon: typeof Gavel
  title: string
  desc: string
  count: string
  tag: string
  tone: string
  updatedAt: string
  entries: LibraryEntry[]
}

// 外部知识库已接入的知识域（体现行业专业性）
const libraries: Library[] = [
  {
    key: 'platform',
    icon: Gavel,
    title: '平台规则库',
    desc: '广告法、价格法及抖音 / 小红书 / 视频号 / 微信内容规范',
    count: '1,286 条',
    tag: '实时同步',
    tone: 'bg-chart-2/12 text-chart-2',
    updatedAt: '2026-07-28 · 实时同步',
    entries: [
      { term: '绝对化用语禁用', note: '“国家级 / 最高级 / 第一品牌”等违反《广告法》第九条，改为“同级领先”。', tag: { variant: 'danger', label: '广告法' } },
      { term: '价格明码标价', note: '“全网最低 / 骨折价”需有依据，建议改为“限时优惠价”并标注有效期。', tag: { variant: 'danger', label: '价格法' } },
      { term: '站外导流限制', note: '“加微信 / 扫码领取”受平台限制，改用官方线索组件挂载。', tag: { variant: 'warning', label: '平台公约' } },
      { term: '资质与免责标注', note: '促销、抽奖类内容需标注活动规则与最终解释权说明。', tag: { variant: 'muted', label: '合规提示' } },
    ],
  },
  {
    key: 'sensitive',
    icon: AlertTriangle,
    title: '敏感词库',
    desc: '违禁词、虚假宣传、金融保值承诺、安全绝对化用语',
    count: '9,540 词',
    tag: 'v3.2',
    tone: 'bg-destructive/12 text-destructive',
    updatedAt: '2026-07-25 · v3.2',
    entries: [
      { term: '永不自燃 / 绝对安全', note: '安全性能禁止绝对承诺，引用 C-NCAP 五星等权威测试替代。', tag: { variant: 'danger', label: '高风险' } },
      { term: '保值率100% / 永不贬值', note: '金融保值承诺需删除或补充“具体以合同为准”。', tag: { variant: 'danger', label: '高风险' } },
      { term: '零风险 / 稳赚', note: '涉及投资回报的夸大表述，一律移除。', tag: { variant: 'danger', label: '高风险' } },
      { term: '包过户 / 包上牌', note: '服务承诺需明确前置条件，避免“包”字绝对化表述。', tag: { variant: 'warning', label: '中风险' } },
    ],
  },
  {
    key: 'knowhow',
    icon: BookOpen,
    title: '行业 know-how',
    desc: '续航 / 能耗工况标注、智驾等级表述、参数合规写法',
    count: '648 条',
    tag: '专家维护',
    tone: 'bg-accent/12 text-accent',
    updatedAt: '2026-07-20 · 专家维护',
    entries: [
      { term: '续航里程标注', note: '须注明测试工况（CLTC / WLTP）及“实际续航因路况而异”。', tag: { variant: 'warning', label: '标注规范' } },
      { term: '智能驾驶等级', note: '量产功能应表述为“组合辅助驾驶（L2）”，禁用“自动/无人驾驶”。', tag: { variant: 'danger', label: '智驾规范' } },
      { term: '能耗 / 油耗数据', note: '标注数据来源与实验室工况说明，避免“零油耗”等误导。', tag: { variant: 'muted', label: '能耗规范' } },
      { term: '参数合规写法', note: '峰值功率、扭矩、充电时长须标注测试条件与单位。', tag: { variant: 'muted', label: '参数规范' } },
    ],
  },
  {
    key: 'template',
    icon: Sparkles,
    title: '话术优化模板',
    desc: '合规且高转化的汽车营销话术范式与替换建议',
    count: '312 套',
    tag: '每周更新',
    tone: 'bg-primary/12 text-primary',
    updatedAt: '2026-07-27 · 每周更新',
    entries: [
      { term: '上市造势话术', note: '“同级领先的智能座舱体验”替代“国家级豪华”，合规且有记忆点。', tag: { variant: 'success', label: '推荐' } },
      { term: '续航卖点话术', note: '“CLTC 工况续航 700km，长途出行更从容”替代“超长续航无忧”。', tag: { variant: 'success', label: '推荐' } },
      { term: '安全卖点话术', note: '“C-NCAP 五星安全认证”替代“绝对安全”，用权威背书增强说服力。', tag: { variant: 'success', label: '推荐' } },
      { term: '促单引导话术', note: '“到店试驾享专属礼遇”替代“加微信抢购”，规避导流风险。', tag: { variant: 'success', label: '推荐' } },
    ],
  },
]

const sampleText =
  '全新星耀 07 上市！国家级豪华 SUV，续航1000公里超长续航，自动驾驶解放双手，绝对安全永不自燃，全网最低价，加微信立即抢购！'

export default function KnowledgePage() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ValidateResult | null>(null)
  const [selected, setSelected] = useState<Library | null>(null)

  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [selected])

  async function validate() {
    if (!content.trim() || loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/knowledge/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? '校验失败')
      setResult(data as ValidateResult)
    } catch (e) {
      setError(e instanceof Error ? e.message : '校验服务暂不可用')
    } finally {
      setLoading(false)
    }
  }

  const scoreTone = (s: number) =>
    s >= 90 ? 'text-chart-1' : s >= 70 ? 'text-chart-3' : 'text-destructive'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary glow-primary">
            <ShieldCheck className="size-6" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight">知识库</h1>
              <Badge variant="accent" className="gap-1 px-1.5 py-0 text-[11px]">
                <Database className="size-3" />
                外部知识库已接入
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              平台规则验证 · 敏感词验证 · 行业 know-how 规范，为汽车营销内容保驾护航
            </p>
          </div>
        </div>
        <Badge variant="outline" className="gap-1.5">
          <span className="size-1.5 rounded-full bg-chart-1" />
          知识库 auto-kb v3.2 · 在线
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Validator */}
        <div className="space-y-4 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ScanLine className="size-4.5 text-primary" />
                合规校验
              </CardTitle>
              <CardDescription>
                粘贴营销文案，一键调用外部知识库进行三重合规检测
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="在此粘贴需要校验的营销文案，例如海报文案、朋友圈图文、短视频口播稿…"
                rows={5}
                className="w-full resize-none rounded-lg border border-border bg-input px-3.5 py-3 text-sm outline-none ring-primary/40 transition placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2"
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setContent(sampleText)}
                  className="text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  载入示例文案
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {content.length} 字
                  </span>
                  <Button onClick={validate} disabled={!content.trim() || loading} className="gap-1.5">
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        校验中
                      </>
                    ) : (
                      <>
                        <ScanLine className="size-4" />
                        开始校验
                      </>
                    )}
                  </Button>
                </div>
              </div>
              {error && (
                <p className="flex items-center gap-1.5 text-sm text-destructive">
                  <XCircle className="size-4" />
                  {error}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">校验结果</CardTitle>
                  <CardDescription>
                    知识库版本 {result.kbVersion} · 命中 {result.findings.length} 项
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className={cn('text-3xl font-semibold tabular-nums', scoreTone(result.score))}>
                    {result.score}
                  </p>
                  <p className="text-[11px] text-muted-foreground">合规评分</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* category summary */}
                <div className="grid grid-cols-3 gap-2">
                  {(['platform', 'sensitive', 'knowhow'] as const).map((c) => {
                    const meta = categoryMeta[c]
                    const Icon = meta.icon
                    return (
                      <div key={c} className="rounded-lg border border-border p-3">
                        <div className="flex items-center gap-1.5">
                          <Icon className={cn('size-4', meta.tone)} />
                          <span className="text-xs text-muted-foreground">{meta.label}</span>
                        </div>
                        <p className="mt-1 text-xl font-semibold tabular-nums">
                          {result.counts[c]}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {result.passed ? (
                  <div className="flex items-center gap-2 rounded-lg border border-chart-1/30 bg-chart-1/10 px-3.5 py-3 text-sm">
                    <CheckCircle2 className="size-5 text-chart-1" />
                    <span>未发现违规内容，文案符合平台规则与行业规范，可放心发布。</span>
                  </div>
                ) : (
                  <ul className="space-y-2.5">
                    {result.findings.map((f, i) => {
                      const meta = categoryMeta[f.category]
                      const Icon = meta.icon
                      const sev = severityBadge[f.severity]
                      return (
                        <li
                          key={`${f.rule}-${i}`}
                          className="rounded-lg border border-border bg-secondary/30 p-3.5"
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <Icon className={cn('size-4', meta.tone)} />
                            <span className="text-sm font-medium">{f.rule}</span>
                            <Badge variant={sev.variant} className="px-1.5 py-0 text-[11px]">
                              {sev.label}
                            </Badge>
                            <Badge variant="muted" className="px-1.5 py-0 text-[11px]">
                              命中「{f.matched}」
                            </Badge>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{f.advice}</p>
                          <p className="mt-1.5 text-[11px] text-muted-foreground/70">
                            来源：{f.source}
                          </p>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Knowledge libraries */}
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">已接入知识域</CardTitle>
              <CardDescription>外部知识库实时同步，专家团队持续维护</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {libraries.map((lib) => {
                const Icon = lib.icon
                return (
                  <button
                    key={lib.title}
                    type="button"
                    onClick={() => setSelected(lib)}
                    className="group flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:border-primary/40 hover:bg-secondary/40"
                  >
                    <span className={cn('grid size-10 shrink-0 place-items-center rounded-lg', lib.tone)}>
                      <Icon className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium">{lib.title}</span>
                        <Badge variant="muted" className="shrink-0 px-1.5 py-0 text-[10px]">
                          {lib.tag}
                        </Badge>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{lib.desc}</p>
                      <p className="mt-0.5 text-[11px] font-medium text-primary">{lib.count}</p>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </button>
                )
              })}
            </CardContent>
          </Card>

          <Card className="border-primary/25 bg-primary/[0.06]">
            <CardContent className="flex items-start gap-3 p-4">
              <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium">生成即合规</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  五大生成引擎已内置知识库校验，AI 产出内容自动完成平台规则、敏感词与行业规范三重检测。
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Library detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="kb-detail-title"
          onClick={() => setSelected(null)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-2xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 border-b border-border p-5">
              <span className={cn('grid size-11 shrink-0 place-items-center rounded-xl', selected.tone)}>
                <selected.icon className="size-5.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 id="kb-detail-title" className="truncate text-base font-semibold">
                    {selected.title}
                  </h2>
                  <Badge variant="muted" className="shrink-0 px-1.5 py-0 text-[10px]">
                    {selected.tag}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{selected.desc}</p>
                <p className="mt-1 text-[11px] text-muted-foreground/70">
                  {selected.count} · 更新 {selected.updatedAt}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="关闭"
                className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex items-center justify-between px-5 pt-4">
              <p className="text-xs font-medium text-muted-foreground">代表性词条 · 节选</p>
              <span className="text-[11px] text-muted-foreground/70">共 {selected.count}</span>
            </div>

            <ul className="space-y-2.5 overflow-y-auto p-5 pt-3">
              {selected.entries.map((entry) => (
                <li key={entry.term} className="rounded-lg border border-border bg-secondary/30 p-3.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">{entry.term}</span>
                    <Badge variant={entry.tag.variant} className="px-1.5 py-0 text-[11px]">
                      {entry.tag.label}
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-sm text-muted-foreground">{entry.note}</p>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between gap-2 border-t border-border p-4">
              <p className="text-[11px] text-muted-foreground/70">数据来源：外部知识库 auto-kb v3.2</p>
              <Button variant="outline" size="sm" onClick={() => setSelected(null)}>
                关闭
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
