import { useSyncExternalStore } from 'react'
import { initialJobs, type Job, type Stage } from '@/lib/ugc-data'

let jobs: Job[] = initialJobs
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

export function addJobs(next: Job[]) {
  jobs = [...next, ...jobs]
  emit()
}

export function setJobStage(id: number, stage: Stage) {
  jobs = jobs.map((j) => (j.id === id ? { ...j, stage } : j))
  emit()
}

export function removeJob(id: number) {
  jobs = jobs.filter((j) => j.id !== id)
  emit()
}

export function nextJobId() {
  return jobs.reduce((max, j) => Math.max(max, j.id), 0) + 1
}

export function useJobs() {
  return useSyncExternalStore(
    subscribe,
    () => jobs,
    () => initialJobs,
  )
}
