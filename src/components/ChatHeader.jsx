import {
  BackIcon,
  CallIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
  GroupIcon,
  MoreIcon,
  PersonIcon,
  SearchIcon,
  VideoIcon,
} from './Icons'

/** Fake iOS status bar with Apple Dynamic Island, only rendered in Mobile View */
export function StatusBar() {
  return (
    <div className="relative flex h-[46px] shrink-0 items-end justify-between bg-wa-header-dark px-8 pb-1 text-[15px] font-semibold text-white">
      <span className="font-medium tracking-tight">9:41</span>
      {/* Dynamic Island pill */}
      <div className="absolute left-1/2 top-2.5 -translate-x-1/2 flex h-[26px] w-[96px] items-center justify-between rounded-full bg-black px-2.5 shadow-inner pointer-events-none">
        <div className="h-2 w-2 rounded-full bg-[#18181b] ring-1 ring-white/10" />
        <div className="h-2.5 w-2.5 rounded-full bg-[#111113] ring-1 ring-white/10" />
      </div>
      <div className="flex items-center gap-[6px]">
        <svg viewBox="0 0 18 12" width="18" height="12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.500" width="3" height="6.500" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 16 12" width="16" height="12" fill="currentColor">
          <path d="M8 2.200c2.300 0 4.400.9 6 2.400l1-1.100A10.400 10.400 0 0 0 8 .6C5.200.6 2.600 1.700.7 3.500l1 1.100A8.800 8.800 0 0 1 8 2.200zm0 3.300c1.400 0 2.700.5 3.700 1.400l1-1.100A7.100 7.100 0 0 0 8 3.900c-1.800 0-3.500.7-4.700 1.900l1 1.100A5.500 5.500 0 0 1 8 5.500zm0 3.200c-.7 0-1.300.3-1.800.7L8 11.300l1.800-1.900c-.5-.4-1.100-.7-1.800-.7z" />
        </svg>
        <svg viewBox="0 0 27 13" width="27" height="13" fill="none">
          <rect x=".5" y=".5" width="22" height="12" rx="3.500" stroke="currentColor" opacity=".5" />
          <rect x="2" y="2" width="19" height="9" rx="2" fill="currentColor" />
          <path d="M24 4.500v4c.8-.3 1.500-1.100 1.500-2s-.7-1.700-1.500-2z" fill="currentColor" opacity=".5" />
        </svg>
      </div>
    </div>
  )
}

/** WhatsApp contact header with integrated in-chat Search engine interface */
export function ChatHeader({
  name,
  subtitle,
  isGroup,
  mobile,
  searchOpen = false,
  searchQuery = '',
  matchCount = 0,
  activeMatchNumber = 0,
  onSearchOpen,
  onSearchClose,
  onSearchChange,
  onNextMatch,
  onPrevMatch,
}) {
  return (
    <header className="z-10 shrink-0 bg-wa-header text-white shadow-md">
      {mobile && <StatusBar />}
      {searchOpen ? (
        <div className="flex h-[56px] items-center gap-2 px-2 animate-in fade-in duration-200">
          <button
            id="btn-close-search"
            type="button"
            aria-label="Close search"
            onClick={onSearchClose}
            className="flex items-center justify-center rounded-full p-2 text-white/90 transition hover:bg-white/10 active:scale-95"
            title="Close search (Esc)"
          >
            <BackIcon />
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-lg bg-black/20 px-3 py-1.5 focus-within:bg-black/30 transition-colors">
            <input
              id="input-chat-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (e.shiftKey) onPrevMatch()
                  else onNextMatch()
                } else if (e.key === 'Escape') {
                  onSearchClose()
                }
              }}
              placeholder="Search in chat…"
              autoFocus
              className="w-full bg-transparent text-sm text-white placeholder-white/50 outline-none"
            />
            {searchQuery && (
              <span id="search-match-count" className="shrink-0 text-xs text-white/70 select-none">
                {matchCount > 0 ? `${activeMatchNumber} of ${matchCount}` : 'No matches'}
              </span>
            )}
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear query"
                onClick={() => onSearchChange('')}
                className="text-white/60 transition hover:text-white"
              >
                <CloseIcon width={16} height={16} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            <button
              id="btn-search-prev"
              type="button"
              aria-label="Previous match"
              disabled={matchCount <= 1}
              onClick={onPrevMatch}
              className="rounded-full p-1.5 text-white/80 transition hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
              title="Previous match (Shift+Enter)"
            >
              <ChevronUpIcon />
            </button>
            <button
              id="btn-search-next"
              type="button"
              aria-label="Next match"
              disabled={matchCount <= 1}
              onClick={onNextMatch}
              className="rounded-full p-1.5 text-white/80 transition hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
              title="Next match (Enter)"
            >
              <ChevronDownIcon />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-[56px] items-center gap-1 pr-2 pl-1">
          <button type="button" aria-label="Back" className="flex items-center gap-0.5 rounded-full p-1.5">
            <BackIcon />
          </button>
          <div className="-ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#cfd8dc] text-white">
            {isGroup ? <GroupIcon width={26} height={26} /> : <PersonIcon width={28} height={28} />}
          </div>
          <div className="ml-2 min-w-0 flex-1 leading-tight">
            <h1 className="truncate text-[17px] font-medium">{name}</h1>
            <p className="truncate text-[12.5px] text-white/75">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3 pr-1">
            <VideoIcon />
            <CallIcon />
            <button
              id="btn-header-search"
              type="button"
              aria-label="Search chat"
              onClick={onSearchOpen}
              className="rounded-full p-1 text-white/90 transition hover:bg-white/10 active:scale-95"
              title="Search chat (Ctrl+F)"
            >
              <SearchIcon />
            </button>
            <MoreIcon />
          </div>
        </div>
      )}
    </header>
  )
}
