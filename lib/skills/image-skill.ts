import type { ImageInput, ImageOutput, Skill } from './types'
import { createTaskId, isBlank, simulateLatency } from './shared'

const STYLES = ['科技感', '写实商业', '运动动感', '豪华质感', '国潮插画']
const RATIOS = ['1:1', '16:9', '9:16', '3:4', '2.35:1']

const RATIO_SIZE: Record<string, { w: number; h: number }> = {
  '1:1': { w: 1024, h: 1024 },
  '16:9': { w: 1280, h: 720 },
  '9:16': { w: 720, h: 1280 },
  '3:4': { w: 900, h: 1200 },
  '2.35:1': { w: 1410, h: 600 },
}

const SAMPLE_COVERS = [
  '/cars/blue-suv-poster.png',
  '/cars/red-suv-snow.png',
  '/cars/city-night.png',
  '/cars/showroom.png',
]

/**
 * AI 图片生成引擎（FR-IMG）
 * 输入营销诉求与风格，输出多张候选主视觉。
 */
export const imageSkill: Skill<ImageInput, ImageOutput> = {
  meta: {
    id: 'image',
    name: 'AI 图片生成',
    description: '根据车型卖点与风格，一键生成多张营销主视觉',
    route: '/image',
    frPrefix: 'FR-IMG',
    estimatedMs: 3200,
  },
  fields: [
    { key: 'prompt', label: '创作描述', type: 'textarea', required: true, hint: '车型、场景、卖点等' },
    { key: 'style', label: '视觉风格', type: 'select', options: STYLES, default: STYLES[0] },
    { key: 'ratio', label: '导出比例', type: 'select', options: RATIOS, default: '1:1' },
    { key: 'count', label: '生成数量', type: 'number', default: 4, hint: '1-8 张' },
    { key: 'referenceImage', label: '参考图', type: 'text', hint: '可选，参考图 URL' },
  ],
  stages: [
    { label: '解析创作描述', desc: '提取车型、场景与卖点' },
    { label: '匹配视觉风格', desc: '套用所选风格与色调' },
    { label: '扩散模型生成', desc: '并行生成候选画面' },
    { label: '超分与出图', desc: '高清放大并裁切比例' },
  ],
  validate(input) {
    const errors: string[] = []
    if (isBlank(input.prompt)) errors.push('创作描述不能为空')
    if (input.count != null && (input.count < 1 || input.count > 8)) errors.push('生成数量需在 1-8 之间')
    return errors
  },
  async run(input) {
    const taskId = createTaskId('image')
    const errors = this.validate(input)
    if (errors.length) {
      return { ok: false, skillId: 'image', taskId, code: 'INVALID_INPUT', message: errors.join('；') }
    }

    const start = Date.now()
    await simulateLatency(this.meta.estimatedMs)

    const size = RATIO_SIZE[input.ratio] ?? RATIO_SIZE['1:1']
    const count = Math.min(Math.max(input.count ?? 4, 1), 8)
    const images = Array.from({ length: count }, (_, i) => ({
      url: SAMPLE_COVERS[i % SAMPLE_COVERS.length],
      width: size.w,
      height: size.h,
      seed: Math.floor(Math.random() * 1_000_000),
    }))

    return {
      ok: true,
      skillId: 'image',
      taskId,
      elapsedMs: Date.now() - start,
      output: {
        images,
        revisedPrompt: `${input.style}风格 · ${input.prompt.trim()}`,
      },
    }
  },
}
