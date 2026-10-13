'use client'

import { useEffect, useRef, useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Segmented } from '@/components/geo/segmented'
import type { Brand, BrandKind } from '@/lib/brands'

export function BrandManagerDialog({
  open,
  onClose,
  brands,
  selectedId,
  prefill = '',
  onAdd,
  onRemove,
}: {
  open: boolean
  onClose: () => void
  brands: Brand[]
  selectedId: string | null
  prefill?: string
  onAdd: (brand: Omit<Brand, 'id'>) => string | void
  onRemove: (id: string) => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [name, setName] = useState(prefill)
  const [aliases, setAliases] = useState('')
  const [kind, setKind] = useState<BrandKind>('竞品品牌')
  const [error, setError] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('请输入品牌名称')
      return
    }
    if (brands.some((b) => b.name === trimmed)) {
      setError('该品牌已存在')
      return
    }
    const result = onAdd({
      name: trimmed,
      kind,
      aliases: aliases
        .split(/[,，、]+/)
        .map((s) => s.trim())
        .filter(Boolean),
    })
    if (typeof result === 'string') setError(result)
    else {
      setName('')
      setAliases('')
      setError('')
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose()
      }}
      aria-labelledby="brand-manager-title"
      className="m-auto w-[min(560px,calc(100vw-2rem))] rounded-2xl border border-border bg-card p-0 text-foreground shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-start justify-between gap-4 border-b border-border p-5">
        <div>
          <h3 id="brand-manager-title" className="text-base font-semibold">
            管理品牌
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            添加后即可在“目标品牌”中模糊搜索选择；竞品品牌将用于计算 SOV 声量份额。
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3 border-b border-border p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="brand-name" className="mb-1.5 block text-xs font-medium">
              品牌名称 <span className="text-destructive">*</span>
            </label>
            <input
              id="brand-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              placeholder="如：星河汽车"
              className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/40"
            />
          </div>
          <div>
            <label htmlFor="brand-aliases" className="mb-1.5 block text-xs font-medium">
              别名 / 拼音缩写
            </label>
            <input
              id="brand-aliases"
              value={aliases}
              onChange={(e) => setAliases(e.target.value)}
              placeholder="逗号分隔，如：Xinghe, xhqc"
              className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/40"
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Segmented
            aria-label="品牌类型"
            value={kind}
            onChange={setKind}
            options={[
              { value: '自有品牌', label: '自有品牌' },
              { value: '竞品品牌', label: '竞品品牌' },
            ]}
          />
          <Button type="submit" size="lg">
            <Plus />
            添加品牌
          </Button>
        </div>
        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
      </form>

      <div className="p-5">
        <p className="mb-2 text-xs font-medium text-muted-foreground">品牌库（{brands.length}）</p>
        <ul className="max-h-56 space-y-1.5 overflow-y-auto pr-1">
          {brands.map((b) => (
            <li
              key={b.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/12 text-xs font-bold text-primary">
                {b.name.slice(0, 1)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{b.name}</span>
                {b.aliases.length > 0 && (
                  <span className="block truncate text-[11px] text-muted-foreground">{b.aliases.join(' · ')}</span>
                )}
              </span>
              {b.id === selectedId && <Badge variant="accent">当前目标</Badge>}
              <Badge variant={b.kind === '自有品牌' ? 'default' : 'muted'}>{b.kind}</Badge>
              <button
                type="button"
                onClick={() => onRemove(b.id)}
                aria-label={`删除品牌 ${b.name}`}
                className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end border-t border-border p-4">
        <Button variant="outline" size="lg" onClick={onClose}>
          完成
        </Button>
      </div>
    </dialog>
  )
}
