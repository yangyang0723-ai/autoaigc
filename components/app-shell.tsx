'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { navGroups, flatNav } from '@/lib/nav'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Car,
  Search,
  Bell,
  Plus,
  Sparkles,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground glow-primary">
        <Car className="size-5" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-bold tracking-wide">车智绘</span>
        <span className="text-[10px] text-muted-foreground">AutoAIGC Platform</span>
      </span>
    </Link>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const current = flatNav.find((n) =>
    n.href === '/' ? pathname === '/' : pathname.startsWith(n.href),
  )

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'sticky top-0 hidden h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200 md:flex',
          collapsed ? 'w-[76px]' : 'w-64',
        )}
      >
        <div className="flex h-16 items-center border-b border-sidebar-border px-4">
          {collapsed ? (
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground glow-primary">
              <Car className="size-5" />
            </span>
          ) : (
            <Logo />
          )}
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {navGroups.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {group.title}
                </p>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const active =
                    item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
                  const Icon = item.icon
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={item.label}
                        className={cn(
                          'group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors',
                          active
                            ? 'bg-primary/15 text-primary'
                            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                        )}
                      >
                        <Icon
                          className={cn(
                            'size-[18px] shrink-0',
                            active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                          )}
                        />
                        {!collapsed && (
                          <span className="flex flex-1 flex-col">
                            <span className="font-medium leading-tight">{item.label}</span>
                            <span className="text-[11px] text-muted-foreground">{item.desc}</span>
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg bg-sidebar-accent px-2.5 py-2',
              collapsed && 'justify-center',
            )}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
              张
            </span>
            {!collapsed && (
              <div className="flex flex-1 flex-col leading-tight">
                <span className="text-sm font-medium">张经理</span>
                <span className="text-[11px] text-muted-foreground">市场部 · 旗舰版</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-5 backdrop-blur-xl">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            onClick={() => setCollapsed((c) => !c)}
            aria-label="切换侧边栏"
          >
            {collapsed ? <PanelLeft className="size-5" /> : <PanelLeftClose className="size-5" />}
          </Button>

          <div className="flex flex-col">
            <h1 className="text-base font-semibold leading-tight">{current?.label ?? '工作台'}</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">{current?.desc}</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground lg:flex">
              <Search className="size-4" />
              <span className="pr-8">搜索素材、模板、车型…</span>
              <kbd className="rounded border border-border bg-muted px-1.5 text-[10px]">⌘K</kbd>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="通知"
              className="relative transition-transform active:scale-90"
            >
              <Bell className="size-5" />
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-accent" />
            </Button>
            <Button
              className="gap-1.5 h-9 px-3 transition-transform active:scale-95"
              onClick={() => router.push('/image')}
            >
              <Plus className="size-4" />
              新建创作
            </Button>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
