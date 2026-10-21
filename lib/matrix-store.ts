import { useSyncExternalStore } from 'react'
import {
  initialMatrixState,
  type AccountGroup,
  type MatrixAccount,
  type MatrixSettings,
  type MatrixState,
  type PoolLevel,
  type Violation,
} from '@/lib/matrix-data'

let state: MatrixState = initialMatrixState
let seq = 100
const listeners = new Set<() => void>()

function set(next: MatrixState) {
  state = next
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useMatrix() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => initialMatrixState,
  )
}

export function setCurrentMember(id: string) {
  set({ ...state, currentMemberId: id })
}

export function addAccount(input: Omit<MatrixAccount, 'id' | 'violations' | 'plan' | 'monthPosts'>) {
  const account: MatrixAccount = { ...input, id: `a${++seq}`, violations: [], plan: 0, monthPosts: 0 }
  set({ ...state, accounts: [account, ...state.accounts] })
}

export function updateAccount(id: string, patch: Partial<MatrixAccount>) {
  set({ ...state, accounts: state.accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)) })
}

export function removeAccount(id: string) {
  set({ ...state, accounts: state.accounts.filter((a) => a.id !== id) })
}

export function authorizeAccount(id: string) {
  updateAccount(id, { status: '正常' })
}

export function addViolation(accountId: string, input: Omit<Violation, 'id'>) {
  const violation: Violation = { ...input, id: `v${++seq}` }
  set({
    ...state,
    accounts: state.accounts.map((a) =>
      a.id === accountId
        ? {
            ...a,
            violations: [violation, ...a.violations],
            status: input.severity === '重' && a.status === '正常' ? '限流' : a.status,
          }
        : a,
    ),
  })
}

export function addGroup(input: Omit<AccountGroup, 'id'>) {
  set({ ...state, groups: [...state.groups, { ...input, id: `g${++seq}` }] })
}

export function removeGroup(id: string) {
  set({
    ...state,
    groups: state.groups.filter((g) => g.id !== id),
    accounts: state.accounts.map((a) => (a.groupId === id ? { ...a, groupId: '' } : a)),
  })
}

export function setMemberLevel(poolId: string, memberId: string, level: PoolLevel | null) {
  set({
    ...state,
    pools: state.pools.map((p) => {
      if (p.id !== poolId) return p
      const rest = p.members.filter((m) => m.memberId !== memberId)
      return { ...p, members: level ? [...rest, { memberId, level }] : rest }
    }),
  })
}

export function updateSettings(patch: Partial<MatrixSettings>) {
  set({ ...state, settings: { ...state.settings, ...patch } })
}
