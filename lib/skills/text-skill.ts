import type { Skill, TextInput, TextOutput } from './types'
import { createTaskId, isBlank, simulateLatency } from './shared'

const PLATFORMS = ['公众号', '小红书', '微博', '知乎']
const TONES = ['专业权威', '亲切种草', '幽默活泼', '热血激情']
const LENGTHS = ['短文 (300字)', '中篇 (600字)', '长文 (1200字)']

const LENGTH_WORDS: Record<string, number> = {
  '短文 (300字)': 300,
  '中篇 (600字)': 600,
  '长文 (1200字)': 1200,
}

/**
 * AI 图文生成引擎（FR-TXT）
 * 输入选题与平台，输出成稿标题、正文、标签与封面建议。
 */
export const textSkill: Skill<TextInput, TextOutput> = {
  meta: {
    id: 'text',
    name: 'AI 图文生成',
    description: '按平台调性生成标题、正文、话题标签与配图建议',
    route: '/text',
    frPrefix: 'FR-TXT',
    estimatedMs: 2600,
  },
  fields: [
    { key: 'topic', label: '内容选题', type: 'textarea', required: true, hint: '本篇要讲的主题' },
    { key: 'platform', label: '发布平台', type: 'select', options: PLATFORMS, default: PLATFORMS[0] },
    { key: 'tone', label: '文案语气', type: 'select', options: TONES, default: TONES[0] },
    { key: 'length', label: '字数控制', type: 'select', options: LENGTHS, default: LENGTHS[1] },
    { key: 'keywords', label: '长尾关键词', type: 'multiselect', hint: '可选，用于内容选题与平台表达' },
    { key: 'imageSize', label: '配图尺寸', type: 'select', options: ['16:9', '4:3', '1:1', '3:4'], default: '16:9' },
  ],
  stages: [
    { label: '解析选题与平台', desc: '匹配平台调性与人群' },
    { label: '生成内容大纲', desc: '搭建标题与段落结构' },
    { label: 'AI 撰写正文', desc: '按语气与字数成稿' },
    { label: '优化标签配图', desc: '生成话题标签与封面建议' },
  ],
  validate(input) {
    const errors: string[] = []
    if (isBlank(input.topic)) errors.push('内容选题不能为空')
    return errors
  },
  async run(input) {
    const taskId = createTaskId('text')
    const errors = this.validate(input)
    if (errors.length) {
      return { ok: false, skillId: 'text', taskId, code: 'INVALID_INPUT', message: errors.join('；') }
    }

    const start = Date.now()
    await simulateLatency(this.meta.estimatedMs)

    const topic = input.topic.trim()
    const wordCount = LENGTH_WORDS[input.length] ?? 600
    const kw = input.keywords ?? []

    return {
      ok: true,
      skillId: 'text',
      taskId,
      elapsedMs: Date.now() - start,
      output: {
        title: `${topic}｜${input.platform}${input.tone === '亲切种草' ? '真实体验分享' : '深度解读'}`,
        body: `【${input.platform} · ${input.tone}】\n\n${topic}\n\n开篇用一个高转化钩子抓住读者，随后分 3 个层次展开核心卖点，${
          kw.length ? `自然融入关键词「${kw.join('、')}」，` : ''
        }结尾给出明确的行动号召（到店试驾 / 私信领取福利）。本段为 ${wordCount} 字规格的示例占位文案，接入真实模型后将替换为完整正文。`,
        tags: [...kw, '#新车上市', '#试驾福利', `#${input.platform}好物`].slice(0, 6),
        coverSuggestions: ['车头 45° 动感特写', '中控大屏科技细节', '门店交付真实场景'],
        wordCount,
      },
    }
  },
}
