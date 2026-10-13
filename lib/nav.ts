import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  ImageIcon,
  FileText,
  Clapperboard,
  MessageCircle,
  FolderKanban,
  ScrollText,
  Sparkles,
  Radar,
  GitCompareArrows,
  Telescope,
  Library,
  Share2,
} from 'lucide-react'

export type NavItem = {
  href: string
  label: string
  desc: string
  icon: LucideIcon
  badge?: string
  children?: NavItem[]
}

export type NavGroup = {
  title: string
  items: NavItem[]
}

export const contentChildren: NavItem[] = [
  {
    href: '/content',
    label: '内容创作工作台',
    desc: '数据总览与快捷创作',
    icon: LayoutDashboard,
  },
  {
    href: '/image',
    label: 'AI 图片生成',
    desc: '海报 / 对比图 / 配图',
    icon: ImageIcon,
  },
  {
    href: '/text',
    label: 'AI 图文生成',
    desc: '推文 / 种草 / 详情页',
    icon: FileText,
  },
  {
    href: '/video',
    label: 'AI 视频生成',
    desc: '口播 / 展示 / 切片',
    icon: Clapperboard,
  },
  {
    href: '/moments',
    label: '朋友圈图文',
    desc: '一线销售快速发圈',
    icon: MessageCircle,
  },
  {
    href: '/assets',
    label: '素材资产管理',
    desc: '存储 / 检索 / 协作',
    icon: FolderKanban,
  },
]

export const navGroups: NavGroup[] = [
  {
    title: '概览',
    items: [
      {
        href: '/',
        label: '三期总览',
        desc: 'GEO 品牌可见度驾驶舱',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'GEO 监测与洞察',
    items: [
      {
        href: '/geo',
        label: 'GEO 品牌评估',
        desc: '提及率 / 排名 / 情感倾向',
        icon: Radar,
      },
      {
        href: '/cross-report',
        label: '多平台交叉报告',
        desc: '跨 AI 平台描述差异',
        icon: GitCompareArrows,
      },
      {
        href: '/insights',
        label: '需求洞察',
        desc: '真实意图与蓝海词',
        icon: Telescope,
      },
    ],
  },
  {
    title: '内容与信源',
    items: [
      {
        href: '/knowledge',
        label: '品牌知识库',
        desc: '结构化品牌事实底座',
        icon: Library,
      },
      {
        href: '/content',
        label: 'AI 内容创作',
        desc: '二期 · 图片 / 图文 / 视频',
        icon: Sparkles,
        badge: '二期',
        children: contentChildren,
      },
      {
        href: '/ugc',
        label: 'UGC 信源分发',
        desc: '多平台矩阵自动发布',
        icon: Share2,
      },
    ],
  },
  {
    title: '文档',
    items: [
      {
        href: '/prd',
        label: '车智绘AutoAIGC-PRD-v2.0.md',
        desc: 'PRD v2.0 · 需求与验收',
        icon: ScrollText,
      },
    ],
  },
]

export const flatNav: NavItem[] = navGroups.flatMap((g) =>
  g.items.flatMap((i) => (i.children ? i.children : [i])),
)

export function findParent(href: string): NavItem | undefined {
  return navGroups
    .flatMap((g) => g.items)
    .find((i) => i.children?.some((c) => c.href === href))
}
