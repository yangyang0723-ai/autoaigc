'use client'

import { useState } from 'react'
import { CalendarClock, Check, X, Hash, Clock3, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Segmented } from '@/components/geo/segmented'
import { cn } from '@/lib/utils'

type Stage = '草稿预审' | '已定时' | '发布中' | '已发布'
type Job = { id: number; title: string; platform: string; account: string; time: string; stage: Stage }

const initialJobs: Job[] = [
  { id: 1, title: '三十万内纯电 SUV 怎么选？一份不踩坑清单', platform: '小红书', account: '星河车主说', time: '今天 19:30', stage: '草稿预审' },
  { id: 2, title: '冬季续航缩水真相：实测 5 款纯电 SUV', platform: '知乎', account: '新能源老张', time: '明天 12:00', stage: '草稿预审' },
  { id: 3, title: '带娃出行选车指南：空间与安全怎么权衡', platform: '公众号', account: '星河汽车官方', time: '周三 08:00', stage: '草稿预审' },
  { id: 4, title: '800V 超充到底快在哪？一分钟看懂', platform: '抖音', account: '星河小智', time: '今天 21:00', stage: '已定时' },
  { id: 5, title: '星河 S7 真实车主三个月用车报告', platform: '小红书', account: '通勤日记', time: '明天 10:30', stage: '已定时' },
  { id: 6, title: '增程还是纯电？按用车场景给你答案', platform: '知乎', account: '车评人阿木', time: '周三 20:00', stage: '已定时' },
  { id: 7, title: '电池安全五重防护，工程师这样解读', platform: '公众号', account: '星河汽车官方', time: '周四 08:00', stage: '已定时' },
  { id: 8, title: '冬天开电车去东北需要注意什么', platform: '抖音', account: '路上的星河', time: '正在发布', stage: '发布中' },
  { id: 9, title: '星河 S7 vs 同级竞品：参数与体验对照', platform: '知乎', account: '新能源老张', time: '昨天 12:00', stage: '已发布' },
  { id: 10, title: '家庭第二辆车，我为什么选了纯电 SUV', platform: '小红书', account: '星河车主说', time: '昨天 19:30', stage: '已发布' },
  { id: 11, title: '一图看懂星河 S7 配置与价格', platform: '公众号', account: '星河汽车官方', time: '周一 08:00', stage: '已发布' },
]

const stages: Stage[] = ['草稿预审', '已定时', '发布中', '已发布']
const stageVariant: Record<Stage, 'warning' | 'default' | 'accent' | 'success'> = {
  草稿预审: 'warning',
  已定时: 'default',
  发布中: 'accent',
  已发布: 'success',
}

type Account = {
  platform: string
  name: string
  persona: string
  fans: string
  state: '正常' | '限流' | '待授权'
  plan: number
  index: string
}

const accounts: Account[] = [
  { platform: '小红书', name: '星河车主说', persona: '真实车主 · 用车日记', fans: '8.2 万', state: '正常', plan: 6, index: '78%' },
  { platform: '小红书', name: '通勤日记', persona: '城市通勤 · 效率向', fans: '3.6 万', state: '正常', plan: 4, index: '71%' },
  { platform: '小红书', name: '亲子出行手册', persona: '家庭用户 · 亲子场景', fans: '5.1 万', state: '限流', plan: 3, index: '54%' },
  { platform: '知乎', name: '新能源老张', persona: '行业答主 · 深度测评', fans: '12.4 万', state: '正常', plan: 5, index: '86%' },
  { platform: '知乎', name: '车评人阿木', persona: '对比选型 · 数据派', fans: '6.8 万', state: '正常', plan: 4, index: '82%' },
  { platform: '抖音', name: '星河小智', persona: '品牌官方 · 科普口播', fans: '21.7 万', state: '正常', plan: 7, index: '63%' },
  { platform: '抖音', name: '路上的星河', persona: '场景实拍 · 冬季/长途', fans: '9.3 万', state: '待授权', plan: 0, index: '—' },
  { platform: '公众号', name: '星河汽车官方', persona: '品牌官方 · 深度图文', fans: '34.5 万', state: '正常', plan: 3, index: '91%' },
  { platform: '公众号', name: '星河车主会', persona: '车主社群 · 活动资讯', fans: '4.9 万', state: '正常', plan: 2, index: '68%' },
]

const stateVariant = { 正常: 'success', 限流: 'warning', 待授权: 'danger' } as const

const adaptations = [
  {
    platform: '小红书',
    title: '三十万内纯电 SUV 怎么选？一份不踩坑清单',
    form: '种草笔记 · 9 图',
    length: '正文 ≤ 800 字',
    tone: '真实口语，第一人称体验',
    snippet: '去年换车对比了 6 款，整理了我自己的 5 条选车标准：续航口径、补能速度、家庭空间……',
    tags: ['#纯电SUV', '#选车攻略', '#家用车推荐'],
  },
  {
    platform: '知乎',
    title: '30 万以内的纯电中大型 SUV 有哪些值得推荐？',
    form: '回答体 · 图表 + 引用',
    length: '正文 1,800 字左右',
    tone: '专业客观，结构化小标题',
    snippet: '结论先行：按综合表现推荐三款。下面从续航、补能、智能化、保值四个维度逐一拆解，数据来源均已标注……',
    tags: ['新能源汽车', '购车指南', '电动汽车'],
  },
  {
    platform: '抖音',
    title: '30 万内纯电 SUV，别急着下单',
    form: '口播短视频 · 60 秒',
    length: '脚本 220 字 · 15 秒钩子',
    tone: '节奏快，强结论，强对比',
    snippet: '开头 3 秒抛问题：“预算 30 万，纯电 SUV 到底怎么选？” 中段三点对比，结尾引导评论区提问。',
    tags: ['#纯电SUV', '#买车必看', '#新能源'],
  },
  {
    platform: '公众号',
    title: '一份写给家庭用户的纯电 SUV 选购手册（2026 版）',
    form: '深度图文 · 头图 + 配图',
    length: '正文 2,500 字左右',
    tone: '品牌口吻，权威可信',
    snippet: '本文基于官方参数与第三方测评整理，涵盖续航、补能、安全、空间与全生命周期成本……',
    tags: ['购车手册', '新能源', '品牌观点'],
  },
]

export function UgcBoard() {
  const [tab, setTab] = useState<'queue' | 'accounts' | 'adapt'>('queue')
  const [jobs, setJobs] = useState(initialJobs)
  const [adaptPlatform, setAdaptPlatform] = useState('小红书')

  const approve = (id: number) =>
    setJobs((js) => js.map((j) => (j.id === id ? { ...j, stage: '已定时' as Stage } : j)))
  const reject = (id: number) => setJobs((js) => js.filter((j) => j.id !== id))

  const adapt = adaptations.find((a) => a.platform === adaptPlatform) ?? adaptations[0]

  return (
    <div className="flex flex-col gap-4">
      <Segmented
        value={tab}
        onChange={setTab}
        aria-label="视图切换"
        options={[
          { value: 'queue', label: '发布队列' },
          { value: 'accounts', label: '账号矩阵' },
          { value: 'adapt', label: '分平台差异化' },
        ]}
      />

      {tab === 'queue' && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stages.map((s) => {
            const items = jobs.filter((j) => j.stage === s)
            return (
              <div key={s} className="flex flex-col gap-3 rounded-xl border border-border bg-background p-3">
                <div className="flex items-center justify-between px-1">
                  <Badge variant={stageVariant[s]}>{s}</Badge>
                  <span className="font-mono text-xs text-muted-foreground">{items.length}</span>
                </div>
                {items.map((j) => (
                  <div key={j.id} className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline">{j.platform}</Badge>
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock3 className="size-3" />
                        {j.time}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-sm font-medium leading-snug">{j.title}</p>
                    <p className="text-[11px] text-muted-foreground">账号：{j.account}</p>
                    {s === '草稿预审' && (
                      <div className="flex gap-2 pt-1">
                        <Button size="sm" className="flex-1" onClick={() => approve(j.id)}>
                          <Check />
                          通过并定时
                        </Button>
                        <Button size="icon-sm" variant="destructive" aria-label="驳回草稿" onClick={() => reject(j.id)}>
                          <X />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="py-6 text-center text-xs text-muted-foreground">暂无内容</p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {tab === 'accounts' && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-medium">平台</th>
                <th className="px-3 py-2 font-medium">账号</th>
                <th className="px-3 py-2 font-medium">定位 / 人设</th>
                <th className="px-3 py-2 text-right font-medium">粉丝</th>
                <th className="px-3 py-2 font-medium">状态</th>
                <th className="px-3 py-2 text-right font-medium">本周计划</th>
                <th className="py-2 pl-3 text-right font-medium">收录率</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr key={a.name} className="border-b border-border/60 last:border-0">
                  <td className="py-3 pr-3">
                    <Badge variant="outline">{a.platform}</Badge>
                  </td>
                  <td className="px-3 py-3 font-medium">{a.name}</td>
                  <td className="px-3 py-3 text-muted-foreground">{a.persona}</td>
                  <td className="px-3 py-3 text-right font-mono">{a.fans}</td>
                  <td className="px-3 py-3">
                    <Badge variant={stateVariant[a.state]}>{a.state}</Badge>
                  </td>
                  <td className="px-3 py-3 text-right font-mono">{a.plan} 篇</td>
                  <td className="py-3 pl-3 text-right font-mono">{a.index}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'adapt' && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="muted">
              <FileText className="size-3" />
              同一主题 · 一次创作，分平台改写
            </Badge>
            <Segmented
              value={adaptPlatform}
              onChange={setAdaptPlatform}
              aria-label="目标平台"
              options={adaptations.map((a) => ({ value: a.platform, label: a.platform }))}
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-xl border border-border bg-background p-4 lg:col-span-2">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                {adapt.platform} 版本
              </p>
              <h4 className="mt-2 text-balance text-lg font-semibold">{adapt.title}</h4>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{adapt.snippet}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {adapt.tags.map((t) => (
                  <Badge key={t} variant="default">
                    <Hash className="size-3" />
                    {t.replace('#', '')}
                  </Badge>
                ))}
              </div>
            </div>
            <dl className="space-y-3 rounded-xl border border-border bg-background p-4 text-sm">
              {(
                [
                  ['内容形式', adapt.form],
                  ['篇幅规范', adapt.length],
                  ['语气风格', adapt.tone],
                ] as const
              ).map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="mt-0.5 font-medium">{v}</dd>
                </div>
              ))}
              <Button className="w-full">
                <CalendarClock />
                加入发布队列
              </Button>
            </dl>
          </div>
        </div>
      )}
    </div>
  )
}
