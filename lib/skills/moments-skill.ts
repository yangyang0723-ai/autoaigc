import type { MomentsInput, MomentsOutput, Skill } from './types'
import { createTaskId, isBlank, simulateLatency } from './shared'

const SCENES = ['新车到店', '限时促销', '客户提车', '节日祝福', '知识科普']
const PERSONAS = ['专业顾问', '亲切朋友', '幽默达人', '励志导师']
const IMAGE_SIZES = ['1:1', '3:4', '4:3']

/**
 * 朋友圈图文引擎（FR-MOM）
 * 输入场景与人设，输出高转化朋友圈文案、配图与水印二维码方案。
 */
export const momentsSkill: Skill<MomentsInput, MomentsOutput> = {
  meta: {
    id: 'moments',
    name: '朋友圈图文',
    description: '按场景人设生成朋友圈文案、配图与专属水印',
    route: '/moments',
    frPrefix: 'FR-MOM',
    estimatedMs: 2400,
  },
  fields: [
    { key: 'scene', label: '发布场景', type: 'select', required: true, options: SCENES, default: SCENES[1] },
    { key: 'persona', label: '人设风格', type: 'select', options: PERSONAS, default: PERSONAS[0] },
    { key: 'imageSize', label: '配图尺寸', type: 'select', options: IMAGE_SIZES, default: '1:1' },
    {
      key: 'watermark',
      label: '水印内容',
      type: 'multiselect',
      options: ['个人二维码 / 联系方式', '品牌 Logo + 门店信息', '水印位置 · 右下角'],
      hint: '嵌入配图的水印元素',
    },
  ],
  stages: [
    { label: '解析场景与人设', desc: '结合内容日历与风格' },
    { label: 'AI 文案撰写', desc: '生成高转化文案' },
    { label: '智能配图匹配', desc: '挑选场景图并加水印' },
    { label: '合规润色校验', desc: '规避违禁词并优化' },
  ],
  validate(input) {
    const errors: string[] = []
    if (isBlank(input.scene)) errors.push('发布场景不能为空')
    return errors
  },
  async run(input) {
    const taskId = createTaskId('moments')
    const errors = this.validate(input)
    if (errors.length) {
      return { ok: false, skillId: 'moments', taskId, code: 'INVALID_INPUT', message: errors.join('；') }
    }

    const start = Date.now()
    await simulateLatency(this.meta.estimatedMs)

    return {
      ok: true,
      skillId: 'moments',
      taskId,
      elapsedMs: Date.now() - start,
      output: {
        copy: `【${input.scene}】\n以「${input.persona}」的口吻，用一句共鸣开场，中间点出 1 个核心福利点，结尾引导私信或到店。真实、口语化、不硬广——这是接入真实模型前的示例文案占位。`,
        images: ['/cars/blue-suv-poster.png', '/cars/showroom.png'],
        hashtags: ['#星海SUV', '#新能源', '#0首付购车'],
        watermark: input.watermark?.length ? input.watermark : ['个人二维码 / 联系方式'],
      },
    }
  },
}
