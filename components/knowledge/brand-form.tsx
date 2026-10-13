'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowUp, Check, Circle, Save, Sparkles, Wand2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Segmented } from '@/components/geo/segmented'
import { cn } from '@/lib/utils'
import {
  Field,
  LineListEditor,
  ProductEditor,
  TagInput,
  inputClass,
  textareaClass,
} from '@/components/knowledge/form-fields'
import { SourceUploader } from '@/components/knowledge/source-uploader'
import { GenerateProgress } from '@/components/knowledge/generate-progress'
import { KnowledgeOutput } from '@/components/knowledge/knowledge-output'
import {
  addBrand,
  brandStatuses,
  brandTypes,
  computeChecklist,
  createEmptyDraft,
  deriveKnowledge,
  uid,
  useBrands,
  type BrandDraft,
  type SourceFile,
  type SourceLink,
} from '@/lib/brand-kb'

const audienceSuggestions = ['家庭用户', '年轻首购用户', '商务用户', '科技爱好者', '越野玩家']
const rivalFallback = ['极光汽车', '远山汽车', '澜海汽车', '云岭汽车']

const sampleDraft = (): BrandDraft => ({
  name: '天行汽车',
  nameEn: 'Tianxing Auto',
  aliases: ['Tianxing', 'txqc'],
  type: '整车厂商',
  status: '运营中',
  company: '天行新能源汽车有限公司',
  founded: '2020',
  hq: '深圳 · 坪山',
  slogan: '越野，也可以很从容',
  summary: '天行汽车成立于 2020 年，专注城市与户外双场景的新能源 SUV，面向热爱周末出行的家庭与户外用户，主打增程与纯电双动力、全地形底盘调校。',
  products: [
    { id: uid('p'), name: '天行 T9', desc: '中大型增程式 SUV，综合续航 1200km' },
    { id: uid('p'), name: '天行 T5', desc: '紧凑型纯电 SUV，CLTC 续航 560km' },
  ],
  audiences: ['户外爱好者', '家庭用户'],
  sellingPoints: ['增程与纯电双动力可选，覆盖长途与城市通勤', '全地形底盘调校，涉水深度 700mm', '车内 220V 对外放电，露营场景友好'],
  competitors: ['极光汽车', '远山汽车'],
  files: [{ id: uid('f'), name: '天行品牌手册.pdf', size: 3_250_000, status: '已解析' }],
  links: [{ id: uid('l'), url: 'https://www.tianxing-auto.example', kind: '官网', status: '已抓取' }],
})

function stableKey(d: BrandDraft) {
  return JSON.stringify({
    ...d,
    files: d.files.map((f) => `${f.name}:${f.size}`),
    links: d.links.map((l) => `${l.url}:${l.kind}`),
  })
}

function SectionCard({
  index,
  title,
  desc,
  children,
}: {
  index: number
  title: string
  desc: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary font-mono text-sm font-bold text-primary-foreground">
            {index}
          </span>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-0.5">{desc}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
  )
}

export function BrandForm() {
  const router = useRouter()
  const brands = useBrands()
  const [draft, setDraft] = useState<BrandDraft>(createEmptyDraft)
  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('idle')
  const [progress, setProgress] = useState(0)
  const [generated, setGenerated] = useState<BrandDraft | null>(null)
  const [saveError, setSaveError] = useState('')
  const outputRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number | null>(null)

  const patch = (p: Partial<BrandDraft>) => setDraft((d) => ({ ...d, ...p }))

  useEffect(
    () => () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    },
    [],
  )

  useEffect(() => {
    if (phase !== 'idle') outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [phase])

  const checklist = useMemo(() => computeChecklist(draft), [draft])
  const completeness = checklist.reduce((n, c) => n + (c.done ? c.weight : 0), 0)

  const parsing = draft.files.some((f) => f.status === '解析中') || draft.links.some((l) => l.status === '抓取中')
  const blockers = [
    !draft.name.trim() && '品牌名称',
    draft.summary.trim().length < 10 && '品牌总述（至少 10 字）',
  ].filter(Boolean) as string[]
  const canGenerate = blockers.length === 0 && !parsing && phase !== 'running'

  const rivalSuggestions = useMemo(() => {
    const names = [...brands.map((b) => b.name), ...rivalFallback]
    return Array.from(new Set(names)).filter((n) => n !== draft.name.trim()).slice(0, 6)
  }, [brands, draft.name])

  const derived = useMemo(() => (generated ? deriveKnowledge(generated) : null), [generated])
  const stale = generated ? stableKey(generated) !== stableKey(draft) : false

  function generate() {
    const snapshot: BrandDraft = JSON.parse(JSON.stringify(draft))
    snapshot.products = snapshot.products.filter((p) => p.name.trim() || p.desc.trim())
    snapshot.sellingPoints = snapshot.sellingPoints.map((s) => s.trim()).filter(Boolean)
    setSaveError('')
    setPhase('running')
    setProgress(0)
    if (timerRef.current) window.clearInterval(timerRef.current)
    let p = 0
    timerRef.current = window.setInterval(() => {
      p += 3.4
      if (p >= 100) {
        if (timerRef.current) window.clearInterval(timerRef.current)
        setProgress(100)
        setGenerated(snapshot)
        setPhase('done')
        return
      }
      setProgress(p)
    }, 90)
  }

  function save() {
    if (!generated) return
    if (brands.some((b) => b.name === generated.name.trim())) {
      setSaveError(`品牌库中已存在「${generated.name.trim()}」，请修改品牌名称后重新生成`)
      return
    }
    const id = addBrand({ ...generated, name: generated.name.trim() })
    router.push(`/knowledge?brand=${id}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 lg:grid-cols-12 lg:items-start">
        <div className="flex flex-col gap-5 lg:col-span-8">
          <SectionCard index={1} title="基本信息" desc="品牌的身份信息，用于实体识别与 GEO 评估中的品牌匹配">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="品牌名称" htmlFor="b-name" required>
                <input
                  id="b-name"
                  value={draft.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  placeholder="如：星河汽车"
                  maxLength={30}
                  className={inputClass}
                />
              </Field>
              <Field label="英文名称" htmlFor="b-name-en">
                <input
                  id="b-name-en"
                  value={draft.nameEn}
                  onChange={(e) => patch({ nameEn: e.target.value })}
                  placeholder="如：Xinghe Auto"
                  maxLength={60}
                  className={inputClass}
                />
              </Field>
              <Field label="品牌类型" required className="sm:col-span-2">
                <Segmented
                  aria-label="品牌类型"
                  value={draft.type}
                  onChange={(type) => patch({ type })}
                  options={brandTypes.map((t) => ({ value: t, label: t }))}
                />
              </Field>
              <Field label="品牌状态" required className="sm:col-span-2">
                <Segmented
                  aria-label="品牌状态"
                  value={draft.status}
                  onChange={(status) => patch({ status })}
                  options={brandStatuses.map((s) => ({ value: s, label: s }))}
                />
              </Field>
              <Field label="品牌别名" hint="拼音缩写、简称等，用于 AI 提及识别" className="sm:col-span-2">
                <TagInput
                  tags={draft.aliases}
                  onChange={(aliases) => patch({ aliases })}
                  placeholder="输入后回车添加，如：xhqc"
                  ariaLabel="品牌别名"
                />
              </Field>
              <Field label="所属企业" htmlFor="b-company">
                <input
                  id="b-company"
                  value={draft.company}
                  onChange={(e) => patch({ company: e.target.value })}
                  placeholder="如：星河智能汽车科技有限公司"
                  className={inputClass}
                />
              </Field>
              <Field label="总部所在地" htmlFor="b-hq">
                <input
                  id="b-hq"
                  value={draft.hq}
                  onChange={(e) => patch({ hq: e.target.value })}
                  placeholder="如：上海 · 临港"
                  className={inputClass}
                />
              </Field>
              <Field label="成立年份" htmlFor="b-founded">
                <input
                  id="b-founded"
                  value={draft.founded}
                  onChange={(e) => patch({ founded: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                  inputMode="numeric"
                  placeholder="如：2018"
                  className={inputClass}
                />
              </Field>
              <Field label="品牌口号" htmlFor="b-slogan">
                <input
                  id="b-slogan"
                  value={draft.slogan}
                  onChange={(e) => patch({ slogan: e.target.value })}
                  placeholder="如：让智能出行更安心"
                  maxLength={40}
                  className={inputClass}
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard index={2} title="品牌介绍" desc="描述品牌是谁、卖什么、卖给谁、凭什么，这是 AI 理解品牌的核心语料">
            <Field label="总述" htmlFor="b-summary" required>
              <textarea
                id="b-summary"
                value={draft.summary}
                onChange={(e) => patch({ summary: e.target.value })}
                rows={4}
                maxLength={300}
                placeholder="用 2–3 句话讲清品牌定位、发展背景与主打方向"
                className={textareaClass}
              />
              <p className="mt-1 text-right font-mono text-[11px] text-muted-foreground">{draft.summary.length}/300</p>
            </Field>
            <Field label="核心产品 / 服务" hint="最多 6 项">
              <ProductEditor products={draft.products} onChange={(products) => patch({ products })} />
            </Field>
            <Field label="目标用户群体">
              <TagInput
                tags={draft.audiences}
                onChange={(audiences) => patch({ audiences })}
                placeholder="输入人群后回车添加，如：家庭用户"
                suggestions={audienceSuggestions}
                ariaLabel="目标用户群体"
              />
            </Field>
            <Field label="独特卖点" hint="建议 3–5 条，尽量带可核验的数据">
              <LineListEditor
                lines={draft.sellingPoints}
                onChange={(sellingPoints) => patch({ sellingPoints })}
                placeholder="如：800V 高压平台，10%–80% 快充约 15 分钟"
                addLabel="添加卖点"
              />
            </Field>
            <Field label="竞品品牌" hint="用于对比选型探针与 SOV 计算">
              <TagInput
                tags={draft.competitors}
                onChange={(competitors) => patch({ competitors })}
                placeholder="输入竞品品牌后回车添加"
                suggestions={rivalSuggestions}
                ariaLabel="竞品品牌"
              />
            </Field>
          </SectionCard>

          <SectionCard index={3} title="品牌资料" desc="上传品牌文档，或填写官网与线上文章链接，系统自动抽取候选事实并标注来源">
            <SourceUploader
              files={draft.files}
              links={draft.links}
              onFiles={(fn: (prev: SourceFile[]) => SourceFile[]) => setDraft((d) => ({ ...d, files: fn(d.files) }))}
              onLinks={(fn: (prev: SourceLink[]) => SourceLink[]) => setDraft((d) => ({ ...d, links: fn(d.links) }))}
            />
          </SectionCard>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-4 lg:col-span-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>录入完整度</CardTitle>
              <Badge variant={completeness >= 80 ? 'success' : completeness >= 50 ? 'warning' : 'muted'}>
                {completeness >= 80 ? '质量优秀' : completeness >= 50 ? '基本可用' : '待完善'}
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div>
                <p className="font-mono text-3xl font-bold tracking-tight">
                  {completeness}
                  <span className="ml-0.5 text-base font-medium text-muted-foreground">%</span>
                </p>
                <div
                  className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-valuenow={completeness}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="录入完整度"
                >
                  <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${completeness}%` }} />
                </div>
              </div>
              <ul className="flex flex-col gap-1.5">
                {checklist.map((c) => (
                  <li key={c.label} className="flex items-center gap-2 text-xs">
                    {c.done ? (
                      <Check className="size-3.5 shrink-0 text-emerald-400" />
                    ) : (
                      <Circle className="size-3.5 shrink-0 text-muted-foreground/50" />
                    )}
                    <span className={cn('flex-1', c.done ? 'text-foreground' : 'text-muted-foreground')}>{c.label}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">+{c.weight}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <Button size="lg" className="glow-primary w-full" disabled={!canGenerate} onClick={generate}>
                  <Sparkles />
                  {phase === 'done' ? '重新生成结构化知识' : '生成品牌结构化知识'}
                </Button>
                <p role="status" className="text-[11px] leading-relaxed text-muted-foreground">
                  {phase === 'running'
                    ? '正在生成中…'
                    : parsing
                      ? '资料正在解析中，完成后即可生成'
                      : blockers.length
                        ? `还需填写：${blockers.join('、')}`
                        : '信息越完整，输出的知识质量越高'}
                </p>
                <Button variant="ghost" size="sm" className="w-fit" onClick={() => setDraft(sampleDraft())} disabled={phase === 'running'}>
                  <Wand2 />
                  填入示例品牌
                </Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      <div ref={outputRef} className="scroll-mt-4">
        {phase === 'running' && <GenerateProgress progress={progress} />}

        {phase === 'done' && derived && generated && (
          <section className="flex flex-col gap-5" aria-label="品牌结构化知识输出">
            <div className="flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="success">
                    <Check className="size-3" />
                    生成完成
                  </Badge>
                  <h3 className="text-lg font-bold">{generated.name} · 品牌结构化知识</h3>
                  {stale && <Badge variant="warning">表单已修改，请重新生成</Badge>}
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  已为 GEO 评估与 AI 内容生成提供数据支撑，并生成创作校验规则约束智能体输出。
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="lg" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <ArrowUp />
                  返回修改
                </Button>
                <Button size="lg" onClick={save} disabled={stale}>
                  <Save />
                  保存到品牌知识库
                </Button>
              </div>
            </div>
            {saveError && (
              <p role="alert" className="text-sm text-destructive">
                {saveError}
              </p>
            )}
            <KnowledgeOutput derived={derived} brandName={generated.name} />
          </section>
        )}
      </div>
    </div>
  )
}
