import type { SkillId } from './types'

/** 生成一个带引擎前缀的任务 ID */
export function createTaskId(skillId: SkillId): string {
  const rand = Math.random().toString(36).slice(2, 8)
  return `${skillId}_${Date.now().toString(36)}_${rand}`
}

/** 模拟生成延迟。真实接入模型后可删除。 */
export function simulateLatency(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** 简单去空白校验 */
export function isBlank(v: unknown): boolean {
  return typeof v !== 'string' || v.trim().length === 0
}
