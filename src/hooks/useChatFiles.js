import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { mediaKey, parseWhatsAppChat } from '../lib/parser'
import { isChatFile, isJunkFile } from '../lib/files'

/* ==========================================================================
 * 2. STATE MANAGEMENT FOR FILES
 * --------------------------------------------------------------------------
 * - keeps the .txt content in memory
 * - creates URL.createObjectURL() references for every non-.txt file
 * - re-parses (memoised) whenever the text or the media set changes, so media
 *   dropped *after* the chat file is still linked to its message
 * ========================================================================== */
export function useChatFiles() {
  const [chat, setChat] = useState(null) // { fileName, text }
  const [media, setMedia] = useState(() => new Map()) // mediaKey(name) -> { url, name }
  const [error, setError] = useState(null)
  const createdUrls = useRef(new Set())

  const revokeAll = useCallback(() => {
    createdUrls.current.forEach((u) => URL.revokeObjectURL(u))
    createdUrls.current.clear()
  }, [])

  // Free blob URLs when the app unmounts
  useEffect(() => revokeAll, [revokeAll])

  const addFiles = useCallback(async (files) => {
    setError(null)
    const list = Array.from(files).filter((f) => !isJunkFile(f))

    // If several .txt files are dropped, prefer the real WhatsApp export
    const txtFiles = list.filter(isChatFile)
    const txt =
      txtFiles.find((f) => /_chat\.txt$/i.test(f.name)) ??
      txtFiles.find((f) => /whatsapp chat/i.test(f.name)) ??
      txtFiles[txtFiles.length - 1]

    const mediaFiles = list.filter((f) => !isChatFile(f))

    if (!txt && !mediaFiles.length) {
      setError('No chat file found. Drop the exported .txt file (usually named _chat.txt) together with its media.')
      return
    }

    if (txt) {
      try {
        setChat({ fileName: txt.name, text: await txt.text() })
      } catch {
        setError('Could not read the chat file.')
      }
    }

    if (mediaFiles.length) {
      setMedia((prev) => {
        const next = new Map(prev)
        for (const file of mediaFiles) {
          const key = mediaKey(file.name)
          const old = next.get(key)
          if (old) {
            URL.revokeObjectURL(old.url)
            createdUrls.current.delete(old.url)
          }
          const url = URL.createObjectURL(file)
          createdUrls.current.add(url)
          next.set(key, { url, name: file.name })
        }
        return next
      })
    }
  }, [])

  const reset = useCallback(() => {
    revokeAll()
    setChat(null)
    setMedia(new Map())
    setError(null)
  }, [revokeAll])

  const parsed = useMemo(
    () => (chat ? parseWhatsAppChat(chat.text, media) : null),
    [chat, media],
  )

  const stats = useMemo(() => {
    if (!parsed) return null
    const withMedia = parsed.messages.filter((m) => m.media?.url).length
    const missing = parsed.messages.filter(
      (m) => m.media && m.media.kind !== 'omitted' && !m.media.url,
    ).length
    return { total: parsed.messages.length, withMedia, missing }
  }, [parsed])

  return {
    chat,
    messages: parsed?.messages ?? [],
    participants: parsed?.participants ?? [],
    meta: parsed?.meta ?? null,
    mediaCount: media.size,
    stats,
    error,
    addFiles,
    reset,
  }
}
