'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import {
  Search,
  Upload,
  FolderPlus,
  Grid2x2,
  List,
  ImageIcon,
  FileText,
  Video,
  Presentation,
  Star,
  MoreVertical,
  Download,
  Clock,
  X,
  Loader2,
  CheckCircle2,
  Share2,
  Pencil,
  Trash2,
  Sparkles,
  HardDrive,
  Tag,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type AssetType = '图片' | '图文' | '视频' | 'PPT'

interface Asset {
  id: string
  title: string
  type: AssetType
  cover: string
  size: string
  updatedAt: string
  tags: string[]
  starred: boolean
}

const folders = [
  { name: '全部素材', count: 1284 },
  { name: '新车上市', count: 326 },
  { name: '促销活动', count: 218 },
  { name: '车型讲解', count: 174 },
  { name: '朋友圈素材', count: 402 },
  { name: '视频号内容', count: 164 },
]

const typeMeta: Record<AssetType, { icon: typeof ImageIcon; color: string }> = {
  图片: { icon: ImageIcon, color: 'text-chart-1' },
  图文: { icon: FileText, color: 'text-chart-2' },
  视频: { icon: Video, color: 'text-chart-4' },
  PPT: { icon: Presentation, color: 'text-chart-3' },
}

const covers = [
  '/cars/blue-suv-poster.png',
  '/cars/showroom.png',
  '/cars/red-suv-snow.png',
  '/cars/city-night.png',
]

const assets: Asset[] = Array.from({ length: 12 }).map((_, i) => {
  const types: AssetType[] = ['图片', '图文', '视频', 'PPT']
  const type = types[i % 4]
  const titles = [
    '星耀 07 新车上市主视觉',
    '双旦购车节朋友圈九宫格',
    '雪地试驾短视频脚本',
    '星耀 07 产品讲解 PPT',
    '限时置换补贴海报',
    '城市夜景氛围大片',
    '门店到店有礼图文',
    '智能座舱功能演示',
  ]
  return {
    id: `asset-${i}`,
    title: titles[i % titles.length],
    type,
    cover: covers[i % covers.length],
    size: type === '视频' ? '48.2 MB' : type === 'PPT' ? '12.6 MB' : '2.4 MB',
    updatedAt: `${(i % 7) + 1} 天前`,
    tags: [['新车上市', '海报'], ['朋友圈', '促销'], ['视频', '试驾'], ['PPT', '讲解']][i % 4],
    starred: i % 5 === 0,
  }
})

export default function AssetsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [activeFolder, setActiveFolder] = useState('全部素材')
  const [typeFilter, setTypeFilter] = useState<AssetType | '全部'>('全部')
  const [query, setQuery] = useState('')
  const [starredIds, setStarredIds] = useState<Set<string>>(
    () => new Set(assets.filter((a) => a.starred).map((a) => a.id)),
  )
  const [selected, setSelected] = useState<Asset | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [downloadedId, setDownloadedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      const matchType = typeFilter === '全部' || a.type === typeFilter
      const matchQuery = a.title.includes(query) || a.tags.some((t) => t.includes(query))
      return matchType && matchQuery
    })
  }, [typeFilter, query])

  const isStarred = (id: string) => starredIds.has(id)

  function toggleStar(id: string) {
    setStarredIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleDownload(id: string) {
    if (downloadingId) return
    setDownloadingId(id)
    setDownloadedId(null)
    setTimeout(() => {
      setDownloadingId(null)
      setDownloadedId(id)
      setTimeout(() => setDownloadedId((cur) => (cur === id ? null : cur)), 2000)
    }, 1100)
  }

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

  return (
    <div className="flex gap-6">
      {/* Folder rail */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">素材库</h2>
          <button
            className="grid size-7 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary active:scale-90"
            aria-label="新建文件夹"
          >
            <FolderPlus className="size-4" />
          </button>
        </div>
        <nav className="mt-3 space-y-1">
          {folders.map((f) => (
            <button
              key={f.name}
              onClick={() => setActiveFolder(f.name)}
              className={cn(
                'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                activeFolder === f.name
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              <span className="truncate">{f.name}</span>
              <span className="text-xs tabular-nums opacity-70">{f.count}</span>
            </button>
          ))}
        </nav>

        <Card className="mt-6 p-4">
          <p className="text-xs text-muted-foreground">存储空间</p>
          <p className="mt-1 text-sm font-semibold">62.4 GB / 100 GB</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full w-[62%] rounded-full bg-primary" />
          </div>
        </Card>
      </aside>

      {/* Main */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">{activeFolder}</h1>
              <p className="text-sm text-muted-foreground">
                共 {filtered.length} 个素材 · 支持按车型、活动、渠道多维检索
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="h-9 gap-1.5 px-3 active:scale-95">
                <FolderPlus className="size-4" />
                新建文件夹
              </Button>
              <Button className="h-9 gap-1.5 px-3 active:scale-95">
                <Upload className="size-4" />
                上传素材
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-56">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索素材名称或标签…"
                className="h-9 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary/60"
              />
            </div>
            <div className="flex items-center gap-1.5">
              {(['全部', '图片', '图文', '视频', 'PPT'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={cn(
                    'rounded-lg px-3 py-1.5 text-sm transition-colors',
                    typeFilter === t
                      ? 'bg-secondary text-foreground'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
              <button
                onClick={() => setView('grid')}
                className={cn(
                  'grid size-7 place-items-center rounded-md transition-colors',
                  view === 'grid' ? 'bg-secondary text-foreground' : 'text-muted-foreground',
                )}
                aria-label="网格视图"
              >
                <Grid2x2 className="size-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={cn(
                  'grid size-7 place-items-center rounded-md transition-colors',
                  view === 'list' ? 'bg-secondary text-foreground' : 'text-muted-foreground',
                )}
                aria-label="列表视图"
              >
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {view === 'grid' ? (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {filtered.map((a) => {
              const Icon = typeMeta[a.type].icon
              return (
                <Card
                  key={a.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelected(a)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setSelected(a)
                    }
                  }}
                  className="group cursor-pointer overflow-hidden p-0 transition-all hover:border-primary/40 hover:shadow-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    <Image
                      src={a.cover || '/placeholder.svg'}
                      alt={a.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-background/80 px-1.5 py-0.5 text-xs backdrop-blur">
                      <Icon className={cn('size-3.5', typeMeta[a.type].color)} />
                      {a.type}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleStar(a.id)
                      }}
                      aria-label={isStarred(a.id) ? '取消收藏' : '收藏'}
                      aria-pressed={isStarred(a.id)}
                      className="absolute right-2 top-2 grid size-6 place-items-center rounded-md bg-background/80 backdrop-blur transition-transform hover:scale-110 active:scale-90"
                    >
                      <Star
                        className={cn(
                          'size-3.5 transition-colors',
                          isStarred(a.id)
                            ? 'fill-chart-4 text-chart-4'
                            : 'text-muted-foreground',
                        )}
                      />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-medium">{a.title}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {a.tags.map((t) => (
                        <Badge key={t} variant="muted" className="px-1.5 py-0 text-[11px]">
                          {t}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-2.5 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {a.updatedAt}
                      </span>
                      <span>{a.size}</span>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="mt-5 overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">名称</th>
                  <th className="px-4 py-3 font-medium">类型</th>
                  <th className="px-4 py-3 font-medium">标签</th>
                  <th className="px-4 py-3 font-medium">大小</th>
                  <th className="px-4 py-3 font-medium">更新时间</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => {
                  const Icon = typeMeta[a.type].icon
                  return (
                    <tr
                      key={a.id}
                      onClick={() => setSelected(a)}
                      className="cursor-pointer border-b border-border/60 last:border-0 transition-colors hover:bg-secondary/40"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-secondary">
                            <Image
                              src={a.cover || '/placeholder.svg'}
                              alt={a.title}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                          <span className="font-medium">{a.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5">
                          <Icon className={cn('size-4', typeMeta[a.type].color)} />
                          {a.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {a.tags.map((t) => (
                            <Badge key={t} variant="muted" className="px-1.5 py-0 text-[11px]">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{a.size}</td>
                      <td className="px-4 py-3 text-muted-foreground">{a.updatedAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDownload(a.id)
                            }}
                            disabled={downloadingId === a.id}
                            className={cn(
                              'grid size-7 place-items-center rounded-md transition-colors hover:bg-secondary active:scale-90',
                              downloadedId === a.id
                                ? 'text-primary'
                                : 'text-muted-foreground hover:text-foreground',
                            )}
                            aria-label="下载"
                          >
                            {downloadingId === a.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : downloadedId === a.id ? (
                              <CheckCircle2 className="size-4" />
                            ) : (
                              <Download className="size-4" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelected(a)
                            }}
                            className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-90"
                            aria-label="更多"
                          >
                            <MoreVertical className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {selected && (
        <AssetDetail
          asset={selected}
          starred={isStarred(selected.id)}
          downloading={downloadingId === selected.id}
          downloaded={downloadedId === selected.id}
          onToggleStar={() => toggleStar(selected.id)}
          onDownload={() => handleDownload(selected.id)}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

function AssetDetail({
  asset,
  starred,
  downloading,
  downloaded,
  onToggleStar,
  onDownload,
  onClose,
}: {
  asset: Asset
  starred: boolean
  downloading: boolean
  downloaded: boolean
  onToggleStar: () => void
  onDownload: () => void
  onClose: () => void
}) {
  const Icon = typeMeta[asset.type].icon
  const meta = [
    { icon: Tag, label: '类型', value: asset.type },
    { icon: HardDrive, label: '大小', value: asset.size },
    { icon: Clock, label: '更新时间', value: asset.updatedAt },
    { icon: Sparkles, label: '来源', value: 'AI 生成引擎' },
  ]
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="asset-detail-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-border bg-card shadow-2xl sm:rounded-2xl md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Preview */}
        <div className="relative aspect-[4/3] w-full shrink-0 bg-secondary md:aspect-auto md:w-1/2">
          <Image src={asset.cover || '/placeholder.svg'} alt={asset.title} fill className="object-cover" />
          <div className="absolute left-3 top-3 flex items-center gap-1 rounded-md bg-background/80 px-2 py-1 text-xs backdrop-blur">
            <Icon className={cn('size-3.5', typeMeta[asset.type].color)} />
            {asset.type}
          </div>
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start gap-2 border-b border-border p-5">
            <div className="min-w-0 flex-1">
              <h2 id="asset-detail-title" className="text-base font-semibold leading-snug">
                {asset.title}
              </h2>
              <div className="mt-2 flex flex-wrap gap-1">
                {asset.tags.map((t) => (
                  <Badge key={t} variant="muted" className="px-1.5 py-0 text-[11px]">
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="关闭"
              className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-90"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 p-5">
            {meta.map((m) => (
              <div key={m.label} className="rounded-lg border border-border bg-secondary/30 p-3">
                <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <m.icon className="size-3" />
                  {m.label}
                </p>
                <p className="mt-1 truncate text-sm font-medium">{m.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border p-4">
            <Button
              className="h-9 flex-1 gap-1.5 active:scale-95"
              onClick={onDownload}
              disabled={downloading}
            >
              {downloading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  下载中…
                </>
              ) : downloaded ? (
                <>
                  <CheckCircle2 className="size-4" />
                  已下载
                </>
              ) : (
                <>
                  <Download className="size-4" />
                  下载素材
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className={cn('h-9 gap-1.5 active:scale-95', starred && 'border-primary/50 text-primary')}
              onClick={onToggleStar}
            >
              <Star className={cn('size-4', starred && 'fill-chart-4 text-chart-4')} />
              {starred ? '已收藏' : '收藏'}
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 active:scale-95" aria-label="分享">
              <Share2 className="size-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 active:scale-95" aria-label="重命名">
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-destructive hover:text-destructive active:scale-95"
              aria-label="删除"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
