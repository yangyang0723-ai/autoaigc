'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { BookX, Plus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Segmented } from '@/components/geo/segmented'
import { KnowledgeOutput } from '@/components/knowledge/knowledge-output'
import { KnowledgeLibrary } from '@/components/knowledge/knowledge-library'
import { VerifyPlayground } from '@/components/knowledge/verify-playground'
import { cn } from '@/lib/utils'
import { deriveKnowledge, useBrands, type BrandStatus } from '@/lib/brand-kb'

type Tab = 'structured' | 'entries' | 'verify'

const statusVariant: Record<BrandStatus, 'success' | 'warning' | 'muted'> = {
  运营中: 'success',
  筹备中: 'warning',
  已停用: 'muted',
}

export function KnowledgeWorkspace({ initialId }: { initialId?: string }) {
  const brands = useBrands()
  const [selectedId, setSelectedId] = useState(initialId)
  const [tab, setTab] = useState<Tab>('structured')

  const brand = brands.find((b) => b.id === selectedId) ?? brands[0]
  const derived = useMemo(() => (brand ? deriveKnowledge(brand) : null), [brand])
  const allDerived = useMemo(() => new Map(brands.map((b) => [b.id, deriveKnowledge(b)])), [brands])

  if (!brand || !derived) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
          <BookX className="size-8 text-muted-foreground" />
          <p className="text-sm font-semibold">品牌库为空</p>
          <Link href="/knowledge/new" className={buttonVariants({ size: 'lg' })}>
            <Plus />
            新增品牌
          </Link>
        </CardContent>
      </Card>
    )
  }

  const meta = [brand.company, brand.hq, brand.founded && `${brand.founded} 年成立`].filter(Boolean).join(' · ')

  return (
    <div className="flex flex-col gap-5">
      <section aria-label="品牌列表">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">
            品牌库 <span className="ml-1 font-mono text-muted-foreground">{brands.length}</span>
          </h3>
          <Link href="/knowledge/new" className={buttonVariants({ size: 'lg' })}>
            <Plus />
            新增品牌
          </Link>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {brands.map((b) => {
            const d = allDerived.get(b.id)
            const on = b.id === brand.id
            return (
              <li key={b.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSelectedId(b.id)}
                  className={cn(
                    'flex h-full w-full flex-col gap-3 rounded-xl border bg-card p-4 text-left transition-colors',
                    on ? 'border-primary/60 bg-primary/5 ring-1 ring-primary/30' : 'border-border hover:bg-muted/50',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-base font-bold text-primary">
                      {b.name.slice(0, 1)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{b.name}</span>
                      <span className="block truncate text-[11px] text-muted-foreground">{b.nameEn || '未填写英文名'}</span>
                    </span>
                  </span>
                  <span className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline">{b.type}</Badge>
                    <Badge variant={statusVariant[b.status]}>{b.status}</Badge>
                  </span>
                  <span>
                    <span className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>信息完整度</span>
                      <span className="font-mono text-foreground">{d?.completeness ?? 0}%</span>
                    </span>
                    <span className="block h-1.5 overflow-hidden rounded-full bg-muted">
                      <span className="block h-full rounded-full bg-primary" style={{ width: `${d?.completeness ?? 0}%` }} />
                    </span>
                    <span className="mt-2 block text-[11px] text-muted-foreground">
                      <span className="font-mono text-foreground">{d?.entityCount ?? 0}</span> 条结构化知识
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <Card>
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-lg">{brand.name}</CardTitle>
            {brand.nameEn && <span className="text-sm text-muted-foreground">{brand.nameEn}</span>}
            <Badge variant="outline">{brand.type}</Badge>
            <Badge variant={statusVariant[brand.status]}>{brand.status}</Badge>
            <span className="ml-auto text-xs text-muted-foreground">创建于 {brand.createdAt}</span>
          </div>
          {(meta || brand.slogan) && (
            <CardDescription>
              {meta}
              {meta && brand.slogan ? ' · ' : ''}
              {brand.slogan && `“${brand.slogan}”`}
            </CardDescription>
          )}
          <Segmented
            className="w-fit"
            aria-label="品牌知识视图"
            value={tab}
            onChange={setTab}
            options={[
              { value: 'structured', label: '品牌结构化知识' },
              { value: 'entries', label: '知识条目管理' },
              { value: 'verify', label: '创作校验演示' },
            ]}
          />
        </CardHeader>
        <CardContent>
          {tab === 'structured' && <KnowledgeOutput derived={derived} brandName={brand.name} />}
          {tab === 'entries' &&
            (brand.hasLibrary ? (
              <KnowledgeLibrary />
            ) : (
              <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border p-10 text-center">
                <BookX className="size-7 text-muted-foreground" />
                <p className="text-sm font-semibold">暂无已发布的知识条目</p>
                <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
                  「{brand.name}」的结构化知识已生成。审核资料来源中的候选事实后，将发布为可被调用的知识条目。
                </p>
              </div>
            ))}
          {tab === 'verify' && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-muted-foreground">
                体验「{brand.name}」的内容创作环节如何自动调用知识库，校验并修正文案（共 {derived.guardrails.length} 条规则）
              </p>
              <VerifyPlayground key={brand.id} rules={derived.guardrails} sample={derived.verifySample} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
