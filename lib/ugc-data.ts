export type Stage = '草稿预审' | '已定时' | '发布中' | '已发布'
export type Job = { id: number; title: string; platform: string; account: string; time: string; stage: Stage }

export const initialJobs: Job[] = [
  { id: 1, title: '三十万内纯电 SUV 怎么选？一份不踩坑清单', platform: '小红书', account: '星河车主说', time: '今天 19:30', stage: '草稿预审' },
  { id: 2, title: '冬季续航缩水真相：实测 5 款纯电 SUV', platform: '知乎', account: '新能源老张', time: '明天 12:00', stage: '草稿预审' },
  { id: 3, title: '带娃出行选车指南：空间与安全怎么权衡', platform: '公众号', account: '星河汽车官方', time: '周三 08:00', stage: '草稿预审' },
  { id: 4, title: '800V 超充到底快在哪？一分钟看懂', platform: '抖音', account: '星河小智', time: '今天 21:00', stage: '已定时' },
  { id: 5, title: '星河 S7 真实车主三个月用车报告', platform: '小红书', account: '通勤日记', time: '明天 10:30', stage: '已定时' },
  { id: 6, title: '增程还是纯电？按用车场景给你答案', platform: '知乎', account: '车评人阿木', time: '周三 20:00', stage: '已定时' },
  { id: 7, title: '电池安全五重防护，工程师这样解读', platform: '公众号', account: '星河汽车官方', time: '周四 08:00', stage: '已定时' },
  { id: 8, title: '冬天开电车去东北需要注意什么', platform: '抖音', account: '路上的星河', time: '正在发布', stage: '发布中' },
  { id: 9, title: '星河 S7 vs 同级竞品：参数与体验对照', platform: '知乎', account: '新能源老张', time: '昨天 12:00', stage: '已发布' },
  { id: 10, title: '家庭第二辆车，我为什么选了纯电 SUV', platform: '小红书', account: '星河车主说', time: '昨天 19:30', stage: '已发布' },
  { id: 11, title: '一图看懂星河 S7 配置与价格', platform: '公众号', account: '星河汽车官方', time: '周一 08:00', stage: '已发布' },
]
