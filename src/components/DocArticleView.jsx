import { useMemo, useState } from 'react'
import { CheckIcon, CopyIcon, InfoIcon } from './Icons'

/**
 * Pure function tokenizing inline markdown tokens: **bold**, `code`, *italic*
 */
function parseInlineTokens(text) {
  if (!text) return []
  const rawTokens = []
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      rawTokens.push({ type: 'text', content: text.substring(lastIndex, match.index) })
    }
    const raw = match[0]
    if (raw.startsWith('**') && raw.endsWith('**')) {
      rawTokens.push({ type: 'bold', content: raw.slice(2, -2) })
    } else if (raw.startsWith('`') && raw.endsWith('`')) {
      rawTokens.push({ type: 'code', content: raw.slice(1, -1) })
    } else if (raw.startsWith('*') && raw.endsWith('*')) {
      rawTokens.push({ type: 'italic', content: raw.slice(1, -1) })
    } else {
      rawTokens.push({ type: 'text', content: raw })
    }
    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    rawTokens.push({ type: 'text', content: text.substring(lastIndex) })
  }

  return rawTokens
}

/**
 * Highlights search matches within a plain string
 */
function highlightMatch(str, query) {
  if (!query || !query.trim()) return str
  const q = query.trim()
  const matchRegex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = str.split(matchRegex)

  return parts.map((part, i) =>
    matchRegex.test(part) ? (
      <mark key={i} className="rounded bg-wa-green/30 px-0.5 font-medium text-wa-green">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

/**
 * Renders inline markdown: **bold**, `code`, *italic*, and search highlights
 */
function FormattedInline({ text, query = '' }) {
  if (!text) return null
  const tokens = parseInlineTokens(text)

  return (
    <span>
      {tokens.map((tok, i) => {
        if (tok.type === 'bold') {
          return (
            <strong key={i} className="font-semibold text-white tracking-tight">
              {highlightMatch(tok.content, query)}
            </strong>
          )
        }
        if (tok.type === 'code') {
          return (
            <code
              key={i}
              className="rounded-md border border-white/10 bg-white/10 px-1.5 py-0.5 font-mono text-[11px] sm:text-xs text-emerald-300 shadow-xs"
            >
              {highlightMatch(tok.content, query)}
            </code>
          )
        }
        if (tok.type === 'italic') {
          return (
            <em key={i} className="italic text-white/90">
              {highlightMatch(tok.content, query)}
            </em>
          )
        }
        return <span key={i}>{highlightMatch(tok.content, query)}</span>
      })}
    </span>
  )
}

/**
 * Parses markdown blocks: Headers, Numbered Step Timeline, Bullet Lists, Tables, Paragraphs
 */
export default function DocArticleView({ article, searchQuery = '' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const content = article?.content ?? ''

  // Parse raw markdown content into structured blocks
  const blocks = useMemo(() => {
    if (!content) return []

    const lines = content.split('\n')
    const parsedBlocks = []
    let currentSteps = null
    let currentList = null
    let currentTable = null

    const flush = () => {
      if (currentSteps) {
        parsedBlocks.push({ type: 'steps', items: currentSteps })
        currentSteps = null
      }
      if (currentList) {
        parsedBlocks.push({ type: 'list', items: currentList })
        currentList = null
      }
      if (currentTable) {
        parsedBlocks.push({ type: 'table', rows: currentTable })
        currentTable = null
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trimEnd()
      const trimmed = line.trim()

      if (!trimmed) {
        flush()
        continue
      }

      // 1. Heading level 3: ###
      if (trimmed.startsWith('### ')) {
        flush()
        parsedBlocks.push({ type: 'h3', text: trimmed.replace(/^###\s+/, '') })
        continue
      }

      // 2. Heading level 4: ####
      if (trimmed.startsWith('#### ')) {
        flush()
        parsedBlocks.push({ type: 'h4', text: trimmed.replace(/^####\s+/, '') })
        continue
      }

      // 3. Table rows: | ... |
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        if (currentSteps) flush()
        if (currentList) flush()
        if (trimmed.includes('---')) continue // skip markdown separator

        const cols = trimmed
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim())
        if (!currentTable) currentTable = []
        currentTable.push(cols)
        continue
      }

      // 4. Numbered steps: 1. ...
      const stepMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/)
      if (stepMatch) {
        if (currentList) flush()
        if (!currentSteps) currentSteps = []

        currentSteps.push({
          number: stepMatch[2],
          text: stepMatch[3],
          subItems: [],
        })
        continue
      }

      // 4b. Sub-items under a step (e.g. "   - Select Save to Files")
      if (currentSteps && line.match(/^(\s{2,}|\t+)[-*]\s+(.*)$/)) {
        const subText = line.replace(/^(\s{2,}|\t+)[-*]\s+/, '')
        currentSteps[currentSteps.length - 1].subItems.push(subText)
        continue
      }

      // 5. Unordered list: - item
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        if (currentSteps) flush()
        if (!currentList) currentList = []

        currentList.push({
          text: trimmed.replace(/^[-*]\s+/, ''),
        })
        continue
      }

      // 6. Regular paragraph
      flush()
      parsedBlocks.push({ type: 'p', text: trimmed })
    }

    flush()
    return parsedBlocks
  }, [content])

  if (!article) return null

  return (
    <article className="max-w-2xl animate-in fade-in duration-200">
      {/* Header Tag & Platform Badge */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-wa-green/15 border border-wa-green/25 px-3 py-1 text-xs font-semibold text-wa-green tracking-wide shadow-xs">
          <span className="h-1.5 w-1.5 rounded-full bg-wa-green" />
          {article.badge}
        </span>
        <span className="text-xs text-white/40">· Official User Guide</span>
      </div>

      {/* Article Title */}
      <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl leading-snug">
        <FormattedInline text={article.title} query={searchQuery} />
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-white/60">
        <FormattedInline text={article.summary} query={searchQuery} />
      </p>

      <div className="my-6 h-px bg-white/10" />

      {/* Structured Content Blocks */}
      <div className="space-y-6">
        {blocks.map((block, idx) => {
          if (block.type === 'h3') {
            return (
              <div key={idx} className="pt-2">
                <h4 className="flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-wa-green">
                  <span className="h-1 w-3 rounded-full bg-wa-green" />
                  <FormattedInline text={block.text} query={searchQuery} />
                </h4>
              </div>
            )
          }

          if (block.type === 'h4') {
            return (
              <h5 key={idx} className="text-base font-semibold tracking-tight text-white mt-4">
                <FormattedInline text={block.text} query={searchQuery} />
              </h5>
            )
          }

          if (block.type === 'p') {
            return (
              <p key={idx} className="text-sm leading-relaxed text-white/70">
                <FormattedInline text={block.text} query={searchQuery} />
              </p>
            )
          }

          // Numbered Steps Timeline
          if (block.type === 'steps') {
            return (
              <div key={idx} className="my-5 space-y-4">
                {block.items.map((step, sIdx) => {
                  const isLast = sIdx === block.items.length - 1
                  return (
                    <div key={sIdx} className="relative flex items-start gap-3.5 group">
                      {/* Step Number Badge + Connecting Line */}
                      <div className="flex flex-col items-center shrink-0 self-stretch">
                        <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-wa-green/15 text-xs font-bold text-wa-green border border-wa-green/30 shadow-xs transition-all group-hover:scale-105 group-hover:bg-wa-green/25">
                          {step.number}
                        </div>
                        {!isLast && <div className="w-0.5 grow bg-white/10 my-1 rounded-full" />}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 pb-3 pt-0.5">
                        <div className="text-sm leading-relaxed text-white/90">
                          <FormattedInline text={step.text} query={searchQuery} />
                        </div>

                        {/* Indented Sub-items / Sub-bullets */}
                        {step.subItems.length > 0 && (
                          <div className="mt-2.5 space-y-2 rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                            {step.subItems.map((sub, subIdx) => (
                              <div key={subIdx} className="flex items-start gap-2.5 text-white/70">
                                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-wa-green/80" />
                                <span className="leading-relaxed">
                                  <FormattedInline text={sub} query={searchQuery} />
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          }

          // Bullet List
          if (block.type === 'list') {
            return (
              <div key={idx} className="space-y-2 rounded-2xl border border-white/5 bg-white/[0.02] p-4 my-3">
                {block.items.map((item, lIdx) => (
                  <div key={lIdx} className="flex items-start gap-3 text-sm text-white/80">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-wa-green" />
                    <span className="leading-relaxed">
                      <FormattedInline text={item.text} query={searchQuery} />
                    </span>
                  </div>
                ))}
              </div>
            )
          }

          // Table
          if (block.type === 'table') {
            const [headers, ...rows] = block.rows
            return (
              <div key={idx} className="overflow-x-auto rounded-2xl border border-white/10 bg-black/30 my-4 shadow-sm">
                <table className="w-full text-left text-xs text-white/80">
                  {headers && (
                    <thead className="border-b border-white/10 bg-white/[0.05]">
                      <tr>
                        {headers.map((h, hIdx) => (
                          <th key={hIdx} className="p-3 font-semibold text-white tracking-wide">
                            <FormattedInline text={h} query={searchQuery} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody className="divide-y divide-white/5">
                    {rows.map((row, rIdx) => (
                      <tr key={rIdx} className="transition-colors hover:bg-white/[0.02]">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-3 leading-relaxed">
                            <FormattedInline text={cell} query={searchQuery} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }

          return null
        })}
      </div>

      {/* Sample Syntax Example Block */}
      {article.example && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-4 shadow-inner">
          <div className="flex items-center justify-between pb-2.5">
            <span className="text-xs font-semibold text-white/60 tracking-wide uppercase">
              Format Specification Example
            </span>
            <button
              type="button"
              onClick={() => handleCopy(article.example)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-wa-green transition-all hover:bg-white/10 active:scale-95"
            >
              {copied ? (
                <>
                  <CheckIcon width={13} height={13} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <CopyIcon width={13} height={13} />
                  <span>Copy Syntax</span>
                </>
              )}
            </button>
          </div>
          <pre className="overflow-x-auto rounded-xl bg-black/60 p-3.5 font-mono text-xs leading-relaxed text-emerald-300 border border-white/5">
            <code>{article.example}</code>
          </pre>
        </div>
      )}

      {/* Tip Callout Box */}
      {article.tip && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4 text-amber-100 shadow-sm">
          <span className="text-amber-300 mt-0.5 shrink-0">
            <InfoIcon width={20} height={20} />
          </span>
          <p className="text-xs sm:text-sm leading-relaxed text-amber-100/90">
            <strong className="font-semibold text-amber-200">Tip: </strong>
            <FormattedInline text={article.tip} query={searchQuery} />
          </p>
        </div>
      )}
    </article>
  )
}
