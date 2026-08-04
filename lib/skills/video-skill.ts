import type { Skill, VideoInput, VideoOutput } from './types'
import { createTaskId, isBlank, simulateLatency } from './shared'

const HUMANS = ['数字人·晓琳', '数字人·浩然', '真人出镜', '纯口播无露脸']
const VOICES = ['磁性男声', '甜美女声', '沉稳解说', '激情促销']
const SIZES = ['16:9', '9:16', '1:1']
const TYPES = ['新车宣传片', '卖点讲解', '门店探店', '促销快剪']

const SHOT_COVERS = [
  '/cars/city-night.png',
  '/cars/blue-suv-poster.png',
  '/cars/showroom.png',
  '/cars/red-suv-snow.png',
]

/**
 * AI 视频生成引擎（FR-VID）
 * 输入脚本主题与呈现方式，输出分镜脚本与合成视频。
 */
export const videoSkill: Skill<VideoInput, VideoOutput> = {
  meta: {
    id: 'video',
    name: 'AI 视频生成',
    description: '数字人口播 + 智能分镜，一键合成营销短视频',
    route: '/video',
    frPrefix: 'FR-VID',
    estimatedMs: 4200,
  },
  fields: [
    { key: 'topic', label: '视频主题/脚本', type: 'textarea', required: true, hint: '想表达的核心内容' },
    { key: 'digitalHuman', label: '出镜形象', type: 'select', options: HUMANS, default: HUMANS[0] },
    { key: 'voice', label: '配音音色', type: 'select', options: VOICES, default: VOICES[0] },
    { key: 'videoSize', label: '视频尺寸', type: 'select', options: SIZES, default: '16:9' },
    { key: 'durationSec', label: '时长(秒)', type: 'number', default: 30, hint: '15-60 秒' },
    { key: 'type', label: '视频类型', type: 'select', options: TYPES, default: TYPES[0] },
  ],
  stages: [
    { label: '解析脚本', desc: '拆解卖点与叙事节奏' },
    { label: '智能分镜', desc: '生成镜头脚本与画面' },
    { label: '数字人口播', desc: '合成配音与口型' },
    { label: '卡点合成', desc: '配乐卡点并输出成片' },
  ],
  validate(input) {
    const errors: string[] = []
    if (isBlank(input.topic)) errors.push('视频主题/脚本不能为空')
    if (input.durationSec != null && (input.durationSec < 15 || input.durationSec > 60))
      errors.push('时长需在 15-60 秒之间')
    return errors
  },
  async run(input) {
    const taskId = createTaskId('video')
    const errors = this.validate(input)
    if (errors.length) {
      return { ok: false, skillId: 'video', taskId, code: 'INVALID_INPUT', message: errors.join('；') }
    }

    const start = Date.now()
    await simulateLatency(this.meta.estimatedMs)

    const duration = input.durationSec ?? 30
    const shotCount = 4
    const per = Math.round((duration / shotCount) * 10) / 10
    const descs = ['开场卖点钩子', '外观动态展示', '智能座舱细节', '行动号召 CTA']
    const storyboard = Array.from({ length: shotCount }, (_, i) => ({
      index: i + 1,
      desc: descs[i],
      durationSec: per,
      cover: SHOT_COVERS[i % SHOT_COVERS.length],
    }))

    return {
      ok: true,
      skillId: 'video',
      taskId,
      elapsedMs: Date.now() - start,
      output: {
        videoUrl: `/mock/video/${taskId}.mp4`,
        coverUrl: SHOT_COVERS[0],
        durationSec: duration,
        storyboard,
        captions: [
          `${input.type}｜${input.topic.trim()}`,
          '越级智能座舱，这一次真的不一样',
          '0 首付 · 到店即享试驾礼',
        ],
      },
    }
  },
}
