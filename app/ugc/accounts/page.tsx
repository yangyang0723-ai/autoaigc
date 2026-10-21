import type { Metadata } from 'next'
import { MatrixWorkbench } from '@/components/matrix/matrix-workbench'

export const metadata: Metadata = {
  title: '多平台账号矩阵管理 · 车智绘',
  description: '多平台 UGC 账号绑定、分组标签、健康度评估与团队权限管理',
}

export default function UgcAccountsPage() {
  return <MatrixWorkbench />
}
