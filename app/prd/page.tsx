'use client'

import { useEffect, useState } from 'react'
import {
  ScrollText,
  LayoutDashboard,
  ImageIcon,
  FileText,
  Clapperboard,
  Presentation,
  MessageCircle,
  FolderKanban,
  ShieldCheck,
  Layers,
  Gauge,
  Target,
  GitBranch,
  AlertTriangle,
  ServerCog,
  Sparkles,
  Workflow,
  ArrowDown,
  CheckCircle2,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type FR = { id: string; title: string; desc: string }
type Module = {
  id: string
  code: string
  route: string
  title: string
  desc: string
  icon: LucideIcon
  frs: FR[]
  acceptance: string
}

const meta = {
  version: 'v2.0 · 全量重写',
  status: 'v1.x 已作废',
  product: '车智绘 AutoAIGC',
}

const overview = {
  purpose:
    '车智绘（AutoAIGC）是面向汽车主机厂、经销商集团与一线销售的 AIGC 内容生产平台，通过「五大生成引擎 + 素材资产 + 合规知识库」，将图片、图文、视频、PPT、朋友圈内容的生产周期从小时级压缩到分钟级。五大生成引擎统一采用可追踪、可恢复的工作流模式，按节点传递上下文并在完成前执行硬约束与合规校验。',
  roles: [
    { role: '品牌 / 市场经理', need: '批量高质量产出、数据洞察、风险可控' },
    { role: '内容运营', need: '高效、模板化、多平台一键适配' },
    { role: '一线销售顾问', need: '极简操作、快速成稿、带专属二维码' },
    { role: '合规 / 法务', need: '广告法 / 价格法 / 平台规则自动拦截' },
  ],
}

const navRows = [
  { group: '概览', module: '工作台', route: '/', icon: LayoutDashboard },
  { group: '五大生成引擎', module: 'AI 图片生成', route: '/image', icon: ImageIcon },
  { group: '五大生成引擎', module: 'AI 图文生成', route: '/text', icon: FileText },
  { group: '五大生成引擎', module: 'AI 视频生成', route: '/video', icon: Clapperboard },
  { group: '五大生成引擎', module: 'AI PPT 生成', route: '/ppt', icon: Presentation },
  { group: '五大生成引擎', module: '朋友圈图文', route: '/moments', icon: MessageCircle },
  { group: '资产与数据', module: '素材资产管理', route: '/assets', icon: FolderKanban },

  { group: '合规中心', module: '知识库', route: '/knowledge', icon: ShieldCheck },
]

const modules: Module[] = [
  {
    id: 'home',
    code: 'FR-HOME',
    route: '/',
    title: '工作台',
    desc: '产品首页，聚合总览与快捷入口。',
    icon: LayoutDashboard,
    frs: [
      { id: 'FR-HOME-001', title: '平台概览 Hero', desc: '展示平台定位与「开始创作」主 CTA，带点击反馈并跳转。' },
      { id: 'FR-HOME-002', title: '五大生成引擎入口', desc: '卡片陈列五大引擎，hover 抬升 + 发光，点击进入对应引擎。' },
      { id: 'FR-HOME-003', title: '关键指标概览', desc: '以卡片呈现生成量、耗时、通过率、复用率等核心数据摘要。' },
      { id: 'FR-HOME-004', title: '近 7 天生成趋势', desc: '按自然日聚合、无数据日补 0；卡片占满工作台主内容网格整行，图表使用 100% 宽度响应式填充。' },
    ],
    acceptance: '所有卡片与按钮可点击并有反馈；引擎卡片按类型正确路由；近 7 天趋势卡片占满主内容宽度且图表响应式填充；图表无数据时展示占位。',
  },
  {
    id: 'image',
    code: 'FR-IMG',
    route: '/image',
    title: 'AI 图片生成',
    desc: '生成汽车营销海报、车型对比图、场景配图。',
    icon: ImageIcon,
    frs: [
      { id: 'FR-IMG-001', title: '创意描述输入', desc: '支持文本 Prompt 输入，描述期望画面。' },
      { id: 'FR-IMG-002', title: '视觉风格选择', desc: '科技感 / 写实商业 / 运动动感 / 豪华质感 / 国潮插画，Chip 单选。' },
      { id: 'FR-IMG-003', title: '导出比例选择', desc: '1:1、16:9、9:16、3:4、2.35:1，映射到固定输出尺寸。' },
      { id: 'FR-IMG-004', title: '生成数量控制', desc: '1–8 张，超出范围返回 INVALID_INPUT。' },
      { id: 'FR-IMG-005', title: '生成结果网格', desc: '网格展示候选图，点击选中，选中态描边高亮。' },
      { id: 'FR-IMG-006', title: '图片操作', desc: '每张图支持收藏 / 放大 / 下载，均有点击反馈。' },
      { id: 'FR-IMG-007', title: '生成过程动效', desc: '按解析描述 → 匹配风格 → 扩散生成 → 超分出图四阶段渲染。' },
    ],
    acceptance: '参数为单选且状态清晰；按工作流节点展示生成进度并支持失败节点重试；输出数量等于 count、尺寸符合所选比例；选中图片高亮且操作均有反馈。',
  },
  {
    id: 'text',
    code: 'FR-TXT',
    route: '/text',
    title: 'AI 图文生成',
    desc: '生成公众号推文、小红书种草、商品详情页图文。',
    icon: FileText,
    frs: [
      { id: 'FR-TXT-001', title: '智能选题推荐', desc: '基于购车旅程、平台、车型事实和爆款关键词推荐选题，支持刷新并回填标题。' },
      { id: 'FR-TXT-002', title: '手动标题输入', desc: '可直接输入自定义标题替代推荐选题。' },
      { id: 'FR-TXT-003', title: '专业知识注入', desc: '正文中车型参数标注「数据来源：车型数据库」。' },
      { id: 'FR-TXT-004', title: '平台与风格参数', desc: '平台（公众号 / 小红书 / 微博 / 知乎）、语气、字数、配图尺寸四组参数。' },
      { id: 'FR-TXT-005', title: '长尾关键词建议', desc: '展示推荐长尾关键词，服务于内容选题与平台表达，点击可复制并带反馈。' },
      { id: 'FR-TXT-006', title: '图文混排预览', desc: '正文与配图按所选配图尺寸渲染。' },
      { id: 'FR-TXT-007', title: '一键复制', desc: '复制正文，带「已复制」反馈。' },
      { id: 'FR-TXT-008', title: '生成过程动效', desc: '按解析选题 → 生成大纲 → 撰写正文 → 优化标签配图四阶段渲染。' },
    ],
    acceptance: '复制 / 转换 / 关键词均有反馈；工作流按节点传递选题、事实与正文结果，失败节点可重试；事实资料来源清晰；尺寸切换实时改变配图比例；不提供 SEO 评分与优化结果。',
  },
  {
    id: 'video',
    code: 'FR-VID',
    route: '/video',
    title: 'AI 视频生成',
    desc: '生成数字人口播、车型展示、直播切片等短视频。',
    icon: Clapperboard,
    frs: [
      { id: 'FR-VID-001', title: 'AI 脚本生成', desc: '输入视频主题或完整脚本。' },
      { id: 'FR-VID-002', title: '视频类型选择', desc: '新车宣传片 / 卖点讲解 / 门店探店 / 促销快剪，Chip 单选。' },
      { id: 'FR-VID-003', title: '数字人形象与音色', desc: '选择数字人形象与配音音色组合。' },
      { id: 'FR-VID-004', title: '视频尺寸选择', desc: '横版 16:9 / 竖版 9:16 / 方形 1:1，驱动主预览与渲染画布比例。' },
      { id: 'FR-VID-005', title: '时长控制', desc: '15–60 秒，超出范围返回 INVALID_INPUT。' },
      { id: 'FR-VID-006', title: '主预览与播放控制', desc: '主预览按所选尺寸渲染，支持播放 / 暂停切换。' },
      { id: 'FR-VID-007', title: '直播回放上传与切片', desc: '上传直播回放自动解析高光切片，带「已生成 N 条切片」反馈。' },
      { id: 'FR-VID-008', title: '智能分镜时间轴', desc: '固定 4 镜头缩略图展示，点击切换预览镜头。' },
      { id: 'FR-VID-009', title: '一键成片渲染过程', desc: '按解析脚本 → 智能分镜 → 数字人口播 → 卡点合成四阶段渲染。' },
    ],
    acceptance: '工作流按节点传递脚本、分镜、音频与视频片段，节点状态可追踪且失败可重试；尺寸切换后预览比例正确；分镜时长之和等于目标时长；字幕与口播逐句对应；视频变体 A/B 不在本期范围。',
  },
  {
    id: 'ppt',
    code: 'FR-PPT',
    route: '/ppt',
    title: 'AI PPT 生成',
    desc: '生成发布会、培训、汇报类演示文稿。',
    icon: Presentation,
    frs: [
      { id: 'FR-PPT-001', title: '智能大纲生成', desc: '输入汇报主题与应用场景，生成分页大纲结构。' },
      { id: 'FR-PPT-002', title: '模板选择', desc: '科技蓝 / 商务金 / 极简白 / 国潮红，Chip 单选。' },
      { id: 'FR-PPT-003', title: '页数控制', desc: '3–20 页，超出范围返回 INVALID_INPUT。' },
      { id: 'FR-PPT-004', title: '幻灯片预览与翻页', desc: '主画布按页渲染，支持缩略图翻页切换。' },
      { id: 'FR-PPT-005', title: '演示模式', desc: '进入 / 退出演示态，画布显示「演示中」标记。' },
      { id: 'FR-PPT-006', title: '导出', desc: '导出 PPTX / PDF，带加载态与「已导出」反馈。' },
      { id: 'FR-PPT-007', title: '一键生成渲染过程', desc: '按解析主题 → 编排大纲 → 套用模板 → 数据可视化四阶段渲染。' },
    ],
    acceptance: '工作流按节点传递主题、大纲、模板与页面数据，结果可恢复并在持久化后导出；生成页数等于所选页数；缩略图翻页、演示切换、导出反馈均生效；图表缺少数据时标记「待补充」而非伪造数值。',
  },
  {
    id: 'moments',
    code: 'FR-MOM',
    route: '/moments',
    title: '朋友圈图文',
    desc: '面向一线销售的极简发圈工具。',
    icon: MessageCircle,
    frs: [
      { id: 'FR-MOM-001', title: '极简 3 步生成', desc: '选场景 → 选图片 → 一键生成，步骤条可视化。' },
      { id: 'FR-MOM-002', title: '场景与人设选择', desc: '场景由每日内容日历自动推荐，人设风格 Chip 单选。' },
      { id: 'FR-MOM-003', title: '配图选择与上传', desc: '从素材库选图或本地上传。' },
      { id: 'FR-MOM-004', title: '配图尺寸选择', desc: '方图 1:1 / 竖图 3:4 / 横图 4:3，驱动手机预览九宫格比例。' },
      { id: 'FR-MOM-005', title: '水印与二维码', desc: '可勾选个人二维码 / 品牌 Logo / 水印位置，与预览联动。' },
      { id: 'FR-MOM-006', title: '手机朋友圈实时预览', desc: '手机 mockup 展示头像、文案、九宫格配图、时间与点赞。' },
      { id: 'FR-MOM-007', title: '点赞交互', desc: '预览内点赞可切换（红心 + 计数）。' },
      { id: 'FR-MOM-008', title: '语音输入', desc: '支持语音输入创作诉求。' },
      { id: 'FR-MOM-009', title: '复制文案', desc: '一键复制，带「已复制」反馈。' },
      { id: 'FR-MOM-010', title: '一键生成渲染过程', desc: '手机 mockup 骨架屏按四阶段渲染，完成后恢复预览。' },
    ],
    acceptance: '工作流按节点传递场景、人设、素材与水印配置，节点状态可追踪且失败可重试；尺寸与水印切换实时反映到预览；文案长度 80–180 字、标签 3–5 个；水印输出与勾选一致；复制与点赞均有反馈。',
  },
  {
    id: 'assets',
    code: 'FR-AST',
    route: '/assets',
    title: '素材资产管理',
    desc: '统一存储、检索与协作管理生成物料。',
    icon: FolderKanban,
    frs: [
      { id: 'FR-AST-001', title: '文件夹与分类', desc: '左侧文件夹树，可新建文件夹。' },
      { id: 'FR-AST-002', title: '视图切换', desc: '网格 / 列表两种视图切换。' },
      { id: 'FR-AST-003', title: '搜索与筛选', desc: '按关键词、标签、素材类型筛选。' },
      { id: 'FR-AST-004', title: '素材卡片 / 列表行', desc: '展示封面、类型、标签等；点击打开详情（支持键盘 Enter/Space）。' },
      { id: 'FR-AST-005', title: '收藏', desc: '卡片可切换收藏（星标），状态在卡片与详情间共享。' },
      { id: 'FR-AST-006', title: '下载', desc: '列表行与详情内下载，带「下载中 → 已下载」反馈。' },
      { id: 'FR-AST-007', title: '素材详情弹层', desc: '大图预览、元信息与操作（下载 / 收藏 / 分享 / 重命名 / 删除）；遮罩或 Esc 关闭并锁滚动。' },
      { id: 'FR-AST-008', title: '上传素材', desc: '顶部「上传素材」入口。' },
    ],
    acceptance: '卡片 / 行点击打开详情；收藏状态跨视图共享；下载有反馈；弹层可正确关闭并锁滚动。',
  },

  {
    id: 'knowledge',
    code: 'FR-KB',
    route: '/knowledge',
    title: '知识库 / 合规中心',
    desc: '为营销内容提供平台规则、敏感词、行业规范三重校验。',
    icon: ShieldCheck,
    frs: [
      { id: 'FR-KB-001', title: '合规校验输入', desc: '粘贴营销文案，展示字数，支持载入示例文案。' },
      { id: 'FR-KB-002', title: '一键校验', desc: '调用 POST /api/knowledge/validate 检测，带加载态与错误提示。' },
      { id: 'FR-KB-003', title: '校验结果', desc: '展示合规评分、命中项数、分类计数（平台规则 / 敏感词 / 行业规范）。' },
      { id: 'FR-KB-004', title: '违规明细', desc: '逐条列出命中规则、命中词、风险等级、整改建议与来源；无违规给出通过提示。' },
      { id: 'FR-KB-005', title: '已接入知识域', desc: '平台规则库、敏感词库、行业 know-how、话术优化模板，含条目数与更新时间。' },
      { id: 'FR-KB-006', title: '知识域详情弹层', desc: '点击知识域打开弹层展示代表性词条节选；遮罩 / Esc 关闭并锁滚动。' },
      { id: 'FR-KB-007', title: '生成即合规', desc: '五大引擎已内置知识库校验，产出内容自动完成三重检测。' },
    ],
    acceptance: '校验返回评分与明细；风险分级正确；知识域弹层可正常查看与关闭。',
  },
]

const promptSpecs = [
  { id: 'FR-IMG', name: 'AI 图片生成', role: '汽车品牌视觉创意总监', journey: '认知种草 / 兴趣考虑：用场景化视觉建立车型第一印象，突出可验证卖点。', vars: 'journey_stage、viral_keywords、prompt、style、scene、vehicle、ratio、count、reference_image?', output: 'images[]（url/width/height/seed）、revisedPrompt', rules: '车型外观一致；无畸变、乱码、虚假 Logo、水印；宽高符合 ratio，数量等于 count。', prompt: '你是汽车品牌视觉创意总监。请为{{vehicle}}生成{{count}}张{{ratio}}汽车营销图，处于{{journey_stage}}阶段。创意：{{prompt}}；风格：{{style}}；场景：{{scene}}。保持车身比例、灯组、轮毂、车标和颜色一致；不得出现畸变、乱码、虚假或竞品 Logo、水印；不要在图片中绘制文字。只返回 JSON：{"images":[{"url":"string","width":0,"height":0,"seed":"string"}],"revisedPrompt":"string"}。' },
  { id: 'FR-TXT', name: 'AI 图文生成', role: '汽车行业内容运营专家', journey: '认知种草 / 兴趣考虑 / 车型比较：按平台解释用户关心的空间、智能、安全、能源和用车成本。', vars: 'journey_stage、viral_keywords、topic、platform、tone、length、keywords、image_size、brand_facts', output: 'title、body、tags[]、coverSuggestions[]、wordCount', rules: '只使用事实资料；避免绝对化、虚构参数和未证实优惠；正文字符数误差不超过 5%。', prompt: '你是汽车行业内容运营专家。请围绕{{topic}}为{{platform}}撰写{{length}}字内容，购车阶段为{{journey_stage}}，语气为{{tone}}。仅使用{{brand_facts}}，自然融入{{keywords}}，解释用户决策问题并给出合规咨询 CTA。只返回 JSON：{"title":"string","body":"string","tags":["string"],"coverSuggestions":["string","string"],"wordCount":0}。' },
  { id: 'FR-VID', name: 'AI 视频生成', role: '汽车短视频导演与编导', journey: '兴趣考虑 / 试驾体验 / 购买决策：通过功能演示、试驾路线和真实证据降低决策疑虑。', vars: 'journey_stage、viral_keywords、topic、digital_human、voice、video_type、video_size、duration_sec、vehicle_facts', output: 'videoUrl、coverUrl、durationSec、storyboard[]、captions[]', rules: '分镜总时长等于目标时长；前三秒给出利益点；不得编造性能、价格和背书。', prompt: '你是汽车短视频导演。请为{{journey_stage}}阶段制作{{duration_sec}}秒{{video_size}}视频，主题为{{topic}}，使用{{digital_human}}和{{voice}}。基于{{vehicle_facts}}拆分镜头，前三秒呈现利益点，结尾使用合规预约试驾 CTA。只返回包含 videoUrl、coverUrl、durationSec、storyboard[]、captions[] 的 JSON。' },
  { id: 'FR-PPT', name: 'AI PPT 生成', role: '汽车品牌市场汇报顾问', journey: '车型比较 / 购买决策：面向管理层、经销商或销售团队，呈现市场、线索和转化证据。', vars: 'journey_stage、viral_keywords、topic、scene、template、pages、audience、data', output: 'title、template、slides[]（index/title/bullets/notes）', rules: '一页一个结论；每页 3–5 条要点；图表注明口径、单位、时间范围和来源。', prompt: '你是汽车品牌市场汇报顾问。请为{{audience}}制作{{pages}}页{{scene}}演示文稿，主题为{{topic}}，对应购车阶段{{journey_stage}}。只能使用{{data}}中的事实；一页一个结论，图表注明口径、单位、时间范围和来源。只返回包含 title、template、slides[] 的 JSON。' },
  { id: 'FR-MOM', name: '朋友圈图文', role: '一线汽车销售顾问内容助手', journey: '购买决策 / 交付分享 / 车主运营：以门店和顾问的可信关系推动咨询、到店、交付分享和售后复购。', vars: 'journey_stage、viral_keywords、scene、persona、image_size、watermark、vehicle、offer、store_info', output: 'copy、images[]、hashtags[]、watermark[]', rules: '正文 80–180 字；低打扰口语；禁止虚构库存、价格、限时、案例和未经授权联系方式。', prompt: '你是一线汽车销售顾问的朋友圈内容助手。请为{{journey_stage}}阶段生成{{persona}}口吻的{{scene}}图文，车型{{vehicle}}，活动事实{{offer}}，门店信息{{store_info}}，配图{{image_size}}。正文80–180字，低打扰并包含咨询 CTA；只返回包含 copy、images[]、hashtags[]、watermark[]、compliance 的 JSON。' },
]

const nonFunctional = [
  { k: '性能', v: '生成过程分阶段可视化；单条内容目标分钟级；交互即时响应。' },
  { k: '可用性', v: '所有可点击元素具备点击反馈（按压 / 加载 / 成功态）。' },
  { k: '可访问性', v: '语义化 HTML、ARIA 标注、键盘可达（卡片 Enter/Space、弹层 Esc）。' },
  { k: '响应式', v: '采用设计系统断点与布局原语，移动端到宽屏自适应。' },
  { k: '一致性', v: '统一使用设计系统 Design Token 与组件。' },
  { k: '合规', v: '生成内容默认接入知识库三重校验。' },
]

const metrics = [
  { k: '本月生成素材', v: 'COUNT(DISTINCT task_id)，成功任务 / 本自然月', calc: '生成成功事件按 task_id 去重；与上月同期比较', dir: '↑' },
  { k: '平均生成时长', v: 'AVG(finished_at - started_at)，成功任务，单位分钟', calc: '仅统计 status=success；耗时下降为正向', dir: '↓' },
  { k: '审核通过率', v: '通过校验数 / 全部校验数 × 100%', calc: '来源 compliance_checked；分母为 0 显示 —', dir: '↑' },
  { k: '素材复用率', v: '被下载或发布内容数 / 成功生成内容数 × 100%', calc: '按 content_id 去重；下载 / 发布任一成立即计复用', dir: '↑' },
  { k: '活跃门店数', v: 'COUNT(DISTINCT store_id)', calc: '统计期内有成功生成、下载、发布或登录事件', dir: '↑' },
  { k: '合规拦截率', v: 'blocked 校验数 / 全部校验数 × 100%', calc: '来源 compliance_checked；按时间范围聚合', dir: '稳定' },
  { k: '近 7 天生成趋势', v: '按日、内容类型 COUNT(DISTINCT task_id)', calc: '最近 7 个自然日；无数据日补 0；周环比对比前 7 日', dir: '图表' },
  { k: '渠道分发占比', v: '渠道发布内容数 / 全渠道发布内容数 × 100%', calc: '按 content_id 去重后按 channel 分组', dir: '图表' },
  { k: '互动率', v: '(点赞 + 评论 + 分享) / 曝光 × 100%', calc: '热门内容按曝光降序取 TOP 5；曝光为 0 显示 —', dir: '图表' },
  { k: '门店活跃度', v: '该店成功生成任务数 / TOP1 门店任务数 × 100%', calc: '门店榜按 COUNT(DISTINCT task_id) 降序', dir: '图表' },
]

const implementationCards = [
  { title: '统一工作流', body: '五大引擎均按 validate_input → create_task → prepare_context → compose_prompt → model_generate → parse_and_validate → compliance_check → persist_result 执行；节点状态可追踪、失败可从检查点恢复。' },
  { title: '任务状态机', body: 'draft → queued → running → succeeded / failed / canceled；进度 = completed_steps / total_steps × 100%，刷新后通过 task_id 恢复。' },
  { title: '接口与幂等', body: '统一使用 /api/generations、/api/assets、/api/knowledge/validate；写接口必须携带会话与 idempotencyKey。' },
  { title: '数据与权限', body: 'generation_tasks、generation_outputs、assets、compliance_checks 四类核心数据；按 organization_id 隔离。' },
  { title: '错误与重试', body: '统一返回 code、message、requestId、retryable；模型 5xx / 超时最多指数退避重试 2 次，参数、权限、合规错误不可重试。' },
  { title: '安全与验收', body: '上传白名单与大小校验由服务端执行，使用私有对象存储短期签名 URL；必须覆盖权限、重试、上传安全和主路径 E2E。' },
]

const implementationRows = [
  ['生成提交', 'POST /api/generations', 'engine、input、idempotencyKey', 'taskId + queued；重复幂等键返回同一任务'],
  ['任务查询', 'GET /api/generations/:taskId', 'taskId', 'status、progress、stage、outputs、error'],
  ['资产下载', 'POST /api/assets/:id/download', 'format、ratio', '5 分钟过期 downloadUrl；需重新鉴权'],
  ['合规校验', 'POST /api/knowledge/validate', 'content', 'score、passed、counts、findings'],
]

type FlowStep = {
  label: string
  note: string
  decision?: { pass: string; fail: string }
}

const engineFlows: { id: string; title: string; icon: LucideIcon; steps: FlowStep[] }[] = [
  {
    id: 'flow-img',
    title: 'AI 图片生成（FR-IMG）',
    icon: ImageIcon,
    steps: [
      { label: '输入参数', note: 'prompt / style / scene / vehicle / ratio / count', decision: { pass: '创建任务 queued', fail: '400 INVALID_INPUT' } },
      { label: '注入上下文', note: '车型知识库事实 + viral_keywords（核心/场景/证据词）' },
      { label: '组装 Prompt A 并调用图像模型', note: '按 ratio 生成 count 张候选图' },
      { label: '校验输出', note: '宽高比=ratio 且数量=count', decision: { pass: '进入品牌安全检测', fail: 'MODEL_OUTPUT_INVALID，重试 1 次' } },
      { label: '品牌安全检测', note: '无乱码 / 无竞品 Logo / 无水印 / 无畸变' },
      { label: '合规知识库校验', note: '三重校验：平台规则 / 敏感词 / 行业规范', decision: { pass: '落库 4 张候选图 + revisedPrompt', fail: 'COMPLIANCE_BLOCKED' } },
      { label: '前端网格展示', note: '用户选中 1 张 → 按导出比例条一键导出' },
    ],
  },
  {
    id: 'flow-txt',
    title: 'AI 图文生成（FR-TXT）',
    icon: FileText,
    steps: [
      { label: '输入参数', note: 'topic / platform / tone / length / keywords / brand_facts' },
      { label: '选题来源分支', note: '智能推荐（可刷新重推、点击回填标题）或用户手动输入标题' },
      { label: '组装 Prompt B 并调用文本模型', note: '生成 title / body / tags / coverSuggestions' },
      { label: '校验字数', note: 'wordCount 与正文实际字符误差 ≤5%', decision: { pass: '进入合规校验', fail: 'MODEL_OUTPUT_INVALID，重试 1 次' } },
      { label: '合规知识库校验', note: '通过后落库正文+大纲', decision: { pass: '落库，进入图文预览', fail: 'COMPLIANCE_BLOCKED' } },
      { label: '前端交互', note: '图文混排预览 / 一键复制 / 长尾关键词复制' },
    ],
  },
  {
    id: 'flow-vid',
    title: 'AI 视频生成（FR-VID）',
    icon: Clapperboard,
    steps: [
      { label: '输入参数', note: 'topic / digital_human / voice / video_type / video_size / duration_sec / vehicle_facts' },
      { label: '组装 Prompt C 并调用模型', note: '生成 storyboard[] + captions[]' },
      { label: '校验分镜总时长', note: 'Σ storyboard.durationSec = duration_sec', decision: { pass: '校验字幕对应关系', fail: 'MODEL_OUTPUT_INVALID，重试 1 次' } },
      { label: '校验字幕与口播', note: '逐句对应、安全区内', decision: { pass: '进入合成阶段', fail: '标记待修复，不进入合成' } },
      { label: '合成阶段', note: '数字人驱动 + AI 配音 + 字幕烧录 + 智能卡点合成' },
      { label: '合规知识库校验', note: '性能/价格/续航/背书均须来自 vehicle_facts', decision: { pass: '落库 videoUrl / coverUrl', fail: 'COMPLIANCE_BLOCKED' } },
      { label: '前端渲染', note: '智能分镜时间轴，可切换镜头预览' },
      { label: '直播切片子流程', note: '上传直播回放 → 自动解析高光时刻 → 产出 N 条切片资产' },
    ],
  },
  {
    id: 'flow-ppt',
    title: 'AI PPT 生成（FR-PPT）',
    icon: Presentation,
    steps: [
      { label: '输入参数', note: 'topic / scene / template / pages / audience / data' },
      { label: '组装 Prompt D 并调用模型', note: '生成 slides[]（每页 title / bullets / chart / notes）' },
      { label: '校验页数', note: 'slides.length = pages', decision: { pass: '校验图表数据', fail: 'MODEL_OUTPUT_INVALID，重试 1 次' } },
      { label: '校验图表数据', note: '口径 / 单位 / 时间范围 / 来源齐全', decision: { pass: '进入合规校验', fail: '标记"待补充"，不得伪造数值' } },
      { label: '合规知识库校验', note: '通过后落库 slides + notes，套用视觉模板' },
      { label: '前端交互', note: '缩略图翻页 / 演示模式 / 图表类型推荐插入当前页' },
      { label: '导出', note: 'PPTX / PDF：生成文件 → 签名下载 URL → status=exported' },
    ],
  },
  {
    id: 'flow-mom',
    title: '朋友圈图文（FR-MOM）',
    icon: MessageCircle,
    steps: [
      { label: '输入参数', note: 'scene / persona / image_size / watermark / vehicle / offer / store_info' },
      { label: '组装 Prompt E 并调用模型', note: '生成 copy / images / hashtags / watermark' },
      { label: '校验输出', note: 'copy 长度 80–180 字，hashtags 3–5 个', decision: { pass: '进入合规校验', fail: 'MODEL_OUTPUT_INVALID，重试 1 次' } },
      { label: '合规知识库校验', note: '库存 / 价格 / 客户案例 / 联系方式来源核验', decision: { pass: '校验水印一致性', fail: 'COMPLIANCE_BLOCKED，不生成可发布文案' } },
      { label: '校验水印一致性', note: '输出 watermark 与用户勾选项匹配', decision: { pass: '落库文案+配图建议', fail: '标记异常，禁止自行追加二维码/电话/Logo' } },
      { label: '前端渲染', note: '按 image_size 渲染手机朋友圈预览' },
      { label: '用户操作', note: '复制文案（已复制反馈）/ 点赞交互（红心 + 计数）' },
    ],
  },
]

const roadmap = [
  { v: 'v2.0（当前基线）', d: '五大生成引擎 + 素材资产 + 合规知识库，支持点击反馈与生成过程可视化。' },
  { v: 'v1.1（规划）', d: '素材详情的分享 / 重命名 / 删除落地真实逻辑；模板库独立页面。' },
  { v: 'v1.2（规划）', d: '视频变体 / 多平台 A/B 重新评估引入；批量生成与任务队列。' },
  { v: 'v2.0（远期）', d: '多角色协作与审批流；私域获客数据回流与 ROI 归因。' },
]

const risks = [
  { k: '生成模型质量', v: '质量依赖底层模型', a: '多模型 + 采纳率反馈优化' },
  { k: '合规知识库时效', v: '广告法 / 平台规则更新频繁', a: '实时同步 + 专家维护' },
  { k: '多平台规则差异', v: '各平台格式与限制不同', a: '按平台注入 Prompt 约束 + 站内线索组件' },
  { k: '数据准确性', v: '指标依赖埋点与回流', a: '统一埋点规范 + 数据校验' },
]

const toc = [
  { id: 'overview', label: '1. 文档概述', icon: ScrollText },
  { id: 'architecture', label: '2. 产品总体架构', icon: Layers },
  ...modules.map((m, i) => ({ id: m.id, label: `3.${i + 1} ${m.title}`, icon: m.icon })),
  { id: 'prompt-specs', label: '3.10 提示词规范', icon: Sparkles },
  { id: 'non-functional', label: '4. 非功能性需求', icon: Gauge },
  { id: 'metrics', label: '5. 数据指标', icon: Target },
  { id: 'implementation', label: '6. 研发实现规格', icon: ServerCog },
  { id: 'engine-flows', label: '6.9 五大引擎工作流', icon: Workflow },
  { id: 'roadmap', label: '7. 迭代规划', icon: GitBranch },
  { id: 'risks', label: '8. 风险与依赖', icon: AlertTriangle },
  ]

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-96px 0px -60% 0px', threshold: 0 },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])
  return active
}

export default function PrdPage() {
  const active = useActiveSection(toc.map((t) => t.id))

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary glow-primary">
            <ScrollText className="size-6" />
          </span>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">产品需求文档（PRD）</h1>
            <p className="text-sm text-muted-foreground">{meta.product} · 由现有交互原型反向梳理生成</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default">{meta.version}</Badge>
          <Badge variant="success">{meta.status}</Badge>
          <Badge variant="outline">docs/PRD.md</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* TOC */}
        <aside className="hidden lg:block">
          <nav className="sticky top-20 space-y-1">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              文档目录
            </p>
            {toc.map((t) => {
              const Icon = t.icon
              const on = active === t.id
              return (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  className={cn(
                    'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors',
                    on
                      ? 'bg-primary/15 font-medium text-primary'
                      : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="truncate">{t.label}</span>
                </a>
              )
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0 space-y-10 scroll-smooth">
          {/* 1. Overview */}
          <Section id="overview" title="1. 文档概述">
            <Card className="p-5">
              <p className="text-sm leading-relaxed text-muted-foreground">{overview.purpose}</p>
              <p className="mb-2 mt-5 text-sm font-semibold">目标用户与角色</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {overview.roles.map((r) => (
                  <div key={r.role} className="rounded-lg border border-border bg-secondary/30 p-3">
                    <p className="text-sm font-medium">{r.role}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{r.need}</p>
                  </div>
                ))}
              </div>
            </Card>
          </Section>

          {/* 2. Architecture */}
          <Section id="architecture" title="2. 产品整体架构">
            <Card className="overflow-hidden p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2.5 font-medium">分组</th>
                    <th className="px-4 py-2.5 font-medium">模块</th>
                    <th className="px-4 py-2.5 font-medium">路由</th>
                  </tr>
                </thead>
                <tbody>
                  {navRows.map((n) => {
                    const Icon = n.icon
                    return (
                      <tr key={n.route} className="border-b border-border/60 last:border-0">
                        <td className="px-4 py-2.5 text-muted-foreground">{n.group}</td>
                        <td className="px-4 py-2.5">
                          <span className="flex items-center gap-2 font-medium">
                            <Icon className="size-4 text-primary" />
                            {n.module}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                            {n.route}
                          </code>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </Card>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              全局外壳 AppShell：可折叠分组侧边栏（当前项高亮）+ 顶栏（页面标题、全局搜索 ⌘K、通知、「新建创作」）。
            </p>
          </Section>

          {/* 3. Modules */}
          <Section id="modules-heading" title="3. 功能需求明细" hideAnchor>
            <p className="-mt-2 text-sm text-muted-foreground">
              功能编号（FR-xxx）与原型标注一致，作为研发、测试与验收的统一依据。
            </p>
          </Section>

          {modules.map((m, i) => {
            const Icon = m.icon
            return (
              <Section key={m.id} id={m.id} title={`3.${i + 1} ${m.title}`} icon={Icon}>
                <Card className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="muted">{m.code}</Badge>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      {m.route}
                    </code>
                    <span className="text-sm text-muted-foreground">{m.desc}</span>
                  </div>

                  <div className="mt-4 space-y-2">
                    {m.frs.map((fr) => (
                      <div
                        key={fr.id}
                        className="flex flex-col gap-1 rounded-lg border border-border bg-secondary/20 p-3 sm:flex-row sm:items-start sm:gap-3"
                      >
                        <Badge variant="outline" className="shrink-0 font-mono text-[11px]">
                          {fr.id}
                        </Badge>
                        <div className="min-w-0">
                          <p className="text-sm font-medium">{fr.title}</p>
                          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                            {fr.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-start gap-2 rounded-lg border border-primary/25 bg-primary/[0.06] p-3">
                    <span className="mt-0.5 text-xs font-semibold text-primary">验收</span>
                    <p className="text-xs leading-relaxed text-muted-foreground">{m.acceptance}</p>
                  </div>
                </Card>
              </Section>
            )
          })}

          {/* 3.10 Prompt specifications */}
          <Section id="prompt-specs" title="3.10 五大生成引擎提示词规范" icon={Sparkles}>
            <Card className="mb-3 border-primary/25 bg-primary/[0.04] p-4">
              <p className="text-sm font-medium">统一执行规范</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                服务端组合 system_prompt、user_prompt 与 output_schema；使用 {'{{variable}}'} 模板变量。结果必须通过 JSON Schema 与知识库合规校验，事实参数不得由模型编造，保存 prompt_template_version、模型版本与 requestId。
              </p>
            </Card>
            <Card className="mb-3 border-amber-500/25 bg-amber-500/[0.04] p-4">
              <p className="text-sm font-medium">爆款关键词注入规则</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                每次注入 1–2 个核心词、2–4 个场景/痛点词、1–2 个证据词和 1 个转化词；核心词放标题、首屏或前三秒，证据词必须绑定知识库事实。同一核心词默认不超过 3 次，关键词覆盖率不超过正文 3%；交易词须有官方有效期和适用条件，绝对化词一律拦截。
              </p>
            </Card>
            <div className="space-y-3">
              {promptSpecs.map((p) => (
                <Card key={p.id} className="overflow-hidden p-0">
                  <div className="flex flex-wrap items-center gap-2 border-b border-border bg-secondary/20 px-4 py-3">
                    <Badge variant="muted">{p.id}</Badge>
                    <p className="text-sm font-semibold">{p.name}</p>
                    <span className="text-xs text-muted-foreground">角色：{p.role}</span>
                  </div>
                  <div className="grid gap-3 p-4 md:grid-cols-3">
                    <div className="md:col-span-3 rounded-lg border border-primary/20 bg-primary/[0.04] p-3">
                      <p className="text-xs font-semibold text-primary">购车旅程应用</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.journey}</p>
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground"><span className="font-medium text-foreground">关键词位置：</span>核心词进标题/首屏，场景与痛点词进正文，证据词绑定车型事实，转化词仅用于 CTA。</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary">输入变量</p>
                      <code className="mt-1 block text-xs leading-relaxed text-muted-foreground">{p.vars}</code>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary">结构化输出</p>
                      <code className="mt-1 block text-xs leading-relaxed text-muted-foreground">{p.output}</code>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-primary">业务约束</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.rules}</p>
                    </div>
                  </div>
                  <div className="border-t border-border bg-muted/30 p-4">
                    <p className="text-xs font-semibold text-primary">可直接复制的完整 Prompt</p>
                    <pre className="mt-2 whitespace-pre-wrap break-words rounded-lg border border-border bg-background p-3 text-[11px] leading-relaxed text-muted-foreground">{p.prompt}</pre>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-3 rounded-lg border border-border bg-secondary/20 p-4 text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">提示词验收：</span>固定输入可复现结构化 JSON；缺少必填变量、非法枚举、事实资料缺失、模型解析失败和合规命中时返回明确错误码；同一版本下输出字段稳定。
            </div>
          </Section>

          {/* 4. Non-functional */}
          <Section id="non-functional" title="4. 非功能性需求">
            <div className="grid gap-2 sm:grid-cols-2">
              {nonFunctional.map((n) => (
                <Card key={n.k} className="p-4">
                  <p className="text-sm font-medium">{n.k}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{n.v}</p>
                </Card>
              ))}
            </div>
          </Section>

          {/* 5. Metrics */}
          <Section id="metrics" title="5. 数据指标">
            <Card className="overflow-hidden p-0">
              <table className="w-full text-sm">
                <thead>
                      <tr className="border-b border-border text-left text-xs text-muted-foreground">
                        <th className="px-4 py-2.5 font-medium">指标 / 图表</th>
                        <th className="px-4 py-2.5 font-medium">取值定义</th>
                        <th className="px-4 py-2.5 font-medium">计算与聚合方式</th>
                        <th className="px-4 py-2.5 font-medium">方向</th>
                      </tr>
                </thead>
                <tbody>
                  {metrics.map((m) => (
                    <tr key={m.k} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-2.5 font-medium">{m.k}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{m.v}</td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground">{m.calc}</td>
                        <td className="px-4 py-2.5">
                          <Badge variant="muted" className="tabular-nums">
                            {m.dir}
                          </Badge>
                        </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </Section>

          {/* 6. Implementation */}
          <Section id="implementation" title="6. 研发实现规格" icon={ServerCog}>
            <div className="grid gap-2 sm:grid-cols-2">
              {implementationCards.map((item) => (
                <Card key={item.title} className="p-4">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
                </Card>
              ))}
            </div>
            <Card className="mt-3 overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs text-muted-foreground">
                      <th className="px-4 py-2.5 font-medium">能力</th>
                      <th className="px-4 py-2.5 font-medium">接口</th>
                      <th className="px-4 py-2.5 font-medium">请求关键字段</th>
                      <th className="px-4 py-2.5 font-medium">成功响应 / 约束</th>
                    </tr>
                  </thead>
                  <tbody>
                    {implementationRows.map((row) => (
                      <tr key={row[0]} className="border-b border-border/60 last:border-0">
                        {row.map((cell, index) => (
                          <td key={index} className={cn('px-4 py-2.5 text-xs', index === 0 ? 'font-medium' : 'text-muted-foreground')}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <div className="mt-3 rounded-lg border border-primary/25 bg-primary/[0.06] p-4 text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-primary">研发验收：</span>断网、刷新、重复提交、浏览器返回后任务状态不丢失；服务端执行组织隔离、配额、文件白名单与权限校验；所有关键流程覆盖单元、接口、权限、重试、上传安全和 E2E 测试。
            </div>
          </Section>

          {/* 6.9 Engine implementation flow diagrams */}
          <Section id="engine-flows" title="6.9 五大生成引擎实现逻辑流程图" icon={Workflow}>
            <Card className="mb-4 border-primary/25 bg-primary/[0.04] p-4">
              <p className="text-sm font-medium">统一流水线</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                提交参数 → 校验与配额 → 创建任务(queued) → Worker 领取(running) → 注入旅程/关键词上下文 → 组装 Prompt →
创建 workflowRunId → 节点状态 pending/running/succeeded/failed → 调用模型（失败指数退避重试 ≤2 次） → JSON Schema 解析（失败重试 1 次） → 引擎专属后处理 → 合规知识库三重校验
            → 落库 generation_outputs/assets → status=succeeded 并推送前端。五大引擎共用该可恢复流水线与 6.2 状态机、6.6 错误码，
                差异仅在下方各引擎的专属校验与后处理节点。
              </p>
            </Card>
            <div className="space-y-4">
              {engineFlows.map((flow) => (
                <FlowDiagram key={flow.id} title={flow.title} icon={flow.icon} steps={flow.steps} />
              ))}
            </div>
          </Section>

          {/* 7. Roadmap */}
          <Section id="roadmap" title="7. 迭代规划">
            <div className="space-y-3">
              {roadmap.map((r, i) => (
                <Card key={r.v} className="flex items-start gap-3 p-4">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{r.v}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{r.d}</p>
                  </div>
                </Card>
              ))}
            </div>
          </Section>

          {/* 7. Risks */}
          <Section id="risks" title="7. 风险与依赖">
            <div className="grid gap-2 sm:grid-cols-2">
              {risks.map((r) => (
                <Card key={r.k} className="p-4">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="size-3.5 text-amber-400" />
                    <p className="text-sm font-medium">{r.k}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{r.v}</p>
                  <p className="mt-1.5 text-xs text-primary">应对：{r.a}</p>
                </Card>
              ))}
            </div>
          </Section>

          <p className="border-t border-border pt-4 text-xs text-muted-foreground">
            本文档随原型演进持续更新；功能编号与验收标准以最新基线为准。同步文件：docs/PRD.md
          </p>
        </div>
      </div>
    </div>
  )
}

function FlowDiagram({
  title,
  icon: Icon,
  steps,
}: {
  title: string
  icon: LucideIcon
  steps: FlowStep[]
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center gap-2 border-b border-border bg-secondary/20 px-4 py-3">
        <Icon className="size-4 text-primary" />
        <p className="text-sm font-semibold">{title}</p>
      </div>
      <div className="flex flex-col items-stretch gap-0 p-4">
        {steps.map((s, i) => (
          <div key={s.label} className="flex flex-col items-center">
            <div className="w-full rounded-lg border border-border bg-secondary/20 p-3">
              <p className="text-sm font-medium">
                <span className="mr-2 inline-flex size-5 items-center justify-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">
                  {i + 1}
                </span>
                {s.label}
              </p>
              <p className="mt-1 pl-7 text-xs leading-relaxed text-muted-foreground">{s.note}</p>
              {s.decision && (
                <div className="mt-2 grid gap-1.5 pl-7 sm:grid-cols-2">
                  <div className="flex items-start gap-1.5 rounded-md border border-emerald-500/25 bg-emerald-500/[0.06] px-2 py-1.5">
                    <CheckCircle2 className="mt-0.5 size-3 shrink-0 text-emerald-500" />
                    <p className="text-[11px] leading-relaxed text-muted-foreground">{s.decision.pass}</p>
                  </div>
                  <div className="flex items-start gap-1.5 rounded-md border border-red-500/25 bg-red-500/[0.06] px-2 py-1.5">
                    <XCircle className="mt-0.5 size-3 shrink-0 text-red-500" />
                    <p className="text-[11px] leading-relaxed text-muted-foreground">{s.decision.fail}</p>
                  </div>
                </div>
              )}
            </div>
            {i < steps.length - 1 && <ArrowDown className="my-1 size-4 shrink-0 text-muted-foreground/50" />}
          </div>
        ))}
      </div>
    </Card>
  )
}

function Section({
  id,
  title,
  icon: Icon,
  children,
  hideAnchor,
}: {
  id: string
  title: string
  icon?: LucideIcon
  children: React.ReactNode
  hideAnchor?: boolean
}) {
  return (
    <section id={id} className="scroll-mt-20">
      {!hideAnchor && (
        <h2 className="mb-3 flex items-center gap-2 text-base font-semibold">
          {Icon && <Icon className="size-4.5 text-primary" />}
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}
