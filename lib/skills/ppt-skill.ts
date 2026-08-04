import type { PptInput, PptOutput, PptSlide, Skill } from './types'
import { createTaskId, isBlank, simulateLatency } from './shared'

const SCENES = ['新车发布会', '经销商培训', '季度业绩汇报', '产品竞品分析']
const TEMPLATES = ['科技蓝', '商务金', '极简白', '国潮红']

/**
 * AI PPT 生成引擎（FR-PPT）
 * 输入汇报主题与场景，输出成套幻灯片大纲与演讲者备注。
 */
export const pptSkill: Skill<PptInput, PptOutput> = {
  meta: {
    id: 'ppt',
    name: 'AI PPT 生成',
    description: '按汇报场景智能编排大纲、图表与演讲者备注',
    route: '/ppt',
    frPrefix: 'FR-PPT',
    estimatedMs: 3900,
  },
  fields: [
    { key: 'topic', label: '汇报主题', type: 'textarea', required: true, hint: 'PPT 要讲的核心内容' },
    { key: 'scene', label: '使用场景', type: 'select', options: SCENES, default: SCENES[0] },
    { key: 'template', label: '视觉模板', type: 'select', options: TEMPLATES, default: TEMPLATES[0] },
    { key: 'pages', label: '页数', type: 'number', default: 6, hint: '3-20 页' },
  ],
  stages: [
    { label: '解析主题与受众', desc: '提炼汇报目标与信息' },
    { label: '智能编排大纲', desc: '生成逻辑页面结构' },
    { label: '套用专业模板', desc: '匹配行业视觉风格' },
    { label: '数据可视化生成', desc: '自动生成图表与备注' },
  ],
  validate(input) {
    const errors: string[] = []
    if (isBlank(input.topic)) errors.push('汇报主题不能为空')
    if (input.pages != null && (input.pages < 3 || input.pages > 20)) errors.push('页数需在 3-20 之间')
    return errors
  },
  async run(input) {
    const taskId = createTaskId('ppt')
    const errors = this.validate(input)
    if (errors.length) {
      return { ok: false, skillId: 'ppt', taskId, code: 'INVALID_INPUT', message: errors.join('；') }
    }

    const start = Date.now()
    await simulateLatency(this.meta.estimatedMs)

    const topic = input.topic.trim()
    const pages = Math.min(Math.max(input.pages ?? 6, 3), 20)
    const blueprint: Array<{ title: string; chart: PptSlide['chartType'] }> = [
      { title: '封面 · 标题页', chart: 'none' },
      { title: '市场背景与机会', chart: 'line' },
      { title: '核心卖点解析', chart: 'none' },
      { title: '竞品对比分析', chart: 'bar' },
      { title: '销量与目标', chart: 'pie' },
      { title: '行动计划 · 结语', chart: 'none' },
    ]

    const slides: PptSlide[] = Array.from({ length: pages }, (_, i) => {
      const bp = blueprint[i % blueprint.length]
      return {
        index: i + 1,
        title: i === 0 ? topic : bp.title,
        bullets: ['要点一：数据支撑的核心结论', '要点二：差异化优势说明', '要点三：可执行的落地建议'],
        chartType: bp.chart,
        notes: `第 ${i + 1} 页讲解建议：围绕「${bp.title}」展开，配合现场演示，控制在 60-90 秒。`,
      }
    })

    return {
      ok: true,
      skillId: 'ppt',
      taskId,
      elapsedMs: Date.now() - start,
      output: { title: topic, template: input.template, slides },
    }
  },
}
