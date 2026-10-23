import { useEffect, useMemo, useRef, useState } from 'react'
import { DOC_ARTICLES, DOC_CATEGORIES } from '../data/docsData'
import DocArticleView from './DocArticleView'
import { BookIcon, CloseIcon, SearchIcon } from './Icons'

/**
 * Highlights matches of query within text
 */
function HighlightText({ text, query }) {
  if (!query || !query.trim()) return text
  const trimmed = query.trim()
  const regex = new RegExp(`(${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="rounded bg-wa-green/30 px-0.5 font-medium text-wa-green">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  )
}

export default function DocsModal({ isOpen, onClose, initialCategory = 'all', initialQuery = '' }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [selectedId, setSelectedId] = useState(DOC_ARTICLES[0].id)
  const searchInputRef = useRef(null)

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Filtered articles based on category and search query
  const filteredArticles = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return DOC_ARTICLES.filter((item) => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory
      if (!matchCat) return false
      if (!q) return true

      const inTitle = item.title.toLowerCase().includes(q)
      const inSummary = item.summary.toLowerCase().includes(q)
      const inKeywords = item.keywords.some((k) => k.toLowerCase().includes(q))
      const inContent = item.content.toLowerCase().includes(q)

      return inTitle || inSummary || inKeywords || inContent
    })
  }, [searchQuery, activeCategory])

  const selectedArticle = useMemo(
    () => filteredArticles.find((a) => a.id === selectedId) || filteredArticles[0] || DOC_ARTICLES[0],
    [selectedId, filteredArticles]
  )

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Documentation and Knowledge Base"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-md sm:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="relative flex h-[90vh] max-h-[840px] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0c141a]/95 text-white shadow-[0_25px_80px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========== Modal Header & Apple Spotlight Search ========== */}
        <div className="shrink-0 border-b border-white/10 bg-white/[0.02] p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-wa-green/15 text-wa-green border border-wa-green/25 shadow-xs">
                <BookIcon width={20} height={20} />
              </div>
              <div>
                <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">
                  Documentation & Help Center
                </h2>
                <p className="text-xs text-white/50">
                  Search step-by-step export guides, timestamp formats, and troubleshooting
                </p>
              </div>
            </div>

            <button
              id="btn-close-docs"
              type="button"
              onClick={onClose}
              aria-label="Close documentation"
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 transition-all hover:bg-white/10 hover:text-white active:scale-95"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Search Input */}
          <div className="relative mt-2 flex items-center rounded-2xl border border-white/10 bg-black/40 px-3.5 py-2.5 focus-within:border-wa-green/50 focus-within:ring-2 focus-within:ring-wa-green/20 transition-all">
            <span className="mr-2 text-white/40">
              <SearchIcon width={18} height={18} />
            </span>
            <input
              id="input-docs-search"
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides (e.g. 'iphone export', 'dates', 'missing photos', 'shortcuts')..."
              className="w-full bg-transparent text-sm text-white placeholder-white/40 outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mr-2 text-xs text-white/40 hover:text-white"
              >
                Clear
              </button>
            )}
            <kbd className="hidden rounded bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white/60 sm:inline-block">
              ESC to close
            </kbd>
          </div>

          {/* Category Tabs */}
          <div className="no-scrollbar mt-3.5 flex items-center gap-1.5 overflow-x-auto pb-1">
            {DOC_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-wa-green/20 text-wa-green border border-wa-green/35 shadow-xs'
                    : 'border border-white/5 bg-white/[0.03] text-white/60 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ========== Dual-Pane Content Body ========== */}
        <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Pane: Article List */}
          <div className="col-span-12 md:col-span-5 flex flex-col border-r border-white/10 bg-black/25 overflow-y-auto wa-scroll">
            <div className="p-3 text-[11px] font-semibold tracking-wider text-white/40 uppercase">
              {filteredArticles.length} {filteredArticles.length === 1 ? 'Topic' : 'Topics'} Found
            </div>

            {filteredArticles.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-white/50">
                <div className="mb-2 text-2xl">🔍</div>
                <p className="text-sm font-medium text-white/70">No matching articles found</p>
                <p className="mt-1 text-xs text-white/40">Try searching for &quot;export&quot;, &quot;formats&quot;, or &quot;photos&quot;</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setActiveCategory('all')
                  }}
                  className="mt-4 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-wa-green hover:bg-white/10"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredArticles.map((article) => {
                  const isSelected = selectedArticle?.id === article.id
                  return (
                    <button
                      key={article.id}
                      type="button"
                      onClick={() => setSelectedId(article.id)}
                      className={`group flex w-full flex-col items-start rounded-2xl p-3 text-left transition-all ${
                        isSelected
                          ? 'border border-wa-green/30 bg-wa-green/10 shadow-xs'
                          : 'border border-transparent hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span
                          className={`text-xs font-semibold ${
                            isSelected ? 'text-wa-green' : 'text-white group-hover:text-white'
                          }`}
                        >
                          <HighlightText text={article.title} query={searchQuery} />
                        </span>
                        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/50">
                          {article.badge}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/50">
                        <HighlightText text={article.summary} query={searchQuery} />
                      </p>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right Pane: Selected Article Detail with Apple Step Timeline */}
          <div className="col-span-12 md:col-span-7 flex flex-col overflow-y-auto wa-scroll p-6 sm:p-8 bg-gradient-to-b from-white/[0.02] to-transparent">
            {selectedArticle ? (
              <DocArticleView article={selectedArticle} searchQuery={searchQuery} />
            ) : null}
          </div>
        </div>

        {/* ========== Modal Footer: Keyboard Cheatsheet ========== */}
        <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/40 px-5 py-3 text-xs text-white/50">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">Ctrl+F</kbd> In-chat search
            </span>
            <span className="inline-flex items-center gap-1.5">
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">?</kbd> Open Help & Docs
            </span>
            <span className="inline-flex items-center gap-1.5">
              <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">Esc</kbd> Close
            </span>
          </div>

          <div className="text-[11px] text-wa-green flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-wa-green" /> 100% Client-Side Private
          </div>
        </div>
      </div>
    </div>
  )
}
