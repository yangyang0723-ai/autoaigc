'use client'

import { Check } from 'lucide-react'
import { platforms } from '@/lib/geo-data'
import { cn } from '@/lib/utils'

const vendors: Record<string, string> = {
  deepseek: '深度求索',
  doubao: '字节跳动',
  qwen: '阿里云',
  wenxin: '百度',
  kimi: '月之暗面',
  yuanbao: '腾讯',
}

export function PlatformPicker({
  value,
  onChange,
}: {
  value: string[]
  onChange: (next: string[]) => void
}) {
  const allSelected = value.length === platforms.length

  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id])
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground" role="status">
          已选 <span className="font-mono text-foreground">{value.length}</span> / {platforms.length} 个平台，可同时选择多个
        </p>
        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => onChange(allSelected ? [] : platforms.map((p) => p.id))}
            className="rounded-md px-2 py-1 font-medium text-primary hover:bg-primary/10"
          >
            {allSelected ? '取消全选' : '全选'}
          </button>
          {value.length > 0 && !allSelected && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              清空
            </button>
          )}
        </div>
      </div>

      <div role="group" aria-label="检测平台" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {platforms.map((p) => {
          const checked = value.includes(p.id)
          return (
            <label key={p.id} className="relative block cursor-pointer">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(p.id)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  'flex h-full flex-col gap-1 rounded-xl border p-3.5 transition-colors',
                  'peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50',
                  checked
                    ? 'border-primary/60 bg-primary/10'
                    : 'border-border bg-background hover:border-primary/30 hover:bg-muted/40',
                )}
              >
                <span className="flex items-center justify-between">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-sm font-bold text-foreground">
                    {p.name.slice(0, 1)}
                  </span>
                  <span
                    className={cn(
                      'flex size-5 items-center justify-center rounded-md border transition-colors',
                      checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
                    )}
                  >
                    {checked && <Check className="size-3.5" strokeWidth={3} />}
                  </span>
                </span>
                <span className="mt-1.5 text-sm font-semibold">{p.name}</span>
                <span className="text-[11px] text-muted-foreground">{vendors[p.id]}</span>
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
