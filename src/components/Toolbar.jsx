import { useState } from 'react'

const FORMAT_LABEL = { ios: 'iOS', android: 'Android', mixed: 'Mixed', unknown: 'Unknown' }

export default function Toolbar({
  stats,
  mediaCount,
  meta,
  participants,
  me,
  onMe,
  mobile,
  onToggleMobile,
  searchOpen,
  onToggleSearch,
  theme,
  onTheme,
  displayName,
  onDisplayName,
  bounds,
  from,
  to,
  onFrom,
  onTo,
  capturing,
  onScreenshot,
  onAddFiles,
  onReset,
  addInputRef,
}) {
  const [showOptions, setShowOptions] = useState(true)

  const hasCustomOptions =
    (displayName && displayName.trim().length > 0) ||
    Boolean(from) ||
    Boolean(to) ||
    (me && participants.length > 1 && me !== participants[0])

  return (
    <div
      id="toolbar"
      className="wa-pop mb-5 flex w-full max-w-[960px] flex-col gap-2.5 rounded-3xl border border-white/10 bg-white/[0.03] p-3 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-all"
    >
      {/* Row 1: Consolidated Status + Primary Core Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-1">
        {/* Consolidated Apple Status Badge */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-white/80 shadow-xs backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-wa-green" />
            <span className="font-semibold text-white">{stats.total.toLocaleString()}</span> messages
            {mediaCount > 0 && (
              <>
                <span className="text-white/30">·</span>
                <span>{mediaCount} files</span>
              </>
            )}
            {meta && meta.format !== 'unknown' && (
              <>
                <span className="text-white/30">·</span>
                <span className="text-white/60">
                  {FORMAT_LABEL[meta.format]} ({meta.dateOrder === 'MDY' ? 'MM/DD' : 'DD/MM'})
                </span>
              </>
            )}
            {stats.missing > 0 && (
              <span className="ml-1 rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-semibold text-amber-200">
                {stats.missing} missing
              </span>
            )}
          </div>
        </div>

        {/* Primary Action Controls */}
        <div className="flex items-center gap-2">
          {/* In-chat search trigger */}
          <button
            id="btn-toolbar-search"
            type="button"
            onClick={onToggleSearch}
            aria-pressed={searchOpen}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all active:scale-95 ${
              searchOpen
                ? 'border-wa-green/40 bg-wa-green/20 text-wa-green shadow-xs'
                : 'border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-white/20'
            }`}
            title="Search in chat (Ctrl+F)"
          >
            <span>🔍 Search</span>
            <kbd className="hidden rounded bg-black/40 px-1.5 py-0.5 text-[9px] text-white/50 sm:inline-block">
              Ctrl+F
            </kbd>
          </button>

          {/* Toggle Mobile / Desktop view */}
          <button
            id="btn-toggle-mobile"
            type="button"
            onClick={onToggleMobile}
            aria-pressed={mobile}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all active:scale-95 ${
              mobile
                ? 'border-wa-green/40 bg-wa-green/20 text-wa-green shadow-xs'
                : 'border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08] hover:border-white/20'
            }`}
          >
            <span>📱 {mobile ? 'Desktop View' : 'Mobile View'}</span>
          </button>

          {/* Customize / Filter Strip Toggle */}
          <button
            id="btn-toggle-options"
            type="button"
            onClick={() => setShowOptions((v) => !v)}
            aria-expanded={showOptions}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
              showOptions
                ? 'border-white/20 bg-white/10 text-white'
                : 'border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.08] hover:text-white'
            }`}
            title="Toggle Customize & Filter Options"
          >
            <span>⚙️ Options</span>
            {hasCustomOptions && <span className="h-1.5 w-1.5 rounded-full bg-wa-green" />}
            <span className="text-[10px] text-white/40">{showOptions ? '▲' : '▼'}</span>
          </button>

          {/* Fast Screenshot Capture CTA */}
          <button
            id="btn-screenshot"
            type="button"
            onClick={onScreenshot}
            disabled={capturing}
            className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-b from-[#28e36e] to-[#1eb857] px-4 py-1.5 text-xs font-semibold text-[#042013] shadow-[0_4px_16px_rgba(37,211,102,0.35)] transition-all hover:brightness-110 active:scale-95 disabled:cursor-wait disabled:opacity-60"
          >
            {capturing ? (
              <>
                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-[#042013] border-t-transparent" />
                <span>Capturing…</span>
              </>
            ) : (
              <span>⬇ Download Screenshot</span>
            )}
          </button>
        </div>
      </div>

      {/* Row 2: Streamlined Apple Studio Controls Ribbon (Non-wrapping, compact) */}
      {showOptions && (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-2xl border border-white/5 bg-black/25 px-3 py-2 text-xs backdrop-blur-md animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center gap-3">
            {/* Theme Segmented Switch */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-medium uppercase tracking-wider text-white/40 select-none">Theme</span>
              <div
                className="flex items-center rounded-xl border border-white/10 bg-black/40 p-0.5"
                role="group"
                aria-label="Chat theme"
              >
                {['light', 'dark'].map((t) => (
                  <button
                    key={t}
                    id={`btn-theme-${t}`}
                    type="button"
                    aria-pressed={theme === t}
                    onClick={() => onTheme(t)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition-all active:scale-95 ${
                      theme === t
                        ? 'bg-white/20 text-white shadow-xs'
                        : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    {t === 'light' ? '☀️ Light' : '🌙 Dark'}
                  </button>
                ))}
              </div>
            </div>

            {/* "I am" Sender Selector */}
            {participants.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium uppercase tracking-wider text-white/40 select-none">I am</span>
                <select
                  id="select-me"
                  value={me ?? ''}
                  onChange={(e) => onMe(e.target.value)}
                  className="wa-input max-w-[150px] py-1 text-xs"
                >
                  {participants.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Chat Name Override */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-medium uppercase tracking-wider text-white/40 select-none">Name</span>
              <input
                id="input-display-name"
                type="text"
                value={displayName}
                onChange={(e) => onDisplayName(e.target.value)}
                placeholder="Auto (file title)"
                className="wa-input w-32 py-1 text-xs"
              />
            </div>

            {/* Date Range Filter */}
            {bounds && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium uppercase tracking-wider text-white/40 select-none">Dates</span>
                <div className="flex items-center gap-1">
                  <input
                    id="input-from"
                    type="date"
                    value={from}
                    min={bounds.min}
                    max={to || bounds.max}
                    onChange={(e) => onFrom(e.target.value)}
                    className="wa-input py-0.5 px-1.5 text-[11px]"
                    aria-label="From date"
                  />
                  <span className="text-white/30 text-[10px]">→</span>
                  <input
                    id="input-to"
                    type="date"
                    value={to}
                    min={from || bounds.min}
                    max={bounds.max}
                    onChange={(e) => onTo(e.target.value)}
                    className="wa-input py-0.5 px-1.5 text-[11px]"
                    aria-label="To date"
                  />
                  {(from || to) && (
                    <button
                      type="button"
                      onClick={() => {
                        onFrom('')
                        onTo('')
                      }}
                      className="rounded px-1.5 py-0.5 text-[10px] text-white/50 transition hover:text-white hover:bg-white/10"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick File & Reset Utilities */}
          <div className="flex items-center gap-2">
            <button
              id="btn-add-files"
              type="button"
              onClick={() => addInputRef.current?.click()}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/80 transition-all hover:bg-white/[0.08] hover:text-white active:scale-95"
            >
              + Add files
            </button>

            <button
              id="btn-reset"
              type="button"
              onClick={onReset}
              className="rounded-full px-2.5 py-1 text-xs text-white/40 transition-all hover:text-red-400 active:scale-95"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Input for Add Files */}
      <input
        ref={addInputRef}
        type="file"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files?.length) onAddFiles(Array.from(e.target.files))
          e.target.value = ''
        }}
      />
    </div>
  )
}
