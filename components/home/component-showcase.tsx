import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sparkles, ArrowRight } from 'lucide-react'

const buttonVariants = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const
const badgeVariants = [
  { variant: 'default', label: '默认' },
  { variant: 'accent', label: '强调' },
  { variant: 'muted', label: '中性' },
  { variant: 'success', label: '成功' },
  { variant: 'warning', label: '警告' },
  { variant: 'danger', label: '危险' },
  { variant: 'outline', label: '描边' },
] as const

export function ComponentShowcase() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">设计系统组件</h3>
        <span className="text-xs text-muted-foreground">Button · Badge · Card</span>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>按钮 Button</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {buttonVariants.map((v) => (
                <Button key={v} variant={v} size="sm">
                  {v}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="xs">
                <Sparkles />
                xs
              </Button>
              <Button size="sm">sm</Button>
              <Button size="default">default</Button>
              <Button size="lg">
                lg
                <ArrowRight />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle>徽章 Badge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {badgeVariants.map((b) => (
                <Badge key={b.variant} variant={b.variant}>
                  {b.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Card anatomy */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>卡片 Card</CardTitle>
            <Badge variant="accent">
              <Sparkles className="size-3" />
              示例
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Card 由 CardHeader、CardTitle、CardContent 等部件组合而成，承载页面的主要信息块。
            </p>
            <Button variant="outline" size="sm">
              了解更多
              <ArrowRight />
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
