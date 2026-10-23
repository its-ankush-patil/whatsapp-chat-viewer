import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ChatWindow from './components/ChatWindow'
import DropZone from './components/DropZone'
import Toolbar from './components/Toolbar'
import DocsModal from './components/DocsModal'
import { ErrorBoundary } from './components/ErrorBoundary'
import { BookIcon } from './components/Icons'
import { useChatFiles } from './hooks/useChatFiles'
import { useFileDrop } from './hooks/useFileDrop'
import { useChatSearch } from './hooks/useChatSearch'
import { downloadScreenshot } from './lib/screenshot'
import { loadSampleFiles } from './lib/sample'

/** "WhatsApp Chat with Maya (2).txt" -> "Maya" */
const titleFromFileName = (fileName = '') =>
  fileName.match(/^WhatsApp Chat\s*(?:with|-|–|con|mit|avec)?\s*(.+?)(?:\s*\(\d+\))?\.txt$/i)?.[1]?.trim() ?? null

/** Date -> "YYYY-MM-DD" in local time (what <input type="date"> expects) */
const toInputDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

const STEPS = [
  ['1', 'Export', 'In WhatsApp: ⋮ → More → Export chat → Include media'],
  ['2', 'Drop', 'Drop _chat.txt and the media files (or the unzipped folder) here'],
  ['3', 'Share', 'Pick a theme, toggle Mobile View and download a PNG'],
]

export default function App() {
  const { chat, messages, participants, stats, meta, mediaCount, error, addFiles, reset } = useChatFiles()
  const { isDragging, dropProps } = useFileDrop(addFiles)

  const chatRef = useRef(null)
  const addInput = useRef(null)

  // view settings
  const [mobileView, setMobileView] = useState(false)
  const [theme, setTheme] = useState('light')
  const [meOverride, setMeOverride] = useState(null)
  const [displayName, setDisplayName] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [capturing, setCapturing] = useState(false)

  // documentation modal state
  const [docsOpen, setDocsOpen] = useState(false)
  const [docsCategory, setDocsCategory] = useState('all')
  const [docsQuery, setDocsQuery] = useState('')

  const handleOpenDocs = (category = 'all', query = '') => {
    setDocsCategory(category)
    setDocsQuery(query)
    setDocsOpen(true)
  }

  // Global '?' shortcut for Docs
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault()
        handleOpenDocs('all', '')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  /* ----- derived chat metadata ----- */
  const fileTitle = titleFromFileName(chat?.fileName)
  const defaultMe = useMemo(() => {
    if (!participants.length) return null
    // 1) a participant literally called "You"  2) the one who is not the chat title  3) first sender
    const you = participants.find((p) => /^you$/i.test(p))
    if (you) return you
    const them = participants.find((p) => p === fileTitle)
    return participants.find((p) => p !== them) ?? participants[0]
  }, [participants, fileTitle])
  const me = participants.includes(meOverride) ? meOverride : defaultMe
  const isGroup = participants.length > 2
  const others = participants.filter((p) => p !== me)
  const contactName = displayName.trim() || fileTitle || others.join(', ') || 'WhatsApp Chat'
  const subtitle = isGroup ? participants.join(', ') : 'online'

  /* ----- date range filter ----- */
  const bounds = useMemo(() => {
    const dated = messages.filter((m) => m.date)
    if (!dated.length) return null
    return { min: toInputDate(dated[0].date), max: toInputDate(dated[dated.length - 1].date) }
  }, [messages])

  const shownMessages = useMemo(() => {
    if (!from && !to) return messages
    const f = from ? new Date(`${from}T00:00:00`) : null
    const t = to ? new Date(`${to}T23:59:59.999`) : null
    return messages.filter((m) => !m.date || ((!f || m.date >= f) && (!t || m.date <= t)))
  }, [messages, from, to])

  /* ----- search engine ----- */
  const search = useChatSearch(shownMessages)

  /* ----- actions ----- */
  const loadSample = async () => addFiles(await loadSampleFiles())

  const handleReset = () => {
    reset()
    search.closeSearch()
    setMeOverride(null)
    setDisplayName('')
    setFrom('')
    setTo('')
  }

  const handleScreenshot = useCallback(async () => {
    if (!chatRef.current || capturing) return
    setCapturing(true)
    try {
      await downloadScreenshot(chatRef.current)
    } catch (err) {
      console.error('Screenshot failed', err)
      alert('Sorry, the screenshot failed. See the console for details.')
    } finally {
      setCapturing(false)
    }
  }, [capturing])

  return (
    <div
      {...dropProps}
      className="relative flex min-h-screen flex-col items-center overflow-x-hidden px-4 py-6 sm:py-8"
      style={{
        background:
          'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(37,211,102,0.16), transparent), radial-gradient(ellipse 60% 40% at 90% 100%, rgba(7,94,84,0.28), transparent), #090e11',
      }}
    >
      {/* ---------- Apple-grade Brand Top Bar ---------- */}
      <header className="mb-6 flex w-full max-w-4xl items-center justify-between gap-3 px-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-wa-green/15 text-wa-green border border-wa-green/20 shadow-xs">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 sm:text-2xl">
              <span>WhatsApp</span>
              <span className="bg-linear-to-r from-[#25d366] to-[#7ff0b0] bg-clip-text text-transparent">Chat Viewer</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-wa-green" /> 100% Private Browser App
          </span>
          <button
            id="btn-nav-docs"
            type="button"
            onClick={() => handleOpenDocs('all', '')}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 text-xs font-medium text-white shadow-xs backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/25 active:scale-95"
            title="Search Documentation & Help (press ?)"
          >
            <BookIcon width={14} height={14} />
            <span>Docs & Help</span>
            <kbd className="hidden rounded bg-black/40 px-1.5 py-0.5 text-[10px] text-white/50 sm:inline-block">?</kbd>
          </button>
        </div>
      </header>

      {!chat ? (
        <>
          <DropZone
            isDragging={isDragging}
            onFiles={addFiles}
            onSample={loadSample}
            error={error}
            onOpenDocs={() => handleOpenDocs('export', '')}
          />
          <ol className="mt-8 grid w-full max-w-2xl gap-3.5 sm:grid-cols-3">
            {STEPS.map(([n, title, text]) => (
              <li
                key={n}
                className="group rounded-3xl border border-white/10 bg-white/[0.02] p-4.5 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.04] shadow-xs"
              >
                <div className="mb-2.5 flex h-7 w-7 items-center justify-center rounded-xl bg-wa-green/15 text-xs font-bold text-wa-green border border-wa-green/20">
                  {n}
                </div>
                <div className="text-sm font-semibold text-white tracking-tight">{title}</div>
                <p className="mt-1 text-xs leading-relaxed text-white/50 group-hover:text-white/60 transition-colors">
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <>
          <Toolbar
            stats={stats}
            mediaCount={mediaCount}
            meta={meta}
            participants={participants}
            me={me}
            onMe={setMeOverride}
            mobile={mobileView}
            onToggleMobile={() => setMobileView((v) => !v)}
            searchOpen={search.isOpen}
            onToggleSearch={search.toggleSearch}
            theme={theme}
            onTheme={setTheme}
            displayName={displayName}
            onDisplayName={setDisplayName}
            bounds={bounds}
            from={from}
            to={to}
            onFrom={setFrom}
            onTo={setTo}
            capturing={capturing}
            onScreenshot={handleScreenshot}
            onAddFiles={addFiles}
            onReset={handleReset}
            addInputRef={addInput}
          />

          {error && (
            <p role="alert" className="mb-4 text-xs font-medium text-red-300">
              {error}
            </p>
          )}

          {stats.total === 0 ? (
            <div
              id="empty-state"
              role="alert"
              className="max-w-md rounded-3xl border border-amber-400/30 bg-amber-400/10 p-6 text-center text-amber-100 backdrop-blur-xl shadow-lg"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-300">
                ⚠️
              </div>
              <p className="font-semibold text-sm">No messages were recognised in “{chat.fileName}”.</p>
              <p className="mt-2 text-xs leading-relaxed text-amber-100/80">
                Make sure this is the file produced by WhatsApp’s “Export chat” (usually <code>_chat.txt</code>) and
                that it hasn’t been edited.
              </p>
              <button
                type="button"
                onClick={() => handleOpenDocs('formats', 'syntax')}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/20 px-4 py-1.5 text-xs font-medium text-amber-200 transition-all hover:bg-amber-400/30"
              >
                <BookIcon width={13} height={13} />
                <span>View Supported Formats & Troubleshooting</span>
              </button>
            </div>
          ) : (
            <ErrorBoundary onReset={handleReset}>
              <ChatWindow
                frameRef={chatRef}
                mobile={mobileView}
                theme={theme}
                contactName={contactName}
                subtitle={subtitle}
                isGroup={isGroup}
                messages={shownMessages}
                me={me}
                searchOpen={search.isOpen}
                searchQuery={search.query}
                matchCount={search.matchCount}
                activeMatchNumber={search.activeMatchNumber}
                onSearchOpen={search.openSearch}
                onSearchClose={search.closeSearch}
                onSearchChange={search.setQuery}
                onNextMatch={search.nextMatch}
                onPrevMatch={search.prevMatch}
                activeMessageId={search.activeMessageId}
              />
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs text-white/40">
                <span>
                  Tip: Use <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/70">Ctrl+F</kbd> to search in chat
                </span>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => handleOpenDocs('search', '')}
                  className="text-white/50 hover:text-wa-green hover:underline underline-offset-2"
                >
                  Search & Navigation shortcuts
                </button>
                <span>·</span>
                <span>Hit “Download Screenshot” to save PNG</span>
              </div>
            </ErrorBoundary>
          )}
        </>
      )}

      {/* ---------- Full-Window Drop Overlay ---------- */}
      {chat && isDragging && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-[#090e11]/85 backdrop-blur-md">
          <div className="rounded-3xl border-2 border-dashed border-wa-green bg-wa-green/10 px-12 py-10 text-xl font-semibold text-white shadow-[0_0_80px_rgba(37,211,102,0.3)]">
            Drop to add files
          </div>
        </div>
      )}

      {/* ---------- Apple-grade Documentation & Search Modal ---------- */}
      <DocsModal
        key={`${docsCategory}-${docsQuery}-${docsOpen}`}
        isOpen={docsOpen}
        onClose={() => setDocsOpen(false)}
        initialCategory={docsCategory}
        initialQuery={docsQuery}
      />
    </div>
  )
}
