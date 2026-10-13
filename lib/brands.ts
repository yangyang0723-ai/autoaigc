export type BrandKind = '自有品牌' | '竞品品牌'

export type Brand = {
  id: string
  name: string
  aliases: string[]
  kind: BrandKind
}

export const initialBrands: Brand[] = [
  { id: 'xinghe', name: '星河汽车', aliases: ['Xinghe', 'xhqc', '星河 S7'], kind: '自有品牌' },
  { id: 'jiguang', name: '极光汽车', aliases: ['Aurora', 'jgqc'], kind: '竞品品牌' },
  { id: 'yuanshan', name: '远山汽车', aliases: ['Yuanshan', 'ysqc'], kind: '竞品品牌' },
  { id: 'lanhai', name: '澜海汽车', aliases: ['Lanhai', 'lhqc'], kind: '竞品品牌' },
  { id: 'yunling', name: '云岭汽车', aliases: ['Yunling', 'ylqc'], kind: '竞品品牌' },
  { id: 'chenxi', name: '晨曦新能源', aliases: ['Chenxi', 'cxxny'], kind: '竞品品牌' },
]

function isSubsequence(needle: string, haystack: string) {
  let i = 0
  for (const ch of haystack) {
    if (ch === needle[i]) i += 1
    if (i === needle.length) return true
  }
  return false
}

/**
 * 模糊匹配得分：0 = 不匹配；3 = 前缀匹配；2 = 连续包含；1 = 字符顺序匹配（如“星汽”→“星河汽车”）。
 * 同时匹配品牌名与别名（英文名 / 拼音缩写）。
 */
export function scoreBrand(brand: Brand, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return 1
  let best = 0
  for (const target of [brand.name, ...brand.aliases]) {
    const t = target.toLowerCase()
    if (t.startsWith(q)) best = Math.max(best, 3)
    else if (t.includes(q)) best = Math.max(best, 2)
    else if (isSubsequence(q, t)) best = Math.max(best, 1)
  }
  return best
}

export function searchBrands(brands: Brand[], query: string) {
  return brands
    .map((brand) => ({ brand, score: scoreBrand(brand, query) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.brand)
}
