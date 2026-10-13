export const brandName = '星河汽车'

export type Platform = {
  id: string
  name: string
  mention: number
  first: number
  top3: number
  sov: number
  pos: number
  neu: number
  neg: number
  samples: number
  delta: number
}

export const platforms: Platform[] = [
  { id: 'deepseek', name: 'DeepSeek', mention: 78.4, first: 29.1, top3: 61.2, sov: 31.6, pos: 64, neu: 30, neg: 6, samples: 5400, delta: 3.1 },
  { id: 'doubao', name: '豆包', mention: 74.2, first: 26.8, top3: 55.4, sov: 29.8, pos: 58, neu: 35, neg: 7, samples: 5400, delta: -2.4 },
  { id: 'qwen', name: '通义千问', mention: 70.6, first: 23.5, top3: 51.3, sov: 27.9, pos: 61, neu: 33, neg: 6, samples: 5400, delta: 1.8 },
  { id: 'wenxin', name: '文心一言', mention: 63.8, first: 19.2, top3: 45.7, sov: 24.1, pos: 49, neu: 41, neg: 10, samples: 5400, delta: -1.1 },
  { id: 'kimi', name: 'Kimi', mention: 69.5, first: 22.7, top3: 50.8, sov: 27.2, pos: 57, neu: 37, neg: 6, samples: 5400, delta: 2.6 },
  { id: 'yuanbao', name: '腾讯元宝', mention: 71.3, first: 26.4, top3: 48.2, sov: 29.8, pos: 55, neu: 38, neg: 7, samples: 5400, delta: 0.9 },
]
