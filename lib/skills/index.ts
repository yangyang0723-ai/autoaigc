// 车智绘 · 五大生成引擎 Skill 注册表
// 统一导出所有 skill，并提供按 id 调度的入口。
//
// 直接调用示例：
//   import { imageSkill } from '@/lib/skills'
//   const res = await imageSkill.run({ prompt: '蓝色科技SUV海报', style: '科技感', ratio: '16:9', count: 4 })
//
// 动态调度示例：
//   import { runSkill } from '@/lib/skills'
//   const res = await runSkill('ppt', { topic: '星海SUV上市发布', scene: '新车发布会', template: '科技蓝', pages: 6 })

import { imageSkill } from './image-skill'
import { textSkill } from './text-skill'
import { videoSkill } from './video-skill'
import { pptSkill } from './ppt-skill'
import { momentsSkill } from './moments-skill'
import type { SkillId } from './types'

export * from './types'
export { imageSkill, textSkill, videoSkill, pptSkill, momentsSkill }

/** 所有 skill 的注册表，按 id 索引 */
export const skills = {
  image: imageSkill,
  text: textSkill,
  video: videoSkill,
  ppt: pptSkill,
  moments: momentsSkill,
} as const

/** 所有 skill 的元信息列表，供导航 / 文档 / 选择器使用 */
export const skillList = Object.values(skills).map((s) => s.meta)

/** 从 id 取出对应 skill */
export function getSkill(id: SkillId) {
  return skills[id]
}

/**
 * 按 id 动态调度生成。入参类型交由具体 skill 校验，
 * 便于在通用调用层（如统一 API 路由）中复用。
 */
export async function runSkill(id: SkillId, input: unknown) {
  const skill = skills[id]
  // 各 skill 的 run 会先执行 validate，这里做类型收口即可
  return skill.run(input as never)
}
