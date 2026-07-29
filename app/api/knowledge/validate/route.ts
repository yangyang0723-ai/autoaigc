import { NextResponse } from 'next/server'

/**
 * 外部知识库校验代理
 *
 * 该路由模拟“调用外部知识库服务”对营销文案进行合规校验，
 * 返回三类结果：平台规则、敏感词、行业 know-how 规范。
 * 生产环境可将 scan() 替换为对真实知识库 API 的请求：
 *   const res = await fetch(process.env.KB_ENDPOINT!, { ... })
 */

export type Severity = 'high' | 'medium' | 'low'
export type Finding = {
  category: 'platform' | 'sensitive' | 'knowhow'
  rule: string
  matched: string
  severity: Severity
  advice: string
  source: string
}

type Rule = {
  category: Finding['category']
  rule: string
  patterns: string[]
  severity: Severity
  advice: string
  source: string
}

// 汽车营销行业知识库规则集（节选，体现行业专业性）
const KB_RULES: Rule[] = [
  // —— 平台规则 / 广告法 ——
  {
    category: 'platform',
    rule: '广告法绝对化用语禁用',
    patterns: ['国家级', '最高级', '最佳', '第一品牌', '销量第一', '绝无仅有'],
    severity: 'high',
    advice: '《广告法》第九条禁止使用绝对化用语，建议替换为“同级领先”“备受好评”等相对表述。',
    source: '中华人民共和国广告法 · 第九条',
  },
  {
    category: 'platform',
    rule: '价格宣传合规',
    patterns: ['全网最低', '史上最低', '最低价', '骨折价'],
    severity: 'high',
    advice: '价格宣称需有依据且不得使用绝对化表述，建议改为“限时优惠价”并标注活动有效期。',
    source: '价格法 · 明码标价规定',
  },
  {
    category: 'platform',
    rule: '平台内容规范（抖音/小红书/微信）',
    patterns: ['点击链接', '加微信', '私信我', '扫码领取'],
    severity: 'medium',
    advice: '主流内容平台限制站外导流话术，建议通过官方组件挂载线索表单或门店预约。',
    source: '内容平台社区公约 · 商业导流条款',
  },
  // —— 敏感词 ——
  {
    category: 'sensitive',
    rule: '虚假 / 夸大宣传',
    patterns: ['零风险', '包过户', '稳赚', '保值率100%', '永不贬值'],
    severity: 'high',
    advice: '涉及金融/保值承诺属高风险话术，需删除或补充“具体以合同为准”免责说明。',
    source: '知识库 · 敏感词库 v3.2',
  },
  {
    category: 'sensitive',
    rule: '安全性绝对承诺',
    patterns: ['绝对安全', '零事故', '永不自燃', '百分百安全'],
    severity: 'high',
    advice: '安全性能不得作绝对承诺，建议引用权威碰撞测试成绩（如 C-NCAP 五星）替代。',
    source: '知识库 · 敏感词库 v3.2',
  },
  // —— 行业 know-how 规范 ——
  {
    category: 'knowhow',
    rule: '续航里程标注规范',
    patterns: ['续航1000', '续航 1000', '超长续航', '续航无忧'],
    severity: 'medium',
    advice: '新能源续航须标注测试工况（CLTC/WLTP）及“实际续航因路况而异”，避免消费误导。',
    source: '行业 know-how · 新能源标注规范',
  },
  {
    category: 'knowhow',
    rule: '智能驾驶等级表述',
    patterns: ['自动驾驶', '无人驾驶', '解放双手', 'L3', 'L4'],
    severity: 'high',
    advice: '现售车型量产功能应表述为“组合辅助驾驶（L2）”，禁止使用“自动/无人驾驶”误导用户。',
    source: '行业 know-how · 智驾宣传规范',
  },
  {
    category: 'knowhow',
    rule: '油耗 / 能耗标注规范',
    patterns: ['零油耗', '一箱油', '百公里1个'],
    severity: 'low',
    advice: '能耗宣称建议标注工况来源，并注明“数据来自实验室工况”。',
    source: '行业 know-how · 能耗标注规范',
  },
]

function scan(text: string): Finding[] {
  const findings: Finding[] = []
  for (const rule of KB_RULES) {
    for (const p of rule.patterns) {
      if (text.includes(p)) {
        findings.push({
          category: rule.category,
          rule: rule.rule,
          matched: p,
          severity: rule.severity,
          advice: rule.advice,
          source: rule.source,
        })
      }
    }
  }
  return findings
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { content?: string }
  const content = (body.content ?? '').trim()

  if (!content) {
    return NextResponse.json({ error: '请输入需要校验的文案内容' }, { status: 400 })
  }

  // 模拟外部知识库服务的网络往返延迟
  await new Promise((r) => setTimeout(r, 600))

  const findings = scan(content)
  const score = Math.max(0, 100 - findings.reduce((s, f) => s + (f.severity === 'high' ? 20 : f.severity === 'medium' ? 10 : 4), 0))

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    kbVersion: 'auto-kb v3.2',
    length: content.length,
    score,
    passed: findings.length === 0,
    counts: {
      platform: findings.filter((f) => f.category === 'platform').length,
      sensitive: findings.filter((f) => f.category === 'sensitive').length,
      knowhow: findings.filter((f) => f.category === 'knowhow').length,
    },
    findings,
  })
}
