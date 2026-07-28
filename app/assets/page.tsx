'use client'

import { useMemo, useState } from 'react'
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

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      const matchType = typeFilter === '全部' || a.type === typeFilter
      const matchQuery = a.title.includes(query) || a.tags.some((t) => t.includes(query))
      return matchType && matchQuery
    })
  }, [typeFilter, query])

  return (
    <div className="flex gap-6">
      {/* Folder rail */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">素材库</h2>
          <button
            className="grid size-7 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary"
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
              <Button variant="outline" className="h-9 gap-1.5 px-3">
                <FolderPlus className="size-4" />
                新建文件夹
              </Button>
              <Button className="h-9 gap-1.5 px-3">
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
                  className="group overflow-hidden p-0 transition-colors hover:border-primary/40"
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
                    {a.starred && (
                      <div className="absolute right-2 top-2 grid size-6 place-items-center rounded-md bg-background/80 backdrop-blur">
                        <Star className="size-3.5 fill-chart-4 text-chart-4" />
                      </div>
                    )}
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
                      className="border-b border-border/60 last:border-0 transition-colors hover:bg-secondary/40"
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
                            className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                            aria-label="下载"
                          >
                            <Download className="size-4" />
                          </button>
                          <button
                            className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
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
    </div>
  )
}
