import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard,
  ImageIcon,
  FileText,
  Clapperboard,
  Presentation,
  MessageCircle,
  FolderKanban,
  BarChart3,
  ShieldCheck,
  ScrollText,
} from 'lucide-react'

export type NavItem = {
  href: string
  label: string
  desc: string
  icon: LucideIcon
  badge?: string
}

export type NavGroup = {
  title: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    title: '概览',
    items: [
      {
        href: '/',
        label: '工作台',
        desc: '数据总览与快捷创作',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: '五大生成引擎',
    items: [
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
        href: '/ppt',
        label: 'AI PPT 生成',
        desc: '发布会 / 培训 / 汇报',
        icon: Presentation,
      },
      {
        href: '/moments',
        label: '朋友圈图文',
        desc: '一线销售快速发圈',
        icon: MessageCircle,
      },
    ],
  },
  {
    title: '资产与数据',
    items: [
      {
        href: '/assets',
        label: '素材资产管理',
        desc: '存储 / 检索 / 协作',
        icon: FolderKanban,
      },
      {
        href: '/analytics',
        label: '数据分析中台',
        desc: '效果追踪与优化',
        icon: BarChart3,
      },
    ],
  },
  {
    title: '合规中心',
    items: [
      {
        href: '/knowledge',
        label: '知识库',
        desc: '规则 / 敏感词 / 行业规范',
        icon: ShieldCheck,
        badge: '合规',
      },
    ],
  },
  {
    title: '文档',
    items: [
      {
        href: '/prd',
        label: '产品需求文档',
        desc: 'PRD · 需求与验收',
        icon: ScrollText,
      },
    ],
  },
]

export const flatNav: NavItem[] = navGroups.flatMap((g) => g.items)
