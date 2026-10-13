'use client'

import { useRef, useState } from 'react'
import { CheckCircle2, FileText, Globe, Link2, Loader2, Plus, Trash2, UploadCloud } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Segmented } from '@/components/geo/segmented'
import { cn } from '@/lib/utils'
import { inputClass } from '@/components/knowledge/form-fields'
import {
  formatSize,
  hostOf,
  linkKinds,
  uid,
  type LinkKind,
  type SourceFile,
  type SourceLink,
} from '@/lib/brand-kb'

const ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt,.md'
const MAX_SIZE = 50 * 1024 * 1024

type Updater<T> = (fn: (prev: T[]) => T[]) => void

export function SourceUploader({
  files,
  links,
  onFiles,
  onLinks,
}: {
  files: SourceFile[]
  links: SourceLink[]
  onFiles: Updater<SourceFile>
  onLinks: Updater<SourceLink>
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [fileError, setFileError] = useState('')
  const [url, setUrl] = useState('')
  const [kind, setKind] = useState<LinkKind>('官网')
  const [linkError, setLinkError] = useState('')

  function ingest(list: FileList | File[]) {
    const incoming = Array.from(list)
    const tooBig = incoming.filter((f) => f.size > MAX_SIZE)
    const ok = incoming.filter((f) => f.size <= MAX_SIZE)
    setFileError(tooBig.length ? `${tooBig.map((f) => f.name).join('、')} 超过 50MB，已忽略` : '')
    const added: SourceFile[] = ok.map((f) => ({ id: uid('f'), name: f.name, size: f.size, status: '解析中' }))
    if (!added.length) return
    onFiles((prev) => [...prev, ...added])
    window.setTimeout(() => {
      const ids = new Set(added.map((a) => a.id))
      onFiles((prev) => prev.map((f) => (ids.has(f.id) ? { ...f, status: '已解析' } : f)))
    }, 1400)
  }

  function addLink(e: React.FormEvent) {
    e.preventDefault()
    const raw = url.trim()
    if (!raw) {
      setLinkError('请输入链接地址')
      return
    }
    const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
    try {
      const parsed = new URL(normalized)
      if (!parsed.hostname.includes('.')) throw new Error('invalid')
    } catch {
      setLinkError('链接格式不正确，请检查后重试')
      return
    }
    if (links.some((l) => l.url === normalized)) {
      setLinkError('该链接已添加')
      return
    }
    const added: SourceLink = { id: uid('l'), url: normalized, kind, status: '抓取中' }
    onLinks((prev) => [...prev, added])
    setUrl('')
    setLinkError('')
    window.setTimeout(() => {
      onLinks((prev) => prev.map((l) => (l.id === added.id ? { ...l, status: '已抓取' } : l)))
    }, 1400)
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium">上传品牌文档</p>
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            ingest(e.dataTransfer.files)
          }}
          className={cn(
            'flex flex-col items-center rounded-xl border border-dashed p-5 text-center transition-colors',
            dragging ? 'border-primary bg-primary/10' : 'border-primary/40 bg-primary/5',
          )}
        >
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/12 text-primary">
            <UploadCloud className="size-5" />
          </span>
          <p className="mt-2 text-sm font-semibold">拖拽文件到此处，或点击选择</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            品牌手册、产品参数表、资质专利、官方话术（pdf / docx / xlsx / csv / pptx / txt，单个 ≤ 50MB）
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPT}
            className="sr-only"
            aria-label="选择品牌文档"
            onChange={(e) => {
              if (e.target.files) ingest(e.target.files)
              e.target.value = ''
            }}
          />
          <Button type="button" size="sm" className="mt-3" onClick={() => inputRef.current?.click()}>
            <UploadCloud />
            选择文件
          </Button>
        </div>
        {fileError && (
          <p role="alert" className="text-xs text-amber-400">
            {fileError}
          </p>
        )}
        {files.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {files.map((f) => (
              <li key={f.id} className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2">
                <FileText className="size-4 shrink-0 text-primary" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{f.name}</span>
                  <span className="block font-mono text-[11px] text-muted-foreground">{formatSize(f.size)}</span>
                </span>
                {f.status === '解析中' ? (
                  <Badge variant="warning">
                    <Loader2 className="size-3 animate-spin" />
                    解析中
                  </Badge>
                ) : (
                  <Badge variant="success">
                    <CheckCircle2 className="size-3" />
                    已解析
                  </Badge>
                )}
                <button
                  type="button"
                  onClick={() => onFiles((prev) => prev.filter((x) => x.id !== f.id))}
                  aria-label={`移除文件 ${f.name}`}
                  className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium">官网链接 / 线上文章</p>
        <form onSubmit={addLink} className="flex flex-col gap-2.5 rounded-xl border border-border bg-background/60 p-3">
          <Segmented aria-label="链接类型" value={kind} onChange={setKind} options={linkKinds.map((k) => ({ value: k, label: k }))} />
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  setLinkError('')
                }}
                placeholder="https://www.example.com/about"
                aria-label="链接地址"
                className={cn(inputClass, 'pl-9')}
              />
            </div>
            <Button type="submit" size="lg">
              <Plus />
              添加
            </Button>
          </div>
          {linkError && (
            <p role="alert" className="text-xs text-destructive">
              {linkError}
            </p>
          )}
        </form>
        {links.length > 0 ? (
          <ul className="flex flex-col gap-1.5">
            {links.map((l) => (
              <li key={l.id} className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2">
                <Globe className="size-4 shrink-0 text-accent" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{hostOf(l.url)}</span>
                  <span className="block truncate font-mono text-[11px] text-muted-foreground">{l.url}</span>
                </span>
                <Badge variant="muted">{l.kind}</Badge>
                {l.status === '抓取中' ? (
                  <Badge variant="warning">
                    <Loader2 className="size-3 animate-spin" />
                    抓取中
                  </Badge>
                ) : (
                  <Badge variant="success">
                    <CheckCircle2 className="size-3" />
                    已抓取
                  </Badge>
                )}
                <button
                  type="button"
                  onClick={() => onLinks((prev) => prev.filter((x) => x.id !== l.id))}
                  aria-label={`移除链接 ${hostOf(l.url)}`}
                  className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
            还没有链接。添加官网或权威线上文章，系统会抓取并抽取候选事实。
          </p>
        )}
      </div>
    </div>
  )
}
