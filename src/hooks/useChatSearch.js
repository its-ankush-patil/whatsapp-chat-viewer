import { useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'

/**
 * High-performance search hook for WhatsApp conversations.
 *
 * System Design & Optimizations:
 * 1. Pre-computed normalized index string (_searchable) per message.
 * 2. Deferred query evaluation (useDeferredValue) to ensure 60fps typing responsiveness.
 * 3. Diacritic-insensitive & case-insensitive matching.
 * 4. Keyboard shortcuts: Ctrl+F/Cmd+F to open, Enter/Shift+Enter to navigate, Esc to close.
 *
 * @param {Array} messages  Array of parsed messages
 */
export function useChatSearch(messages = []) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQueryState] = useState('')
  const [activeMatchIndex, setActiveMatchIndex] = useState(0)

  // Defers recalculating 50k messages during rapid keystrokes
  const deferredQuery = useDeferredValue(query)

  // Normalize query: lowercase, strip accents/diacritics
  const normalizedQuery = useMemo(() => {
    return deferredQuery
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }, [deferredQuery])

  // Array of matching message IDs
  const matchIds = useMemo(() => {
    if (!normalizedQuery || !messages.length) return []
    const results = []
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i]
      if (msg._searchable && msg._searchable.includes(normalizedQuery)) {
        results.push(msg.id)
      }
    }
    return results
  }, [messages, normalizedQuery])

  const matchCount = matchIds.length
  const safeActiveIndex = matchCount > 0 ? Math.min(activeMatchIndex, matchCount - 1) : 0
  const activeMessageId = matchCount > 0 ? matchIds[safeActiveIndex] : null

  const setQuery = useCallback((newQuery) => {
    setQueryState(newQuery)
    setActiveMatchIndex(0)
  }, [])

  const nextMatch = useCallback(() => {
    if (matchCount <= 1) return
    setActiveMatchIndex((prev) => (prev + 1) % matchCount)
  }, [matchCount])

  const prevMatch = useCallback(() => {
    if (matchCount <= 1) return
    setActiveMatchIndex((prev) => (prev - 1 + matchCount) % matchCount)
  }, [matchCount])

  const openSearch = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeSearch = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    setActiveMatchIndex(0)
  }, [setQuery])

  const toggleSearch = useCallback(() => {
    if (isOpen) closeSearch()
    else openSearch()
  }, [isOpen, closeSearch, openSearch])

  // Global keyboard shortcuts (Ctrl+F, Cmd+F, Escape)
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault()
        setIsOpen(true)
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault()
        closeSearch()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, closeSearch])

  return {
    isOpen,
    query,
    setQuery,
    matchCount,
    activeMatchIndex: safeActiveIndex,
    activeMessageId,
    activeMatchNumber: matchCount > 0 ? safeActiveIndex + 1 : 0,
    openSearch,
    closeSearch,
    toggleSearch,
    nextMatch,
    prevMatch,
  }
}
