import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { THEMES } from '../lib/themes'
import { Bubble, DayChip, SystemMessage } from './chat/MessageBubble'

/** How many messages are rendered at once */
const PAGE_SIZE = 400
/** Bounded upper ceiling of active messages in the DOM to protect low-memory devices */
const MAX_ACTIVE_DOM = 1200

const sameDay = (a, b) =>
  a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const dayLabel = (d) =>
  d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

export default function ChatBody({
  messages,
  me,
  isGroup,
  theme = 'light',
  searchQuery = '',
  activeMessageId = null,
}) {
  const scrollRef = useRef(null)
  const stickToBottom = useRef(true)
  const restoreFrom = useRef(null) // scrollHeight before older messages were prepended
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [showScrollBottom, setShowScrollBottom] = useState(false)
  const fills = THEMES[theme].tail

  // If search matches an earlier message outside the current page, expand limit automatically
  const requiredLimit = useMemo(() => {
    if (activeMessageId == null) return 0
    const idx = messages.findIndex((m) => m.id === activeMessageId)
    if (idx === -1) return 0
    return messages.length - idx + 40
  }, [activeMessageId, messages])

  const effectiveLimit = Math.min(MAX_ACTIVE_DOM, Math.max(limit, requiredLimit))
  const hidden = Math.max(0, messages.length - effectiveLimit)
  const visible = useMemo(() => (hidden ? messages.slice(hidden) : messages), [messages, hidden])

  const rows = useMemo(() => {
    const out = []
    let prev = null
    for (const msg of visible) {
      if (msg.date && !sameDay(prev?.date, msg.date)) {
        out.push({ type: 'day', key: `d-${msg.id}`, label: dayLabel(msg.date) })
      }
      if (!msg.sender) {
        out.push({ type: 'system', key: msg.id, msg })
      } else {
        const newGroup = !prev || !prev.sender || prev.sender !== msg.sender || !sameDay(prev.date, msg.date)
        out.push({ type: 'msg', key: msg.id, msg, newGroup })
      }
      prev = msg
    }
    return out
  }, [visible])

  const scrollToBottom = useCallback(() => {
    const el = scrollRef.current
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
      stickToBottom.current = true
      setShowScrollBottom(false)
    }
  }, [])

  // New chat / new filter => jump to the latest message
  useEffect(() => {
    if (activeMessageId == null) {
      stickToBottom.current = true
      const el = scrollRef.current
      if (el) el.scrollTop = el.scrollHeight
    }
  }, [messages, activeMessageId])

  // Scroll to active search match smoothly
  useEffect(() => {
    if (activeMessageId == null) return
    stickToBottom.current = false
    const timer = setTimeout(() => {
      const target = document.getElementById(`msg-${activeMessageId}`)
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 60)
    return () => clearTimeout(timer)
  }, [activeMessageId])

  // After prepending older messages keep the viewport where it was
  useLayoutEffect(() => {
    const el = scrollRef.current
    if (el && restoreFrom.current != null) {
      el.scrollTop += el.scrollHeight - restoreFrom.current
      restoreFrom.current = null
    }
  }, [effectiveLimit])

  const loadEarlier = () => {
    restoreFrom.current = scrollRef.current?.scrollHeight ?? 0
    stickToBottom.current = false
    setLimit((l) => Math.min(MAX_ACTIVE_DOM, l + PAGE_SIZE))
  }

  // Images finish loading after first paint and grow the list; keep pinned
  const onMediaLoad = useCallback(() => {
    if (stickToBottom.current) {
      const el = scrollRef.current
      if (el) el.scrollTop = el.scrollHeight
    }
  }, [])

  const onScroll = (e) => {
    const el = e.currentTarget
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    const atBottom = distanceFromBottom < 80
    stickToBottom.current = atBottom
    setShowScrollBottom(!atBottom && distanceFromBottom > 250)
  }

  return (
    <div className="relative flex flex-1 min-h-0 flex-col">
      <div ref={scrollRef} onScroll={onScroll} className="wa-scroll min-h-0 flex-1 overflow-y-auto py-2">
        {hidden > 0 && (
          <div className="my-2 flex justify-center">
            <button
              id="btn-load-earlier"
              type="button"
              onClick={loadEarlier}
              className="rounded-full bg-wa-chip px-4 py-1.5 font-wa text-[12.5px] font-medium text-wa-link shadow-[0_1px_0.5px_rgba(11,20,26,0.13)] cursor-pointer"
            >
              Load {Math.min(PAGE_SIZE, hidden)} earlier messages ({hidden.toLocaleString()} hidden)
            </button>
          </div>
        )}
        {rows.map((row) => {
          if (row.type === 'day') return <DayChip key={row.key} label={row.label} />
          if (row.type === 'system') {
            return (
              <SystemMessage
                key={row.key}
                text={row.msg.text}
                searchQuery={searchQuery}
                isCurrentMatch={row.msg.id === activeMessageId}
              />
            )
          }
          const outgoing = row.msg.sender === me
          const isCurrentMatch = row.msg.id === activeMessageId
          return (
            <Bubble
              key={row.key}
              msg={row.msg}
              outgoing={outgoing}
              showTail={row.newGroup}
              senderLabel={isGroup && !outgoing && row.newGroup}
              fills={fills}
              onMediaLoad={onMediaLoad}
              searchQuery={searchQuery}
              isCurrentMatch={isCurrentMatch}
            />
          )
        })}
      </div>

      {showScrollBottom && (
        <button
          type="button"
          onClick={scrollToBottom}
          aria-label="Scroll to latest messages"
          className="absolute right-4 bottom-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-wa-chip text-wa-system shadow-md transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}
    </div>
  )
}
