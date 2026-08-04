// 车智绘 · 五大生成引擎 Skill 统一类型定义
// 每个 skill 都遵循同一套契约：元信息(meta) + 入参描述(fields) + 强类型入参/出参 + run() 生成函数。
// 当前 run() 为 mock 实现，未来将内部替换为真实模型调用（AI Gateway / 自建服务），调用方无需改动。

export type SkillId = 'image' | 'text' | 'video' | 'ppt' | 'moments'

/** 入参字段描述，供表单渲染 / 校验 / 文档生成使用 */
export interface SkillField {
  /** 字段 key，对应入参对象的属性名 */
  key: string
  /** 展示名称 */
  label: string
  /** 控件类型 */
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'number' | 'boolean'
  /** 是否必填 */
  required?: boolean
  /** 可选项（select / multiselect 用） */
  options?: string[]
  /** 默认值 */
  default?: string | number | boolean | string[]
  /** 字段说明 */
  hint?: string
}

/** Skill 元信息 */
export interface SkillMeta {
  id: SkillId
  /** 引擎名称 */
  name: string
  /** 一句话描述 */
  description: string
  /** 对应前端路由 */
  route: string
  /** 需求编号前缀，与 PRD 对应 */
  frPrefix: string
  /** 预计生成耗时（毫秒），用于前端进度展示 */
  estimatedMs: number
}

/** 生成过程的阶段，用于渲染进度 */
export interface SkillStage {
  label: string
  desc: string
}

/** 统一返回结构 */
export type SkillResult<TOutput> =
  | {
      ok: true
      skillId: SkillId
      /** 本次生成的唯一 ID */
      taskId: string
      /** 生成耗时（毫秒） */
      elapsedMs: number
      output: TOutput
    }
  | {
      ok: false
      skillId: SkillId
      taskId: string
      /** 错误码，便于前端分支处理 */
      code: 'INVALID_INPUT' | 'MODEL_ERROR' | 'RATE_LIMITED' | 'UNKNOWN'
      message: string
    }

/** Skill 通用接口：任意引擎都实现该接口，可被注册表统一调度 */
export interface Skill<TInput, TOutput> {
  meta: SkillMeta
  fields: SkillField[]
  /** 生成过程阶段（用于渲染 loading 动效） */
  stages: SkillStage[]
  /** 校验入参，返回错误信息数组（空数组代表通过） */
  validate: (input: Partial<TInput>) => string[]
  /** 执行生成。当前为 mock，返回贴近真实的示例数据 */
  run: (input: TInput) => Promise<SkillResult<TOutput>>
}

// ---------- 各引擎入参 / 出参类型 ----------

// 1. AI 图片生成
export interface ImageInput {
  prompt: string
  style: string
  ratio: string
  count: number
  referenceImage?: string
}
export interface GeneratedImage {
  url: string
  width: number
  height: number
  seed: number
}
export interface ImageOutput {
  images: GeneratedImage[]
  revisedPrompt: string
}

// 2. AI 图文生成
export interface TextInput {
  topic: string
  platform: string
  tone: string
  length: string
  keywords?: string[]
  imageSize?: string
}
export interface TextOutput {
  title: string
  body: string
  tags: string[]
  coverSuggestions: string[]
  wordCount: number
}

// 3. AI 视频生成
export interface VideoInput {
  topic: string
  digitalHuman: string
  voice: string
  videoSize: string
  durationSec: number
  type: string
}
export interface StoryboardShot {
  index: number
  desc: string
  durationSec: number
  cover: string
}
export interface VideoOutput {
  videoUrl: string
  coverUrl: string
  durationSec: number
  storyboard: StoryboardShot[]
  captions: string[]
}

// 4. AI PPT 生成
export interface PptInput {
  topic: string
  scene: string
  template: string
  pages: number
}
export interface PptSlide {
  index: number
  title: string
  bullets: string[]
  chartType?: 'bar' | 'line' | 'pie' | 'none'
  notes: string
}
export interface PptOutput {
  title: string
  template: string
  slides: PptSlide[]
}

// 5. 朋友圈图文
export interface MomentsInput {
  scene: string
  persona: string
  imageSize: string
  watermark: string[]
}
export interface MomentsOutput {
  copy: string
  images: string[]
  hashtags: string[]
  watermark: string[]
}
