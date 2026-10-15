import { useSyncExternalStore } from 'react'
import { seedBrands } from '@/lib/brand-kb'
import { generateCrossReport, type CrossReport } from '@/lib/cross-eval'

export const SEED_KEYWORDS = ['30万以内纯电SUV推荐', '家用新能源车怎么选', '纯电车冬季续航哪款好']
export const SEED_PLATFORMS = ['deepseek', 'doubao', 'qwen', 'wenxin', 'kimi', 'yuanbao']
const SEED_BRAND_IDS = ['xinghe', 'chenxi']
const SEED_TIME = new Date(2026, 9, 15, 9, 30)

function createSeedReports(): CrossReport[] {
  const brands = seedBrands.filter((b) => SEED_BRAND_IDS.includes(b.id))
  if (!brands.length) return []
  return [generateCrossReport({ brands, keywords: SEED_KEYWORDS, platformIds: SEED_PLATFORMS, now: SEED_TIME })]
}

const seedReports = createSeedReports()
let reports: CrossReport[] = seedReports
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function addCrossReport(report: CrossReport) {
  reports = [report, ...reports]
  emit()
}

export function removeCrossReport(id: string) {
  reports = reports.filter((r) => r.id !== id)
  emit()
}

export function useCrossReports() {
  return useSyncExternalStore(
    subscribe,
    () => reports,
    () => seedReports,
  )
}

export function useCrossReport(id: string) {
  const list = useCrossReports()
  return list.find((r) => r.id === id) ?? null
}
