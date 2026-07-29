'use client'

import { useState } from 'react'
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

// 外部知识库已接入的知识域（体现行业专业性）
const libraries = [
  {
    icon: Gavel,
    title: '平台规则库',
    desc: '广告法、价格法及抖音 / 小红书 / 视频号 / 微信内容规范',
    count: '1,286 条',
    tag: '实时同步',
    tone: 'bg-chart-2/12 text-chart-2',
  },
  {
    icon: AlertTriangle,
    title: '敏感词库',
    desc: '违禁词、虚假宣传、金融保值承诺、安全绝对化用语',
    count: '9,540 词',
    tag: 'v3.2',
    tone: 'bg-destructive/12 text-destructive',
  },
  {
    icon: BookOpen,
    title: '行业 know-how',
    desc: '续航 / 能耗工况标注、智驾等级表述、参数合规写法',
    count: '648 条',
    tag: '专家维护',
    tone: 'bg-accent/12 text-accent',
  },
  {
    icon: Sparkles,
    title: '话术优化模板',
    desc: '合规且高转化的汽车营销话术范式与替换建议',
    count: '312 套',
    tag: '每周更新',
    tone: 'bg-primary/12 text-primary',
  },
]

const sampleText =
  '全新星耀 07 上市！国家级豪华 SUV，续航1000公里超长续航，自动驾驶解放双手，绝对安全永不自燃，全网最低价，加微信立即抢购！'

export default function KnowledgePage() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ValidateResult | null>(null)

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
    </div>
  )
}
