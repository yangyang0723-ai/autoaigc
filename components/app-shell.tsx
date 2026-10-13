'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { navGroups, flatNav, findParent, type NavItem } from '@/lib/nav'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Car,
  Search,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
  Building2,
} from 'lucide-react'

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground glow-primary">
        <Car className="size-5" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-bold tracking-wide">车智绘</span>
        <span className="text-[10px] text-muted-foreground">AutoAIGC · 三期 GEO</span>
      </span>
    </Link>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [open, setOpen] = useState<Record<string, boolean>>({ '/content': true })

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')

  const current = flatNav.find((n) => isActive(n.href))
  const parent = current ? findParent(current.href) : undefined

  const rowClass = (active: boolean) =>
    cn(
      'group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
      active
        ? 'bg-primary/15 text-primary'
        : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground',
    )

  const renderIcon = (item: NavItem, active: boolean) => {
    const Icon = item.icon
    return (
      <Icon
        className={cn(
          'size-[18px] shrink-0',
          active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
        )}
      />
    )
  }

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
                  if (item.children) {
                    const groupActive = item.children.some((c) => isActive(c.href))
                    const expanded = open[item.href] ?? false

                    if (collapsed) {
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            title={item.label}
                            className={cn(rowClass(groupActive), 'justify-center')}
                          >
                            {renderIcon(item, groupActive)}
                          </Link>
                        </li>
                      )
                    }

                    return (
                      <li key={item.href}>
                        <button
                          type="button"
                          aria-expanded={expanded}
                          onClick={() => setOpen((s) => ({ ...s, [item.href]: !expanded }))}
                          className={rowClass(groupActive && !expanded)}
                        >
                          {renderIcon(item, groupActive)}
                          <span className="flex flex-1 flex-col">
                            <span className="flex items-center gap-1.5 font-medium leading-tight">
                              {item.label}
                              {item.badge && (
                                <Badge variant="accent" className="px-1.5 py-0 text-[10px]">
                                  {item.badge}
                                </Badge>
                              )}
                            </span>
                            <span className="text-[11px] text-muted-foreground">{item.desc}</span>
                          </span>
                          <ChevronDown
                            className={cn(
                              'size-4 shrink-0 text-muted-foreground transition-transform',
                              expanded && 'rotate-180',
                            )}
                          />
                        </button>
                        {expanded && (
                          <ul className="ml-[18px] mt-1 space-y-0.5 border-l border-sidebar-border pl-2">
                            {item.children.map((child) => {
                              const active = isActive(child.href)
                              return (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    className={cn(
                                      'flex items-center gap-2.5 rounded-md px-2 py-1.5 text-[13px] transition-colors',
                                      active
                                        ? 'bg-primary/15 text-primary'
                                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                                    )}
                                  >
                                    <child.icon className="size-4 shrink-0" />
                                    {child.label}
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </li>
                    )
                  }

                  const active = isActive(item.href)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={item.label}
                        className={rowClass(active)}
                      >
                        {renderIcon(item, active)}
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

          <div className="flex min-w-0 flex-col">
            {parent && (
              <span className="text-[11px] leading-tight text-muted-foreground">{parent.label}</span>
            )}
            <h1 className="truncate text-base font-semibold leading-tight">
              {current?.label ?? '三期总览'}
            </h1>
          </div>
          <p className="hidden text-xs text-muted-foreground xl:block">{current?.desc}</p>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm sm:flex">
              <Building2 className="size-4 text-primary" />
              <span className="font-medium">星河汽车</span>
              <span className="text-xs text-muted-foreground">新能源中大型 SUV</span>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </div>
            <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground xl:flex">
              <Search className="size-4" />
              <span className="pr-6">搜索品牌词、平台、素材…</span>
              <kbd className="rounded border border-border bg-muted px-1.5 text-[10px]">⌘K</kbd>
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
