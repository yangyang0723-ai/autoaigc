import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AppShell } from '@/components/app-shell'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: '车智绘 三期 — GEO 品牌评估与 AI 内容创作平台',
  description:
    '车智绘三期在 AI 内容创作基础上，新增 GEO 品牌评估、多平台交叉报告、需求洞察、品牌知识库与 UGC 信源自动分发，帮助汽车品牌提升在各大 AI 搜索引擎中的可见度。',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0b1220',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} bg-background`}>
      <body suppressHydrationWarning className="font-sans antialiased">
        <AppShell>{children}</AppShell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
