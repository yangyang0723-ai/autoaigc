import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { ReactNode } from 'react'
import { ScrollText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

function renderMarkdown(markdown: string) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const blocks: ReactNode[] = []
  let listItems: string[] = []
  let tableRows: string[] = []
  let codeLines: string[] = []
  let inCode = false

  const flushList = () => {
    if (listItems.length === 0) return
    blocks.push(
      <ul key={`list-${blocks.length}`} className="my-3 list-disc space-y-1 pl-6 text-sm leading-7 text-muted-foreground">
        {listItems.map((item, index) => <li key={`${item}-${index}`}>{inlineMarkdown(item)}</li>)}
      </ul>,
    )
    listItems = []
  }

  const flushTable = () => {
    if (tableRows.length === 0) return
    const rows = tableRows
      .filter((row) => !/^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?$/.test(row))
      .map((row) => row.replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim()))
    if (rows.length > 0) {
      blocks.push(
        <div key={`table-${blocks.length}`} className="my-5 overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead className="bg-secondary/60"><tr>{rows[0].map((cell, index) => <th key={index} className="border-b border-border px-3 py-2 font-semibold">{inlineMarkdown(cell)}</th>)}</tr></thead>
            <tbody>{rows.slice(1).map((row, rowIndex) => <tr key={rowIndex} className="border-b border-border last:border-0">{row.map((cell, cellIndex) => <td key={cellIndex} className="px-3 py-2 align-top text-muted-foreground">{inlineMarkdown(cell)}</td>)}</tr>)}</tbody>
          </table>
        </div>,
      )
    }
    tableRows = []
  }

  const flushCode = () => {
    if (codeLines.length === 0) return
    blocks.push(<pre key={`code-${blocks.length}`} className="my-5 overflow-x-auto rounded-lg bg-secondary/70 p-4 text-xs leading-6 text-foreground"><code>{codeLines.join('\n')}</code></pre>)
    codeLines = []
  }

  lines.forEach((line, index) => {
    if (line.trim().startsWith('```')) {
      if (inCode) flushCode()
      flushList(); flushTable(); inCode = !inCode
      return
    }
    if (inCode) { codeLines.push(line); return }
    if (line.trim().startsWith('|')) { flushList(); tableRows.push(line); return }
    flushTable()
    const listMatch = line.match(/^\s*[-*]\s+(.*)$/)
    if (listMatch) { listItems.push(listMatch[1]); return }
    flushList()
    if (!line.trim()) return
    const heading = line.match(/^(#{1,4})\s+(.*)$/)
    if (heading) {
      const level = heading[1].length
      const className = level === 1 ? 'mt-2 text-2xl font-bold tracking-tight' : level === 2 ? 'mt-10 border-b border-border pb-2 text-xl font-semibold' : 'mt-7 text-lg font-semibold'
      const Tag = `h${Math.min(level, 4)}` as 'h1' | 'h2' | 'h3' | 'h4'
      blocks.push(<Tag key={`heading-${index}`} className={className}>{inlineMarkdown(heading[2])}</Tag>)
      return
    }
    if (/^---+$/.test(line.trim())) { blocks.push(<hr key={`hr-${index}`} className="my-6 border-border" />); return }
    if (line.trim().startsWith('>')) { blocks.push(<blockquote key={`quote-${index}`} className="my-4 border-l-2 border-primary pl-4 text-sm italic text-muted-foreground">{inlineMarkdown(line.replace(/^>\s?/, ''))}</blockquote>); return }
    blocks.push(<p key={`p-${index}`} className="my-3 text-sm leading-7 text-muted-foreground">{inlineMarkdown(line)}</p>)
  })
  flushList(); flushTable(); flushCode()
  return blocks
}

function inlineMarkdown(value: string) {
  const parts = value.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]*\))/g)
  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index} className="rounded bg-secondary px-1.5 py-0.5 text-xs text-primary">{part.slice(1, -1)}</code>
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>
    const link = part.match(/^\[([^\]]+)\]\(([^)]*)\)$/)
    if (link) return <a key={index} href={link[2]} className="text-primary underline underline-offset-4">{link[1]}</a>
    return part
  })
}

export default function PRDPage() {
  const filePath = path.join(process.cwd(), 'docs', '车智绘AutoAIGC-PRD-v2.0.md')
  const markdown = readFileSync(filePath, 'utf8')
  return (
    <main className="min-h-screen bg-background px-5 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary"><ScrollText className="size-6" /></span>
            <div><h1 className="text-xl font-semibold tracking-tight">车智绘 AutoAIGC · 产品需求文档</h1><p className="text-sm text-muted-foreground">来自 docs/车智绘AutoAIGC-PRD-v2.0.md</p></div>
          </div>
          <Badge variant="default">PRD v2.0</Badge>
        </header>
        <article className="rounded-xl border border-border bg-card p-6 shadow-sm md:p-10">{renderMarkdown(markdown)}</article>
      </div>
    </main>
  )
}
