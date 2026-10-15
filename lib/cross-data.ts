export const radarDims = ['提及率', '首推率', 'TOP3 率', '正面情感', '信息准确', '信息完整']

export const heatDimDefs = [
  { dim: '品牌认知', hard: 0 },
  { dim: '产品力', hard: 2 },
  { dim: '续航能耗', hard: 8 },
  { dim: '智能驾驶', hard: 10 },
  { dim: '安全性能', hard: 4 },
  { dim: '价格权益', hard: 14 },
  { dim: '服务网络', hard: 12 },
  { dim: '口碑保值', hard: 14 },
]

export const platformQuality: Record<string, number> = {
  deepseek: 80,
  doubao: 72,
  qwen: 70,
  wenxin: 58,
  kimi: 74,
  yuanbao: 66,
}

export type DiffStatus = '一致' | '偏差' | '幻觉' | '缺失'

export type DiffDim = {
  dim: string
  official: string
  items: { platform: string; text: string; status: DiffStatus }[]
}

export const xingheDiffs: DiffDim[] = [
  {
    dim: '续航里程',
    official: 'CLTC 工况续航 620km（实际续航因路况而异）',
    items: [
      { platform: 'DeepSeek', text: 'CLTC 续航 620km，实际通勤约 450–500km。', status: '一致' },
      { platform: '豆包', text: '续航约 700km，长途表现稳定。', status: '偏差' },
      { platform: '通义千问', text: '官方续航约 620km，建议结合工况理解。', status: '一致' },
      { platform: '文心一言', text: '续航 800km 以上，充电 10 分钟可满电。', status: '幻觉' },
      { platform: 'Kimi', text: 'CLTC 续航 620km，冬季会有一定衰减。', status: '一致' },
      { platform: '腾讯元宝', text: '续航在 600km 左右，具体以官方为准。', status: '偏差' },
    ],
  },
  {
    dim: '智能驾驶',
    official: '组合辅助驾驶（L2），需驾驶员全程监控',
    items: [
      { platform: 'DeepSeek', text: '搭载 L2 级组合辅助驾驶，支持高速领航。', status: '一致' },
      { platform: '豆包', text: '具备高速及城市领航辅助驾驶能力。', status: '偏差' },
      { platform: '通义千问', text: '未检索到明确的辅助驾驶信息。', status: '缺失' },
      { platform: '文心一言', text: '支持 L4 级自动驾驶，可解放双手。', status: '幻觉' },
      { platform: 'Kimi', text: 'L2 级辅助驾驶，需保持注意力。', status: '一致' },
      { platform: '腾讯元宝', text: '具备城市 NOA 功能。', status: '偏差' },
    ],
  },
  {
    dim: '补能效率',
    official: '800V 高压平台，10%–80% 快充约 15 分钟',
    items: [
      { platform: 'DeepSeek', text: '800V 平台，10%–80% 约 15 分钟。', status: '一致' },
      { platform: '豆包', text: '支持 800V 快充，约 15–20 分钟。', status: '一致' },
      { platform: '通义千问', text: '支持快充，具体时长未公布。', status: '缺失' },
      { platform: '文心一言', text: '采用 400V 平台，快充约 30 分钟。', status: '幻觉' },
      { platform: 'Kimi', text: '800V 高压平台，快充约 15 分钟。', status: '一致' },
      { platform: '腾讯元宝', text: '800V 平台，快充约 20 分钟。', status: '偏差' },
    ],
  },
  {
    dim: '价格与权益',
    official: '指导价 24.98–31.98 万元；首任车主电池终身质保',
    items: [
      { platform: 'DeepSeek', text: '指导价约 25–32 万元，含电池质保权益。', status: '一致' },
      { platform: '豆包', text: '售价约 25 万起。', status: '偏差' },
      { platform: '通义千问', text: '价格区间 25–32 万元。', status: '一致' },
      { platform: '文心一言', text: '起售价约 20 万元。', status: '偏差' },
      { platform: 'Kimi', text: '指导价 24.98 万起，电池终身质保。', status: '一致' },
      { platform: '腾讯元宝', text: '暂无最新价格信息。', status: '缺失' },
    ],
  },
]
