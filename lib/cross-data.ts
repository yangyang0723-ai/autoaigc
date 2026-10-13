export const radarDims = ['提及率', '首推率', 'TOP3 率', '正面情感', '信息准确', '信息完整']

export const radarScores: Record<string, number[]> = {
  DeepSeek: [82, 75, 84, 78, 90, 84],
  豆包: [78, 70, 76, 72, 70, 74],
  通义千问: [74, 64, 70, 76, 78, 72],
  文心一言: [66, 56, 62, 60, 58, 64],
  Kimi: [73, 62, 68, 72, 84, 80],
  腾讯元宝: [75, 70, 66, 68, 66, 70],
}

export const heatDims = [
  { dim: '品牌认知', scores: [86, 82, 78, 70, 76, 80] },
  { dim: '产品力', scores: [84, 80, 76, 68, 74, 72] },
  { dim: '续航能耗', scores: [88, 62, 70, 52, 80, 58] },
  { dim: '智能驾驶', scores: [80, 74, 56, 48, 68, 70] },
  { dim: '安全性能', scores: [82, 78, 72, 66, 70, 64] },
  { dim: '价格权益', scores: [70, 66, 60, 58, 54, 46] },
  { dim: '服务网络', scores: [62, 68, 64, 50, 58, 60] },
  { dim: '口碑保值', scores: [74, 70, 66, 44, 62, 55] },
]

export type DiffStatus = '一致' | '偏差' | '幻觉' | '缺失'

export const diffDims: {
  dim: string
  official: string
  items: { platform: string; text: string; status: DiffStatus }[]
}[] = [
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

export const weakPoints = [
  {
    level: '高',
    platform: '文心一言',
    title: '续航、快充参数出现幻觉描述',
    evidence: '“续航 800km 以上”“400V 平台”与官方口径冲突，且在 3 条探针中重复出现。',
    impact: '预计影响该平台约 38% 的参数类提问，存在误导与合规风险。',
  },
  {
    level: '高',
    platform: '文心一言',
    title: '智能驾驶被表述为 L4 级自动驾驶',
    evidence: '违反“组合辅助驾驶（L2）”宣传规范，疑似引用了第三方过期文章。',
    impact: '合规风险高，需优先纠偏并补充权威信源。',
  },
  {
    level: '中',
    platform: '豆包',
    title: '首推率较上周下降 2.4pp',
    evidence: '在“家庭用车”场景下被极光、澜海替代，缺少亲子用车相关的第三方口碑内容。',
    impact: '家庭场景为高价值提问，建议补充小红书、知乎亲子用车口碑内容。',
  },
  {
    level: '中',
    platform: '通义千问',
    title: '智能驾驶、补能信息缺失',
    evidence: '多次回答“未检索到明确信息”，说明可被采信的结构化来源不足。',
    impact: '导致在技术对比类问题中被直接跳过。',
  },
  {
    level: '低',
    platform: '腾讯元宝',
    title: '价格信息缺失或过期',
    evidence: '部分回答无最新价格；公众号来源的价格信息停留在上季度。',
    impact: '影响决策阶段转化，建议在公众号更新官方权益说明。',
  },
]
