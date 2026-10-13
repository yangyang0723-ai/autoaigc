import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function PageHero({
  module,
  title,
  desc,
  icon: Icon,
  children,
}: {
  module: string
  title: string
  desc: string
  icon: LucideIcon
  children?: React.ReactNode
}) {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-card grid-bg">
      <div className="absolute inset-0 bg-gradient-to-r from-card via-card/85 to-transparent" />
      <div className="relative flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between lg:p-7">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground glow-primary">
            <Icon className="size-6" />
          </span>
          <div className="max-w-2xl">
            <Badge variant="accent" className="mb-2">
              {module}
            </Badge>
            <h2 className="text-balance text-xl font-bold lg:text-2xl">{title}</h2>
            <p className="mt-1.5 text-pretty text-sm leading-relaxed text-muted-foreground">{desc}</p>
          </div>
        </div>
        {children && <div className="flex flex-wrap items-center gap-2.5">{children}</div>}
      </div>
    </section>
  )
}
