import { detectDateOrder, parseDate, parseTime } from './datetime.js'
import { resolveMedia, mediaKey, kindFromFileName } from './media.js'
import {
  ANDROID_LINE_RE,
  DELETED_RE,
  EDITED_SUFFIX_RE,
  INVISIBLE,
  IOS_LINE_RE,
  SENDER_SPLIT_RE,
  SPACE_LIKE,
  SYSTEM_TEXT_RE,
} from './patterns.js'

export { mediaKey, kindFromFileName }

/* ==========================================================================
 * 1. THE PARSING ENGINE
 * --------------------------------------------------------------------------
 * Turns the raw text of a WhatsApp "Export chat" file into structured
 * message objects, re-attaching uploaded media via object URLs.
 *
 *  iOS     [23/10/23, 10:15:30] Sender: Message
 *  Android 23/10/2023, 10:15 - Sender: Message
 *
 * Pure function, no DOM / React dependencies => trivially unit-testable.
 * ========================================================================== */

/**
 * @typedef {Object} Message
 * @property {number} id
 * @property {Date|null} date
 * @property {string} time               Display time ("10:15" / "10:15 PM")
 * @property {string|null} sender        null => system message
 * @property {string} text               Message text (caption if media is attached)
 * @property {boolean} deleted           "This message was deleted"
 * @property {boolean} edited            "<This message was edited>"
 * @property {{fileName:string|null, kind:string, url:string|null}|null} media
 *
 * @typedef {Object} ParseResult
 * @property {Message[]} messages
 * @property {string[]} participants     Distinct senders in order of appearance
 * @property {{format:'ios'|'android'|'mixed'|'unknown', dateOrder:'DMY'|'MDY', skippedLines:number}} meta
 */

const clean = (s) => s.replace(SPACE_LIKE, ' ').replace(INVISIBLE, '')

/** Split "Sender: text". Returns null for system messages (no sender). */
function splitSender(body) {
  const m = SENDER_SPLIT_RE.exec(body)
  if (!m || m.index === 0 || m.index > 64) return null
  const sender = body.slice(0, m.index)
  // System lines like: You changed the subject to "Foo: Bar" / multi-line notices
  if (/["“”\n]/.test(sender)) return null
  return { sender: sender.trim(), text: body.slice(m.index + 1).trimStart() }
}

/**
 * @param {string} rawText  Contents of the exported .txt file
 * @param {Map<string,{url:string}>} [mediaMap]  mediaKey(fileName) -> { url }
 * @returns {ParseResult}
 */
export function parseWhatsAppChat(rawText, mediaMap = new Map()) {
  const lines = rawText.split(/\r?\n/)
  const entries = [] // raw entries: { dateStr, timeStr, body }
  let iosCount = 0
  let androidCount = 0
  let skippedLines = 0

  // Pass 1: group physical lines into logical messages (multi-line support)
  for (const rawLine of lines) {
    const line = clean(rawLine)
    const ios = line.match(IOS_LINE_RE)
    const android = ios ? null : line.match(ANDROID_LINE_RE)
    const m = ios || android
    if (m) {
      if (ios) iosCount++
      else androidCount++
      entries.push({ dateStr: m[1], timeStr: m[2], body: m[3] })
    } else if (entries.length) {
      // No timestamp => continuation of the previous message
      entries[entries.length - 1].body += '\n' + line
    } else if (line.trim()) {
      skippedLines++ // junk before the first timestamp
    }
  }

  const order = detectDateOrder(entries.map((e) => e.dateStr))
  const participants = new Set()

  // Pass 2: resolve dates, senders, state flags and media
  const messages = entries.map((e, id) => {
    const { day, month, year } = parseDate(e.dateStr, order)
    const { hours, minutes, display } = parseTime(e.timeStr)
    const date = new Date(year, month - 1, day, hours, minutes)

    const body = e.body.replace(/\s+$/, '')
    const split = splitSender(body)
    let sender = split ? split.sender : null
    let text = split ? split.text : body

    // iOS "Chat name: Messages and calls are end-to-end encrypted…" => system
    if (sender && SYSTEM_TEXT_RE.test(text)) sender = null

    let edited = false
    if (sender && EDITED_SUFFIX_RE.test(text)) {
      edited = true
      text = text.replace(EDITED_SUFFIX_RE, '')
    }
    const deleted = !!sender && DELETED_RE.test(text.trim())

    if (sender) participants.add(sender)

    const { media, caption } =
      sender && !deleted ? resolveMedia(text, mediaMap) : { media: null, caption: text }

    const messageText = media ? caption : text
    const searchable = `${sender ?? ''} ${media?.fileName ?? ''} ${messageText}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    return {
      id,
      date: Number.isNaN(date.getTime()) ? null : date,
      time: display,
      sender,
      text: messageText,
      deleted,
      edited,
      media,
      _searchable: searchable,
    }
  })

  const format =
    iosCount && androidCount ? 'mixed' : iosCount ? 'ios' : androidCount ? 'android' : 'unknown'

  return {
    messages,
    participants: [...participants],
    meta: { format, dateOrder: order, skippedLines },
  }
}
